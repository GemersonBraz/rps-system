import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ICONS } from '../../utils/icons';
import { showToast } from '../../utils/toasts';
import { supabase } from '../../lib/supabase';
import ConfirmationModal from '../../components/ConfirmationModal';

// Lista de Avatars Padrão (Icons do game)
const DEFAULT_AVATARS = [
    { id: 'helmet', icon: ICONS.HELMET, label: 'Guerreiro' },
    { id: 'wizard', icon: ICONS.WIZARD, label: 'Mago' },
    { id: 'skull', icon: ICONS.SKULL, label: 'Vilão' },
    { id: 'tower', icon: ICONS.TOWER, label: 'Mestre' },
    { id: 'history', icon: ICONS.HISTORY, label: 'Historiador' },
    { id: 'confirm', icon: ICONS.CONFIRM, label: 'Paladino' },
];

export default function Profile() {
    const { user, loading, syncUserData } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estados para edição no Modal
    const [editData, setEditData] = useState({
        display_title: '',
        bio: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Sincronizar dados quando o user carregar
    useEffect(() => {
        if (user) {
            setEditData(prev => ({
                ...prev,
                display_title: user.display_title || '',
                bio: user.bio || ''
            }));
        }
    }, [user]);

    if (!user && !loading) return (
        <div className="p-20 text-center">
            <h2 className="text-2xl font-bold text-red-500">Acesso Negado</h2>
            <p className="text-gray-400">Logue para ver seu perfil.</p>
        </div>
    );

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Validar senhas se preenchidas
            if (editData.newPassword) {
                if (editData.newPassword !== editData.confirmPassword) {
                    throw new Error("As senhas não coincidem!");
                }
                const { error: pwdError } = await supabase.auth.updateUser({
                    password: editData.newPassword
                });
                if (pwdError) throw pwdError;
            }

            // 2. Atualizar perfil no banco
            const { error } = await supabase
                .from('profiles')
                .update({
                    display_title: editData.display_title,
                    bio: editData.bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            // 3. Atualizar metadados do Auth
            await supabase.auth.updateUser({
                data: {
                    display_title: editData.display_title,
                    bio: editData.bio
                }
            });

            await syncUserData(user);
            showToast("Perfil atualizado!", { type: "success" });
            setIsModalOpen(false);
            setEditData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
        } catch (error) {
            showToast(error.message, { type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo e tamanho (max 2MB)
        if (!file.type.startsWith('image/')) {
            return showToast("Apenas imagens são permitidas!", { type: "error" });
        }
        if (file.size > 2 * 1024 * 1024) {
            return showToast("Imagem muito grande! Máximo 2MB.", { type: "error" });
        }

        setIsSubmitting(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}.${fileExt}`;
            const filePath = `${fileName}`;

            // Upload para o storage (Upsert: true para sobrescrever)
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Pegar URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Adicionar query param de tempo para forçar refresh da imagem (cache bust)
            const finalUrl = `${publicUrl}?t=${Date.now()}`;

            // Atualizar perfil
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: finalUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;

            await syncUserData(user);
            showToast("Avatar atualizado com sucesso!", { type: "success" });
        } catch (error) {
            showToast("Erro no upload: " + error.message, { type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSelectDefaultAvatar = async (avatarId) => {
        setIsSubmitting(true);
        try {
            // Para icons, vamos salvar o ID ou um caminho mapeado
            // Por enquanto, salvamos uma string especial indicando que é um icone do sistema
            const avatarUrl = `system:${avatarId}`;

            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: avatarUrl })
                .eq('id', user.id);

            if (error) throw error;

            await syncUserData(user);
            showToast("Ícone selecionado!", { type: "success" });
        } catch (error) {
            showToast(error.message, { type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper para renderizar o avatar atual
    const renderAvatar = (url, size = "w-32 h-32") => {
        if (!url) return <div className={`${size} rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--color-brand)] flex items-center justify-center text-gray-500`}><ICONS.HELMET className="text-4xl" /></div>;

        if (url.startsWith('system:')) {
            const iconId = url.split(':')[1];
            const found = DEFAULT_AVATARS.find(a => a.id === iconId);
            const IconComp = found ? found.icon : ICONS.HELMET;
            return (
                <div className={`${size} rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--color-brand)] flex items-center justify-center text-[var(--color-brand)]`}>
                    <IconComp className="text-4xl" />
                </div>
            );
        }

        return <img src={url} alt="Avatar" className={`${size} rounded-full border-2 border-[var(--color-brand)] object-cover bg-black`} />;
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
            <header className="mb-10">
                <h1 className="text-4xl font-black italic tracking-tighter text-[var(--color-brand)] uppercase">MEU PERFIL</h1>
                <div className="h-1 w-20 bg-[var(--color-brand)] mt-2"></div>
            </header>

            {/* SEÇÃO 1: AVATAR E IDENTIDADE */}
            <section className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-2xl mb-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ICONS.WIZARD className="text-9xl" />
                </div>

                <div className="grid md:grid-cols-[auto_1fr_1fr] gap-12 items-center">
                    {/* Avatar Display */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)]">Avatar</span>
                        <div className="relative">
                            {renderAvatar(user?.avatar_url)}
                            {isSubmitting && (
                                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                    <ICONS.WAIT className="animate-spin text-[var(--color-brand)] text-3xl" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Dados Pessoais */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase text-[var(--text-secondary)]">
                            <ICONS.BOOK /> Dados Pessoais
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-[var(--text-secondary)]">Nome:</p>
                                <p className="font-bold text-lg text-yellow-600">{user?.nome}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-secondary)]">Email:</p>
                                <p className="font-medium text-[var(--text-primary)]">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-secondary)]">Tipo de Conta:</p>
                                <p className={`font-bold uppercase text-xs px-2 py-1 rounded inline-block ${user?.tipo === 'admin' ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30' : 'bg-blue-900/40 text-blue-400 border border-blue-500/30'}`}>
                                    {user?.tipo || 'Player'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="space-y-4 border-l border-[var(--border-color)] pl-12 md:block hidden">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase text-[var(--text-secondary)]">
                            <ICONS.HISTORY /> Estatísticas
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-[var(--text-secondary)]">Conta criada em:</p>
                                <p className="font-bold text-yellow-600/80">{new Date(user?.created_at).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-secondary)]">Último acesso:</p>
                                <p className="font-medium text-[var(--text-primary)]">{new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text-secondary)]">Status:</p>
                                <p className="flex items-center gap-2 text-green-500 font-bold uppercase text-xs">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Ativa
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-8 pt-8 border-t border-[var(--border-color)]">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-black font-black uppercase text-sm rounded shadow-lg transition-all flex items-center gap-2 hover:-translate-y-0.5"
                    >
                        <ICONS.EDIT /> Editar Perfil
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2.5 bg-[var(--bg-primary)] hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-bold uppercase text-sm rounded border border-[var(--border-color)] transition-all flex items-center gap-2"
                    >
                        <ICONS.TOWER /> Voltar ao Dashboard
                    </button>
                </div>
            </section>

            {/* SEÇÃO 2: INFORMAÇÕES PÚBLICAS */}
            <section className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-xl mb-8">
                <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)] uppercase tracking-tight">Informações Públicas</h2>
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-2">Nome de Exibição</p>
                        <p className="text-2xl font-black text-yellow-600 italic tracking-tight">
                            {user?.display_title || "Sem Título de Guerra"}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-2">Descrição / Bio</p>
                        <p className="text-[var(--text-primary)] leading-relaxed italic">
                            {user?.bio || "Este aventureiro ainda não escreveu sua lenda..."}
                        </p>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 3: ATUALIZAR AVATAR */}
            <section className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-xl mb-20">
                <h2 className="text-xl font-bold mb-2 text-[var(--text-primary)] uppercase tracking-tight">Atualizar Avatar</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8">Envie uma imagem (JPG, PNG, WEBP até 2MB) ou escolha um avatar salvo/padrão.</p>

                <div className="space-y-10">
                    {/* Upload de Arquivo */}
                    <div className="max-w-md">
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-3">Enviar nova imagem</label>
                        <div className="flex items-center gap-4 bg-[var(--bg-primary)] p-4 rounded-xl border-2 border-dashed border-[var(--border-color)] hover:border-[var(--color-brand)] transition-colors group">
                            <input
                                type="file"
                                id="avatar-input"
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                disabled={isSubmitting}
                            />
                            <label htmlFor="avatar-input" className="cursor-pointer flex items-center gap-3 w-full">
                                <div className="p-3 bg-[var(--bg-secondary)] rounded-lg text-[var(--color-brand)] group-hover:scale-110 transition-transform">
                                    <ICONS.SAVE className="text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[var(--text-primary)]">Escolher Ficheiro</p>
                                    <p className="text-xs text-[var(--text-secondary)]">Nenhum ficheiro selecionado</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Galeria de Padrões */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-secondary)] mb-4">Ou escolha um avatar salvo/padrão</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {DEFAULT_AVATARS.map((av) => (
                                <button
                                    key={av.id}
                                    onClick={() => handleSelectDefaultAvatar(av.id)}
                                    disabled={isSubmitting}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all group ${user?.avatar_url === `system:${av.id}`
                                            ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5 grayscale-0'
                                            : 'border-[var(--border-color)] hover:border-[var(--color-brand)] grayscale hover:grayscale-0'
                                        }`}
                                >
                                    <av.icon className="text-3xl text-[var(--color-brand)]" />
                                    <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">{av.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* MODAL DE EDIÇÃO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>

                    <div className="relative bg-[var(--bg-card)] border-2 border-[var(--color-brand)] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-secondary)]">
                            <h2 className="text-2xl font-black italic tracking-tighter text-[var(--color-brand)]">EDITAR IDENTIDADE</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                            >
                                <ICONS.CLOSE className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveProfile} className="p-8 space-y-6">
                            {/* Display Name */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-2">Nome de Exibição</label>
                                <div className="relative">
                                    <ICONS.EDIT className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-brand)]" />
                                    <input
                                        type="text"
                                        name="display_title"
                                        value={editData.display_title}
                                        onChange={handleEditChange}
                                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-3 pl-12 pr-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors font-bold"
                                        placeholder="Ex: O Destruidor de Goblins"
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-[var(--text-secondary)] mb-2">Biografia</label>
                                <textarea
                                    name="bio"
                                    value={editData.bio}
                                    onChange={handleEditChange}
                                    rows="4"
                                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-brand)] transition-colors resize-none italic"
                                    placeholder="Conte sua história..."
                                />
                            </div>

                            <hr className="border-[var(--border-color)]" />

                            {/* Password Group */}
                            <div className="space-y-4">
                                <label className="block text-xs font-bold uppercase text-red-500 flex items-center gap-2">
                                    <ICONS.SKULL /> Alterar Senha (Deixe em branco para manter)
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={editData.newPassword}
                                        onChange={handleEditChange}
                                        placeholder="Nova Senha"
                                        className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 text-sm focus:outline-none focus:border-red-500"
                                    />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={editData.confirmPassword}
                                        onChange={handleEditChange}
                                        placeholder="Confirmar"
                                        className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg p-3 text-sm focus:outline-none focus:border-red-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-black font-black uppercase py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group"
                                >
                                    {isSubmitting ? <ICONS.WAIT className="animate-spin text-2xl" /> : (
                                        <>
                                            <ICONS.SAVE className="group-hover:scale-110 transition-transform" />
                                            SALVAR MUDANÇAS
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
