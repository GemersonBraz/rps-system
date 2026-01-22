import { useAuth } from '../../contexts/AuthContext';
import { ICONS } from '../../utils/icons';

export default function UserDashboard() {
    const { user } = useAuth();

    return (
        <div className="bg-[var(--bg-card)] p-8 rounded-lg shadow-lg">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-[var(--bg-secondary)] rounded-full text-[var(--color-brand)]">
                    <ICONS.HOME className="text-4xl" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-[var(--color-brand)]">Refúgio do Viajante</h1>
                    <p className="text-[var(--text-secondary)]">Saudações, {user?.display_title || 'Aventureiro'}.</p>
                </div>
            </div>

            <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-primary)] mt-8">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                    <ICONS.SCROLL /> Missões Ativas
                </h2>
                <ul className="space-y-3">
                    <li className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded">
                        <span className="text-[var(--text-primary)]">Derrotar Goblins das Sombras</span>
                        <span className="text-yellow-500 font-bold text-sm">Em Progresso</span>
                    </li>
                    <li className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded">
                        <span className="text-[var(--text-primary)]">Entregar pacote em Arcano</span>
                        <span className="text-green-500 font-bold text-sm">Concluído</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
