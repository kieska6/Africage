-- Ajouter 'VERIFIED' à l'enum user_status si pas présent
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'VERIFIED' AND enumtypid = 'public.user_status'::regtype) THEN
    ALTER TYPE public.user_status ADD VALUE 'VERIFIED';
  END IF;
END $$;

-- Fonction pour vérifier si compte est fully verified (bypass RLS)
CREATE OR REPLACE FUNCTION public.is_account_verified()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND status = 'VERIFIED'::user_status
    AND is_profile_complete = true
  );
END;
$$;

-- Fonction RPC pour auto-updater status si toutes vérifs OK
CREATE OR REPLACE FUNCTION public.verify_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record public.users;
BEGIN
  SELECT * INTO user_record FROM public.users WHERE id = auth.uid();
  
  -- Conditions pour VERIFIED : profil complet + au moins phone/email + KYC submitted
  IF user_record.is_profile_complete 
     AND (user_record.is_phone_verified OR user_record.is_email_verified)
     AND user_record.kyc_status IN ('SUBMITTED'::kyc_status, 'APPROVED'::kyc_status) THEN
    UPDATE public.users 
    SET status = 'VERIFIED'::user_status,
        updated_at = now()
    WHERE id = auth.uid();
  END IF;
END;
$$;