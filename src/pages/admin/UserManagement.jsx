import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ICONS } from '../../utils/icons';
import { showToast } from '../../utils/toasts';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Estado do Modal de Confirmação
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: '',
        variant: 'danger',
        icon: ICONS.SKULL,
        onConfirm: () => { }
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            showToast("Erro ao carregar usuários: " + error.message, { type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = (user) => {
        const action = user.ativo ? 'BANIR' : 'REATIVAR';
        setModalConfig({
            isOpen: true,
            title: `${action} AVENTUREIRO`,
            message: `Você tem certeza que deseja ${action.toLowerCase()} o aventureiro "${user.display_title || user.nome}"? Ele perderá acesso imediato às terras do reino.`,
            confirmText: action,
            variant: user.ativo ? 'danger' : 'warning',
            icon: user.ativo ? ICONS.SKULL : ICONS.CONFIRM,
            onConfirm: () => executeToggleStatus(user)
        });
    };

    const executeToggleStatus = async (user) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ ativo: !user.ativo })
                .eq('id', user.id);

            if (error) throw error;
            showToast(`Usuário ${user.ativo ? 'desativado' : 'ativado'}!`, { type: "success" });
            fetchUsers();
        } catch (error) {
            showToast(error.message, { type: "error" });
        } finally {
            closeModal();
        }
    };

    const handleToggleRole = (user) => {
        const newRole = user.tipo === 'admin' ? 'jogador' : 'admin';
        setModalConfig({
            isOpen: true,
            title: "MUDAR HIERARQUIA",
            message: `Deseja transformar "${user.display_title || user.nome}" em um ${newRole.toUpperCase()}? Isso alterará as permissões de acesso deste usuário.`,
            confirmText: "Alterar Cargo",
            variant: 'warning',
            icon: ICONS.WIZARD,
            onConfirm: () => executeToggleRole(user, newRole)
        });
    };

    const executeToggleRole = async (user, newRole) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ tipo: newRole })
                .eq('id', user.id);

            if (error) throw error;
            showToast(`Tipo alterado para ${newRole}!`, { type: "success" });
            fetchUsers();
        } catch (error) {
            showToast(error.message, { type: "error" });
        } finally {
            closeModal();
        }
    };

    const closeModal = () => setModalConfig(prev => ({ ...prev, isOpen: false }));

    if (currentUser?.tipo !== 'admin') {
        return <div className="p-8 text-center text-red-500 font-bold">Acesso Negado.</div>;
    }

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-brand)] flex items-center gap-3">
                        <ICONS.HISTORY className="text-4xl" /> Gestão do Reino (Usuários)
                    </h1>
                    <p className="text-[var(--text-secondary)]">Gerencie quem entra e quem governa nestas terras.</p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="p-3 bg-[var(--bg-secondary)] rounded-full hover:text-[var(--color-brand)] transition-colors shadow-lg"
                    title="Recarregar Lista"
                >
                    <ICONS.WAIT className={loading ? 'animate-spin' : ''} />
                </button>
            </header>

            <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                                <th className="p-4 font-bold text-[var(--color-brand)]">Aventureiro</th>
                                <th className="p-4 font-bold text-[var(--color-brand)]">E-mail</th>
                                <th className="p-4 font-bold text-[var(--color-brand)]">Função</th>
                                <th className="p-4 font-bold text-[var(--color-brand)]">Status</th>
                                <th className="p-4 font-bold text-[var(--color-brand)] text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-full border border-[var(--color-brand)]" />
                                            <div>
                                                <div className="font-bold text-[var(--text-primary)]">{u.display_title || u.nome}</div>
                                                <div className="text-xs text-[var(--text-secondary)]">{u.nome}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-[var(--text-secondary)]">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.tipo === 'admin' ? 'bg-purple-900/50 text-purple-400' : 'bg-blue-900/50 text-blue-400'
                                            }`}>
                                            {u.tipo.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`flex items-center gap-2 text-sm ${u.ativo ? 'text-green-500' : 'text-red-500'}`}>
                                            <div className={`w-2 h-2 rounded-full ${u.ativo ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            {u.ativo ? 'Ativo' : 'Banido'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleToggleRole(u)}
                                                className="p-2 bg-[var(--bg-secondary)] rounded hover:text-purple-400 transition-colors"
                                                title="Mudar Função"
                                            >
                                                <ICONS.WIZARD />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(u)}
                                                className={`p-2 bg-[var(--bg-secondary)] rounded transition-colors ${u.ativo ? 'hover:text-red-500' : 'hover:text-green-500'}`}
                                                title={u.ativo ? "Banir" : "Desbanir"}
                                            >
                                                {u.ativo ? <ICONS.CLOSE /> : <ICONS.CONFIRM />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Confirmação Temático */}
            <ConfirmationModal
                {...modalConfig}
                onCancel={closeModal}
            />
        </div>
    );
}
