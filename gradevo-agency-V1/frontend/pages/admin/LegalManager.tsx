import React, { useState, useEffect } from 'react';
import { Save, Loader, FileText, Shield } from 'lucide-react';

const LegalManager: React.FC = () => {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');

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
        const key = activeTab === 'terms' ? 'terms_content' : 'privacy_content';
        const value = content[key] || '';

        try {
            await fetch('http://localhost:5000/api/content/site-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ key, value })
            });

            alert(`${activeTab === 'terms' ? 'Terms' : 'Privacy Policy'} updated successfully!`);
        } catch (err) {
            console.error('Failed to save content', err);
            alert('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Legal & Compliance</h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradevo-blue text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                    Save Changes
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'terms'
                                ? 'bg-gray-50 text-gradevo-blue border-b-2 border-gradevo-blue'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <FileText size={18} />
                        Terms of Service
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'privacy'
                                ? 'bg-gray-50 text-gradevo-blue border-b-2 border-gradevo-blue'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <Shield size={18} />
                        Privacy Policy
                    </button>
                </div>

                <div className="p-6">
                    <textarea
                        className="w-full h-[600px] p-4 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-gradevo-blue focus:border-transparent outline-none"
                        value={content[activeTab === 'terms' ? 'terms_content' : 'privacy_content'] || ''}
                        onChange={(e) => setContent({
                            ...content,
                            [activeTab === 'terms' ? 'terms_content' : 'privacy_content']: e.target.value
                        })}
                        placeholder={`Enter your ${activeTab === 'terms' ? 'Terms of Service' : 'Privacy Policy'} here... (Markdown supported)`}
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Tip: You can use Markdown formatting for headers, lists, and links.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LegalManager;
