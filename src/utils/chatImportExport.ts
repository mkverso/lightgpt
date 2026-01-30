/**
 * Chat Import/Export Utilities
 * 
 * Handles conversion between chat sessions and markdown format
 * for easy backup and sharing.
 * 
 * @module utils/chatImportExport
 */

import type { ChatSession, Message } from '../types';

/**
 * Export a chat session to markdown format.
 * 
 * Format:
 * ```markdown
 * # Chat Title
 * 
 * **User**: message
 * **AI**: response
 * ```
 * 
 * @param {ChatSession} session - The session to export
 * @returns {string} Markdown-formatted chat content
 * 
 * @example
 * ```typescript
 * const markdown = exportSessionToMarkdown(session);
 * downloadFile('chat.md', markdown);
 * ```
 */
export function exportSessionToMarkdown(session: ChatSession): string {
    let md = `# ${session.title}\n\n`;

    session.messages.forEach((msg: Message) => {
        const role = msg.role === 'user' ? 'User' : 'AI';
        md += `**${role}**: ${msg.content}\n\n`;
    });

    return md;
}

/**
 * Parse a markdown file back into a chat session.
 * 
 * Expected format:
 * - First H1 (#) becomes the title
 * - Lines starting with "**User**:" become user messages
 * - Lines starting with "**AI**:" become AI messages
 * 
 * @param {string} markdown - Markdown content to parse
 * @returns {ChatSession | null} Parsed session, or null if invalid format
 * 
 * @example
 * ```typescript
 * const session = parseMarkdownToSession(fileContent);
 * if (session) {
 *   addSession(session);
 * }
 * ```
 */
export function parseMarkdownToSession(markdown: string): ChatSession | null {
    try {
        const lines = markdown.split('\n');
        let title = 'Imported Chat';
        const messages: Message[] = [];

        for (const line of lines) {
            // Extract title from first H1
            if (line.startsWith('# ')) {
                title = line.substring(2).trim();
            }

            // Parse user messages
            if (line.startsWith('**User**:')) {
                messages.push({
                    role: 'user',
                    content: line.substring(9).trim()
                });
            }

            // Parse AI messages
            if (line.startsWith('**AI**:')) {
                messages.push({
                    role: 'ai',
                    content: line.substring(7).trim()
                });
            }
        }

        // Validate we got at least one message
        if (messages.length === 0) {
            return null;
        }

        return {
            id: crypto.randomUUID(),
            title,
            messages,
            createdAt: Date.now()
        };
    } catch (e) {
        console.error('Failed to parse markdown', e);
        return null;
    }
}

/**
 * Trigger a browser download for a text file.
 * 
 * Creates a temporary blob URL and triggers a download via a hidden anchor element.
 * 
 * @param {string} filename - Name for the downloaded file
 * @param {string} content - Text content to download
 * 
 * @example
 * ```typescript
 * downloadFile('my-chat.md', markdownContent);
 * ```
 */
export function downloadFile(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
