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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    backgroundColor: isUser ? 'var(--msg-user-bg)' : 'var(--msg-ai-bg)',
                    color: isUser ? 'var(--msg-user-text)' : 'var(--msg-ai-text)',
                    border: isUser ? '1px solid var(--accent-primary)' : 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    lineHeight: '1.6',
                    wordBreak: 'break-word',
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

                {/* Render text content with Markdown support */}
                {message.content && (
                    <div className="markdown-content">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }: any) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="code-block-wrapper">
                                            <div className="code-block-header">
                                                <span>{match[1]}</span>
                                            </div>
                                            <SyntaxHighlighter
                                                {...props}
                                                style={atomDark}
                                                language={match[1]}
                                                PreTag="div"
                                                customStyle={{
                                                    margin: 0,
                                                    borderRadius: '0 0 8px 8px',
                                                    fontSize: '0.9rem',
                                                    backgroundColor: '#1a1a1a'
                                                }}
                                            >
                                                {String(children).replace(/\n$/, '')}
                                            </SyntaxHighlighter>
                                        </div>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
});
