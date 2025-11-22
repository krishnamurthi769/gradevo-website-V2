import React, { useState, useEffect } from 'react';
import { Save, Loader, Upload, Image as ImageIcon } from 'lucide-react';

const LogoManager: React.FC = () => {
    const [logoUrl, setLogoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchLogo();
    }, []);

    const fetchLogo = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/content/site-content');
            const data = await res.json();
            const logoItem = data.find((item: any) => item.key === 'logo_url');
            if (logoItem) {
                setLogoUrl(logoItem.value);
            }
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch logo', err);
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('token');

        try {
            const formData = new FormData();
            formData.append('key', 'logo_url');
            if (file) {
                formData.append('image', file);
            } else {
                formData.append('value', logoUrl);
            }

            const res = await fetch('http://localhost:5000/api/content/site-content', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setLogoUrl(data.value);
                setFile(null);
                setPreview(null);
                alert('Logo updated successfully!');
                // Force reload to update logo across the site
                window.location.reload();
            } else {
                throw new Error('Failed to save');
            }
        } catch (err) {
            console.error('Failed to save logo', err);
            alert('Failed to save logo');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Logo & Branding</h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradevo-blue text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-8">
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Website Logo</h3>
                    <p className="text-gray-500 mb-6">Upload your brand logo. This will be displayed in the navbar and footer.</p>

                    <div className="flex items-start gap-8">
                        <div className="w-64 h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative overflow-hidden group">
                            {preview || logoUrl ? (
                                <img
                                    src={preview || (logoUrl.startsWith('http') ? logoUrl : `http://localhost:5000${logoUrl}`)}
                                    alt="Logo Preview"
                                    className="w-full h-full object-contain p-4"
                                />
                            ) : (
                                <div className="text-center p-4">
                                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                    <span className="text-gray-400 text-sm">No logo uploaded</span>
                                </div>
                            )}

                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <div className="text-white flex flex-col items-center">
                                    <Upload size={24} className="mb-2" />
                                    <span className="text-sm font-medium">Change Logo</span>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        <div className="flex-1">
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4">
                                <strong>Tip:</strong> For best results, use a PNG or SVG file with a transparent background. Recommended height: 60px.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogoManager;
