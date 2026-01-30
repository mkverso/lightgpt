import React, { useState, useEffect } from 'react';

interface LoginFormProps {
    onSuccess: () => void;
}

/**
 * LoginForm Component (Refined)
 * 
 * Implements strict validation rules and improved UX:
 * - Validation: Username (min 4, alphanumeric), Password (min 6, not empty).
 * - UX: Errors show only after interaction (touched). Button disabled until valid.
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
    // Field State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Touched State (to track interaction)
    const [touched, setTouched] = useState({ username: false, password: false });

    // Error State
    const [errors, setErrors] = useState({ username: '', password: '', form: '' });

    // Validation Logic
    const validate = () => {
        const newErrors = { username: '', password: '', form: '' };
        let isValid = true;

        // Username Rule: Min 4 chars, Alphanumeric
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!username) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters';
            isValid = false;
        } else if (!usernameRegex.test(username)) {
            newErrors.username = 'Username must be alphanumeric';
            isValid = false;
        }

        // Password Rule: Not Empty, Min 6 chars
        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        return { isValid, newErrors };
    };

    // Update errors on change
    useEffect(() => {
        const { newErrors } = validate();
        setErrors(prev => ({ ...prev, username: newErrors.username, password: newErrors.password }));
    }, [username, password]);

    const { isValid } = validate();

    const handleBlur = (field: 'username' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        if (username === "user" && password === "user123") {
            onSuccess();
        } else {
            setErrors(prev => ({ ...prev, form: "Invalid credentials" }));
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '300px' }}>
            {/* Username Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => handleBlur('username')}
                    style={{
                        padding: '0.5rem',
                        fontFamily: 'inherit',
                        borderColor: touched.username && errors.username ? '#ff6b6b' : 'inherit'
                    }}
                />
                {touched.username && errors.username && (
                    <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{errors.username}</span>
                )}
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    style={{
                        padding: '0.5rem',
                        fontFamily: 'inherit',
                        borderColor: touched.password && errors.password ? '#ff6b6b' : 'inherit'
                    }}
                />
                {touched.password && errors.password && (
                    <span style={{ color: '#ff6b6b', fontSize: '0.8rem' }}>{errors.password}</span>
                )}
            </div>

            {/* Global Form Error */}
            {errors.form && (
                <div style={{ color: '#ff6b6b', fontSize: '0.9rem', textAlign: 'center' }}>
                    {errors.form}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isValid}
                style={{
                    padding: '0.75rem',
                    cursor: isValid ? 'pointer' : 'not-allowed',
                    fontFamily: 'inherit',
                    // Theme color integration
                    backgroundColor: isValid ? 'var(--accent-primary)' : 'var(--input-bg)',
                    color: isValid ? 'var(--pk-bg-light)' : 'var(--text-secondary)',
                    border: isValid ? 'none' : '1px solid var(--border-color)',
                    fontWeight: 'bold',
                    borderRadius: '4px',
                    opacity: isValid ? 1 : 0.7
                }}
            >
                Login
            </button>
        </form>
    );
}
