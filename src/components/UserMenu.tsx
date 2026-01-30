import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        // In a real app, clear auth tokens. Here just nav to login.
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={menuRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-color)',
                    background: 'var(--accent-secondary)', // Greenish
                    color: 'var(--pk-color-5)', // Dark text
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                }}
                aria-label="User menu"
            >
                U
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    minWidth: '120px',
                    padding: '0.5rem',
                    zIndex: 10
                }}>
                    <div style={{ padding: '0.5rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)' }}>
                        User
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.5rem',
                            background: 'none',
                            border: 'none',
                            color: '#ff6b6b',
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
