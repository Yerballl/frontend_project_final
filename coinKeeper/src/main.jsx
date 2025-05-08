// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Ваши глобальные стили

import { Provider } from 'react-redux';
import { store } from '../src/redux/store.js'; // Убедитесь, что путь к вашему store правильный

import { BrowserRouter } from 'react-router-dom'; // <--- ИМПОРТИРУЙТЕ ЭТО

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter> {/* <--- ОБЕРНИТЕ ВАШЕ ПРИЛОЖЕНИЕ ЗДЕСЬ */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
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
