CREATE OR REPLACE FUNCTION public.prevent_self_admin_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.is_admin = true AND OLD.is_admin = false AND auth.uid() != '00000000-0000-0000-0000-000000000000' THEN -- Remplacez par ID admin connu si besoin
    RAISE EXCEPTION 'Users cannot self-promote to admin';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_admin_escalation
  BEFORE UPDATE OF is_admin ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_admin_escalation();