import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Theme, THEME_GRADIENTS, THEME_META, type NavbarProps } from "../../Types/CommonTypes";

const Navbar = ({
    theme,
    toggleTheme,
    onLoginClick,
    onSignupClick,
    colors,
}: NavbarProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Responsive detection
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Close picker on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
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

    const themeToggleStyle: CSSProperties = {
        background: colors.glassBg,
        border: `1px solid ${colors.glassBorder}`,
        color: colors.textPrimary,
        width: isMobile ? '38px' : '45px',
        height: isMobile ? '38px' : '45px',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        fontSize: isMobile ? '1rem' : '1.2rem',
        boxShadow: showPicker ? `0 0 0 2px ${colors.accentPrimary}` : 'none',
        flexShrink: 0,
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

    const pickerStyle: CSSProperties = {
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        left: isMobile ? -132 : -128,
        background: colors.bgSecondary,
        border: `1px solid ${colors.glassBorder}`,
        borderRadius: '20px',
        padding: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        boxShadow: `0 20px 60px ${colors.glassShadow}, 0 0 0 1px ${colors.glassBorder}`,
        width: isMobile ? '240px' : '270px',
        zIndex: 2000,
        animation: 'popIn 0.22s cubic-bezier(0.34,1.56,0.64,1)',
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
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.88) translateY(-6px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .theme-card-visual {
                    transition: transform 0.3s ease;
                    display: block;
                }
                .theme-card:hover .theme-card-visual {
                    transform: scale(1.18) rotate(-4deg);
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

                    {/* Theme picker button */}
                    <div ref={pickerRef} style={{ position: 'relative' }}>
                        <button
                            style={themeToggleStyle}
                            onClick={() => setShowPicker(p => !p)}
                            aria-label="Choose theme"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1) rotate(20deg)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                            }}
                        >
                            <span>{THEME_META[theme]?.icon ?? '🎨'}</span>
                        </button>

                        {/* ── Picker dropdown ── */}
                        {showPicker && (
                            <div style={pickerStyle}>

                                {/* Header */}
                                <div style={{
                                    gridColumn: '1 / -1',
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: colors.textTertiary,
                                    paddingBottom: '8px',
                                    borderBottom: `1px solid ${colors.glassBorder}`,
                                    marginBottom: '2px',
                                    textAlign: 'center',
                                }}>
                                    🎨 Choose Theme
                                </div>

                                {Object.entries(THEME_META).map(([key, meta]) => {
                                    const [g1, g2] = THEME_GRADIENTS[key];
                                    const isActive = theme === key;

                                    return (
                                        <button
                                            key={key}
                                            className="theme-card"
                                            onClick={() => {
                                                toggleTheme(meta.id as Theme);
                                                setShowPicker(false);
                                            }}
                                            title={meta.label}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '5px',
                                                padding: '0',
                                                borderRadius: '14px',
                                                border: isActive
                                                    ? `2px solid ${colors.accentPrimary}`
                                                    : '2px solid transparent',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                transition: 'all 0.22s ease',
                                                overflow: 'hidden',
                                                outline: 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.border = `2px solid ${colors.glassBorder}`;
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive) {
                                                    e.currentTarget.style.border = '2px solid transparent';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }
                                            }}
                                        >
                                            {/* Gradient preview card */}
                                            <div style={{
                                                width: '100%',
                                                height: isMobile ? '52px' : '58px',
                                                borderRadius: '12px',
                                                background: `linear-gradient(135deg, ${g1}, ${g2})`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: isMobile ? '22px' : '26px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                boxShadow: isActive
                                                    ? `0 4px 16px ${g1}88`
                                                    : `0 2px 8px ${g1}44`,
                                                transition: 'box-shadow 0.2s ease',
                                            }}>
                                                {/* Shimmer orbs for depth */}
                                                <div style={{
                                                    position: 'absolute', top: '-8px', right: '-8px',
                                                    width: '32px', height: '32px', borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.18)',
                                                    filter: 'blur(8px)',
                                                }} />
                                                <div style={{
                                                    position: 'absolute', bottom: '-6px', left: '-6px',
                                                    width: '22px', height: '22px', borderRadius: '50%',
                                                    background: 'rgba(255,255,255,0.10)',
                                                    filter: 'blur(5px)',
                                                }} />

                                                {/* Scene visual emoji */}
                                                <span
                                                    className="theme-card-visual"
                                                    style={{
                                                        position: 'relative',
                                                        zIndex: 1,
                                                        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
                                                    }}
                                                >
                                                    {meta.visual}
                                                </span>

                                                {/* Active checkmark badge */}
                                                {isActive && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '5px', right: '5px',
                                                        width: '16px', height: '16px',
                                                        borderRadius: '50%',
                                                        background: colors.accentPrimary,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '9px',
                                                        color: 'white',
                                                        fontWeight: 900,
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                                        zIndex: 2,
                                                    }}>✓</div>
                                                )}
                                            </div>

                                            {/* Label row */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '3px',
                                                paddingBottom: '5px',
                                            }}>
                                                <span style={{ fontSize: '10px', lineHeight: 1 }}>
                                                    {meta.icon}
                                                </span>
                                                <span style={{
                                                    fontSize: '9px',
                                                    fontWeight: 700,
                                                    color: isActive ? colors.accentPrimary : colors.textSecondary,
                                                    letterSpacing: '0.04em',
                                                    textTransform: 'uppercase',
                                                    transition: 'color 0.2s ease',
                                                }}>
                                                    {meta.label}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

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