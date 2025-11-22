import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MagneticButton from './MagneticButton';
import React from 'react';

describe('MagneticButton', () => {
    it('renders children correctly', () => {
        render(<MagneticButton>Click Me</MagneticButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('renders with primary variant by default', () => {
        render(<MagneticButton>Primary</MagneticButton>);
        const button = screen.getByText('Primary').closest('button');
        expect(button).toHaveClass('bg-gradevo-red');
    });

    it('renders with secondary variant', () => {
        render(<MagneticButton variant="secondary">Secondary</MagneticButton>);
        const button = screen.getByText('Secondary').closest('button');
        expect(button).toHaveClass('border-gradevo-white/20');
    });
});
