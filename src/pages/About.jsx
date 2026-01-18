export default function About() {
    return (
        <div className="bg-[var(--bg-card)] p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-[var(--color-brand)]">Rota 2: Sobre</h2>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                Esta é a segunda rota. Quando você clicou nela, o React Router trocou o componente
                <code>Home</code> pelo componente <code>About</code> instantaneamente.
            </p>

            <div className="mt-8 border-l-4 border-[var(--color-brand)] pl-4 italic text-[var(--text-primary)]">
                "O React permite construir interfaces de usuário interativas de forma eficiente e declarativa."
            </div>
        </div>
    );
}
