import { useState, useEffect, useCallback, useRef } from 'react';
import type { ChatSession, Message } from '../types';
import { loadSessions, saveSessions, createSession } from '../utils/chatSession';
import { generateResponse } from '../ai/generate';

const MAX_MESSAGES = 50;

/**
 * Custom hook for managing chat sessions and AI interactions.
 * 
 * @returns {Object} Chat state and handlers
 * @property {ChatSession[]} sessions - All chat sessions
 * @property {string | null} activeSessionId - Currently selected session ID
 * @property {boolean} isTyping - Whether AI is currently generating a response
 * @property {ChatSession | undefined} activeSession - Currently active session object
 * @property {() => void} handleCreateSession - Create a new chat session
 * @property {() => void} handleClearSession - Clear messages from active session
 * @property {(id: string) => void} handleDeleteSession - Delete a specific session
 * @property {(id: string, newTitle: string) => void} handleRenameSession - Rename a session
 * @property {(text: string, image?: string) => Promise<void>} handleSend - Send a message and get AI response
 * @property {(id: string) => void} setActiveSessionId - Switch to a different session
 */
export function useChat() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load sessions on mount
    useEffect(() => {
        const loaded = loadSessions();
        setSessions(loaded);
        if (loaded.length > 0) {
            setActiveSessionId(loaded[0].id);
        } else {
            const firstSession = createSession();
            setSessions([firstSession]);
            setActiveSessionId(firstSession.id);
        }
    }, []);

    // Save sessions when they change
    useEffect(() => {
        if (sessions.length > 0) {
            saveSessions(sessions);
        }
    }, [sessions]);

    // Auto-scroll to bottom when messages change or AI is typing
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [sessions, activeSessionId, isTyping]);

    const activeSession = sessions.find(s => s.id === activeSessionId);

    /**
     * Create a new chat session and set it as active
     */
    const handleCreateSession = useCallback(() => {
        const newSession = createSession();
        setSessions(prev => [newSession, ...prev].slice(0, 10)); // Limit to 10 chats
        setActiveSessionId(newSession.id);
    }, []);

    /**
     * Clear all messages from the active session
     */
    const handleClearSession = useCallback(() => {
        if (!activeSessionId) return;
        setSessions(prev => prev.map(s =>
            s.id === activeSessionId ? { ...s, messages: [] } : s
        ));
    }, [activeSessionId]);

    /**
     * Delete a specific session. If it's the last one, create a new empty session.
     * @param {string} id - Session ID to delete
     */
    const handleDeleteSession = useCallback((id: string) => {
        if (sessions.length === 1 && sessions[0].id === id) {
            const newSession = createSession();
            setSessions([newSession]);
            setActiveSessionId(newSession.id);
            return;
        }

        const newSessions = sessions.filter(s => s.id !== id);
        setSessions(newSessions);

        if (id === activeSessionId) {
            setActiveSessionId(newSessions[0].id);
        }
    }, [sessions, activeSessionId]);

    /**
     * Rename a specific session
     * @param {string} id - Session ID to rename
     * @param {string} newTitle - New title for the session
     */
    const handleRenameSession = useCallback((id: string, newTitle: string) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
    }, []);

    /**
     * Send a message and get AI response
     * @param {string} text - User message text
     * @param {string} [image] - Optional base64 image
     */
    const handleSend = useCallback(async (text: string, image?: string) => {
        if (!activeSessionId) return;

        const newUserMsg: Message = { role: 'user', content: text, image };

        const currentSession = sessions.find(s => s.id === activeSessionId);
        const currentHistory = currentSession ? currentSession.messages : [];

        // Add user message
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                const updatedMessages = [...s.messages, newUserMsg];
                const trimmedMessages = updatedMessages.length > MAX_MESSAGES
                    ? updatedMessages.slice(updatedMessages.length - MAX_MESSAGES)
                    : updatedMessages;

                const newTitle = (s.messages.length === 0 && s.title === 'New Chat')
                    ? (text || 'Image Analysis').slice(0, 30) + (text && text.length > 30 ? '...' : '')
                    : s.title;

                return { ...s, messages: trimmedMessages, title: newTitle };
            }
            return s;
        }));

        setIsTyping(true);

        try {
            // Build context from last 10 messages (without full images to avoid token blow-up in prompt if needed)
            const historyWindow = currentHistory.slice(-10);
            const promptContext = historyWindow.map(m =>
                `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`
            ).join('\n');
            const fullPrompt = `${promptContext}\nUser: ${text || "[Image uploaded]"}\nAI:`;

            const aiText = await generateResponse(fullPrompt, image);

            const newAiMsg: Message = { role: 'ai', content: aiText };

            setSessions(prev => prev.map(s => {
                if (s.id === activeSessionId) {
                    const updatedMessages = [...s.messages, newAiMsg];
                    const trimmedMessages = updatedMessages.length > MAX_MESSAGES
                        ? updatedMessages.slice(updatedMessages.length - MAX_MESSAGES)
                        : updatedMessages;
                    return { ...s, messages: trimmedMessages };
                }
                return s;
            }));

        } catch (error) {
            console.error("AI Error", error);
            const errorMsg: Message = { role: 'ai', content: "⚠️ Sorry, I couldn't generate a response." };
            setSessions(prev => prev.map(s => {
                if (s.id === activeSessionId) {
                    return { ...s, messages: [...s.messages, errorMsg] };
                }
                return s;
            }));
        } finally {
            setIsTyping(false);
        }
    }, [activeSessionId, sessions]);

    return {
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
    };
}
