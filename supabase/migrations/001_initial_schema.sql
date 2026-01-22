/*
  # 📊 Schema Inicial - Honra e Sombra RPG
  
  ## 🎯 Objetivo
  Este arquivo contém a estrutura completa do banco de dados para o sistema de RPG,
  incluindo tabelas de conteúdo, perfis de usuário, sistema de auditoria e segurança.

  ## 🧱 Estrutura Principal
  1.  **Profiles**: Vinculado ao Auth do Supabase, armazena dados extras do usuário.
  2.  **RPG Core**: Classes, Magias, Habilidades, Armas, Equipamentos.
  3.  **Mecânicas**: Progressão de Níveis, Sistema Elemental.
  4.  **Auditoria**: Rastreamento de quem criou/editou cada item.

  ## 🔗 Relacionamentos
  - `classes` é a tabela pai de quase tudo (Magias, Armas, Equipamentos, Golpes).
  - `audit_logs` registra todas as mudanças manuais feitas por admins.
  
  ## 🛠️ Triggers e Automação
  - Atualização automática de `updated_at`.
  - Criação automática de `profile` ao registrar novo usuário no Auth.
  - Registro de auditoria em tabelas críticas.
*/

-- ##################################################################
-- 1. EXTENSÕES E UTILITÁRIOS
-- ##################################################################
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ##################################################################
-- 2. TABELAS DE USUÁRIOS E AUDITORIA
-- ##################################################################

-- Tabela de Perfis
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    nome TEXT,
    email TEXT,
    avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/adventurer/svg?seed=default', -- Placeholder
    tipo TEXT DEFAULT 'jogador' CHECK (tipo IN ('admin', 'jogador')),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Auditoria (Logs de Alterações)
CREATE TABLE public.audit_logs (
    id SERIAL PRIMARY KEY,
    tabela TEXT NOT NULL,
    item_id TEXT NOT NULL,
    acao TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    dados_antigos JSONB,
    dados_novos JSONB,
    executado_por UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ##################################################################
-- 3. CORE DO RPG (CLASSES E PROGRESSÃO)
-- ##################################################################

CREATE TABLE public.classes (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    emoji TEXT,
    especializacao TEXT,
    descricao TEXT,
    historia TEXT,
    tipo_desenvolvimento TEXT CHECK (tipo_desenvolvimento IN ('mundano', 'mistico')),
    protecao_total_base INTEGER DEFAULT 0,
    resistencia_protecao INTEGER DEFAULT 0,
    icone_path TEXT,
    image_url TEXT DEFAULT 'https://api.dicebear.com/7.x/icons/svg?seed=class', -- Placeholder
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.niveis_progressao (
    id SERIAL PRIMARY KEY,
    tipo_desenvolvimento TEXT CHECK (tipo_desenvolvimento IN ('mundano', 'mistico')),
    nivel INTEGER NOT NULL,
    nome_nivel TEXT,
    atk_dados TEXT,
    def_dados TEXT,
    con_dados TEXT,
    hp_base INTEGER,
    pontos_especial INTEGER,
    pontos_habilidade_sec INTEGER,
    UNIQUE(tipo_desenvolvimento, nivel)
);

-- ##################################################################
-- 4. CONTEÚDO (MAGIAS, HABILIDADES, EQUIPAMENTOS)
-- ##################################################################

CREATE TABLE public.magias (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL,
    classe_id INTEGER REFERENCES public.classes(id) ON DELETE CASCADE,
    categoria TEXT CHECK (categoria IN ('permanente', 'nao_permanente', 'assassino')),
    nivel_minimo INTEGER DEFAULT 1,
    tipo TEXT,
    duracao TEXT,
    efeito TEXT,
    importancia INTEGER DEFAULT 0,
    image_url TEXT DEFAULT 'https://api.dicebear.com/7.x/icons/svg?seed=magic',
    observacoes TEXT,
    ordem INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.habilidades_secundarias (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    emoji TEXT,
    nivel_custo INTEGER CHECK (nivel_custo BETWEEN 1 AND 3),
    descricao TEXT,
    efeito_combate TEXT,
    categoria TEXT,
    image_url TEXT DEFAULT 'https://api.dicebear.com/7.x/icons/svg?seed=skill',
    ativo BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.armas (
    id SERIAL PRIMARY KEY,
    classe_id INTEGER REFERENCES public.classes(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    atk_com INTEGER DEFAULT 0,
    def INTEGER DEFAULT 0,
    valor INTEGER DEFAULT 0,
    curso_requerido TEXT,
    tipo TEXT,
    image_url TEXT DEFAULT 'https://api.dicebear.com/7.x/icons/svg?seed=weapon',
    observacoes TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE public.equipamentos (
    id SERIAL PRIMARY KEY,
    classe_id INTEGER REFERENCES public.classes(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    tipo TEXT,
    capacidade TEXT,
    efeito TEXT,
    valor INTEGER DEFAULT 0,
    image_url TEXT DEFAULT 'https://api.dicebear.com/7.x/icons/svg?seed=item',
    observacoes TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id),
    updated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE public.elementais (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    emoji TEXT,
    efeito_principal TEXT,
    efeitos_alternativos TEXT,
    image_url TEXT DEFAULT 'https://api.dicebear.com/7.x/icons/svg?seed=element',
    observacoes TEXT,
    created_by UUID REFERENCES public.profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ##################################################################
-- 5. RELACIONAMENTOS E MECÂNICAS EXTRAS
-- ##################################################################

CREATE TABLE public.classe_habilidades_sugeridas (
    id SERIAL PRIMARY KEY,
    classe_id INTEGER REFERENCES public.classes(id) ON DELETE CASCADE,
    habilidade_id INTEGER REFERENCES public.habilidades_secundarias(id) ON DELETE CASCADE,
    nivel_sugerido INTEGER DEFAULT 1,
    ordem INTEGER DEFAULT 0
);

CREATE TABLE public.golpes_especiais (
    id SERIAL PRIMARY KEY,
    classe_id INTEGER REFERENCES public.classes(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    uso_por_luta TEXT,
    efeito TEXT,
    custo_pontos INTEGER,
    descricao TEXT,
    ordem INTEGER DEFAULT 0
);

CREATE TABLE public.skills_especiais (
    id SERIAL PRIMARY KEY,
    nome TEXT NOT NULL UNIQUE,
    tipo TEXT,
    descricao TEXT,
    efeito_combate TEXT,
    limitacoes TEXT,
    observacoes TEXT
);

CREATE TABLE public.classe_habilidades_especiais (
    id SERIAL PRIMARY KEY,
    classe_id INTEGER REFERENCES public.classes(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    nivel_custo INTEGER DEFAULT 3,
    descricao TEXT,
    efeito TEXT,
    tipo TEXT
);

CREATE TABLE public.classe_desvantagens (
    id SERIAL PRIMARY KEY,
    classe_id INTEGER REFERENCES public.classes(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    nivel_aquisicao TEXT,
    descricao TEXT,
    penalidade TEXT
);

-- ##################################################################
-- 6. AUTOMAÇÃO (TRIGGERS)
-- ##################################################################

-- Trigger para perfis
CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_classes_modtime BEFORE UPDATE ON classes FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Função especial para criar perfil no Auth.users -> profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email, avatar_url, tipo)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)), 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://api.dicebear.com/7.x/adventurer/svg?seed=' || new.id), 
    COALESCE(new.raw_user_meta_data->>'tipo', 'jogador')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para automatizar a criação do perfil
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ##################################################################
-- 7. SEGURANÇA (RLS)
-- ##################################################################

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habilidades_secundarias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.armas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura: Pública
CREATE POLICY "Leitura pública" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Leitura pública magias" ON public.magias FOR SELECT USING (true);
CREATE POLICY "Leitura pública habilidades" ON public.habilidades_secundarias FOR SELECT USING (true);
CREATE POLICY "Leitura pública armas" ON public.armas FOR SELECT USING (true);
CREATE POLICY "Leitura pública equipamentos" ON public.equipamentos FOR SELECT USING (true);

-- Políticas de Auditoria: Apenas Admins veem
CREATE POLICY "Admins leem auditoria" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND tipo = 'admin')
);

-- ##################################################################
-- 8. DADOS INICIAIS (SEED)
-- ##################################################################

INSERT INTO public.elementais (nome, emoji, efeito_principal) VALUES 
('Relâmpago', '⚡', 'Causa -8 HP no inimigo'),
('Fogo', '🔥', 'Dano contínuo de queimadura'),
('Água', '💧', 'Cura +15 HP ou anula fogo'),
('Terra', '🪨', 'Aumenta defesa em +5'),
('Ar', '🌬️', 'Aumenta velocidade/esquiva');

INSERT INTO public.niveis_progressao (tipo_desenvolvimento, nivel, nome_nivel, atk_dados, def_dados, hp_base) VALUES 
('mundano', 1, 'Principiante', '1D6', '1D6', 100),
('mistico', 1, 'Principiante', '1D4', '1D4', 80);
