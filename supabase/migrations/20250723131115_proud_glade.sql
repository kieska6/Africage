/*
  # Création des tables et types pour Africage

  1. Types énumérés
    - UserRole : SENDER, TRAVELER, BOTH
    - UserStatus : PENDING_VERIFICATION, VERIFIED, SUSPENDED, INACTIVE
    - ShipmentStatus : PENDING_MATCH, MATCHED, IN_TRANSIT, DELIVERED, CANCELED
    - TripStatus : AVAILABLE, PARTIALLY_BOOKED, FULLY_BOOKED, COMPLETED, CANCELED
    - TransactionStatus : PENDING, CONFIRMED, IN_PROGRESS, DELIVERED, DISPUTED, CANCELED, COMPLETED
    - PaymentStatus : PENDING, PAID, REFUNDED, FAILED
    - NotificationType : SHIPMENT_MATCHED, TRIP_BOOKED, DELIVERY_CONFIRMED, PAYMENT_RECEIVED, REVIEW_RECEIVED, SYSTEM_ALERT
    - ReviewType : SENDER_TO_TRAVELER, TRAVELER_TO_SENDER

  2. Tables principales
    - users : Profils utilisateurs liés à auth.users
    - shipments : Annonces de colis à expédier
    - trips : Trajets proposés par les voyageurs
    - transactions : Contrats entre expéditeurs et voyageurs
    - reviews : Évaluations mutuelles
    - notifications : Système de notifications
    - payment_methods : Moyens de paiement
    - payments : Historique des paiements
    - sessions : Sessions utilisateur
*/

-- =============================================
-- CRÉATION DES TYPES ÉNUMÉRÉS
-- =============================================

CREATE TYPE user_role AS ENUM (
  'SENDER',
  'TRAVELER', 
  'BOTH'
);

CREATE TYPE user_status AS ENUM (
  'PENDING_VERIFICATION',
  'VERIFIED',
  'SUSPENDED',
  'INACTIVE'
);

CREATE TYPE shipment_status AS ENUM (
  'PENDING_MATCH',
  'MATCHED',
  'IN_TRANSIT',
  'DELIVERED',
  'CANCELED'
);

CREATE TYPE trip_status AS ENUM (
  'AVAILABLE',
  'PARTIALLY_BOOKED',
  'FULLY_BOOKED',
  'COMPLETED',
  'CANCELED'
);

CREATE TYPE transaction_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'DELIVERED',
  'DISPUTED',
  'CANCELED',
  'COMPLETED'
);

CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'PAID',
  'REFUNDED',
  'FAILED'
);

CREATE TYPE notification_type AS ENUM (
  'SHIPMENT_MATCHED',
  'TRIP_BOOKED',
  'DELIVERY_CONFIRMED',
  'PAYMENT_RECEIVED',
  'REVIEW_RECEIVED',
  'SYSTEM_ALERT'
);

CREATE TYPE review_type AS ENUM (
  'SENDER_TO_TRAVELER',
  'TRAVELER_TO_SENDER'
);

-- =============================================
-- CRÉATION DES TABLES
-- =============================================

-- Table des utilisateurs (liée à auth.users de Supabase)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  email_verified timestamp with time zone,
  password text, -- Nullable pour OAuth
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  profile_picture text,
  date_of_birth timestamp with time zone,
  role user_role DEFAULT 'BOTH',
  status user_status DEFAULT 'PENDING_VERIFICATION',
  
  -- Informations de vérification KYC
  is_phone_verified boolean DEFAULT false,
  is_email_verified boolean DEFAULT false,
  is_identity_verified boolean DEFAULT false,
  identity_document text, -- URL du document d'identité
  
  -- Informations de géolocalisation
  city text,
  country text,
  address text,
  
  -- Métadonnées
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  last_login_at timestamp with time zone
);

-- Table des colis à expédier
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Détails du colis
  title text NOT NULL,
  description text,
  weight double precision NOT NULL, -- En kg
  length double precision, -- En cm
  width double precision, -- En cm
  height double precision, -- En cm
  photos text[] DEFAULT '{}', -- URLs des photos
  
  -- Adresses
  pickup_address text NOT NULL,
  pickup_city text NOT NULL,
  pickup_country text NOT NULL,
  delivery_address text NOT NULL,
  delivery_city text NOT NULL,
  delivery_country text NOT NULL,
  
  -- Informations financières
  proposed_price double precision NOT NULL, -- Prix proposé par l'expéditeur
  currency text DEFAULT 'XOF',
  
  -- Contraintes temporelles
  pickup_date_from timestamp with time zone, -- Date de récupération souhaitée (début)
  pickup_date_to timestamp with time zone, -- Date de récupération souhaitée (fin)
  delivery_date_by timestamp with time zone, -- Date de livraison souhaitée
  
  -- Statut et métadonnées
  status shipment_status DEFAULT 'PENDING_MATCH',
  is_urgent boolean DEFAULT false,
  is_fragile boolean DEFAULT false,
  requires_signature boolean DEFAULT false,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table des trajets proposés par les voyageurs
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  traveler_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Détails du trajet
  title text NOT NULL,
  description text,
  
  -- Itinéraire
  departure_city text NOT NULL,
  departure_country text NOT NULL,
  arrival_city text NOT NULL,
  arrival_country text NOT NULL,
  
  -- Dates et horaires
  departure_date timestamp with time zone NOT NULL,
  arrival_date timestamp with time zone NOT NULL,
  
  -- Capacité de transport
  available_weight double precision NOT NULL, -- Poids disponible en kg
  available_volume double precision, -- Volume disponible en litres
  max_packages integer DEFAULT 1,
  
  -- Informations financières
  price_per_kg double precision, -- Prix par kg
  minimum_price double precision, -- Prix minimum
  currency text DEFAULT 'XOF',
  
  -- Statut et métadonnées
  status trip_status DEFAULT 'AVAILABLE',
  is_recurring boolean DEFAULT false,
  recurring_pattern text, -- Pattern de récurrence (JSON)
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Contrainte : date d'arrivée après date de départ
  CONSTRAINT valid_trip_dates CHECK (arrival_date > departure_date)
);

-- Table des transactions (contrats entre expéditeur et voyageur)
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id), -- Dénormalisé pour faciliter les requêtes
  traveler_id uuid NOT NULL REFERENCES users(id), -- Dénormalisé pour faciliter les requêtes
  
  -- Détails financiers
  agreed_price double precision NOT NULL,
  currency text DEFAULT 'XOF',
  platform_fee double precision DEFAULT 0,
  
  -- Code de sécurité pour la livraison
  security_code text UNIQUE NOT NULL,
  
  -- Statuts
  status transaction_status DEFAULT 'PENDING',
  payment_status payment_status DEFAULT 'PENDING',
  
  -- Dates importantes
  confirmed_at timestamp with time zone,
  picked_up_at timestamp with time zone,
  delivered_at timestamp with time zone,
  
  -- Métadonnées
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table des évaluations
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  reviewer_id uuid NOT NULL REFERENCES users(id), -- Celui qui donne l'avis
  reviewee_id uuid NOT NULL REFERENCES users(id), -- Celui qui reçoit l'avis
  type review_type NOT NULL,
  
  -- Contenu de l'évaluation
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Note de 1 à 5
  comment text,
  
  -- Critères spécifiques
  punctuality integer CHECK (punctuality >= 1 AND punctuality <= 5), -- Ponctualité (1-5)
  communication integer CHECK (communication >= 1 AND communication <= 5), -- Communication (1-5)
  carefulness integer CHECK (carefulness >= 1 AND carefulness <= 5), -- Soin apporté (1-5)
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  -- Un utilisateur ne peut évaluer qu'une fois par transaction
  UNIQUE(transaction_id, reviewer_id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES transactions(id) ON DELETE CASCADE,
  
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb, -- Données additionnelles (JSON)
  
  is_read boolean DEFAULT false,
  read_at timestamp with time zone,
  
  created_at timestamp with time zone DEFAULT now()
);

-- Table des moyens de paiement
CREATE TABLE IF NOT EXISTS payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type text NOT NULL, -- "mobile_money", "bank_card", "bank_transfer"
  provider text NOT NULL, -- "orange_money", "mtn_money", "visa", etc.
  account_number text NOT NULL, -- Numéro de compte/carte (chiffré)
  account_name text, -- Nom du titulaire
  
  is_default boolean DEFAULT false,
  is_active boolean DEFAULT true,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table pour l'historique des paiements
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES transactions(id), -- Peut être null pour les recharges de portefeuille
  user_id uuid NOT NULL REFERENCES users(id),
  
  amount double precision NOT NULL,
  currency text DEFAULT 'XOF',
  type text NOT NULL, -- "payment", "refund", "wallet_topup"
  method text NOT NULL, -- "mobile_money", "bank_card", etc.
  
  status payment_status DEFAULT 'PENDING',
  external_id text, -- ID de la transaction chez le prestataire de paiement
  
  metadata jsonb, -- Métadonnées du paiement
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Table pour les sessions utilisateur (optionnel, pour la gestion des sessions)
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- =============================================
-- CRÉATION DES INDEX POUR LES PERFORMANCES
-- =============================================

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_pickup_city ON shipments(pickup_city);
CREATE INDEX IF NOT EXISTS idx_shipments_delivery_city ON shipments(delivery_city);
CREATE INDEX IF NOT EXISTS idx_shipments_created_at ON shipments(created_at);

CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_departure_city ON trips(departure_city);
CREATE INDEX IF NOT EXISTS idx_trips_arrival_city ON trips(arrival_city);
CREATE INDEX IF NOT EXISTS idx_trips_departure_date ON trips(departure_date);

CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_sender_id ON transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_transactions_traveler_id ON transactions(traveler_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- =============================================
-- FONCTION POUR METTRE À JOUR updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();