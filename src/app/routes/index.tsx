import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Login';
import { Chat } from './Chat';

/**
 * AppRoutes
 * 
 * Central routing configuration for the application.
 * 
 * METHODOLOGY:
 * - Uses `BrowserRouter` for clean URLs (history API).
 * - Defines `Routes` and individual `Route` definitions.
 * - `/` -> Renders Login page.
 * - `/chat` -> Renders Chat page.
 * - `*` (Catch-all) -> Redirects back to `/` to handle unknown paths.
 * 
 * WHY:
 * - Centralized route definition makes it easy to manage app structure.
 * - `Navigate` ensures users don't get stuck on 404s.
 */
export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
