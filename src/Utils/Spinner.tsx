import type { CSSProperties } from "react";
import type ThemeConfig from "./ThemeConfig";

// Spinner Component
const Spinner = ({ colors }: { colors: typeof ThemeConfig.light }) => {
    const overlayStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
    };

    const spinnerStyle: CSSProperties = {
        width: '60px',
        height: '60px',
        border: `4px solid ${colors.glassBorder}`,
        borderTopColor: colors.accentPrimary,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
    };

    return (
        <div style={overlayStyle}>
            <div style={spinnerStyle} />
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
export default Spinner;