import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

interface ChatLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
}

export function ChatLayout({ children, sidebar }: ChatLayoutProps) {
    const [isSidebarVisible, setIsSidebarVisible] = useState(window.innerWidth > 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            if (!mobile && !isSidebarVisible) {
                setIsSidebarVisible(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isSidebarVisible]);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            maxWidth: '100%',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)'
        }}>
            {/* Dark Overlay for Mobile */}
            {isMobile && isSidebarVisible && (
                <div
                    onClick={() => setIsSidebarVisible(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: 1000,
                        backdropFilter: 'blur(4px)',
                        cursor: 'pointer'
                    }}
                />
            )}

            {/* Sidebar Container */}
            {sidebar && (
                <div style={{
                    flexShrink: 0,
                    width: isSidebarVisible ? '260px' : '0',
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease',
                    overflow: 'hidden',
                    position: isMobile ? 'fixed' : 'relative',
                    top: 0,
                    left: 0,
                    height: '100%',
                    zIndex: 1001,
                    backgroundColor: 'var(--input-bg)',
                    boxShadow: isMobile && isSidebarVisible ? '10px 0 30px rgba(0,0,0,0.5)' : 'none',
                    transform: (isMobile && !isSidebarVisible) ? 'translateX(-100%)' : 'translateX(0)'
                }}>
                    <div style={{ width: '260px', height: '100%', position: 'relative' }}>
                        {/* Mobile Close Button (X) - Inside Top Right */}
                        {isMobile && isSidebarVisible && (
                            <button
                                onClick={() => setIsSidebarVisible(false)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '12px',
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)',
                                    zIndex: 1005, // Highest priority
                                    fontSize: '18px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                                }}
                                title="Close sidebar"
                            >
                                ✕
                            </button>
                        )}
                        {sidebar}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                width: '100%',
                overflow: 'hidden'
            }}>
                {/* Header */}
                <header style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--bg-primary)',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={toggleSidebar}
                            style={{
                                background: 'none',
                                border: '1px solid var(--border-color)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s',
                                width: '36px',
                                height: '36px'
                            }}
                            title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{
                                    transform: isSidebarVisible ? 'rotate(0deg)' : 'rotate(180deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                <polyline points="15 18 9 12 15 6"></polyline>
                            </svg>
                        </button>
                        <h2 style={{
                            margin: 0,
                            fontSize: '1.2rem',
                            display: (isMobile && isSidebarVisible) ? 'none' : 'block'
                        }}>
                            LiteGPT Web
                        </h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <ThemeToggle />
                        <UserMenu />
                    </div>
                </header>

                {/* Messages Space */}
                <main style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-primary)'
                }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
