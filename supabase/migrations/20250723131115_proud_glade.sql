-- This migration was automatically generated. It's important to check it for unintended changes.
-- If you want to revert this migration, run: npx supabase migration down
-- To apply this migration, run: npx supabase migration up

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET client_min_messages = warning;
SET default_tablespace = '';
SET default_table_access_method = heap;

CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    profile_picture TEXT,
    date_of_birth TIMESTAMP WITH TIME ZONE,
    role TEXT DEFAULT 'BOTH',
    status TEXT DEFAULT 'PENDING_VERIFICATION',
    is_phone_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    is_identity_verified BOOLEAN DEFAULT false,
    identity_document TEXT,
    city TEXT,
    country TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    monthly_token_quota INTEGER,
    token_balance INTEGER DEFAULT 0,
    kyc_status TEXT DEFAULT 'NOT_SUBMITTED',
    kyc_document_url TEXT,
    phone_number TEXT,
    profile_avatar_url TEXT,
    is_profile_complete BOOLEAN DEFAULT false,
    is_admin BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    average_rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    weight DECIMAL(10,2) NOT NULL,
    length DECIMAL(10,2),
    width DECIMAL(10,2),
    height DECIMAL(10,2),
    photos TEXT[] DEFAULT '{}',
    pickup_address TEXT NOT NULL,
    pickup_city TEXT NOT NULL,
    pickup_country TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_city TEXT NOT NULL,
    delivery_country TEXT NOT NULL,
    proposed_price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'XOF',
    pickup_date_from TIMESTAMP WITH TIME ZONE,
    pickup_date_to TIMESTAMP WITH TIME ZONE,
    delivery_date_by TIMESTAMP WITH TIME ZONE,
    is_urgent BOOLEAN DEFAULT false,
    is_fragile BOOLEAN DEFAULT false,
    requires_signature BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'PENDING_MATCH',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    traveler_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    departure_city TEXT NOT NULL,
    departure_country TEXT NOT NULL,
    arrival_city TEXT NOT NULL,
    arrival_country TEXT NOT NULL,
    departure_date TIMESTAMP WITH TIME ZONE NOT NULL,
    arrival_date TIMESTAMP WITH TIME ZONE NOT NULL,
    available_weight DECIMAL(10,2) NOT NULL,
    available_volume DECIMAL(10,2),
    max_packages INTEGER DEFAULT 1,
    price_per_kg DECIMAL(10,2),
    minimum_price DECIMAL(10,2),
    currency TEXT DEFAULT 'XOF',
    status TEXT DEFAULT 'AVAILABLE',
    is_recurring BOOLEAN DEFAULT false,
    recurring_pattern TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    traveler_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    agreed_price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'XOF',
    platform_fee DECIMAL(10,2) DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    payment_status TEXT DEFAULT 'PENDING',
    security_code TEXT NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    picked_up_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    traveler_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    reviewee_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    type TEXT NOT NULL,
    punctuality INTEGER,
    communication INTEGER,
    carefulness INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    link_to TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    account_number TEXT NOT NULL,
    account_name TEXT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'XOF',
    type TEXT NOT NULL,
    method TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    external_id TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_sender_id ON public.shipments(sender_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_traveler_id ON public.trips(traveler_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_shipment_id ON public.transactions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_conversations_shipment_id ON public.conversations(shipment_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations(sender_id, traveler_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_reviews_transaction_id ON public.reviews(transaction_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON public.reviews(reviewee_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON public.payment_methods(is_default);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- Create RLS policies for security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$function$;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at
  BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    ( SELECT users.is_admin
       FROM users
      WHERE (users.id = auth.uid()))
  );

-- Add comments for documentation
COMMENT ON TABLE public.users IS 'User accounts and profiles';
COMMENT ON TABLE public.shipments IS 'Package listings and shipments';
COMMENT ON TABLE public.trips IS 'Traveler trip listings';
COMMENT ON TABLE public.transactions IS 'Package-trip matching and transactions';
COMMENT ON TABLE public.conversations IS 'Message threads between users';
COMMENT ON TABLE public.messages IS 'Individual messages in conversations';
COMMENT ON TABLE public.reviews IS 'User ratings and reviews';
COMMENT ON TABLE public.notifications IS 'User notifications';
COMMENT ON TABLE public.payment_methods IS 'User payment methods';
COMMENT ON TABLE public.payments IS 'Payment transactions';