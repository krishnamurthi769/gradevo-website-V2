import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import ReactMarkdown from 'react-markdown';

const Terms: React.FC = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/content/site-content')
            .then(res => res.json())
            .then(data => {
                const item = data.find((i: any) => i.key === 'terms_content');
                setContent(item ? item.value : 'Terms of Service content not found.');
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="pt-32 bg-gradevo-navy min-h-screen pb-20">
            <div className="container mx-auto px-6">
                <SectionHeader title="Terms of #Service" />
                <div className="bg-white/5 rounded-2xl p-8 md:p-12 text-gradevo-white/80 prose prose-invert max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default Terms;
