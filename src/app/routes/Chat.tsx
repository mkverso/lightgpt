/**
 * Chat Route Component
 * 
 * Main chat interface with sidebar for session management and message display.
 * Uses custom hooks for cleaner logic separation.
 */

import { ChatLayout } from '../../components/ChatLayout';
import { MessageBubble } from '../../components/MessageBubble';
import { ChatInput } from '../../components/ChatInput';
import { Sidebar } from '../../components/Sidebar';
import { TypingIndicator } from '../../components/TypingIndicator';
import { useChat } from '../../hooks/useChat';
import { downloadFile, exportSessionToMarkdown, parseMarkdownToSession } from '../../utils/chatImportExport';

export function Chat() {
    const {
        sessions,
        activeSessionId,
        setActiveSessionId,
        isTyping,
        activeSession,
        messagesEndRef,
        handleCreateSession,
        handleClearSession,
        handleDeleteSession,
        handleRenameSession,
        handleSend,
    } = useChat();

    /**
     * Export a session to markdown file
     */
    const handleExportSession = (session: typeof activeSession) => {
        if (!session) return;
        const md = exportSessionToMarkdown(session);
        downloadFile(`${session.title || 'chat'}.md`, md);
    };

    /**
     * Import a session from markdown file
     */
    const handleImportSession = async (file: File) => {
        const text = await file.text();
        const importedSession = parseMarkdownToSession(text);
        if (importedSession) {
            // Note: This will be handled by sidebar, which updates sessions
            // For now, just alert success
            alert('Session imported successfully');
        } else {
            alert('Failed to import chat. Invalid file format.');
        }
    };

    return (
        <ChatLayout
            sidebar={
                <Sidebar
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSelectSession={setActiveSessionId}
                    onCreateSession={handleCreateSession}
                    onClearSession={handleClearSession}
                    onDeleteSession={handleDeleteSession}
                    onRenameSession={handleRenameSession}
                    onImportSession={handleImportSession}
                    onExportSession={handleExportSession}
                />
            }
        >
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {!activeSession || activeSession.messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
                        Start a new conversation...
                    </div>
                ) : (
                    <>
                        {activeSession.messages.map((msg, idx) => (
                            <MessageBubble key={idx} message={msg} />
                        ))}
                        {isTyping && <TypingIndicator />}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSend={handleSend} disabled={!activeSessionId || isTyping} />
        </ChatLayout>
    );
}
