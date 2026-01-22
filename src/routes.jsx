import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Public Pages
import Home from './pages/public/Home';

// System Pages
import ToastDemo from './pages/system/ToastDemo';
import TestSupabase from './pages/system/TestSupabase';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import UserDashboard from './pages/player/UserDashboard';
import Profile from './pages/auth/Profile';
import UserManagement from './pages/admin/UserManagement';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="toasts-demo" element={<ToastDemo />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<Profile />} />
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/users" element={<UserManagement />} />
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="test-supabase" element={<TestSupabase />} />
            </Route>
        </Routes>
    );
}
