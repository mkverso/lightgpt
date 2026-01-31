import { useState, useRef } from 'react';
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
        selectedModel,
        setSelectedModel,
    } = useChat();

    const [showScrollButton, setShowScrollButton] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const models = [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
        { id: 'gpt-4o', name: 'GPT-4o' },
        { id: 'openai/gpt-oss-120b', name: 'GPT-120B' },
        { id: 'claude-3-5-sonnet-latest', name: 'Claude 3.5 Sonnet' },
        { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro' },
        { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash' },
        { id: 'meta-llama/llama-3.3-70b-instruct-turbo', name: 'Llama 3.3 70B' },
        { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3' },
        { id: 'openai/gpt-5.2-codex', name: 'GPT-5.2 Codex' },
        { id: 'mistralai/ministral-14b-2512', name: 'Ministral 14B' },
    ];

    /**
     * Detect scroll position to show/hide jump button
     */
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButton(!isNearBottom);
    };

    /**
     * Scroll to bottom manually
     */
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
            alert('Session imported successfully');
        } else {
            alert('Failed to import chat. Invalid file format.');
        }
    };

    return (
        <ChatLayout
            modelSelector={
                <div className="model-selector-container">
                    <select
                        className="model-select"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        title="Select AI Model"
                    >
                        {models.map(model => (
                            <option key={model.id} value={model.id}>
                                {model.name}
                            </option>
                        ))}
                    </select>
                    <div className="model-select-arrow">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            }
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
            <div
                className="chat-messages-container"
                onScroll={handleScroll}
                ref={scrollContainerRef}
                style={{ flex: 1, overflowY: 'auto', padding: '1rem', position: 'relative' }}
            >
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

                {/* Jump to bottom button */}
                {showScrollButton && (
                    <button
                        className="scroll-bottom-btn"
                        onClick={scrollToBottom}
                        title="Scroll to bottom"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="7 13 12 18 17 13"></polyline>
                            <polyline points="7 6 12 11 17 6"></polyline>
                        </svg>
                    </button>
                )}
            </div>

            <ChatInput onSend={handleSend} disabled={!activeSessionId || isTyping} />
        </ChatLayout>
    );
}
