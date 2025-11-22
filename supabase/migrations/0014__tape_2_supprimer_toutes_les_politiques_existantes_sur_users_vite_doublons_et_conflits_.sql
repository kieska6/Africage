DROP POLICY IF EXISTS "Users view own profile" ON public.users;
DROP POLICY IF EXISTS "Allow individual users to update their own data." ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users." ON public.users;
DROP POLICY IF EXISTS "Admins can update any user." ON public.users;
DROP POLICY IF EXISTS "Enable update for users" ON public.users;
DROP POLICY IF EXISTS "Enable delete for users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for users" ON public.users;