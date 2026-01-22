import { createClient } from '@supabase/supabase-js';

// Credenciais do Supabase (vem do arquivo .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação básica
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Credenciais do Supabase não encontradas!');
    console.error('Verifique se o arquivo .env.local existe e está preenchido.');
}

// Criar cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper para debug
export const testConnection = async () => {
    try {
        const { data, error } = await supabase.from('_test_').select('*').limit(1);

        // Se o erro for "tabela não existe", a conexão está OK!
        if (error) {
            // Códigos de erro que indicam conexão OK:
            // 42P01 = tabela não existe (PostgreSQL)
            // PGRST116 = tabela não existe (PostgREST)
            if (error.code === '42P01' || error.code === 'PGRST116' || error.message.includes('not find the table')) {
                console.log('✅ Conexão com Supabase OK! (Banco vazio - tabela de teste não existe, como esperado)');
                return { success: true, message: 'Conexão estabelecida! Banco está vazio (esperado).' };
            }

            // Outros erros (credenciais inválidas, etc.)
            console.error('❌ Erro ao conectar:', error.message);
            return { success: false, message: error.message };
        }

        console.log('✅ Conexão com Supabase OK!');
        return { success: true, message: 'Conexão estabelecida com sucesso!' };
    } catch (err) {
        console.error('❌ Erro de conexão:', err);
        return { success: false, message: err.message || 'Erro desconhecido' };
    }
};
