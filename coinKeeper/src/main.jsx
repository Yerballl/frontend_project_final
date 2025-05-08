import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx'; // Импортируйте AuthProvider

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider> {/* Оберните App в AuthProvider */}
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);