import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import ToastDemo from './pages/ToastDemo';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="toasts-demo" element={<ToastDemo />} />
            </Route>
        </Routes>
    );
}
