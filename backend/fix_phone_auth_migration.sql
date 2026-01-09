-- Migration to support Phone Auth (Email is optional for phone users)
-- 1. Make email nullable
ALTER TABLE public.users ALTER COLUMN email DROP NOT NULL;

-- 2. Update the trigger function to insert phone number and handle missing name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, name)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  
  INSERT INTO public.wallets (user_id, balance)
  VALUES (NEW.id, 0.00);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
