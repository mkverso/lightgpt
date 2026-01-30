/**
 * Main Application Component
 * 
 * Root component that wraps the app with theme provider and error boundary.
 * 
 * @component
 */

import { AppRoutes } from './app/routes';
import { ThemeProvider } from './theme/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
