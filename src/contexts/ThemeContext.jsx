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

        // Lógica para compatibilidade com Tailwind Dark Mode (class="dark")
        // Se o tema for escuro (sombra, caos, arcano), adiciona a classe dark
        const darkThemes = ['sombra', 'caos', 'arcano'];
        if (darkThemes.includes(theme)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // toggleTheme foi removido pois agora usamos um seletor múltiplo (setTheme direto)

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
