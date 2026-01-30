/**
 * TypingIndicator Component
 * 
 * Animated "..." indicator shown while AI is generating a response.
 * Uses CSS animation for smooth bouncing effect.
 * 
 * @component
 */

export function TypingIndicator() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: '1rem',
        }}>
            <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: 'var(--input-bg)',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                borderBottomLeftRadius: '2px',
            }}>
                Thinking
                <span style={{
                    display: 'inline-block',
                    animation: 'bounce 1.4s infinite ease-in-out'
                }}>.</span>
                <span style={{
                    display: 'inline-block',
                    animation: 'bounce 1.4s infinite ease-in-out 0.2s'
                }}>.</span>
                <span style={{
                    display: 'inline-block',
                    animation: 'bounce 1.4s infinite ease-in-out 0.4s'
                }}>.</span>
            </div>
            <style>{`
                @keyframes bounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
