import { useState, useRef, useEffect } from 'react';
import type { ChatSession } from '../types/index';

interface SidebarProps {
    sessions: ChatSession[];
    activeSessionId: string | null;
    onSelectSession: (id: string) => void;
    onCreateSession: () => void;
    onClearSession: () => void;
    onDeleteSession: (id: string) => void;
    onRenameSession: (id: string, newTitle: string) => void;
    onImportSession: (file: File) => void;
    onExportSession: (session: ChatSession) => void;
}

export function Sidebar({
    sessions,
    activeSessionId,
    onSelectSession,
    onCreateSession,
    onClearSession,
    onDeleteSession,
    onRenameSession,
    onImportSession,
    onExportSession
}: SidebarProps) {
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === id ? null : id);
    };

    const handleAction = (action: 'rename' | 'delete' | 'export', id: string) => {
        console.log(`Action: ${action} on ${id}`); // Debug
        setMenuOpenId(null);
        const session = sessions.find(s => s.id === id);
        if (!session) return;

        if (action === 'delete') {
            if (confirm('Delete this chat?')) {
                onDeleteSession(id);
            }
        } else if (action === 'rename') {
            const newTitle = prompt('Enter new chat title:', session.title);
            if (newTitle) {
                onRenameSession(id, newTitle);
            }
        } else if (action === 'export') {
            onExportSession(session);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImportSession(file);
        }
        // Reset inputs
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div style={{
            width: '260px',
            backgroundColor: 'var(--input-bg)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        }}>
            {/* Logo Area */}
            <div style={{ padding: '1.5rem 1rem 0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img
                    src="/favicon.png"
                    alt="Logo"
                    style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                />
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>LiteGPT</h3>
            </div>

            {/* Buttons: New Chat & Upload */}
            <div style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={onCreateSession}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                    }}
                >
                    <span>+</span> New Chat
                </button>
                <button
                    onClick={handleImportClick}
                    title="Upload Chat (.md)"
                    style={{
                        padding: '0.75rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px'
                    }}
                >
                    📂
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept=".md"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>

            {/* Session List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {sessions.map(session => (
                        <div
                            key={session.id}
                            onMouseEnter={() => setHoveredId(session.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            style={{ position: 'relative' }}
                        >
                            <button
                                onClick={() => onSelectSession(session.id)}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.75rem 2.5rem 0.75rem 0.75rem', // Extra right padding for menu
                                    borderRadius: '4px',
                                    border: 'none',
                                    background: session.id === activeSessionId ? 'var(--bg-primary)' : 'transparent',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontWeight: session.id === activeSessionId ? 'bold' : 'normal',
                                    opacity: session.id === activeSessionId ? 1 : 0.8,
                                    position: 'relative'
                                }}
                            >
                                {session.title || 'New Chat'}
                            </button>

                            {/* 3-Dot Menu Button (Visible on Hover or if Menu Open) */}
                            {(hoveredId === session.id || menuOpenId === session.id) && (
                                <button
                                    onClick={(e) => handleMenuClick(e, session.id)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        padding: '0.25rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '24px',
                                        height: '24px'
                                    }}
                                >
                                    ⋮
                                </button>
                            )}

                            {/* Dropdown Menu */}
                            {menuOpenId === session.id && (
                                <div
                                    ref={menuRef}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: '1rem',
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                                        zIndex: 20,
                                        minWidth: '120px',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div
                                        onClick={(e) => { e.stopPropagation(); handleAction('rename', session.id); }}
                                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--input-bg)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        ✏️ Rename
                                    </div>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); handleAction('export', session.id); }}
                                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--input-bg)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        ⬇️ Download
                                    </div>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); handleAction('delete', session.id); }}
                                        style={{ padding: '0.5rem 1rem', cursor: 'pointer', color: '#ff6b6b', fontSize: '0.9rem' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--input-bg)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        🗑️ Delete
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / Clear */}
            {activeSessionId && (
                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    <button
                        onClick={onClearSession}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%'
                        }}
                    >
                        🗑️ Clear conversation
                    </button>
                </div>
            )}
        </div>
    );
}
