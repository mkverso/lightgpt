/**
 * ChatInput Component
 * 
 * Text input area for sending messages with character limit and keyboard shortcuts.
 * Redesigned to match modern AI interfaces (ChatGPT-style).
 * 
 * Features:
 * - Pill-shaped integrated input
 * - Image selection menu (Camera / Gallery)
 * - SVG icons for upload (+) and send (↑)
 * - Image selection and preview
 * - Disclaimer footer note
 * 
 * @component
 */

import React, { useState, memo, useCallback, useRef, useEffect } from 'react';

interface ChatInputProps {
    /** Callback fired when user sends a message. Supports optional base64 image. */
    onSend: (text: string, image?: string) => void;
    /** Whether the input should be disabled (e.g., during AI generation) */
    disabled?: boolean;
}

/** SVG Plus Icon */
const PlusIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

/** SVG Arrow Up Icon */
const ArrowUpIcon = ({ color }: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
    </svg>
);

/** Camera Icon */
const CameraIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
        <circle cx="12" cy="13" r="4"></circle>
    </svg>
);

/** Gallery Icon */
const GalleryIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
);

export const ChatInput = memo(function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [text, setText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [showImageMenu, setShowImageMenu] = useState(false);

    const galleryInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const hasInput = text.trim() !== '' || selectedImage !== null;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowImageMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = useCallback((e?: React.FormEvent) => {
        e?.preventDefault();
        if (!hasInput || disabled) return;

        onSend(text, selectedImage || undefined);
        setText('');
        setSelectedImage(null);
        setShowImageMenu(false);
    }, [text, selectedImage, disabled, onSend, hasInput]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
                setShowImageMenu(false);
                // Reset inputs
                if (galleryInputRef.current) galleryInputRef.current.value = '';
                if (cameraInputRef.current) cameraInputRef.current.value = '';
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => setSelectedImage(null);

    return (
        <div style={{
            padding: '1rem 0.75rem 1.5rem',
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem'
        }}>
            {/* Image Preview Container */}
            {selectedImage && (
                <div style={{
                    alignSelf: 'flex-start',
                    marginLeft: '10%',
                    position: 'relative',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    <img
                        src={selectedImage}
                        alt="Selected"
                        style={{ maxWidth: '120px', maxHeight: '120px', display: 'block' }}
                    />
                    <button
                        onClick={removeImage}
                        style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px'
                        }}
                    >✕</button>
                </div>
            )}

            {/* Main Pill Input Area */}
            <div style={{
                width: '100%',
                maxWidth: '800px',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                backgroundColor: 'var(--input-bg)',
                borderRadius: '26px',
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                transition: 'border-color 0.2s',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}>
                {/* Hidden File Inputs */}
                <input
                    type="file"
                    ref={galleryInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
                <input
                    type="file"
                    ref={cameraInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                />

                {/* Upload Section with Menu */}
                <div style={{ position: 'relative' }} ref={menuRef}>
                    <button
                        onClick={() => setShowImageMenu(!showImageMenu)}
                        disabled={disabled}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            padding: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 0.2s'
                        }}
                        title="Image options"
                    >
                        <PlusIcon />
                    </button>

                    {/* Options Menu */}
                    {showImageMenu && (
                        <div style={{
                            position: 'absolute',
                            bottom: '100%',
                            left: '0',
                            marginBottom: '10px',
                            backgroundColor: 'var(--bg-primary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                            padding: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            zIndex: 100,
                            minWidth: '160px'
                        }}>
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '0.9rem',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <CameraIcon /> Camera
                            </button>
                            <button
                                onClick={() => galleryInputRef.current?.click()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '10px 12px',
                                    background: 'transparent',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    fontSize: '0.9rem',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <GalleryIcon /> Gallery
                            </button>
                        </div>
                    )}
                </div>

                {/* Textarea */}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={disabled ? "AI is thinking..." : "Message LiteGPT..."}
                    disabled={disabled}
                    rows={1}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        padding: '10px 4px',
                        outline: 'none',
                        resize: 'none',
                        maxHeight: '200px',
                        lineHeight: '24px',
                        height: '24px',
                        minHeight: '24px',
                        overflowY: 'hidden',
                        boxSizing: 'content-box'
                    }}
                    onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = '24px';
                        if (target.scrollHeight > 44) { // 24px text + 20px padding
                            target.style.height = `${target.scrollHeight - 20}px`;
                        }
                    }}
                />

                {/* Send Button (↑) */}
                <button
                    onClick={() => handleSubmit()}
                    disabled={disabled || !hasInput}
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: (disabled || !hasInput) ? 'var(--border-color)' : 'var(--text-primary)',
                        color: (disabled || !hasInput) ? 'var(--text-secondary)' : '#000',
                        cursor: (disabled || !hasInput) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: '8px',
                        marginBottom: '4px',
                        transition: 'all 0.2s'
                    }}
                >
                    <ArrowUpIcon color={(disabled || !hasInput) ? 'var(--text-secondary)' : '#000'} />
                </button>
            </div>

            {/* Disclaimer Footer Note */}
            <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                textAlign: 'center',
                opacity: 0.8
            }}>
                LiteGPT can make mistakes.
            </div>
        </div>
    );
});
