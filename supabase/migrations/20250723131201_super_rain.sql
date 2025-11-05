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

-- Create additional functions for business logic
CREATE OR REPLACE FUNCTION public.update_user_average_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    UPDATE public.users
    SET
        average_rating = (
            SELECT AVG(rating)
            FROM public.reviews
            WHERE reviewee_id = NEW.reviewee_id
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE reviewee_id = NEW.reviewee_id
        )
    WHERE id = NEW.reviewee_id;
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_notification_on_shipment_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- CAS 1: Une offre vient d'être acceptée.
    -- Le statut passe de PENDING à CONFIRMED et un voyageur est assigné.
    IF OLD.status = 'PENDING' AND NEW.status = 'CONFIRMED' THEN
        INSERT INTO public.notifications (user_id, type, message, link_to)
        VALUES (
            NEW.traveler_id,
            'OFFER_ACCEPTED',
            'Bonne nouvelle ! Votre offre pour le colis "' || NEW.title || '" a été acceptée.',
            '/shipments/' || NEW.id
        );
    END IF;

    -- CAS 2: Le colis est marqué comme livré.
    -- Le statut passe de CONFIRMED à DELIVERED.
    IF OLD.status = 'CONFIRMED' AND NEW.status = 'DELIVERED' THEN
        -- Notifie l'expéditeur
        INSERT INTO public.notifications (user_id, type, message, link_to)
        VALUES (
            NEW.sender_id,
            'SHIPMENT_COMPLETED',
            'Votre colis "' || NEW.title || '" a bien été livré. N''oubliez pas de laisser une évaluation !',
            '/shipments/' || NEW.id
        );
        -- Notifie le voyageur
        INSERT INTO public.notifications (user_id, type, message, link_to)
        VALUES (
            NEW.traveler_id,
            'SHIPMENT_COMPLETED',
            'La livraison du colis "' || NEW.title || '" est terminée. N''oubliez pas de laisser une évaluation !',
            '/shipments/' || NEW.id
        );
    END IF;

    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_notification_on_new_message()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    recipient_id UUID;
    conversation_details RECORD;
BEGIN
    -- Trouve les détails de la conversation.
    SELECT sender_id, traveler_id INTO conversation_details FROM public.conversations WHERE id = NEW.conversation_id;

    -- Détermine qui est le destinataire (celui qui N'EST PAS l'expéditeur du message).
    IF NEW.sender_id = conversation_details.sender_id THEN
        recipient_id := conversation_details.traveler_id;
    ELSE
        recipient_id := conversation_details.sender_id;
    END IF;

    -- Insère la notification pour le destinataire.
    INSERT INTO public.notifications (user_id, type, message, link_to)
    VALUES (
        recipient_id,
        'NEW_MESSAGE',
        'Vous avez reçu un nouveau message.',
        '/messages/' || NEW.conversation_id
    );
    RETURN NEW;
END;
$function$;

-- Create triggers for the new functions
CREATE TRIGGER update_user_average_rating
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_average_rating();

CREATE TRIGGER create_notification_on_shipment_update
  AFTER UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION create_notification_on_shipment_update();

CREATE TRIGGER create_notification_on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION create_notification_on_new_message();

-- Add more RLS policies for enhanced security
CREATE POLICY "Users can view own shipments" ON public.shipments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can update own shipments" ON public.shipments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete own shipments" ON public.shipments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can view own trips" ON public.trips
  FOR SELECT
  TO authenticated
  USING (auth.uid() = traveler_id);

CREATE POLICY "Users can update own trips" ON public.trips
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = traveler_id);

CREATE POLICY "Users can delete own trips" ON public.trips
  FOR DELETE
  TO authenticated
  USING (auth.uid() = traveler_id);

CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = sender_id) OR (auth.uid() = traveler_id));

CREATE POLICY "Users can update own transactions" ON public.transactions
  FOR UPDATE
  TO authenticated
  USING ((auth.uid() = sender_id) OR (auth.uid() = traveler_id));

CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT
  TO authenticated
  USING ((auth.uid() = sender_id) OR (auth.uid() = traveler_id));

CREATE POLICY "Users can send messages in their conversations" ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE ((c.id = messages.conversation_id) AND ((c.sender_id = auth.uid()) OR (c.traveler_id = auth.uid())))
    )
  );

CREATE POLICY "Users can view messages in their conversations" ON public.messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.conversations c
      WHERE ((c.id = messages.conversation_id) AND ((c.sender_id = auth.uid()) OR (c.traveler_id = auth.uid())))
    )
  );

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payment methods" ON public.payment_methods
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payment methods" ON public.payment_methods
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payment methods" ON public.payment_methods
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payment methods" ON public.payment_methods
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own payments" ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all shipments" ON public.shipments
  FOR SELECT
  TO authenticated
  USING (
    ( SELECT users.is_admin
       FROM users
      WHERE (users.id = auth.uid()))
  );

CREATE POLICY "Admins can delete any shipment" ON public.shipments
  FOR DELETE
  TO authenticated
  USING (
    ( SELECT users.is_admin
       FROM users
      WHERE (users.id = auth.uid()))
  );

-- Add additional indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_pickup_city ON public.shipments(pickup_city);
CREATE INDEX IF NOT EXISTS idx_shipments_delivery_city ON public.shipments(delivery_city);
CREATE INDEX IF NOT EXISTS idx_shipments_proposed_price ON public.shipments(proposed_price);
CREATE INDEX IF NOT EXISTS idx_trips_departure_city ON public.trips(departure_city);
CREATE INDEX IF NOT EXISTS idx_trips_arrival_city ON public.trips(arrival_city);
CREATE INDEX IF NOT EXISTS idx_trips_price_per_kg ON public.trips(price_per_kg);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_status ON public.transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at);

-- Add more comments for documentation
COMMENT ON FUNCTION public.update_user_average_rating() IS 'Updates user average rating and review count when a new review is added';
COMMENT ON FUNCTION public.create_notification_on_shipment_update() IS 'Creates notifications when shipment status changes';
COMMENT ON FUNCTION public.create_notification_on_new_message() IS 'Creates notifications when a new message is received';