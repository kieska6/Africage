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

-- Add missing functions for user role management and token system
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role app_role)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Vérifie si l'appelant est un admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Permission denied: Only admins can change user roles.';
  END IF;

  -- Met à jour le rôle de l'utilisateur cible
  UPDATE public.users
  SET role = new_role
  WHERE id = target_user_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.add_tokens_to_user(user_id_input uuid, tokens_to_add integer)
RETURNS void
LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE public.users
  SET token_balance = token_balance + tokens_to_add
  WHERE id = user_id_input;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS app_role
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  user_role app_role;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN get_user_role() = 'ADMIN';
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN get_user_role() = 'MODERATOR';
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_total_shipment_count()
RETURNS integer
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.shipments);
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_total_user_count()
RETURNS integer
LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.users);
END;
$function$;

-- Create additional RLS policies for admin functions
CREATE POLICY "Admins can update any user" ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    ( SELECT users.is_admin
       FROM users
      WHERE (users.id = auth.uid()))
  );

CREATE POLICY "Admins can view all transactions" ON public.transactions
  FOR SELECT
  TO authenticated
  USING (
    ( SELECT users.is_admin
       FROM users
      WHERE (users.id = auth.uid()))
  );

-- Add more indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_token_balance ON public.users(token_balance);

-- Add comments for the new functions
COMMENT ON FUNCTION public.update_user_role(uuid, app_role) IS 'Updates user role (admin only)';
COMMENT ON FUNCTION public.add_tokens_to_user(uuid, integer) IS 'Adds tokens to user balance';
COMMENT ON FUNCTION public.get_user_role() IS 'Gets current user role';
COMMENT ON FUNCTION public.is_admin() IS 'Checks if current user is admin';
COMMENT ON FUNCTION public.is_moderator() IS 'Checks if current user is moderator';
COMMENT ON FUNCTION public.get_total_shipment_count() IS 'Gets total shipment count';
COMMENT ON FUNCTION public.get_total_user_count() IS 'Gets total user count';

-- Create additional constraints
ALTER TABLE public.users ADD CONSTRAINT valid_role CHECK (role IN ('USER', 'MODERATOR', 'ADMIN'));
ALTER TABLE public.users ADD CONSTRAINT valid_status CHECK (status IN ('PENDING_VERIFICATION', 'VERIFIED', 'SUSPENDED', 'INACTIVE'));
ALTER TABLE public.users ADD CONSTRAINT valid_kyc_status CHECK (kyc_status IN ('NOT_SUBMITTED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED'));
ALTER TABLE public.shipments ADD CONSTRAINT valid_status CHECK (status IN ('PENDING_MATCH', 'MATCHED', 'IN_TRANSIT', 'DELIVERED', 'CANCELED'));
ALTER TABLE public.trips ADD CONSTRAINT valid_status CHECK (status IN ('AVAILABLE', 'PARTIALLY_BOOKED', 'FULLY_BOOKED', 'COMPLETED', 'CANCELED'));
ALTER TABLE public.transactions ADD CONSTRAINT valid_status CHECK (status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'DELIVERED', 'DISPUTED', 'CANCELED', 'COMPLETED'));
ALTER TABLE public.transactions ADD CONSTRAINT valid_payment_status CHECK (payment_status IN ('PENDING', 'PAID', 'REFUNDED', 'FAILED'));
ALTER TABLE public.notifications ADD CONSTRAINT valid_type CHECK (type IN ('NEW_MESSAGE', 'OFFER_ACCEPTED', 'SHIPMENT_COMPLETED', 'PAYMENT_RECEIVED', 'REVIEW_RECEIVED', 'SYSTEM_ALERT'));
ALTER TABLE public.reviews ADD CONSTRAINT valid_type CHECK (type IN ('SENDER_TO_TRAVELER', 'TRAVELER_TO_SENDER'));
ALTER TABLE public.reviews ADD CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE public.reviews ADD CONSTRAINT valid_punctuality CHECK (punctuality IS NULL OR (punctuality >= 1 AND punctuality <= 5));
ALTER TABLE public.reviews ADD CONSTRAINT valid_communication CHECK (communication IS NULL OR (communication >= 1 AND communication <= 5));
ALTER TABLE public.reviews ADD CONSTRAINT valid_carefulness CHECK (carefulness IS NULL OR (carefulness >= 1 AND carefulness <= 5));

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;