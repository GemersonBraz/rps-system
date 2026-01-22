import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { showToast, authToasts } from '../utils/toasts';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Monitorar estado da autenticação (Sessão Real)
    useEffect(() => {
        // 1. Verificar sessão atual ao carregar
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    await syncUserData(session.user);
                }
            } catch (err) {
                console.error("Erro ao verificar sessão inicial:", err);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // 2. Ouvir mudanças no estado do Auth (Login/Logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            try {
                if (session) {
                    await syncUserData(session.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Erro na mudança de estado auth:", err);
            } finally {
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sincronizar dados do Auth Metadata + Tabela profiles
    const syncUserData = async (authUser) => {
        if (!authUser) return null;

        // 1. Pegar dados básicos do Metadata (fallback imediato)
        const metadata = authUser.user_metadata || {};
        const safeEmail = authUser.email || '';
        const basicInfo = {
            id: authUser.id,
            email: safeEmail,
            nome: metadata.nome || split_part(safeEmail, '@', 1),
            display_title: metadata.display_title || '',
            avatar_url: metadata.avatar_url || null,
            tipo: metadata.tipo || 'jogador',
            bio: metadata.bio || ''
        };

        // 2. Tentar buscar dados na tabela profiles com TIMEOUT
        try {
            // Promessa com timeout de 5 segundos
            const fetchData = supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .maybeSingle();

            const timeout = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout na busca do perfil')), 5000)
            );

            const { data: profile, error } = await Promise.race([fetchData, timeout]);

            if (profile) {
                console.log("✅ Perfil encontrado no banco para o ID:", authUser.id);
                const mergedData = { ...basicInfo, ...profile };
                setUser(mergedData);
                return mergedData;
            }
            console.warn("⚠️ Perfil NÃO encontrado na tabela 'profiles' para o ID:", authUser.id);
            console.warn("Isso explica por que você ainda é visto como 'jogador'.");
        } catch (error) {
            console.error('❌ Erro crítico/Timeout ao buscar perfil:', error.message);
        }

        // Fallback final: usa os dados do Auth
        setUser(basicInfo);
        return basicInfo;
    };

    // Helper seguro para extrair nome do email
    const split_part = (str, delim, part) => {
        if (!str) return 'Viajante';
        const parts = str.split(delim);
        return parts[part - 1] || str;
    };

    // Login Supabase
    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                authToasts.loginError();
                return false;
            }

            // Sincronizar perfil (Auth + DB)
            const profile = await syncUserData(data.user);

            const displayName = profile?.display_title || profile?.nome || email;
            authToasts.loginSuccess(displayName);

            return profile;
        } catch (err) {
            console.error("Erro fatal no login:", err);
            authToasts.loginError();
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout Supabase
    const logout = async () => {
        try {
            await supabase.auth.signOut();
            // Limpeza forçada de qualquer resíduo antes do reload
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/'; // Garante reset total e redirecionamento limpo
        } catch (err) {
            console.error("Erro ao deslogar do Supabase:", err);
            // Mesmo com erro, tentamos resetar o local
            window.location.href = '/';
        }
    };

    // Register Supabase
    const register = async (userData) => {
        setLoading(true);
        try {
            // No Supabase signUp, passamos o nome e avatar via options.data
            // Nosso trigger SQL handle_new_user vai pegar esses campos
            const { data, error } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        nome: userData.nome,
                        display_title: userData.display_title || '',
                        bio: userData.bio || '',
                        avatar_url: userData.avatar || null,
                        tipo: 'jogador'
                    }
                }
            });

            if (error) {
                showToast(error.message, { type: "error" });
                return false;
            }

            if (data.user) {
                showToast("Cadastro realizado! Verifique seu email para confirmar.", { icon: '📧', duration: 6000 });
            }

            return true;
        } catch (err) {
            console.error("Erro no cadastro:", err);
            showToast("Erro inesperado no cadastro.", { type: "error" });
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, syncUserData, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
