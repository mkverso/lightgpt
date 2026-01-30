/**
 * ThemeToggle Component
 * 
 * Button to toggle between light and dark themes.
 * Displays a sun icon for dark mode and moon icon for light mode.
 * 
 * @component
 */

import React, { memo } from 'react';
import { useTheme } from '../theme/ThemeProvider';

interface ThemeToggleProps {
    /** Additional inline styles */
    style?: React.CSSProperties;
    /** CSS class name */
    className?: string;
}

/**
 * Circular button that toggles theme mode.
 * 
 * @param {ThemeToggleProps} props - Component props
 * @returns {JSX.Element} Theme toggle button
 */
export const ThemeToggle = memo(function ThemeToggle({ style, className }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={className}
            style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '1px solid var(--border-color)',
                background: 'var(--input-bg)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                ...style
            }}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            {theme === 'light' ? '🌙' : '☀️'}
        </button>
    );
});
