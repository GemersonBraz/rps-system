import { authToasts, rpgToasts, systemToasts, showToast } from '../utils/toasts';
import { ICONS } from '../utils/icons';

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
