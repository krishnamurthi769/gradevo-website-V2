import React from 'react';
import { Link } from 'react-router-dom';
import MagneticButton from '../components/ui/MagneticButton';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradevo-navy flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-9xl font-display font-bold text-gradevo-red mb-4">404</h1>
            <h2 className="text-4xl font-display font-bold text-white mb-6">Page Not Found</h2>
            <p className="text-gradevo-white/60 text-lg max-w-md mb-12">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/">
                <MagneticButton>Back to Home</MagneticButton>
            </Link>
        </div>
    );
};

export default NotFound;
