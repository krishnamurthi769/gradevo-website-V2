import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Layers, MessageSquare, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        services: 0,
        portfolio: 0,
        testimonials: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [servicesRes, portfolioRes, testimonialsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/content/services'),
                    fetch('http://localhost:5000/api/content/portfolio'),
                    fetch('http://localhost:5000/api/content/testimonials')
                ]);

                const services = await servicesRes.json();
                const portfolio = await portfolioRes.json();
                const testimonials = await testimonialsRes.json();

                setStats({
                    services: services.length,
                    portfolio: portfolio.length,
                    testimonials: testimonials.length,
                });
            } catch (error) {
                console.error("Failed to fetch stats", error);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, Admin</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition-colors"
                >
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                        <Layers size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Services</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.services}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                        <Briefcase size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Portfolio Projects</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.portfolio}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Testimonials</p>
                        <h3 className="text-2xl font-bold text-gray-800">{stats.testimonials}</h3>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/admin/services')} className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                        <h3 className="font-semibold text-gray-700">Manage Services</h3>
                        <p className="text-sm text-gray-500">Add or edit services</p>
                    </button>
                    <button onClick={() => navigate('/admin/portfolio')} className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                        <h3 className="font-semibold text-gray-700">Manage Portfolio</h3>
                        <p className="text-sm text-gray-500">Update your work</p>
                    </button>
                    <button onClick={() => navigate('/admin/testimonials')} className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                        <h3 className="font-semibold text-gray-700">Manage Testimonials</h3>
                        <p className="text-sm text-gray-500">Client feedback</p>
                    </button>
                    <button onClick={() => navigate('/admin/contact')} className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                        <h3 className="font-semibold text-gray-700">Contact Settings</h3>
                        <p className="text-sm text-gray-500">Update contact info</p>
                    </button>
                    <button onClick={() => navigate('/admin/logo')} className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors">
                        <h3 className="font-semibold text-gray-700">Logo & Branding</h3>
                        <p className="text-sm text-gray-500">Update site logo</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
