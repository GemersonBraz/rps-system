import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ICONS } from '../utils/icons';

const THEMES = [
    { key: 'honra', label: 'Honra', icon: ICONS.DEFENSE, color: 'text-amber-600' },
    { key: 'sombra', label: 'Sombra', icon: ICONS.ATTACK, color: 'text-teal-400' },
    { key: 'caos', label: 'Caos', icon: ICONS.SKULL, color: 'text-red-500' },
    { key: 'arcano', label: 'Arcano', icon: ICONS.MAGIC, color: 'text-blue-400' },
];

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Encontra o objeto do tema atual
    const currentTheme = THEMES.find(t => t.key === theme) || THEMES[0];

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all hover:opacity-80 min-w-[120px]"
                title="Alterar Tema"
            >
                <currentTheme.icon className={`text-lg ${currentTheme.color}`} />
                <span className="text-sm font-bold">{currentTheme.label}</span>
                {/* Seta indicativa */}
                <svg className={`ml-auto w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden z-20">
                    {THEMES.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => {
                                setTheme(t.key);
                                setIsOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-[var(--bg-secondary)]
                                ${theme === t.key ? 'bg-[var(--bg-primary)] font-bold' : ''}
                            `}
                        >
                            <t.icon className={`text-lg ${t.color}`} />
                            <span className="text-[var(--text-primary)]">{t.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
