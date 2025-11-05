/*
  # Configuration de la sécurité Row Level Security (RLS)

  1. Activation de RLS sur toutes les tables
  2. Politiques de sécurité pour chaque table :
    - users : Accès uniquement à son propre profil
    - shipments : Lecture publique, modification par le propriétaire
    - trips : Lecture publique, modification par le propriétaire
    - transactions : Accès limité aux parties impliquées
    - reviews : Accès limité aux parties impliquées
    - notifications : Accès uniquement à ses propres notifications
    - payment_methods : Accès uniquement à ses propres moyens de paiement
    - payments : Accès uniquement à ses propres paiements
    - sessions : Accès uniquement à ses propres sessions
*/

-- =============================================
-- ACTIVATION DE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLITIQUES POUR LA TABLE USERS
-- =============================================

-- Les utilisateurs peuvent voir leur propre profil
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Les utilisateurs peuvent mettre à jour leur propre profil
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Permettre l'insertion lors de l'inscription (via trigger ou fonction)
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- =============================================
-- POLITIQUES POUR LA TABLE SHIPMENTS
-- =============================================

-- Tous les utilisateurs authentifiés peuvent voir les colis disponibles
CREATE POLICY "Authenticated users can view shipments"
  ON shipments
  FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les expéditeurs peuvent créer des colis
CREATE POLICY "Senders can create shipments"
  ON shipments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Seuls les propriétaires peuvent modifier leurs colis
CREATE POLICY "Senders can update own shipments"
  ON shipments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Seuls les propriétaires peuvent supprimer leurs colis
CREATE POLICY "Senders can delete own shipments"
  ON shipments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- =============================================
-- POLITIQUES POUR LA TABLE TRIPS
-- =============================================

-- Tous les utilisateurs authentifiés peuvent voir les trajets disponibles
CREATE POLICY "Authenticated users can view trips"
  ON trips
  FOR SELECT
  TO authenticated
  USING (true);

-- Seuls les voyageurs peuvent créer des trajets
CREATE POLICY "Travelers can create trips"
  ON trips
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = traveler_id);

-- Seuls les propriétaires peuvent modifier leurs trajets
CREATE POLICY "Travelers can update own trips"
  ON trips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = traveler_id);

-- Seuls les propriétaires peuvent supprimer leurs trajets
CREATE POLICY "Travelers can delete own trips"
  ON trips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = traveler_id);

-- =============================================
-- POLITIQUES POUR LA TABLE TRANSACTIONS
-- =============================================

-- Seuls l'expéditeur et le voyageur peuvent voir leurs transactions
CREATE POLICY "Users can view own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = traveler_id);

-- Les transactions peuvent être créées par l'expéditeur ou le voyageur
CREATE POLICY "Users can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id OR auth.uid() = traveler_id);

-- Seuls l'expéditeur et le voyageur peuvent modifier leurs transactions
CREATE POLICY "Users can update own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = traveler_id);

-- =============================================
-- POLITIQUES POUR LA TABLE REVIEWS
-- =============================================

-- Seuls les participants à la transaction peuvent voir les évaluations
CREATE POLICY "Transaction participants can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = reviewer_id OR 
    auth.uid() = reviewee_id OR
    EXISTS (
      SELECT 1 FROM transactions 
      WHERE id = transaction_id 
      AND (sender_id = auth.uid() OR traveler_id = auth.uid())
    )
  );

-- Seuls les participants peuvent créer des évaluations
CREATE POLICY "Transaction participants can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM transactions 
      WHERE id = transaction_id 
      AND (sender_id = auth.uid() OR traveler_id = auth.uid())
    )
  );

-- =============================================
-- POLITIQUES POUR LA TABLE NOTIFICATIONS
-- =============================================

-- Les utilisateurs ne peuvent voir que leurs propres notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Les notifications peuvent être créées par le système (service role)
CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres notifications (marquer comme lu)
CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres notifications
CREATE POLICY "Users can delete own notifications"
  ON notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- POLITIQUES POUR LA TABLE PAYMENT_METHODS
-- =============================================

-- Les utilisateurs ne peuvent voir que leurs propres moyens de paiement
CREATE POLICY "Users can view own payment methods"
  ON payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres moyens de paiement
CREATE POLICY "Users can create own payment methods"
  ON payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent modifier leurs propres moyens de paiement
CREATE POLICY "Users can update own payment methods"
  ON payment_methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres moyens de paiement
CREATE POLICY "Users can delete own payment methods"
  ON payment_methods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- POLITIQUES POUR LA TABLE PAYMENTS
-- =============================================

-- Les utilisateurs ne peuvent voir que leurs propres paiements
CREATE POLICY "Users can view own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Les paiements peuvent être créés par le système ou l'utilisateur
CREATE POLICY "Users can create own payments"
  ON payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- POLITIQUES POUR LA TABLE SESSIONS
-- =============================================

-- Les utilisateurs ne peuvent voir que leurs propres sessions
CREATE POLICY "Users can view own sessions"
  ON sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent créer leurs propres sessions
CREATE POLICY "Users can create own sessions"
  ON sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Les utilisateurs peuvent supprimer leurs propres sessions
CREATE POLICY "Users can delete own sessions"
  ON sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =============================================
-- FONCTION POUR CRÉER UN PROFIL UTILISATEUR
-- =============================================

-- Fonction pour créer automatiquement un profil utilisateur lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, is_email_verified)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email_confirmed_at IS NOT NULL
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Trigger pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();