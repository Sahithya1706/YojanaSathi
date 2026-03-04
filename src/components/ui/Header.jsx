import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import LanguageSelector from 'components/ui/LanguageSelector';

const NAV_ITEMS = [
    { label: 'Home', path: '/home-page', icon: 'Home', public: true },
    { label: 'Start Quiz', path: '/home-page#quiz', icon: 'ClipboardList', public: true, isCTA: false },
    { label: 'My Dashboard', path: '/dashboard', icon: 'LayoutDashboard', public: false },
];

const Header = ({ isAuthenticated = false, user = null, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const profileRef = useRef(null);

    const visibleNavItems = NAV_ITEMS?.filter(item => item?.public || isAuthenticated);

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [location?.pathname]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef?.current && !profileRef?.current?.contains(e?.target)) {
                setProfileOpen(false);
            }
        };
        const handleEsc = (e) => {
            if (e?.key === 'Escape') {
                setProfileOpen(false);
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    const isActive = (path) => {
        const basePath = path?.split('#')?.[0];
        return location?.pathname === basePath;
    };

    const handleLogout = () => {
        setProfileOpen(false);
        setMobileOpen(false);
        onLogout?.();
    };

    const handleStartQuiz = () => {
        navigate('/quiz'); 
        setTimeout(() => {
            const quizSection = document.getElementById('quiz');
            if (quizSection) quizSection?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    return (
        <>
            <a href="#main-content" className="skip-link">Skip to main content</a>
            {/* Tricolor accent bar */}
            <div className="tricolor-bar fixed top-0 left-0 right-0 z-[101]" aria-hidden="true" />
            <header className="header-nav" style={{ top: '4px' }} role="banner">
                <div className="w-full max-w-content mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link
                        to="/home-page"
                        className="header-logo-container"
                        aria-label="Government Scheme Discovery - Home"
                    >
                        <div className="header-logo">
                            <Icon name="Landmark" size={22} color="#FFFFFF" strokeWidth={2} />
                        </div>
                        <div className="hidden sm:flex flex-col leading-tight">
                            <span
                                className="text-white font-heading font-700 text-base leading-tight"
                                style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
                            >
                                YojanaSathi
                            </span>
                            <span
                                className="text-xs leading-tight"
                                style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Nunito Sans, sans-serif' }}
                            >
                                Government Scheme Discovery
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav
                        className="hidden lg:flex items-center gap-1"
                        role="navigation"
                        aria-label="Primary navigation"
                    >
                        {visibleNavItems?.map(item => (
                            item?.path?.includes('#') ? (
                                <button
                                    key={item?.path}
                                    onClick={handleStartQuiz}
                                    className={`nav-link ${isActive(item?.path) ? 'active' : ''}`}
                                    aria-current={isActive(item?.path) ? 'page' : undefined}
                                >
                                    <Icon name={item?.icon} size={18} />
                                    {item?.label}
                                </button>
                            ) : (
                                <Link
                                    key={item?.path}
                                    to={item?.path}
                                    className={`nav-link ${isActive(item?.path) ? 'active' : ''}`}
                                    aria-current={isActive(item?.path) ? 'page' : undefined}
                                >
                                    <Icon name={item?.icon} size={18} />
                                    {item?.label}
                                </Link>
                            )
                        ))}
                    </nav>

                    {/* Right section */}
                    <div className="flex items-center gap-2 sm:gap-3 ml-auto lg:ml-0">
                        {/* Trust badge - desktop only */}
                        <div className="trust-badge hidden xl:flex" aria-label="Secure government platform">
                            <Icon name="ShieldCheck" size={13} color="rgba(255,255,255,0.9)" />
                            <span>Govt. Verified</span>
                        </div>

                        {/* Language Selector */}
                        <LanguageSelector
                            currentLang={currentLang}
                            onLanguageChange={setCurrentLang}
                        />

                        {/* Auth section */}
                        {isAuthenticated ? (
                            <div className="relative hidden lg:block" ref={profileRef}>
                                <button
                                    className="flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-250"
                                    style={{
                                        background: 'rgba(255,255,255,0.12)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        color: '#FFFFFF',
                                        minHeight: '44px',
                                        fontFamily: 'Poppins, sans-serif',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setProfileOpen(prev => !prev)}
                                    aria-haspopup="true"
                                    aria-expanded={profileOpen}
                                    aria-label="Account menu"
                                >
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{ background: 'var(--color-accent)', color: '#FFFFFF' }}
                                        aria-hidden="true"
                                    >
                                        {user?.name ? user?.name?.charAt(0)?.toUpperCase() : 'U'}
                                    </div>
                                    <span className="hidden xl:inline max-w-[120px] truncate">
                                        {user?.name || 'My Account'}
                                    </span>
                                    <Icon name={profileOpen ? 'ChevronUp' : 'ChevronDown'} size={14} />
                                </button>

                                {profileOpen && (
                                    <div className="profile-dropdown" role="menu" aria-label="Account options">
                                        <div
                                            className="px-4 py-3 border-b"
                                            style={{ borderColor: 'var(--color-border)' }}
                                        >
                                            <p
                                                className="font-semibold text-sm truncate"
                                                style={{ fontFamily: 'Poppins, sans-serif', color: 'var(--color-foreground)' }}
                                            >
                                                {user?.name || 'User'}
                                            </p>
                                            <p
                                                className="text-xs truncate mt-0.5"
                                                style={{ color: 'var(--color-text-secondary)' }}
                                            >
                                                {user?.email || ''}
                                            </p>
                                        </div>
                                        <Link to="/dashboard" className="profile-option" role="menuitem">
                                            <Icon name="LayoutDashboard" size={16} color="var(--color-muted-foreground)" />
                                            My Dashboard
                                        </Link>
                                        <button className="profile-option" role="menuitem">
                                            <Icon name="BookmarkCheck" size={16} color="var(--color-muted-foreground)" />
                                            Saved Schemes
                                        </button>
                                        <button className="profile-option" role="menuitem">
                                            <Icon name="User" size={16} color="var(--color-muted-foreground)" />
                                            Profile Settings
                                        </button>
                                        <div
                                            className="border-t my-1"
                                            style={{ borderColor: 'var(--color-border)' }}
                                            aria-hidden="true"
                                        />
                                        <button
                                            className="profile-option danger"
                                            role="menuitem"
                                            onClick={handleLogout}
                                        >
                                            <Icon name="LogOut" size={16} color="var(--color-destructive)" />
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center gap-2">
                                <Link to="/register" className="auth-login-btn" aria-label="Login to your account">
                                    <Icon name="LogIn" size={16} />
                                    Login
                                </Link>
                                <Link to="/register" className="nav-cta" aria-label="Register for free">
                                    <Icon name="UserPlus" size={16} />
                                    Register
                                </Link>
                            </div>
                        )}

                        {/* Start Quiz CTA - always visible on mobile */}
                        <button
                            className="nav-cta lg:hidden"
                            onClick={handleStartQuiz}
                            aria-label="Start eligibility quiz"
                        >
                            <Icon name="ClipboardList" size={16} />
                            <span className="hidden sm:inline">Start Quiz</span>
                            <span className="sm:hidden">Quiz</span>
                        </button>

                        {/* Hamburger - mobile only */}
                        <button
                            className="hamburger-btn lg:hidden"
                            onClick={() => setMobileOpen(prev => !prev)}
                            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
                            aria-expanded={mobileOpen}
                            aria-controls="mobile-menu"
                        >
                            <Icon name={mobileOpen ? 'X' : 'Menu'} size={22} />
                        </button>
                    </div>
                </div>
            </header>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="mobile-menu-overlay lg:hidden"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}
            {/* Mobile drawer */}
            <div
                id="mobile-menu"
                className={`mobile-drawer lg:hidden ${mobileOpen ? 'open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                {/* Drawer header */}
                <div
                    className="flex items-center justify-between px-5 py-4 border-b"
                    style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="header-logo">
                            <Icon name="Landmark" size={20} color="#FFFFFF" />
                        </div>
                        <span
                            className="text-white font-semibold"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                        >
                            YojanaSathi
                        </span>
                    </div>
                    <button
                        className="hamburger-btn"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                    >
                        <Icon name="X" size={20} />
                    </button>
                </div>

                {/* Trust badge mobile */}
                <div className="px-5 py-3">
                    <div className="trust-badge inline-flex">
                        <Icon name="ShieldCheck" size={13} color="rgba(255,255,255,0.9)" />
                        <span>Government Verified Platform</span>
                    </div>
                </div>

                {/* Nav items */}
                <nav
                    className="flex flex-col px-4 py-2 gap-1"
                    role="navigation"
                    aria-label="Mobile navigation"
                >
                    {visibleNavItems?.map(item => (
                        item?.path?.includes('#') ? (
                            <button
                                key={item?.path}
                                onClick={() => { setMobileOpen(false); handleStartQuiz(); }}
                                className={`nav-link w-full justify-start ${isActive(item?.path) ? 'active' : ''}`}
                            >
                                <Icon name={item?.icon} size={20} />
                                {item?.label}
                            </button>
                        ) : (
                            <Link
                                key={item?.path}
                                to={item?.path}
                                className={`nav-link ${isActive(item?.path) ? 'active' : ''}`}
                                aria-current={isActive(item?.path) ? 'page' : undefined}
                            >
                                <Icon name={item?.icon} size={20} />
                                {item?.label}
                            </Link>
                        )
                    ))}
                </nav>

                {/* Divider */}
                <div
                    className="mx-4 my-2 border-t"
                    style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                    aria-hidden="true"
                />

                {/* Auth section mobile */}
                <div className="px-4 py-2 flex flex-col gap-2">
                    {isAuthenticated ? (
                        <>
                            <div
                                className="flex items-center gap-3 px-3 py-3 rounded-md"
                                style={{ background: 'rgba(255,255,255,0.1)' }}
                            >
                                <div
                                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                                    style={{ background: 'var(--color-accent)', color: '#FFFFFF' }}
                                >
                                    {user?.name ? user?.name?.charAt(0)?.toUpperCase() : 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p
                                        className="text-white font-semibold text-sm truncate"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        {user?.name || 'User'}
                                    </p>
                                    <p
                                        className="text-xs truncate"
                                        style={{ color: 'rgba(255,255,255,0.7)' }}
                                    >
                                        {user?.email || ''}
                                    </p>
                                </div>
                            </div>
                            <Link
                                to="/dashboard"
                                className="nav-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon name="BookmarkCheck" size={18} />
                                Saved Schemes
                            </Link>
                            <Link
                                to="/dashboard"
                                className="nav-link"
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon name="User" size={18} />
                                Profile Settings
                            </Link>
                            <button
                                className="nav-link w-full justify-start mt-1"
                                style={{ color: '#FCA5A5' }}
                                onClick={handleLogout}
                            >
                                <Icon name="LogOut" size={18} color="#FCA5A5" />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="auth-login-btn justify-center"
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon name="LogIn" size={18} />
                                Login to Account
                            </Link>
                            <Link
                                to="/register"
                                className="nav-cta justify-center"
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon name="UserPlus" size={18} />
                                Create Free Account
                            </Link>
                        </>
                    )}
                </div>

                {/* Bottom spacer */}
                <div className="flex-1" />
                <div
                    className="px-5 py-4 text-center"
                    style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Nunito Sans, sans-serif', fontSize: '0.75rem' }}
                >
                    © 2026 YojanaSathi · Government of India
                </div>
            </div>
        </>
    );
};

export default Header;