import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
                {/* O Outlet é onde o conteúdo das páginas (Home, About) será renderizado */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
