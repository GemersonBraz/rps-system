import Card from '../components/Card';
import { ICONS, ICON_LIST } from '../utils/icons';

export default function Home() {
    const cardsData = [
        {
            title: "Componentização",
            content: "Construindo fortalezas com pequenos blocos.",
            color: "blue",
            icon: ICONS.TOWER
        },
        {
            title: "Props",
            content: "Pergaminhos que levam mensagens aos filhos.",
            color: "green",
            icon: ICONS.SCROLL
        },
        {
            title: "Estilização",
            content: "Poções mágicas de beleza instantânea.",
            color: "purple",
            icon: ICONS.MAGIC
        }
    ];

    return (
        <div className="bg-[var(--bg-card)] p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-[var(--color-brand)] flex items-center gap-2">
                <ICONS.HOME />
                Rota 1: Home
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
                Esta é a página principal. Agora usando nosso <strong>Sistema de Ícones</strong>!
            </p>

            {/* Cards Principais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {cardsData.map((card, index) => (
                    <Card
                        key={index}
                        title={card.title}
                        content={card.content}
                        color={card.color}
                        icon={card.icon}
                    />
                ))}
            </div>

            {/* Sistema de Notificações (Toasts) */}
            <div className="border-t border-[var(--border-color)] pt-8 mb-8">
                <h3 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
                    Sistema de Notificações (Toasts)
                </h3>
                <div className="flex gap-4">
                    <button
                        onClick={() => import('../utils/toast').then(m => m.notify.success("Item equipado com sucesso!"))}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-bold flex items-center gap-2"
                    >
                        <ICONS.CONFIRM /> Testar Sucesso
                    </button>
                    <button
                        onClick={() => import('../utils/toast').then(m => m.notify.error("Falha ao lançar magia!"))}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 font-bold flex items-center gap-2"
                    >
                        <ICONS.DELETE /> Testar Erro
                    </button>
                    <button
                        onClick={() => import('../utils/toast').then(m => m.notify.info("Você descobriu uma nova área."))}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold flex items-center gap-2"
                    >
                        <ICONS.SCROLL /> Testar Info
                    </button>
                </div>
            </div>

            {/* Guia de Ícones (Solicitado pelo User) */}
            <div className="border-t border-[var(--border-color)] pt-8">
                <h3 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
                    Guia de Ícones do Sistema (RPG)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {ICON_LIST.map((item) => (
                        <div key={item.name} className="flex flex-col items-center p-4 bg-[var(--bg-secondary)] rounded-lg hover:opacity-80 transition-opacity">
                            <item.Icon className="text-4xl mb-2 text-[var(--color-brand)]" />
                            <span className="text-xs font-mono text-[var(--text-secondary)]">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
