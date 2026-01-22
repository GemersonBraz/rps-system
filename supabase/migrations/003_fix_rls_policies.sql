-- ##################################################################
-- 1. CORREÇÃO DE RLS PARA A TABELA PROFILES
-- ##################################################################

-- Habilitar RLS (caso não esteja)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seu próprio perfil
CREATE POLICY "Usuários podem ver o próprio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Política: Usuários podem ver perfis públicos de outros (para o ranking/social)
CREATE POLICY "Leitura pública de perfis" 
ON public.profiles FOR SELECT 
USING (true);

-- Política: Usuários podem editar apenas o próprio perfil
CREATE POLICY "Usuários podem editar o próprio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- ##################################################################
-- 2. SEGURANÇA PARA OUTRAS TABELAS (ELEMENTAIS, NÍVEIS, ETC)
-- ##################################################################

-- Níveis de Progressão
ALTER TABLE public.niveis_progressao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de níveis" ON public.niveis_progressao FOR SELECT USING (true);

-- Elementais
ALTER TABLE public.elementais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de elementais" ON public.elementais FOR SELECT USING (true);

-- Golpes Especiais
ALTER TABLE public.golpes_especiais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de golpes" ON public.golpes_especiais FOR SELECT USING (true);

-- Habilidades Sugeridas
ALTER TABLE public.classe_habilidades_sugeridas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura pública de habilidades sugeridas" ON public.classe_habilidades_sugeridas FOR SELECT USING (true);

-- ##################################################################
-- 3. POLÍTICAS DE ADMIN (PERMISSÃO TOTAL)
-- ##################################################################

-- Criar uma política genérica para admins editarem qualquer conteúdo
-- Nota: Isso exige que o usuário tenha tipo = 'admin' em seu próprio profile
CREATE POLICY "Admins podem inserir classes" ON public.classes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND tipo = 'admin')
);

CREATE POLICY "Admins podem editar classes" ON public.classes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND tipo = 'admin')
);
