import { useState } from 'react';
import './SettingsPage.css';

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        darkMode: false,
        currency: 'RUB',
        notifications: true,
        language: 'ru'
    });

    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        // Здесь будет логика сохранения настроек
        alert('Настройки сохранены!');
    };

    return (
        <div className="settings-page">
            <h1>Настройки</h1>

            <div className="settings-form">
                <div className="setting-item">
                    <label>Темная тема</label>
                    <input
                        type="checkbox"
                        checked={settings.darkMode}
                        onChange={(e) => handleChange('darkMode', e.target.checked)}
                    />
                </div>

                <div className="setting-item">
                    <label>Валюта</label>
                    <select
                        value={settings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                    >
                        <option value="RUB">Рубль (₽)</option>
                        <option value="USD">Доллар ($)</option>
                        <option value="EUR">Евро (€)</option>
                    </select>
                </div>

                <div className="setting-item">
                    <label>Уведомления</label>
                    <input
                        type="checkbox"
                        checked={settings.notifications}
                        onChange={(e) => handleChange('notifications', e.target.checked)}
                    />
                </div>

                <div className="setting-item">
                    <label>Язык</label>
                    <select
                        value={settings.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                    >
                        <option value="ru">Русский</option>
                        <option value="en">English</option>
                    </select>
                </div>

                <button className="save-button" onClick={handleSave}>
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default SettingsPage;