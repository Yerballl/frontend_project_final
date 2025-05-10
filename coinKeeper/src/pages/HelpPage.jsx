// src/pages/HelpPage.jsx
import React from 'react';

const HelpPage = () => {
    return (
        <div className="container mx-auto p-8 pt-24"> {/* pt-24 to account for fixed header */}
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Help & Support</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-700 mb-4">
                    Welcome to the CoinKeeper help section!
                </p>
                <p className="text-gray-700 mb-4">
                    This page is currently under construction. Soon, you'll find detailed guides, FAQs, and tips on how to make the most of CoinKeeper.
                </p>
                <h2 className="text-xl font-semibold text-gray-700 mt-6 mb-3">Topics we'll cover:</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Managing your transactions</li>
                    <li>Setting up and using categories</li>
                    <li>Understanding your financial statistics</li>
                    <li>Account settings and preferences</li>
                    <li>Troubleshooting common issues</li>
                </ul>
                <p className="text-gray-700 mt-8">
                    In the meantime, if you have urgent questions, please try to explore the application or imagine contacting our imaginary support team at <span className="text-indigo-600 font-medium">support@coinkeeper-clone.com</span>.
                </p>
            </div>
        </div>
    );
};

export default HelpPage;