import React, { useEffect, useState } from 'react';
import { Save, Mail, Settings, Phone, MapPin, Globe, Calendar, Send, X, MessageSquare } from 'lucide-react';

interface ContactInfo {
    email: string;
    phone: string;
    address: string;
    social_instagram: string;
    social_linkedin: string;
    social_whatsapp: string;
}

interface Submission {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    services: string; // JSON string
    message: string;
    created_at: string;
    status: string;
}

interface Reply {
    id: number;
    submission_id: number;
    subject: string;
    message: string;
    sent_at: string;
    recipient_name: string;
    recipient_email: string;
}

const ContactManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'info' | 'submissions'>('info');
    const [inboxTab, setInboxTab] = useState<'inbox' | 'sent'>('inbox');
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        email: '',
        phone: '',
        address: '',
        social_instagram: '',
        social_linkedin: '',
        social_whatsapp: '',
    });
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Reply Modal State
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    const [replySubject, setReplySubject] = useState('');
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        fetchContactInfo();
        fetchSubmissions();
        fetchReplies();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/content/site-content');
            const data = await res.json();
            const info: any = {};
            data.forEach((item: any) => {
                info[item.key] = item.value;
            });
            setContactInfo(prev => ({ ...prev, ...info }));
        } catch (err) {
            console.error('Failed to fetch contact info', err);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/content/contact/submissions', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data);
            }
        } catch (err) {
            console.error('Failed to fetch submissions', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchReplies = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/content/contact/replies', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                const data = await res.json();
                setReplies(data);
            }
        } catch (err) {
            console.error('Failed to fetch replies', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setMessage('');
        try {
            const promises = Object.entries(contactInfo).map(([key, value]) =>
                fetch('http://localhost:5000/api/content/site-content', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ key, value }),
                })
            );

            const responses = await Promise.all(promises);
            for (const res of responses) {
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        alert('Session expired. Please login again.');
                        window.location.href = '/#/admin/login';
                        return;
                    }
                    throw new Error('Failed to save');
                }
            }
            setMessage('Contact information updated successfully!');
        } catch (err) {
            console.error('Failed to save contact info', err);
            setMessage('Failed to save changes.');
        }
    };

    const openReplyModal = (submission: Submission) => {
        setSelectedSubmission(submission);
        setReplySubject(`Re: Inquiry from ${submission.name}`);
        setReplyMessage(`Dear ${submission.name},\n\nThank you for contacting Gradevo.\n\n`);
        setReplyModalOpen(true);
    };

    const closeReplyModal = () => {
        setReplyModalOpen(false);
        setSelectedSubmission(null);
        setReplySubject('');
        setReplyMessage('');
    };

    const handleSendReply = async () => {
        if (!selectedSubmission) return;
        setSendingReply(true);

        try {
            const res = await fetch('http://localhost:5000/api/content/contact/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    submission_id: selectedSubmission.id,
                    subject: replySubject,
                    message: replyMessage,
                    to_email: selectedSubmission.email
                }),
            });

            if (res.ok) {
                alert('Reply sent successfully!');
                closeReplyModal();
                fetchSubmissions(); // Refresh status
                fetchReplies(); // Refresh sent items
            } else {
                throw new Error('Failed to send reply');
            }
        } catch (err) {
            console.error('Failed to send reply', err);
            alert('Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto relative">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Contact Management</h2>
                <div className="flex gap-2 bg-white p-1 rounded-lg border">
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'info' ? 'bg-gradevo-blue text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Settings size={18} /> Settings
                    </button>
                    <button
                        onClick={() => setActiveTab('submissions')}
                        className={`px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'submissions' ? 'bg-gradevo-blue text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        <Mail size={18} /> Inquiries
                    </button>
                </div>
            </div>

            {message && (
                <div className={`p-4 rounded mb-6 ${message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            {activeTab === 'info' ? (
                <div className="bg-white p-6 rounded-lg shadow grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 font-semibold">Email Address</label>
                            <input
                                name="email"
                                value={contactInfo.email}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="hello@gradevo.com"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">Phone Number</label>
                            <input
                                name="phone"
                                value={contactInfo.phone}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold">Physical Address</label>
                        <textarea
                            name="address"
                            value={contactInfo.address}
                            onChange={handleChange}
                            className="w-full border p-2 rounded h-24"
                            placeholder="123 Creative St, Design City, DC 10101"
                        />
                    </div>

                    <h3 className="text-xl font-semibold mt-4">Social Media Links</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="block mb-2 text-sm">Instagram URL</label>
                            <input
                                name="social_instagram"
                                value={contactInfo.social_instagram}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm">LinkedIn URL</label>
                            <input
                                name="social_linkedin"
                                value={contactInfo.social_linkedin}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm">WhatsApp URL</label>
                            <input
                                name="social_whatsapp"
                                value={contactInfo.social_whatsapp}
                                onChange={handleChange}
                                className="w-full border p-2 rounded"
                                placeholder="https://wa.me/..."
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleSave}
                            className="bg-gradevo-blue text-white px-6 py-3 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors"
                        >
                            <Save size={20} /> Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="border-b p-4 flex gap-4">
                        <button
                            onClick={() => setInboxTab('inbox')}
                            className={`pb-2 px-2 font-medium ${inboxTab === 'inbox' ? 'text-gradevo-blue border-b-2 border-gradevo-blue' : 'text-gray-500'}`}
                        >
                            Inbox
                        </button>
                        <button
                            onClick={() => setInboxTab('sent')}
                            className={`pb-2 px-2 font-medium ${inboxTab === 'sent' ? 'text-gradevo-blue border-b-2 border-gradevo-blue' : 'text-gray-500'}`}
                        >
                            Sent
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-gray-600">Date</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">{inboxTab === 'inbox' ? 'From' : 'To'}</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Subject/Message</th>
                                    <th className="text-left p-4 font-semibold text-gray-600">Status</th>
                                    {inboxTab === 'inbox' && <th className="text-left p-4 font-semibold text-gray-600">Action</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {inboxTab === 'inbox' ? (
                                    submissions.map((sub) => {
                                        let services = [];
                                        try {
                                            services = JSON.parse(sub.services);
                                        } catch (e) {
                                            services = [sub.services];
                                        }

                                        return (
                                            <tr key={sub.id} className="hover:bg-gray-50">
                                                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        {new Date(sub.created_at).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="p-4 font-medium">
                                                    {sub.name}
                                                    <div className="text-xs text-gray-500 font-normal">{sub.email}</div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={sub.message}>
                                                    {sub.message}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${sub.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {sub.status || 'New'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => openReplyModal(sub)}
                                                        className="text-gradevo-blue hover:bg-blue-50 p-2 rounded-full transition-colors"
                                                        title="Reply"
                                                    >
                                                        <MessageSquare size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    replies.map((reply) => (
                                        <tr key={reply.id} className="hover:bg-gray-50">
                                            <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(reply.sent_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4 font-medium">
                                                {reply.recipient_name}
                                                <div className="text-xs text-gray-500 font-normal">{reply.recipient_email}</div>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                                                <div className="font-medium">{reply.subject}</div>
                                                <div className="truncate text-gray-500">{reply.message}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                                    Sent
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}

                                {(inboxTab === 'inbox' ? submissions.length === 0 : replies.length === 0) && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No {inboxTab === 'inbox' ? 'inquiries' : 'sent messages'} found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Reply Modal */}
            {replyModalOpen && selectedSubmission && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="font-bold text-lg">Reply to {selectedSubmission.name}</h3>
                            <button onClick={closeReplyModal} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                <input
                                    value={selectedSubmission.email}
                                    disabled
                                    className="w-full border p-2 rounded bg-gray-50 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    value={replySubject}
                                    onChange={(e) => setReplySubject(e.target.value)}
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-gradevo-blue focus:border-transparent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    className="w-full border p-2 rounded h-48 focus:ring-2 focus:ring-gradevo-blue focus:border-transparent outline-none resize-none"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={closeReplyModal}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendReply}
                                disabled={sendingReply}
                                className="bg-gradevo-blue text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {sendingReply ? 'Sending...' : <><Send size={16} /> Send Reply</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactManager;
