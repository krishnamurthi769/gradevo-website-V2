import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
}

const ServiceManager: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<Service>>({});

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const res = await fetch('http://localhost:5000/api/content/services');
        const data = await res.json();
        setServices(data);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        const res = await fetch(`http://localhost:5000/api/content/services/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                alert('Session expired. Please login again.');
                window.location.href = '/#/admin/login';
                return;
            }
            alert('Failed to delete service');
            return;
        }
        fetchServices();
    };

    const handleSave = async () => {
        const method = currentService.id ? 'PUT' : 'POST';
        const url = currentService.id
            ? `http://localhost:5000/api/content/services/${currentService.id}`
            : 'http://localhost:5000/api/content/services';

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(currentService),
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                alert('Session expired. Please login again.');
                window.location.href = '/#/admin/login';
                return;
            }
            alert('Failed to save service');
            return;
        }

        setIsEditing(false);
        setCurrentService({});
        fetchServices();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Services</h2>
                <button
                    onClick={() => { setIsEditing(true); setCurrentService({}); }}
                    className="bg-gradevo-blue text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={18} /> Add Service
                </button>
            </div>

            {isEditing && (
                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <h3 className="text-xl font-semibold mb-4">{currentService.id ? 'Edit Service' : 'New Service'}</h3>
                    <div className="grid gap-4">
                        <input
                            placeholder="Title"
                            className="border p-2 rounded"
                            value={currentService.title || ''}
                            onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="border p-2 rounded"
                            value={currentService.description || ''}
                            onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                        />
                        <input
                            placeholder="Icon (Lucide icon name)"
                            className="border p-2 rounded"
                            value={currentService.icon || ''}
                            onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
                                <Save size={18} /> Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2">
                                <X size={18} /> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{service.title}</h3>
                            <p className="text-gray-600">{service.description}</p>
                            <span className="text-sm text-gray-400">Icon: {service.icon}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setCurrentService(service); setIsEditing(true); }}
                                className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                            >
                                <Edit size={20} />
                            </button>
                            <button
                                onClick={() => handleDelete(service.id)}
                                className="text-red-600 hover:bg-red-50 p-2 rounded"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceManager;
