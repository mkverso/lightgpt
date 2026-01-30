/**
 * MessageBubble Component
 * 
 * Displays a single chat message with role-based styling.
 * Supports displaying images for user messages.
 * Memoized to prevent unnecessary re-renders when parent state changes.
 * 
 * @component
 */

import { memo } from 'react';
import type { Message } from '../types/index';

interface MessageBubbleProps {
    /** The message object containing role, content, and optional image */
    message: Message;
}

/**
 * Renders a styled message bubble aligned based on sender role.
 * 
 * @param {MessageBubbleProps} props - Component props
 * @returns {JSX.Element} Styled message bubble
 */
export const MessageBubble = memo(function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                marginBottom: '1rem',
                width: '100%',
            }}
        >
            <div
                style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: isUser ? 'var(--pk-color-6)' : 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    border: isUser ? '1px solid var(--accent-primary)' : 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    lineHeight: '1.5',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    borderBottomRightRadius: isUser ? '2px' : '12px',
                    borderBottomLeftRadius: isUser ? '12px' : '2px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}
            >
                {/* Render image if present */}
                {message.image && (
                    <img
                        src={message.image}
                        alt="User uploaded content"
                        style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            borderRadius: '8px',
                            marginTop: '0.25rem'
                        }}
                    />
                )}

                {/* Render text content */}
                {message.content && (
                    <div>{message.content}</div>
                )}
            </div>
        </div>
    );
});
