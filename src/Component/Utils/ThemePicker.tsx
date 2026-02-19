import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Theme, THEME_GRADIENTS, THEME_META, type ThemeColors } from '../../Types/CommonTypes';

interface ThemePickerProps {
    theme: Theme;
    colors: ThemeColors;
    toggleTheme: (theme: Theme) => void;
    isMobile?: boolean;
    buttonSize?: 'small' | 'medium' | 'large';
}

const ThemePicker = ({
    theme,
    colors,
    toggleTheme,
    isMobile = false,
    buttonSize = 'medium',
}: ThemePickerProps) => {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close picker on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        if (showPicker) {
            document.addEventListener('mousedown', handleClick);
            return () => document.removeEventListener('mousedown', handleClick);
        }
    }, [showPicker]);

    // Size styling
    const sizeMap = {
        small: { width: '32px', height: '32px', fontSize: '0.9rem' },
        medium: { width: '40px', height: '40px', fontSize: '1rem' },
        large: { width: '48px', height: '48px', fontSize: '1.2rem' },
    };

    const buttonDims = sizeMap[buttonSize];

    const themeToggleStyle: CSSProperties = {
        background: colors.glassBg,
        border: `1px solid ${colors.glassBorder}`,
        color: colors.textPrimary,
        width: buttonDims.width,
        height: buttonDims.height,
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        fontSize: buttonDims.fontSize,
        boxShadow: showPicker ? `0 0 0 2px ${colors.accentPrimary}` : 'none',
        flexShrink: 0,
        padding: 0,
    };

    const pickerStyle: CSSProperties = {
        position: 'absolute',
        top: isMobile ? 'calc(100% + 24px)' : 'calc(100% + 12px)',
        right: 0,
        left: isMobile ? -224 : -128,
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

    const headerStyle: CSSProperties = {
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
    };

    const themeCardStyle = (isActive: boolean): CSSProperties => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        padding: '0',
        borderRadius: '14px',
        border: isActive ? `2px solid ${colors.accentPrimary}` : '2px solid transparent',
        background: 'transparent',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        overflow: 'hidden',
        outline: 'none',
    });

    const cardVisualStyle: CSSProperties = {
        width: '100%',
        height: isMobile ? '52px' : '58px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: isMobile ? '22px' : '26px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease',
    };

    const shimmerOrbStyle1: CSSProperties = {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.18)',
        filter: 'blur(8px)',
    };

    const shimmerOrbStyle2: CSSProperties = {
        position: 'absolute',
        bottom: '-6px',
        left: '-6px',
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.10)',
        filter: 'blur(5px)',
    };

    const checkmarkBadgeStyle: CSSProperties = {
        position: 'absolute',
        top: '5px',
        right: '5px',
        width: '16px',
        height: '16px',
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
    };

    const labelRowStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        paddingBottom: '5px',
    };

    const labelStyle = (isActive: boolean): CSSProperties => ({
        fontSize: '9px',
        fontWeight: 700,
        color: isActive ? colors.accentPrimary : colors.textSecondary,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        transition: 'color 0.2s ease',
    });

    const globalStyles = `
        @keyframes popIn {
            from { opacity: 0; transform: scale(0.88) translateY(-6px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .theme-picker-card {
            transition: transform 0.3s ease;
            display: block;
        }
        .theme-picker-card:hover {
            transform: scale(1.18) rotate(-4deg);
        }
    `;

    return (
        <>
            <style>{globalStyles}</style>
            <div ref={pickerRef} style={{ position: 'relative', flexShrink: 0 }}>
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

                {/* Picker dropdown */}
                {showPicker && (
                    <div style={pickerStyle}>
                        {/* Header */}
                        <div style={headerStyle}>🎨 Choose Theme</div>

                        {/* Theme cards */}
                        {Object.entries(THEME_META).map(([key, meta]) => {
                            const [g1, g2] = THEME_GRADIENTS[key];
                            const isActive = theme === key;

                            return (
                                <button
                                    key={key}
                                    className="theme-picker-card"
                                    onClick={() => {
                                        toggleTheme(meta.id as Theme);
                                        setShowPicker(false);
                                    }}
                                    title={meta.label}
                                    style={themeCardStyle(isActive)}
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
                                        ...cardVisualStyle,
                                        background: `linear-gradient(135deg, ${g1}, ${g2})`,
                                        boxShadow: isActive
                                            ? `0 4px 16px ${g1}88`
                                            : `0 2px 8px ${g1}44`,
                                    }}>
                                        {/* Shimmer orbs for depth */}
                                        <div style={shimmerOrbStyle1} />
                                        <div style={shimmerOrbStyle2} />

                                        {/* Scene visual emoji */}
                                        <span
                                            style={{
                                                position: 'relative',
                                                zIndex: 1,
                                                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
                                            }}
                                        >
                                            {meta.visual}
                                        </span>

                                        {/* Active checkmark badge */}
                                        {isActive && <div style={checkmarkBadgeStyle}>✓</div>}
                                    </div>

                                    {/* Label row */}
                                    <div style={labelRowStyle}>
                                        <span style={{ fontSize: '10px', lineHeight: 1 }}>
                                            {meta.icon}
                                        </span>
                                        <span style={labelStyle(isActive)}>
                                            {meta.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default ThemePicker;
