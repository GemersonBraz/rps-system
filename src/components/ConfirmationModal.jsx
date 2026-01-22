import { ICONS } from '../utils/icons';

/**
 * 🛡️ ConfirmationModal: Um modal temático para ações críticas.
 * @param {boolean} isOpen - Controla a visibilidade
 * @param {string} title - Título do modal
 * @param {string} message - Mensagem descritiva
 * @param {function} onConfirm - Ação ao confirmar
 * @param {function} onCancel - Ação ao cancelar
 * @param {React.ElementType} icon - Ícone Gi para exibir
 * @param {string} confirmText - Texto do botão de ação
 * @param {string} variant - 'danger' (vermelho) ou 'warning' (roxo/amarelo)
 */
export default function ConfirmationModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    icon: Icon = ICONS.SKULL,
    confirmText = "Confirmar",
    variant = "danger"
}) {
    if (!isOpen) return null;

    const colors = {
        danger: {
            bg: "bg-red-900/20",
            border: "border-red-900/50",
            text: "text-red-500",
            button: "bg-red-600 hover:bg-red-700",
            glow: "shadow-red-900/20"
        },
        warning: {
            bg: "bg-purple-900/20",
            border: "border-purple-900/50",
            text: "text-purple-400",
            button: "bg-purple-600 hover:bg-purple-700",
            glow: "shadow-purple-900/20"
        }
    };

    const style = colors[variant] || colors.danger;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop com desfoque */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />

            {/* Modal Card */}
            <div className={`relative max-w-md w-full ${style.bg} border ${style.border} p-8 rounded-2xl shadow-2xl ${style.glow} transform transition-all animate-enter`}>

                {/* Header com Ícone */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className={`p-4 rounded-full bg-black/40 ${style.text} mb-4 border ${style.border}`}>
                        <Icon className="text-4xl" />
                    </div>
                    <h2 className={`text-2xl font-bold ${style.text} tracking-tight uppercase`}>
                        {title}
                    </h2>
                </div>

                {/* Mensagem */}
                <p className="text-gray-300 text-center mb-8 leading-relaxed">
                    {message}
                </p>

                {/* Botões */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        className={`w-full py-3 ${style.button} text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-3 bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] text-gray-400 hover:text-white font-bold rounded-lg transition-all border border-[var(--border-color)]"
                    >
                        Cancelar
                    </button>
                </div>

                {/* Rodapé Decorativo */}
                <div className="mt-6 flex justify-center opacity-20">
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-current to-transparent" />
                </div>
            </div>
        </div>
    );
}
