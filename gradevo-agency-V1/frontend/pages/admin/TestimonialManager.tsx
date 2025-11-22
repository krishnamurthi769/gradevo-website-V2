import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Save, X, Upload } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    image_url?: string;
    linkedin_url?: string;
}

const TestimonialManager: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<Testimonial>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        const res = await fetch('http://localhost:5000/api/content/testimonials');
        const data = await res.json();
        setTestimonials(data);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            const res = await fetch(`http://localhost:5000/api/content/testimonials/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    alert('Session expired. Please login again.');
                    window.location.href = '/#/admin/login';
                    return;
                }
                alert('Failed to delete testimonial');
                return;
            }
            fetchTestimonials();
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('name', currentItem.name || '');
        formData.append('role', currentItem.role || '');
        formData.append('content', currentItem.content || '');
        formData.append('linkedin_url', currentItem.linkedin_url || '');
        if (imageFile) {
            formData.append('image', imageFile);
        } else if (currentItem.image_url) {
            formData.append('image_url', currentItem.image_url);
        }

        const url = currentItem.id
            ? `http://localhost:5000/api/content/testimonials/${currentItem.id}`
            : 'http://localhost:5000/api/content/testimonials';

        const method = currentItem.id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                alert('Session expired. Please login again.');
                window.location.href = '/#/admin/login';
                return;
            }
            alert('Failed to save testimonial');
            return;
        }

        setIsEditing(false);
        setCurrentItem({});
        setImageFile(null);
        fetchTestimonials();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Testimonials</h2>
                <button
                    onClick={() => { setIsEditing(true); setCurrentItem({}); setImageFile(null); }}
                    className="bg-gradevo-blue text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={20} /> Add Testimonial
                </button>
            </div>

            <div className="grid gap-4">
                {testimonials.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            {item.image_url && (
                                <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                            )}
                            <div>
                                <h3 className="font-bold">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.role}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setCurrentItem(item); setIsEditing(true); setImageFile(null); }} className="text-blue-600 hover:text-blue-800">
                                <Edit size={20} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">{currentItem.id ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Client Name"
                                className="w-full border p-2 rounded"
                                value={currentItem.name || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Role / Company"
                                className="w-full border p-2 rounded"
                                value={currentItem.role || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                            />
                            <textarea
                                placeholder="Testimonial Content"
                                className="w-full border p-2 rounded h-32"
                                value={currentItem.content || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, content: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="LinkedIn URL"
                                className="w-full border p-2 rounded"
                                value={currentItem.linkedin_url || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, linkedin_url: e.target.value })}
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Client Image</label>
                                <div className="flex items-center gap-2">
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 border">
                                        <Upload size={16} />
                                        <span className="text-sm">Upload Image</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setImageFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </label>
                                    {imageFile ? (
                                        <span className="text-sm text-green-600 truncate">{imageFile.name}</span>
                                    ) : currentItem.image_url ? (
                                        <span className="text-sm text-gray-500 truncate">Current image set</span>
                                    ) : null}
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                className="w-full bg-gradevo-blue text-white py-2 rounded hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
                            >
                                <Save size={20} /> Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialManager;
