import React, { useState, useEffect, createContext, useContext } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';

interface SidebarContextType {
    closeSidebar: () => void;
    isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) throw new Error('useSidebar must be used within a ChatLayout');
    return context;
};

interface ChatLayoutProps {
    children: React.ReactNode;
    sidebar?: React.ReactNode;
    modelSelector?: React.ReactNode;
}

export function ChatLayout({ children, sidebar, modelSelector }: ChatLayoutProps) {
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

    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarVisible(false);
        }
    };

    return (
        <SidebarContext.Provider value={{ closeSidebar, isMobile }}>
            <div className="chat-layout-container">
                {/* Dark Overlay for Mobile */}
                {isMobile && isSidebarVisible && (
                    <div
                        onClick={() => setIsSidebarVisible(false)}
                        className="mobile-overlay"
                    />
                )}

                {/* Sidebar Container */}
                {sidebar && (
                    <div
                        className="sidebar-wrapper"
                        style={{
                            width: isSidebarVisible ? '260px' : '0',
                            position: isMobile ? 'fixed' : 'relative',
                            boxShadow: isMobile && isSidebarVisible ? '10px 0 30px rgba(0,0,0,0.5)' : 'none',
                            transform: (isMobile && !isSidebarVisible) ? 'translateX(-100%)' : 'translateX(0)'
                        }}
                    >
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
                <div className="main-content-area">
                    {/* Header */}
                    <header className="header-bar">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                                onClick={toggleSidebar}
                                className="sidebar-toggle-btn"
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
                            {modelSelector}
                            <ThemeToggle />
                            <UserMenu />
                        </div>
                    </header>

                    {/* Messages Space */}
                    <main className="app-main">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarContext.Provider>
    );
}
