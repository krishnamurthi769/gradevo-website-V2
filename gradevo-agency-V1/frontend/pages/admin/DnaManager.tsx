import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Save, X, Upload } from 'lucide-react';

interface DnaItem {
    id: number;
    title: string;
    description: string;
    image: string;
}

const DnaManager: React.FC = () => {
    const [items, setItems] = useState<DnaItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<DnaItem>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const res = await fetch('http://localhost:5000/api/content/dna');
        const data = await res.json();
        setItems(data);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            const res = await fetch(`http://localhost:5000/api/content/dna/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    alert('Session expired. Please login again.');
                    window.location.href = '/#/admin/login';
                    return;
                }
                alert('Failed to delete item');
                return;
            }
            fetchItems();
        }
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('title', currentItem.title || '');
        formData.append('description', currentItem.description || '');

        if (imageFile) {
            formData.append('image', imageFile);
        } else if (currentItem.image) {
            formData.append('image', currentItem.image);
        }

        const url = currentItem.id
            ? `http://localhost:5000/api/content/dna/${currentItem.id}`
            : 'http://localhost:5000/api/content/dna';

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
            alert('Failed to save item');
            return;
        }

        setIsEditing(false);
        setCurrentItem({});
        setImageFile(null);
        fetchItems();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Our DNA</h2>
                <button
                    onClick={() => { setIsEditing(true); setCurrentItem({}); setImageFile(null); }}
                    className="bg-gradevo-blue text-white px-4 py-2 rounded flex items-center gap-2"
                >
                    <Plus size={20} /> Add Item
                </button>
            </div>

            <div className="grid gap-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            {item.image && (
                                <img
                                    src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                                    alt={item.title}
                                    className="w-16 h-16 rounded object-cover"
                                />
                            )}
                            <div>
                                <h3 className="font-bold text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-1">{item.description}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setCurrentItem(item); setIsEditing(true); setImageFile(null); }} className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded">
                                <Edit size={20} />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded">
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
                            <h3 className="text-xl font-bold">{currentItem.id ? 'Edit Item' : 'Add Item'}</h3>
                            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title (e.g. Immersive #Experiences)"
                                className="w-full border p-2 rounded"
                                value={currentItem.title || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                            />
                            <textarea
                                placeholder="Description"
                                className="w-full border p-2 rounded h-32"
                                value={currentItem.description || ''}
                                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
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
                                    ) : currentItem.image ? (
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

export default DnaManager;
