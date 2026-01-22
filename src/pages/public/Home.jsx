import { Link } from 'react-router-dom';
import { ICONS } from '../../utils/icons';

export default function Home() {
    return (
        <div className="bg-[var(--bg-card)] p-8 rounded-lg shadow-lg">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-brand)] mb-4 tracking-tight">
                    Bem-vindo à Guerra Eterna
                </h1>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                    Em um mundo dividido entre a luz da <strong>Honra</strong> e a astúcia da <strong>Sombra</strong>,
                    qual caminho você escolherá? Junte-se a nós, conquiste territórios e deixe sua marca na história.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        to="/login"
                        className="px-8 py-3 bg-[var(--color-brand)] text-white font-bold rounded-full shadow-lg hover:bg-[var(--color-brand-hover)] transform hover:-translate-y-1 transition-all flex items-center gap-2"
                    >
                        <ICONS.REGISTER className="text-xl" />
                        Juntar-se Agora
                    </Link>
                    <button
                        className="px-8 py-3 border-2 border-[var(--color-brand)] text-[var(--color-brand)] font-bold rounded-full hover:bg-[var(--bg-secondary)] transition-all flex items-center gap-2"
                    >
                        <ICONS.SCROLL className="text-xl" />
                        Saiba Mais
                    </button>
                </div>
            </div>

            <div className="border-t border-[var(--border-color)] my-8"></div>

            <div className="text-center text-[var(--text-secondary)]">
                <p>O Portal está aberto. Escolha seu destino.</p>
            </div>
        </div>
    );
}
