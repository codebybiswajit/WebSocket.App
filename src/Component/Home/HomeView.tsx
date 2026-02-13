import { useState, useEffect, type CSSProperties } from 'react';
import ThemeConfig from '../../Utils/ThemeConfig';
import Spinner from '../../Utils/Spinner';
import type { Feature, Message, NavbarProps, SidebarItem, SidebarProps, Theme } from '../../Types/CommonTypes';
import ChatPreview from '../Chat/ChatPreview';
import LoginModal from './Login';
import SignupModal from './Signup';


// Main App Component
export const HomeViewApp = () => {
    const [theme, setTheme] = useState<Theme>('light');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const colors = ThemeConfig[theme];

    useEffect(() => {
        const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
        setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme: Theme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const appStyles: CSSProperties = {
        margin: 0,
        padding: 0,
        fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        // backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
        transition: 'background-color 0.5s ease, color 0.3s ease',
        minHeight: '100vh',
    };

    return (
        <div style={appStyles}>
            <AppBackground colors={colors} />

            <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
                toggleSidebar={toggleSidebar}
                sidebarCollapsed={sidebarCollapsed}
                onLoginClick={() => setShowLoginModal(true)}
                onSignupClick={() => setShowSignupModal(true)}
                colors={colors}
            />

            <Sidebar collapsed={sidebarCollapsed} colors={colors} />

            <MainContent collapsed={sidebarCollapsed} colors={colors} />

            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onSwitchToSignup={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                    }}
                    setLoading={setLoading}
                    colors={colors}
                />
            )}

            {showSignupModal && (
                <SignupModal
                    onClose={() => setShowSignupModal(false)}
                    onSwitchToLogin={() => {
                        setShowSignupModal(false);
                        setShowLoginModal(true);
                    }}
                    setLoading={setLoading}
                    colors={colors}
                />
            )}

            {loading && <Spinner colors={colors} />}
        </div>
    );
}

// App Background Component
const AppBackground = ({ colors }: { colors: typeof ThemeConfig.light }) => {
    const containerStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: `linear-gradient(135deg, ${colors.bgGradientStart} 0%, ${colors.bgGradientEnd} 100%)`,
        opacity: 0.05,
        overflow: 'hidden',
    };

    const animatedLayerStyle: CSSProperties = {
        position: 'absolute',
        width: '200%',
        height: '200%',
        background: `
      radial-gradient(circle at 20% 50%, ${colors.accentPrimary} 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, ${colors.bgGradientEnd} 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, ${colors.bgGradientStart} 0%, transparent 50%)
    `,
        animation: 'backgroundShift 20s ease infinite',
        opacity: 0.3,
    };

    return (
        <div style={containerStyle}>
            <div style={animatedLayerStyle} />
            <style>{`
        @keyframes backgroundShift {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-10%, -10%); }
          66% { transform: translate(10%, 5%); }
        }
      `}</style>
        </div>
    );
}

// Navbar Component
const Navbar = ({ theme, toggleTheme, toggleSidebar, sidebarCollapsed, onLoginClick, onSignupClick, colors }: NavbarProps & { colors: typeof ThemeConfig.light }) => {
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
        padding: '0 2rem',
        background: colors.glassBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${colors.glassBorder}`,
        boxShadow: `0 8px 32px ${colors.glassShadow}`,
    };

    const navbarLeftStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
    };

    const menuToggleStyle: CSSProperties = {
        background: 'transparent',
        border: 'none',
        color: colors.textPrimary,
        fontSize: '1.5rem',
        cursor: 'pointer',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        transition: 'all 0.3s',
    };

    const logoStyle: CSSProperties = {
        fontFamily: "'Syne', -apple-system, sans-serif",
        fontSize: '1.8rem',
        fontWeight: 800,
        color: colors.textPrimary,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        letterSpacing: '-0.5px',
    };

    const navbarRightStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    };

    const themeToggleStyle: CSSProperties = {
        background: colors.glassBg,
        border: `1px solid ${colors.glassBorder}`,
        color: colors.textPrimary,
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s',
        fontSize: '1.2rem',
    };

    const authButtonsStyle: CSSProperties = {
        display: 'flex',
        gap: '0.75rem',
    };

    const btnStyle: CSSProperties = {
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: 600,
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: "'DM Sans', sans-serif",
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
        <nav style={navbarStyle}>
            <div style={navbarLeftStyle}>
                <button style={menuToggleStyle} onClick={toggleSidebar} aria-label="Toggle menu">
                    <span>{sidebarCollapsed ? '☰' : '✕'}</span>
                </button>
                <div style={logoStyle}>Nexus</div>
            </div>
            <div style={navbarRightStyle}>
                <button style={themeToggleStyle} onClick={toggleTheme} aria-label="Toggle theme">
                    <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                </button>
                <div style={authButtonsStyle}>
                    <button style={btnOutlineStyle} onClick={onLoginClick}>Log In</button>
                    <button style={btnPrimaryStyle} onClick={onSignupClick}>Sign Up</button>
                </div>
            </div>
        </nav>
    );
}

// Sidebar Component
const Sidebar = ({ collapsed, colors }: SidebarProps & { colors: typeof ThemeConfig.light }) => {
    const sidebarStyle: CSSProperties = {
        position: 'fixed',
        top: '70px',
        left: 0,
        width: '280px',
        height: 'calc(100vh - 70px)',
        padding: '2rem 1.5rem',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 999,
        overflowY: 'auto',
        background: colors.bgPrimary,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${colors.glassBorder}`,
        boxShadow: `0 8px 32px ${colors.glassShadow}`,
        transform: collapsed ? 'translateX(-100%)' : 'translateX(0)',
    };

    const menuItems: SidebarItem[] = [
        { icon: '🏠', label: 'Home', active: true },
        { icon: '💬', label: 'Messages', active: false },
        { icon: '👥', label: 'Contacts', active: false },
        { icon: '📞', label: 'Calls', active: false },
    ];

    const recentChats: SidebarItem[] = [
        { icon: '👤', label: 'Sarah Johnson' },
        { icon: '👤', label: 'Team Alpha' },
        { icon: '👤', label: 'David Chen' },
    ];

    const settings: SidebarItem[] = [
        { icon: '⚙️', label: 'Preferences' },
        { icon: '🔔', label: 'Notifications' },
    ];

    return (
        <aside style={sidebarStyle}>
            <SidebarSection title="Menu" items={menuItems} colors={colors} />
            <SidebarSection title="Recent Chats" items={recentChats} colors={colors} />
            <SidebarSection title="Settings" items={settings} colors={colors} />
        </aside>
    );
}

// Sidebar Section Component
const SidebarSection = ({ title, items, colors }: { title: string; items: SidebarItem[]; colors: typeof ThemeConfig.light }) => {
    const sectionStyle: CSSProperties = {
        marginBottom: '2rem',
    };

    const titleStyle: CSSProperties = {
        fontFamily: "'Syne', sans-serif",
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: colors.textTertiary,
        marginBottom: '1rem',
        padding: '0 0.5rem',
    };

    const itemStyle = (active: boolean): CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1rem',
        borderRadius: '12px',
        color: active ? 'white' : colors.textSecondary,
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '0.5rem',
        fontWeight: 500,
        // background: active ? `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.bgGradientEnd})` : 'transparent',
    });

    const iconStyle: CSSProperties = {
        fontSize: '1.25rem',
    };

    return (
        <div style={sectionStyle}>
            <div style={titleStyle}>{title}</div>
            {items.map((item, index) => (
                <div key={index} style={itemStyle(item.active || false)}>
                    <span style={iconStyle}>{item.icon}</span>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
}

// Main Content Component
const MainContent = ({ collapsed, colors }: { collapsed: boolean; colors: typeof ThemeConfig.light }) => {
    const mainStyle: CSSProperties = {
        marginLeft: collapsed ? 0 : '280px',
        marginTop: '70px',
        padding: '3rem',
        minHeight: 'calc(100vh - 70px)',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return (
        <main style={mainStyle}>
            <HomeView colors={colors} />
        </main>
    );
}

// Home View Component
const HomeView = ({ colors }: { colors: typeof ThemeConfig.light }) => {
    const containerStyle: CSSProperties = {
        maxWidth: '1200px',
        margin: '0 auto',
    };

    const heroStyle: CSSProperties = {
        textAlign: 'center',
        padding: '4rem 0',
    };

    const heroTitleStyle: CSSProperties = {
        fontFamily: "'Syne', sans-serif",
        fontSize: '4rem',
        fontWeight: 800,
        lineHeight: 1.1,
        marginBottom: '1.5rem',
        color: colors.textPrimary,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        letterSpacing: '-2px',
    };

    const heroSubtitleStyle: CSSProperties = {
        fontSize: '1.3rem',
        color: colors.textSecondary,
        maxWidth: '600px',
        margin: '0 auto 2.5rem',
        lineHeight: 1.6,
    };

    const btnPrimaryStyle: CSSProperties = {
        padding: '1rem 2.5rem',
        fontSize: '1.1rem',
        borderRadius: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: "'DM Sans', sans-serif",
        background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.bgGradientEnd})`,
        color: 'white',
        border: 'none',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    };

    const messages: Message[] = [
        {
            sent: false,
            avatar: "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23764ba2'/%3E%3C/svg%3E",
            text: "Hey! How's the new project coming along?",
            time: "2:34 PM"
        },
        {
            sent: true,
            avatar: "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23667eea'/%3E%3C/svg%3E",
            text: "Going great! Just finished the design phase. Want to see?",
            time: "2:35 PM"
        },
        {
            sent: false,
            avatar: "data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23764ba2'/%3E%3C/svg%3E",
            text: "Absolutely! Send it over 🎨",
            time: "2:36 PM"
        }
    ];

    const features: Feature[] = [
        // {
        //     icon: '🔒',
        //     title: 'End-to-End Encryption',
        //     description: 'Your conversations are private and secure with military-grade encryption.'
        // },
        {
            icon: '⚡',
            title: 'Lightning Fast',
            description: 'Messages delivered instantly with our optimized infrastructure.'
        },
        // {
        //     icon: '🌍',
        //     title: 'Global Reach',
        //     description: 'Connect with anyone, anywhere in the world, seamlessly.'
        // }
    ];

    return (
        <div style={containerStyle}>
            <section style={heroStyle}>
                <h1 style={heroTitleStyle}>Connect Without Limits</h1>
                <p style={heroSubtitleStyle}>
                    Experience messaging reimagined with crystal-clear communication, seamless collaboration, and privacy at its core.
                </p>
                <div>
                    <button style={btnPrimaryStyle}>Get Started Free</button>
                </div>
            </section>

            <ChatPreview messages={messages} colors={colors} />
            <FeaturesGrid features={features} colors={colors} />
        </div>
    );
}

// Features Grid Component
const FeaturesGrid = ({ features, colors }: { features: Feature[]; colors: typeof ThemeConfig.light }) => {
    const gridStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginTop: '4rem',
    };

    return (
        <div style={gridStyle}>
            {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} colors={colors} />
            ))}
        </div>
    );
}

// Feature Card Component
const FeatureCard = ({ feature, colors }: { feature: Feature; colors: typeof ThemeConfig.light }) => {
    const cardStyle: CSSProperties = {
        padding: '2rem',
        borderRadius: '20px',
        transition: 'all 0.3s',
        background: colors.glassBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `1px solid ${colors.glassBorder}`,
        boxShadow: `0 8px 32px ${colors.glassShadow}`,
    };

    const iconStyle: CSSProperties = {
        fontSize: '2.5rem',
        marginBottom: '1.5rem',
    };

    const titleStyle: CSSProperties = {
        fontFamily: "'Syne', sans-serif",
        fontSize: '1.5rem',
        fontWeight: 700,
        marginBottom: '0.75rem',
    };

    const descriptionStyle: CSSProperties = {
        color: colors.textSecondary,
        lineHeight: 1.6,
    };

    return (
        <div style={cardStyle}>
            <div style={iconStyle}>{feature.icon}</div>
            <h3 style={titleStyle}>{feature.title}</h3>
            <p style={descriptionStyle}>{feature.description}</p>
        </div>
    );
}


