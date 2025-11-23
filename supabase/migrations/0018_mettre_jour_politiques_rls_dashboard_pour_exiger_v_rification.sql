-- Politique SELECT users : Seulement si verified (pour dashboard stats)
DROP POLICY IF EXISTS "Users view own profile" ON public.users;
CREATE POLICY "Verified users view own profile" ON public.users 
FOR SELECT TO authenticated USING (
  auth.uid() = id AND is_account_verified()
);

-- Pour shipments/trips/reviews : Auth + verified (public mais contrôlé)
-- Exemple pour shipments (adaptez si besoin)
DROP POLICY IF EXISTS "Authenticated users can view shipments" ON public.shipments;
CREATE POLICY "Verified users can view shipments" ON public.shipments 
FOR SELECT TO authenticated USING (is_account_verified());

-- Admin bypass toujours (via is_admin())
CREATE POLICY "Admins view all shipments" ON public.shipments 
FOR ALL TO authenticated USING (is_admin());