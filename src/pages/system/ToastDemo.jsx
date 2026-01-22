import { authToasts, rpgToasts, systemToasts, showToast } from '../../utils/toasts';
import { ICONS } from '../../utils/icons';

export default function ToastDemo() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8 text-center text-[var(--color-brand)]">
                <ICONS.MAGIC className="inline-block mr-2" />
                Demonstração do Sistema de Notificações
            </h1>

            <div className="grid gap-8">
                {/* RPG Section */}
                <section className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border-color)]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
                        <ICONS.ATTACK /> RPG Events
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => rpgToasts.levelUp(10)} className="btn-base bg-yellow-500 hover:bg-yellow-600 text-white">
                            Level Up
                        </button>
                        <button onClick={() => rpgToasts.questComplete("Matar o Dragão")} className="btn-base bg-green-500 hover:bg-green-600 text-white">
                            Quest Complete
                        </button>
                        <button onClick={() => rpgToasts.itemObtained("Espada Lendária")} className="btn-base bg-blue-500 hover:bg-blue-600 text-white">
                            Item Obtido
                        </button>
                        <button onClick={() => rpgToasts.damageTaken(50)} className="btn-base bg-red-500 hover:bg-red-600 text-white">
                            Damage Taken
                        </button>
                    </div>
                </section>

                {/* Auth Section */}
                <section className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border-color)]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600">
                        <ICONS.LOGIN /> Autenticação
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => authToasts.loginSuccess("Heroi")} className="btn-base bg-green-600 hover:bg-green-700 text-white">
                            Login Sucesso
                        </button>
                        <button onClick={() => authToasts.loginError()} className="btn-base bg-red-600 hover:bg-red-700 text-white">
                            Login Erro
                        </button>
                        <button onClick={authToasts.logout} className="btn-base bg-gray-600 hover:bg-gray-700 text-white">
                            Logout
                        </button>
                    </div>
                </section>

                {/* System Section */}
                <section className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border-color)]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[var(--text-secondary)]">
                        <ICONS.SETTINGS /> Sistema
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={systemToasts.backupSuccess} className="btn-base bg-indigo-500 hover:bg-indigo-600 text-white">
                            Backup
                        </button>
                        <button onClick={systemToasts.maintenance} className="btn-base bg-orange-500 hover:bg-orange-600 text-white">
                            Manutenção
                        </button>
                        <button onClick={systemToasts.comingSoon} className="btn-base bg-purple-500 hover:bg-purple-600 text-white">
                            Em Breve
                        </button>
                    </div>
                </section>

                {/* Custom Section */}
                <section className="bg-[var(--bg-card)] p-6 rounded-lg border border-[var(--border-color)]">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-pink-600">
                        <ICONS.EDIT /> Custom / Teste
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => showToast("Rápido (2s)", { icon: ICONS.SCROLL, duration: 2000, color: "blue-500" })}
                            className="btn-base bg-blue-400 hover:bg-blue-500 text-white"
                        >
                            Rápido (2s)
                        </button>
                        <button
                            onClick={() => showToast("Normal (5s)", { icon: ICONS.SCROLL, duration: 5000, color: "green-500" })}
                            className="btn-base bg-green-500 hover:bg-green-600 text-white"
                        >
                            Normal (5s)
                        </button>
                        <button
                            onClick={() => showToast("Lento (8s)", { icon: ICONS.SCROLL, duration: 8000, color: "purple-500" })}
                            className="btn-base bg-purple-500 hover:bg-purple-600 text-white"
                        >
                            Lento (8s)
                        </button>
                    </div>
                </section>

                {/* Icons Gallery */}
                <section className="bg-[var(--bg-card)] p-8 rounded-2xl border border-[var(--border-color)] shadow-xl mt-8">
                    <div className="flex items-center justify-between mb-8 border-b border-[var(--border-color)] pb-4">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-[var(--color-brand)]">
                            <ICONS.MAGIC className="text-4xl" />
                            Biblioteca de Artefatos (Ícones)
                        </h2>
                        <span className="px-4 py-1 bg-[var(--bg-secondary)] rounded-full text-xs font-mono text-[var(--text-secondary)]">
                            {Object.keys(ICONS).length} Ícones Registrados
                        </span>
                    </div>

                    <p className="text-[var(--text-secondary)] mb-8 text-lg">
                        Estes são os ícones padronizados para uso em todo o sistema, garantindo consistência visual em Dashboards e Cards.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Object.entries(ICONS).sort(([a], [b]) => a.localeCompare(b)).map(([name, Icon]) => (
                            <div key={name} className="flex flex-col items-center p-5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl hover:border-[var(--color-brand)] hover:scale-105 transition-all cursor-pointer group hover:shadow-lg hover:shadow-[var(--color-brand)]/10">
                                <div className="p-3 rounded-full bg-[var(--bg-secondary)] group-hover:bg-[var(--color-brand)]/10 mb-3 transition-colors">
                                    {Icon ? (
                                        <Icon className="text-3xl text-[var(--text-primary)] group-hover:text-[var(--color-brand)]" />
                                    ) : (
                                        <span className="text-2xl">❌</span>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold tracking-tighter uppercase text-[var(--text-secondary)] group-hover:text-[var(--color-brand)] text-center transition-colors">
                                    {name.replace(/_/g, ' ')}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-[var(--bg-secondary)] rounded-xl border-l-4 border-[var(--color-brand)]">
                        <h4 className="font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                            <ICONS.SETTINGS /> Como usar no código:
                        </h4>
                        <code className="block bg-black/30 p-4 rounded text-sm text-[var(--color-brand)] overflow-x-auto">
                            {`import { ICONS } from '../../utils/icons';\n\n// Exemplo:\n<ICONS.SWORDS className="text-xl" />`}
                        </code>
                    </div>
                </section>
            </div>

            <style>{`
        .btn-base {
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            font-weight: 600;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
      `}</style>
        </div>
    );
}
