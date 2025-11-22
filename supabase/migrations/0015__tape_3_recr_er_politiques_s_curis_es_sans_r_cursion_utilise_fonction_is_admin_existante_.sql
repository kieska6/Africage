-- Users normaux: voir et updater seulement leur profil
CREATE POLICY "Users view own profile" ON public.users 
FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users update own profile" ON public.users 
FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Admins: tout voir et updater (via fonction SECURITY DEFINER, pas de récursion)
CREATE POLICY "Admins view all users" ON public.users 
FOR SELECT TO authenticated USING (is_admin());

CREATE POLICY "Admins update all users" ON public.users 
FOR UPDATE TO authenticated USING (is_admin());

-- INSERT géré par trigger handle_new_user() (pas besoin de policy INSERT manuelle)