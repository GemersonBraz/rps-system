-- ##################################################################
-- 1. ADICIONAR COLUNAS FALTANTES EM PROFILES
-- ##################################################################

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS display_title TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- ##################################################################
-- 2. ATUALIZAR FUNÇÃO DE CRIAÇÃO AUTOMÁTICA DE PERFIL
-- ##################################################################

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, avatar_url, tipo, display_title, bio)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/adventurer/svg?seed=' || new.id), 
    COALESCE(new.raw_user_meta_data->>'tipo', 'jogador'),
    new.raw_user_meta_data->>'display_title',
    new.raw_user_meta_data->>'bio'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
