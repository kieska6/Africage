DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users view own profile" ON public.users 
FOR SELECT TO authenticated USING (auth.uid() = id);