import { Link } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
    return (
        <nav className="bg-[var(--bg-card)] border-b border-[var(--border-color)] p-4 shadow-sm sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-[var(--color-brand)] hover:opacity-80 transition-opacity">
                    RPS Legends
                </Link>
                <div className="flex items-center gap-6">
                    <ul className="flex space-x-6">
                        <li><Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">Home</Link></li>
                        <li><Link to="/about" className="text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">Sobre</Link></li>
                        <li><Link to="/toasts-demo" className="text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors">Toasts</Link></li>
                    </ul>
                    <div className="pl-6 border-l border-[var(--border-color)]">
                        <ThemeSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
}
