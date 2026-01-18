import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Tenta pegar do localStorage ou usa 'honra' como padrão
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('rpg-theme') || 'honra';
    });

    useEffect(() => {
        // Atualiza o atributo no HTML e salva no storage
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('rpg-theme', theme);

        // Opcional: Adiciona classe 'dark' para compatibilidade com Tailwind Dark Mode
        if (theme === 'sombra') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'honra' ? 'sombra' : 'honra');
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
