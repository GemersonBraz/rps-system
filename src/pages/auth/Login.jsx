import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ICONS } from '../../utils/icons';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const user = await login(email, password);
            if (user) {
                console.log("👤 Usuário logado como:", user.tipo);
                if (user.tipo === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }
        } catch (err) {
            console.error("Erro na submissão do login:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md bg-[var(--bg-card)] p-8 rounded-2xl shadow-2xl border border-[var(--border-color)] animation-fade-in">

                <div className="text-center mb-8">
                    <div className="inline-block p-4 rounded-full bg-[var(--bg-secondary)] mb-4">
                        <ICONS.LOGIN className="text-4xl text-[var(--color-brand)]" />
                    </div>
                    <h2 className="text-3xl font-bold text-[var(--color-brand)]">Portal de Acesso</h2>
                    <p className="text-[var(--text-secondary)] mt-2">Identifique-se, viajante.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Endereço de Email
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                                <ICONS.EDIT />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition-all"
                                placeholder="aventureiro@reino.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Senha de Acesso
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                                <ICONS.SETTINGS />
                            </span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold rounded-lg shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <ICONS.WAIT className="animate-spin text-xl" />
                        ) : (
                            <>
                                <ICONS.CONFIRM className="text-xl" />
                                Entrar no Reino
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-[var(--border-color)]">
                    <p className="text-[var(--text-secondary)]">
                        Ainda não possui lealdade?{' '}
                        <Link to="/register" className="text-[var(--color-brand)] font-bold hover:underline">
                            Jure a Bandeira (Cadastrar)
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
