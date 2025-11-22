CREATE OR REPLACE FUNCTION public.audit_user_sensitive_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.is_admin != OLD.is_admin OR NEW.token_balance != OLD.token_balance THEN
    -- Log vers une table d'audit si créée ultérieurement
    RAISE NOTICE 'Sensitive change on user %: admin=%, tokens=%', NEW.id, NEW.is_admin, NEW.token_balance;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER audit_user_changes
  AFTER UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.audit_user_sensitive_changes();