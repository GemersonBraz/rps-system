-- ##################################################################
-- CORREÇÃO DE RLS: PERMISSÕES DE ADMIN PARA GESTÃO DE USUÁRIOS
-- ##################################################################

-- 1. Permitir que ADMIMS vejam todos os perfis (já existe, mas vamos garantir)
-- DROP POLICY IF EXISTS "Leitura pública de perfis" ON public.profiles;
-- CREATE POLICY "Leitura pública de perfis" ON public.profiles FOR SELECT USING (true);

-- 2. Permitir que ADMINS atualizem qualquer perfil
-- Esta política permite que usuários com tipo = 'admin' editem qualquer linha na tabela profiles.
-- Usamos uma subquery para verificar se o ID de quem está tentando editar (auth.uid()) 
-- pertence a um perfil com tipo 'admin'.

DROP POLICY IF EXISTS "Admins podem atualizar qualquer perfil" ON public.profiles;

CREATE POLICY "Admins podem atualizar qualquer perfil" 
ON public.profiles FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND tipo = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND tipo = 'admin'
  )
);

-- Nota: O Supabase pode reclamar de recursão infinita se a política de SELECT 
-- não estiver bem definida, mas como a "Leitura pública de perfis" está como USING (true),
-- a subquery acima deve funcionar sem problemas.

-- 3. Garantir que ADMINS possam deletar perfis se necessário (Opcional, mas útil)
DROP POLICY IF EXISTS "Admins podem deletar qualquer perfil" ON public.profiles;
CREATE POLICY "Admins podem deletar qualquer perfil" 
ON public.profiles FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND tipo = 'admin'
  )
);
