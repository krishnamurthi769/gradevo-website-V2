import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Layers, Image, MessageSquare, LogOut, Dna, BookOpen, Scale } from 'lucide-react';

const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Services', path: '/admin/services', icon: Layers },
        { name: 'Portfolio', path: '/admin/portfolio', icon: Image },
        { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
        { name: 'Our DNA', path: '/admin/dna', icon: Dna },
        { name: 'Our Story', path: '/admin/story', icon: BookOpen },
        { name: 'Legal', path: '/admin/legal', icon: Scale },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 text-gray-900 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-gradevo-navy text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-gradevo-red">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-gradevo-blue text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside >

            {/* Main Content */}
            < main className="flex-1 overflow-y-auto" >
                <div className="p-8">
                    <Outlet />
                </div>
            </main >
        </div >
    );
};

export default AdminLayout;
