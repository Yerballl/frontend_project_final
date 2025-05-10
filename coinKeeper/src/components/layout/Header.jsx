// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, selectCurrentUser, selectIsAuthenticated } from '../../redux/slices/authSlice';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        dispatch(logoutUser()).then(() => {
            navigate('/login');
        });
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isAuthenticated) {
        return null; // Don't render header if not authenticated
    }

    return (
        <header className="bg-slate-50 shadow-md fixed top-0 left-0 right-0 z-40 h-16">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Left Section: Logo and Navigation */}
                <div className="flex items-center">
                    <Link to="/dashboard" className="flex items-center text-indigo-600">
                        {/* Simplified Logo */}
                        <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                        </svg>
                        <span className="text-2xl font-bold">CoinKeeper</span>
                    </Link>
                    <nav className="ml-10 space-x-6">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `pb-1 text-gray-600 hover:text-indigo-600 transition-colors ${
                                    isActive ? 'border-b-2 border-indigo-600 font-semibold text-indigo-600' : 'font-medium'
                                }`
                            }
                        >Dashboard
                        </NavLink>
                        <NavLink
                            to="/stats"
                            className={({ isActive }) =>
                                `pb-1 text-gray-600 hover:text-indigo-600 transition-colors ${
                                    isActive ? 'border-b-2 border-indigo-600 font-semibold text-indigo-600' : 'font-medium'
                                }`
                            }
                        >
                            Statistics
                        </NavLink>
                    </nav>
                </div>

                {/* Right Section: User Info and Dropdown */}
                {user && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none"
                        >
                            <span className="mr-2 text-sm">{user.email}</span>
                            {/* User Icon SVG */}
                            <svg className="w-8 h-8 p-1 bg-gray-200 rounded-full text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                            </svg>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 py-1">
                                <Link
                                    to="/settings"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Settings
                                </Link>
                                <Link
                                    to="/help"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                >
                                    Help
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;