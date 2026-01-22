import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ICONS } from '../../utils/icons';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        display_title: '',
        email: '',
        password: '',
        confirmPassword: '',
        bio: '',
        avatar: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }

        setIsSubmitting(true);
        const success = await register(formData);
        if (success) {
            // No Supabase real, o usuário precisa confirmar email
            navigate('/login');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen py-10 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-[var(--bg-card)] p-8 rounded-2xl shadow-2xl border border-[var(--border-color)]">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[var(--color-brand)] flex items-center justify-center gap-3">
                        <ICONS.REGISTER />
                        Juramento de Lealdade
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-2">Crie sua lenda neste mundo.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coluna 1: Dados Pessoais */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] border-b pb-2 border-[var(--border-color)]">
                            Identidade
                        </h3>

                        <div>
                            <label className="label-text">Nome Real</label>
                            <input name="nome" value={formData.nome} onChange={handleChange} required
                                className="input-field" placeholder="Seu nome" />
                        </div>

                        <div>
                            <label className="label-text">Título de Guerra (Display Name)</label>
                            <input name="display_title" value={formData.display_title} onChange={handleChange} required
                                className="input-field" placeholder="Ex: O Destruidor" />
                        </div>

                        <div>
                            <label className="label-text">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                className="input-field" placeholder="seu@email.com" />
                        </div>
                    </div>

                    {/* Coluna 2: Segurança e Detalhes */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] border-b pb-2 border-[var(--border-color)]">
                            Segurança & Detalhes
                        </h3>

                        <div>
                            <label className="label-text">Senha</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required
                                className="input-field" placeholder="******" />
                        </div>

                        <div>
                            <label className="label-text">Confirmar Senha</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required
                                className="input-field" placeholder="******" />
                        </div>

                        <div className="avatar-selection-container">
                            <label className="label-text mb-2">Avatar do Herói</label>

                            {/* Tabs Simples */}
                            <div className="flex gap-4 mb-3 text-sm">
                                <button type="button"
                                    onClick={() => setFormData(p => ({ ...p, avatarType: 'icon' }))}
                                    className={`pb-1 border-b-2 transition-colors ${!formData.avatar?.startsWith('http') ? 'border-[var(--color-brand)] text-[var(--color-brand)] font-bold' : 'border-transparent text-[var(--text-secondary)]'}`}
                                >
                                    Escolher Classe/Raça
                                </button>
                                <button type="button"
                                    onClick={() => setFormData(p => ({ ...p, avatar: '', avatarType: 'url' }))}
                                    className={`pb-1 border-b-2 transition-colors ${formData.avatar?.startsWith('http') ? 'border-[var(--color-brand)] text-[var(--color-brand)] font-bold' : 'border-transparent text-[var(--text-secondary)]'}`}
                                >
                                    Usar URL de Imagem
                                </button>
                            </div>

                            {!formData.avatar?.startsWith('http') ? (
                                <div className="grid grid-cols-4 gap-2 bg-[var(--bg-primary)] p-2 rounded-lg border border-[var(--border-color)]">
                                    {[
                                        { id: 'warrior', icon: ICONS.WARRIOR, name: 'Guerreiro' },
                                        { id: 'wizard', icon: ICONS.WIZARD, name: 'Mago' },
                                        { id: 'rogue', icon: ICONS.ROGUE, name: 'Ladino' },
                                        { id: 'elf', icon: ICONS.ELF, name: 'Elfo' },
                                        { id: 'barbarian', icon: ICONS.BARBARIAN, name: 'Bárbaro' },
                                        { id: 'orc', icon: ICONS.ORC, name: 'Orc' },
                                        { id: 'goblin', icon: ICONS.GOBLIN, name: 'Goblin' },
                                        { id: 'skeleton', icon: ICONS.SKELETON, name: 'Renegado' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setFormData(p => ({
                                                ...p,
                                                avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${opt.id}`
                                            }))}
                                            className={`flex flex-col items-center justify-center p-2 rounded hover:bg-[var(--bg-secondary)] transition-all ${formData.avatar?.includes(opt.id) ? 'ring-2 ring-[var(--color-brand)] bg-[var(--bg-secondary)]' : ''}`}
                                            title={opt.name}
                                        >
                                            <opt.icon className="text-2xl text-[var(--text-primary)]" />
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    name="avatar"
                                    value={formData.avatar}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="https://..."
                                    autoFocus
                                />
                            )}
                            <p className="text-xs text-[var(--text-secondary)] mt-1">
                                {formData.avatar?.startsWith('http') ? 'Preview não disponível' : `Selecionado: ${formData.avatar || 'Nenhum'}`}
                            </p>
                        </div>
                    </div>

                    {/* Full Width: Bio */}
                    <div className="md:col-span-2">
                        <label className="label-text">Biografia (Opcional)</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3"
                            className="input-field resize-none" placeholder="Conte um pouco da sua história..." />
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold rounded-lg shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <ICONS.WAIT className="animate-spin" /> : <ICONS.CONFIRM />}
                            Confirmar Cadastro
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[var(--text-secondary)]">
                        Já possui conta?{' '}
                        <Link to="/login" className="text-[var(--color-brand)] font-bold hover:underline">
                            Ir para Login
                        </Link>
                    </p>
                </div>

                <style>{`
                    .label-text {
                        display: block;
                        font-size: 0.875rem;
                        font-weight: 500;
                        color: var(--text-secondary);
                        margin-bottom: 0.25rem;
                    }
                    .input-field {
                        width: 100%;
                        padding: 0.75rem;
                        background-color: var(--bg-primary);
                        border: 1px solid var(--border-color);
                        border-radius: 0.5rem;
                        color: var(--text-primary);
                        outline: none;
                        transition: all 0.2s;
                    }
                    .input-field:focus {
                        border-color: var(--color-brand);
                        box-shadow: 0 0 0 2px rgba(var(--color-brand), 0.1);
                    }
                `}</style>
            </div>
        </div>
    );
}
