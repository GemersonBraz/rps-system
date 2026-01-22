import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { ICONS } from '../utils/icons';

export default function Navbar() {
    const { user, logout } = useAuth();

    // Helper para renderizar o avatar do usuário (também usado no Profile)
    const renderAvatar = (url) => {
        const size = "w-8 h-8";
        if (!url) return (
            <div className={`${size} rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-[var(--color-brand)]`}>
                <ICONS.HELMET />
            </div>
        );

        if (url.startsWith('system:')) {
            const iconId = url.split(':')[1];
            // Mapeamento simples para o Navbar
            const IconComp = ICONS[iconId.toUpperCase()] || ICONS.HELMET;
            return (
                <div className={`${size} rounded-full bg-[var(--bg-secondary)] border border-[var(--color-brand)] flex items-center justify-center text-[var(--color-brand)]`}>
                    <IconComp className="text-sm" />
                </div>
            );
        }

        return <img src={url} alt="Avatar" className={`${size} rounded-full border border-[var(--color-brand)] object-cover`} />;
    };

    return (
        <nav className="bg-[var(--bg-card)] border-b border-[var(--border-color)] p-4 shadow-sm sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <img src="/img/logo-honra-sombra.png" alt="Logo Honra ou Sombra" className="h-10 w-10 object-contain" />
                    <span className="text-xl font-bold tracking-wider text-[var(--color-brand)]">
                        HONRA <span className="text-[var(--text-secondary)] text-sm mx-1">OU</span> SOMBRA
                    </span>
                </Link>
                <div className="flex items-center gap-6">
                    <ul className="flex space-x-6 items-center">
                        <li><Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">Home</Link></li>
                        {user && (
                            <li>
                                <Link
                                    to={user.tipo === 'admin' ? "/admin" : "/dashboard"}
                                    className="text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors font-semibold"
                                >
                                    {user.tipo === 'admin' ? "Admin" : "Dashboard"}
                                </Link>
                            </li>
                        )}
                        {user && <li><Link to="/profile" className="text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">Perfil</Link></li>}
                        <li><Link to="/toasts-demo" className="text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">Toasts</Link></li>

                        {/* Divisória */}
                        <div className="h-6 w-px bg-[var(--border-color)]"></div>

                        {/* Área do Usuário */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/profile" className="text-[var(--color-brand)] font-bold flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    {renderAvatar(user.avatar_url)}
                                    {user.display_title || user.nome}
                                </Link>
                                <button
                                    onClick={logout}
                                    className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                                    title="Sair"
                                >
                                    <ICONS.LOGOUT className="text-xl" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 text-[var(--text-primary)] hover:text-[var(--color-brand)] font-medium">
                                <ICONS.LOGIN />
                                Login
                            </Link>
                        )}
                    </ul>
                    <div className="pl-6 border-l border-[var(--border-color)]">
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
}
