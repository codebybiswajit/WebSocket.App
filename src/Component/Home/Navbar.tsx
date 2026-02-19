import { useEffect, useState, type CSSProperties } from "react";
import { type NavbarProps } from "../../Types/CommonTypes";
import ThemePicker from "../Utils/ThemePicker";

const Navbar = ({
    theme,
    toggleTheme,
    onLoginClick,
    onSignupClick,
    colors,
}: NavbarProps) => {
    const [isMobile, setIsMobile] = useState(false);

    // Responsive detection
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // ── Styles ─────────────────────────────────────────────────────

    const navbarStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 1rem' : '0 2rem',
        background: colors.bgPrimary,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${colors.glassBorder}`,
        boxShadow: `0 8px 32px ${colors.glassShadow}`,
        animation: 'fadeInDown 0.6s ease-out',
    };

    const navbarLeftStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.75rem' : '1.5rem',
    };

    const logoStyle: CSSProperties = {
        fontFamily: "'Syne', -apple-system, sans-serif",
        fontSize: isMobile ? '1.2rem' : '1.8rem',
        fontWeight: 800,
        color: colors.textPrimary,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        letterSpacing: '-0.5px',
        animation: 'fadeInLeft 0.8s ease-out',
        whiteSpace: 'nowrap',
    };

    const navbarRightStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '0.5rem' : '1rem',
        animation: 'fadeInRight 0.8s ease-out',
    };

    const authButtonsStyle: CSSProperties = {
        display: 'flex',
        gap: isMobile ? '0.4rem' : '0.75rem',
    };

    const btnStyle: CSSProperties = {
        padding: isMobile ? '0.5rem 0.8rem' : '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        fontSize: isMobile ? '0.75rem' : '0.95rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: 'nowrap',
    };

    const btnOutlineStyle: CSSProperties = {
        ...btnStyle,
        background: 'transparent',
        border: `2px solid ${colors.glassBorder}`,
        color: colors.textPrimary,
    };

    const btnPrimaryStyle: CSSProperties = {
        ...btnStyle,
        background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.bgGradientEnd})`,
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    };

    return (
        <>
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>

            <nav style={navbarStyle}>

                {/* ── Left ── */}
                <div style={navbarLeftStyle}>
                    {/* <button
                        style={menuToggleStyle}
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
                            e.currentTarget.style.background = colors.glassBg;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <span>{sidebarCollapsed ? '☰' : '☰'}</span>
                    </button> */}
                    <div style={logoStyle}>My Chat</div>
                </div>

                {/* ── Right ── */}
                <div style={navbarRightStyle}>

                    {/* Theme Picker Component */}
                    <ThemePicker
                        theme={theme}
                        colors={colors}
                        toggleTheme={toggleTheme}
                        isMobile={isMobile}
                    />

                    {/* Auth buttons — unchanged from original */}
                    <div style={authButtonsStyle}>
                        <button
                            style={btnOutlineStyle}
                            onClick={onLoginClick}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            Log In
                        </button>
                        <button
                            style={btnPrimaryStyle}
                            onClick={onSignupClick}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};
export default Navbar;