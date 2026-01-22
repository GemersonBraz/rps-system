-- 1. Criar o bucket de avatars (se não existir)
-- Nota: Isso geralmente é feito via Dashboard, mas podemos garantir via SQL em algumas versões do Supabase
-- ou simplesmente documentar. No entanto, as políticas de RLS são essenciais.

-- Garantir que a extensão de storage esteja habilitada
CREATE SCHEMA IF NOT EXISTS storage;

-- Inserir o bucket se ele não existir
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
);

-- 2. Configurar Políticas de RLS para o bucket 'avatars'

-- Limpar políticas antigas para evitar erro de "já existe"
DROP POLICY IF EXISTS "Avatars são públicos" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem dar upload no próprio avatar" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem atualizar o próprio avatar" ON storage.objects;
DROP POLICY IF EXISTS "Usuários podem deletar o próprio avatar" ON storage.objects;

-- Política: Qualquer pessoa pode ver os avatars (Público)
CREATE POLICY "Avatars são públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Política: Usuários autenticados podem fazer upload de seu PRÓPRIO avatar
CREATE POLICY "Usuários podem dar upload no próprio avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars' AND 
    name LIKE (auth.uid()::text || '.%')
);

-- Política: Usuários podem atualizar seu PRÓPRIO avatar
CREATE POLICY "Usuários podem atualizar o próprio avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '.%'))
WITH CHECK (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '.%'));

-- Política: Usuários podem deletar seu PRÓPRIO avatar
CREATE POLICY "Usuários podem deletar o próprio avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND name LIKE (auth.uid()::text || '.%'));
