/**
 * Chat Session Management Utilities
 * 
 * Handles storage, creation, and persistence of chat sessions.
 * Uses sessionStorage for data that persists during browser session only.
 * 
 * @module utils/chatSession
 */

import type { ChatSession } from '../types/index';

const STORAGE_KEY = 'chat_sessions';

/**
 * Load all chat sessions from sessionStorage.
 * 
 * Uses sessionStorage instead of localStorage to ensure data is cleared
 * when the browser tab is closed, providing better privacy.
 * 
 * @returns {ChatSession[]} Array of chat sessions, empty array if none found
 * 
 * @example
 * ```typescript
 * const sessions = loadSessions();
 * console.log(sessions.length); // Number of stored sessions
 * ```
 */
export function loadSessions(): ChatSession[] {
    try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error('Failed to parse sessions', e);
        return [];
    }
}

/**
 * Save chat sessions to sessionStorage.
 * 
 * Note: The MAX_CHATS limit is enforced by the UI (Chat.tsx),
 * this function simply persists whatever is passed.
 * 
 * @param {ChatSession[]} sessions - Array of sessions to save
 * 
 * @example
 * ```typescript
 * saveSessions([...sessions, newSession]);
 * ```
 */
export function saveSessions(sessions: ChatSession[]) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/**
 * Create a new empty chat session with a unique ID.
 * 
 * @returns {ChatSession} Newly created session
 * 
 * @example
 * ```typescript
 * const newChat = createSession();
 * console.log(newChat.title); // "New Chat"
 * ```
 */
export function createSession(): ChatSession {
    return {
        id: crypto.randomUUID(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now()
    };
}
