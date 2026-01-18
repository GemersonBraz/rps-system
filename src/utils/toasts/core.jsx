import toast from 'react-hot-toast';
import { ICONS } from '../icons';

// Constantes de Duração (Exportadas para uso global)
export const TOAST_DURATION = {
    FAST: 2000,
    NORMAL: 5000,
    SLOW: 8000
};

// Componente customizado para o Toast com botão de fechar e barra de progresso simples
const ToastContent = ({ message, t, icon: Icon, colorClass, duration }) => {
    return (
        <div className="flex flex-col w-full">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {Icon && <Icon className={`text-2xl ${colorClass}`} />}
                    {/* Aplica a cor do tema também ao texto (mesma cor do ícone/borda) */}
                    <div className={`font-bold ${colorClass}`}>{message}</div>
                </div>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <ICONS.CLOSE />
                </button>
            </div>
            {/* Barra de progresso visual (animação via CSS) */}
            <div className="mt-2 h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${colorClass.replace('text-', 'bg-')} origin-left animate-toast-progress`}
                    // A duração da animação agora é dinâmica baseada na prop duration
                    style={{ animationDuration: `${duration}ms` }}
                />
            </div>
        </div>
    );
};

// Estilo Base
const baseStyle = {
    minWidth: '300px',
    padding: '12px',
    background: 'var(--toast-bg, #fff)', // User vai ver fundo branco/escuro
    color: 'var(--toast-text, #333)',
    borderLeft: '4px solid',
};

// Função Core para disparar
export const showToast = (message, { icon, color = "blue-500", duration = TOAST_DURATION.NORMAL } = {}) => {
    const colorClass = `text-${color}`;

    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            style={{
                ...baseStyle,
                borderColor: color === 'green-500' ? '#22c55e' :
                    color === 'red-500' ? '#ef4444' :
                        color === 'yellow-500' ? '#eab308' : '#3b82f6'
            }}
        >
            <ToastContent
                message={message}
                t={t}
                icon={icon}
                colorClass={colorClass}
                duration={duration} // Passa duração para o componente
            />
        </div>
    ), { duration });
};
