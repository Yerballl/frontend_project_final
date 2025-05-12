import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, selectCurrentUser, selectIsAuthenticated } from '../../redux/slices/authSlice';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLogout = () => {
        dispatch(logoutUser()).then(() => {
            navigate('/login');
        });
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
                setIsUserDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
                event.target.closest('[data-mobile-menu-button]') === null) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!isAuthenticated) {
        return null;
    }

    const commonNavLinkClass = "pb-1 text-gray-600 hover:text-indigo-600 transition-colors";
    const activeNavLinkClass = "border-b-2 border-indigo-600 font-semibold text-indigo-600";

    const mobileNavLinkClass = "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600";
    const mobileActiveNavLinkClass = "bg-indigo-100 text-indigo-700";


    return (
        <header className="bg-slate-50 shadow-md fixed top-0 left-0 right-0 z-40 h-16">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/dashboard" className="flex items-center text-indigo-600" onClick={() => setIsMobileMenuOpen(false)}>
                        <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                            <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                        </svg>
                        <span className="text-2xl font-bold">CoinKeeper</span>
                    </Link>
                    <nav className="hidden md:flex ml-10 space-x-6">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => `${commonNavLinkClass} ${isActive ? activeNavLinkClass : 'font-medium'}`}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/stats"
                            className={({ isActive }) => `${commonNavLinkClass} ${isActive ? activeNavLinkClass : 'font-medium'}`}
                        >
                            Statistics
                        </NavLink>
                    </nav>
                </div>

                <div className="flex items-center">
                    {user && (
                        <div className="relative" ref={userDropdownRef}>
                            <button
                                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                                className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none"
                                aria-expanded={isUserDropdownOpen}
                                aria-haspopup="true"
                            >
                                <span className="mr-2 text-sm hidden sm:inline">{user.email}</span>
                                <svg className="w-8 h-8 p-1 bg-gray-200 rounded-full text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                </svg>
                            </button>

                            {isUserDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 py-1 ring-1 ring-black ring-opacity-5">
                                    <div className="px-4 py-2 text-sm text-gray-500 sm:hidden border-b">{user.email}</div>
                                    <Link
                                        to="/settings"
                                        onClick={() => setIsUserDropdownOpen(false)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                    >
                                        Settings
                                    </Link>
                                    <Link
                                        to="/help"
                                        onClick={() => setIsUserDropdownOpen(false)}
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
                    <div className="md:hidden ml-2" ref={mobileMenuRef}>
                        <button
                            data-mobile-menu-button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-16 inset-x-0 bg-slate-50 shadow-lg z-30" id="mobile-menu" ref={mobileMenuRef}>
                    <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => `${mobileNavLinkClass} ${isActive ? mobileActiveNavLinkClass : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </NavLink>
                        <NavLink
                            to="/stats"
                            className={({ isActive }) => `${mobileNavLinkClass} ${isActive ? mobileActiveNavLinkClass : ''}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Statistics
                        </NavLink>
                        <div className="pt-2 mt-2 border-t border-gray-200">
                            <NavLink
                                to="/settings"
                                className={({ isActive }) => `${mobileNavLinkClass} ${isActive ? mobileActiveNavLinkClass : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Settings
                            </NavLink>
                            <NavLink
                                to="/help"
                                className={({ isActive }) => `${mobileNavLinkClass} ${isActive ? mobileActiveNavLinkClass : ''}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Help
                            </NavLink>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;