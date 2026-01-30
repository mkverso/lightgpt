import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginForm } from '../../components/LoginForm';
import { ThemeToggle } from '../../components/ThemeToggle';

/**
 * Login Page
 * 
 * The entry point for unauthenticated users.
 * 
 * LOGIC:
 * - Uses `useNavigate` hook from react-router-dom for navigation.
 * - Renders the `LoginForm` component.
 * - Passes a success callback to `LoginForm` that triggers navigation to `/chat`.
 * 
 * WHY:
 * - Separates PAGE logic (navigation, layout) from FORM logic (validation, state).
 * - "Smart" container (Login Page) vs "Dumb" presentational component (LoginForm).
 */
export function Login() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoading(true);
        // Simulate loading / context switch
        setTimeout(() => {
            navigate('/chat', { replace: true });
        }, 1500);
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: '1rem',
                animation: 'fadeIn 0.5s ease'
            }}>
                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                `}</style>
                <img
                    src="/favicon.png"
                    alt="Logo"
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        animation: 'spin 2s linear infinite' // Spin the logo
                    }}
                />
                <h2 style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>Entering LiteGPT...</h2>
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '2rem',
            position: 'relative' // For absolute positioning of toggle
        }}>
            <ThemeToggle style={{ position: 'absolute', top: '1rem', right: '1rem' }} />
            <img
                src="/favicon.png"
                alt="Logo"
                style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
            />
            <h1>LiteGPT Web</h1>
            <LoginForm onSuccess={handleLoginSuccess} />
        </div>
    );
}
