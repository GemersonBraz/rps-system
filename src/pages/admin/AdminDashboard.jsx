import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ICONS } from '../../utils/icons';

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="bg-[var(--bg-card)] p-8 rounded-lg shadow-lg border-2 border-[var(--color-brand)]">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-[var(--bg-secondary)] rounded-full text-[var(--color-brand)]">
                    <ICONS.TOWER className="text-4xl" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-brand)]">Painel do Comandante</h1>
                    <p className="text-[var(--text-secondary)]">Bem-vindo, {user?.display_title || 'Administrador'}.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Stat 1 */}
                <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Jogadores Ativos</h3>
                    <p className="text-4xl font-bold text-green-500">1,392</p>
                </div>
                {/* Stat 2 */}
                <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Batalhas Hoje</h3>
                    <p className="text-4xl font-bold text-red-500">458</p>
                </div>
                {/* Stat 3 */}
                <div className="bg-[var(--bg-primary)] p-6 rounded-lg border border-[var(--border-color)]">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">Reports</h3>
                    <p className="text-4xl font-bold text-yellow-500">12</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Link to="/admin/users" className="p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] hover:border-[var(--color-brand)] transition-all group shadow-lg">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                        <ICONS.HISTORY className="group-hover:text-[var(--color-brand)] text-2xl" />
                        Gestão de Usuários
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm">Controle aventureiros, mude funções e gerencie acessos ao reino.</p>
                </Link>
                <div className="p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] hover:border-yellow-500 transition-all group opacity-50 cursor-not-allowed">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2 text-yellow-500">
                        <ICONS.BOOK /> Conteúdo do Jogo (Breve)
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm">Em breve: Criar classes, magias e equipamentos lendários.</p>
                </div>
            </div>
        </div>
    );
}
