import React, { useState, useEffect } from 'react';
import { Save, Upload, Loader } from 'lucide-react';

const StoryManager: React.FC = () => {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/content/site-content');
            const data = await res.json();
            const contentMap: Record<string, string> = {};
            data.forEach((item: { key: string; value: string }) => {
                contentMap[item.key] = item.value;
            });
            setContent(contentMap);
            setLoading(false);
        } catch (err) {
            console.error('Failed to fetch content', err);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('token');

        try {
            // Save text fields
            const textFields = [
                'story_p1', 'story_p2',
                'mission_title', 'mission_text',
                'vision_title', 'vision_text',
                'values_title', 'values_text'
            ];

            for (const key of textFields) {
                if (content[key]) {
                    await fetch('http://localhost:5000/api/content/site-content', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ key, value: content[key] })
                    });
                }
            }

            // Save image if selected
            if (imageFile) {
                const formData = new FormData();
                formData.append('key', 'story_image');
                formData.append('image', imageFile);

                await fetch('http://localhost:5000/api/content/site-content', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });
            }

            alert('Story updated successfully!');
            fetchContent(); // Refresh to get new image URL if updated
            setImageFile(null);
        } catch (err) {
            console.error('Failed to save story', err);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Manage Our Story</h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradevo-blue text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Story Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Main Story</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 1</label>
                        <textarea
                            className="w-full border p-2 rounded h-32"
                            value={content.story_p1 || ''}
                            onChange={(e) => setContent({ ...content, story_p1: e.target.value })}
                            placeholder="Enter the first paragraph of your story..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph 2</label>
                        <textarea
                            className="w-full border p-2 rounded h-32"
                            value={content.story_p2 || ''}
                            onChange={(e) => setContent({ ...content, story_p2: e.target.value })}
                            placeholder="Enter the second paragraph..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Story Image</label>
                        <div className="flex items-center gap-4">
                            {content.story_image && (
                                <img
                                    src={content.story_image.startsWith('http') ? content.story_image : `http://localhost:5000${content.story_image}`}
                                    alt="Current story"
                                    className="w-24 h-24 object-cover rounded"
                                />
                            )}
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2 border">
                                <Upload size={16} />
                                <span className="text-sm">Upload New Image</span>
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
                            {imageFile && <span className="text-sm text-green-600">{imageFile.name}</span>}
                        </div>
                    </div>
                </div>

                {/* Mission, Vision, Values */}
                <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Mission, Vision & Values</h3>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gradevo-red">Mission</h4>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={content.mission_title || 'Mission'}
                            onChange={(e) => setContent({ ...content, mission_title: e.target.value })}
                            placeholder="Title (e.g., Mission)"
                        />
                        <textarea
                            className="w-full border p-2 rounded h-20"
                            value={content.mission_text || ''}
                            onChange={(e) => setContent({ ...content, mission_text: e.target.value })}
                            placeholder="Mission statement..."
                        />
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gradevo-blue">Vision</h4>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={content.vision_title || 'Vision'}
                            onChange={(e) => setContent({ ...content, vision_title: e.target.value })}
                            placeholder="Title (e.g., Vision)"
                        />
                        <textarea
                            className="w-full border p-2 rounded h-20"
                            value={content.vision_text || ''}
                            onChange={(e) => setContent({ ...content, vision_text: e.target.value })}
                            placeholder="Vision statement..."
                        />
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-600">Values</h4>
                        <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={content.values_title || 'Values'}
                            onChange={(e) => setContent({ ...content, values_title: e.target.value })}
                            placeholder="Title (e.g., Values)"
                        />
                        <textarea
                            className="w-full border p-2 rounded h-20"
                            value={content.values_text || ''}
                            onChange={(e) => setContent({ ...content, values_text: e.target.value })}
                            placeholder="Values statement..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryManager;
