import { useEffect, useRef, useState } from 'react';
import type { ThemeColors } from '../../Types/CommonTypes';
import { CloseIcon } from '../../Utils/svg';

interface ActionModalProps {
    isOpen: boolean;
    position?: { top: number; left: number };
    onClose: () => void;
    onLogout: () => void;
    color: ThemeColors;
    isMobile?: boolean;
}

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    color: ThemeColors;
    isLoading?: boolean;
}

// ─── Confirm Modal (Center) ───────────────────────────────────────────────────

export const ConfirmLogoutModal = ({
    isOpen,
    onConfirm,
    onCancel,
    color,
    isLoading,
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            onClick={onCancel}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2000,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'cwOverlayIn 0.2s ease',
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    width: '320px',
                    maxWidth: '90vw',
                    background: color.glassBg,
                    backdropFilter: 'blur(32px) saturate(1.8)',
                    WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
                    border: `1px solid ${color.glassBorder}`,
                    borderRadius: '20px',
                    boxShadow: color.glassShadow,
                    overflow: 'hidden',
                    animation: 'cwModalIn 0.26s cubic-bezier(0.34,1.2,0.64,1)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px 20px 14px',
                        borderBottom: `1px solid ${color.glassBorder}`,
                    }}
                >
                    <span
                        style={{
                            color: color.textPrimary,
                            fontSize: '16px',
                            fontWeight: 600,
                        }}
                    >
                        Logout
                    </span>
                    <button
                        onClick={onCancel}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            padding: '4px',
                        }}
                    >
                        <CloseIcon color={color.textSecondary} />
                    </button>
                </div>

                <div style={{ padding: '18px 20px' }}>
                    <p
                        style={{
                            color: color.textSecondary,
                            fontSize: '14px',
                            marginBottom: '20px',
                            lineHeight: '1.5',
                        }}
                    >
                        Are you sure you want to logout? You'll need to login again to access your chats.
                    </p>

                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            style={{
                                padding: '10px 20px',
                                background: color.bgSecondary,
                                color: color.textPrimary,
                                border: `1px solid ${color.glassBorder}`,
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: 500,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: isLoading ? 0.6 : 1,
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            style={{
                                padding: '10px 20px',
                                background: '#ff5252',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                opacity: isLoading ? 0.7 : 1,
                            }}
                        >
                            {isLoading ? 'Logging out...' : 'Yes, Logout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─── Action Modal (Position-based or Center) ──────────────────────────────────

export const ActionLogoutModal = ({
    isOpen,
    position,
    onClose,
    onLogout,
    color,
    isMobile,
}: ActionModalProps) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const handleLogoutClick = () => {
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onLogout();
        } catch (e) {
            console.error(e);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    // Mobile: Center modal
    if (isMobile) {
        return (
            <>
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1500,
                        background: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                    }}
                />

                <div
                    ref={ref}
                    onClick={e => e.stopPropagation()}
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1600,
                        width: '200px',
                        background: color.glassBg,
                        backdropFilter: 'blur(20px) saturate(1.6)',
                        WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
                        border: `1px solid ${color.glassBorder}`,
                        borderRadius: '14px',
                        boxShadow: color.glassShadow,
                        overflow: 'hidden',
                        animation: 'cwMenuIn 0.18s cubic-bezier(0.34,1.4,0.64,1)',
                    }}
                >
                    <div
                        onClick={handleLogoutClick}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '12px 16px',
                            cursor: 'pointer',
                            color: '#ff5252',
                            fontSize: '14px',
                            fontWeight: 500,
                            transition: 'background 0.12s',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.background = 'rgba(255,82,82,0.1)';
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                        }}
                    >
                        Logout
                    </div>
                </div>

                <ConfirmLogoutModal
                    isOpen={showConfirm}
                    onConfirm={handleConfirm}
                    onCancel={() => {
                        setShowConfirm(false);
                        onClose();
                    }}
                    color={color}
                    isLoading={isLoading}
                />
            </>
        );
    }

    // Desktop: Position-based modal
    if (!position) return null;

    return (
        <>
            <div
                ref={ref}
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                    zIndex: 1500,
                    width: '180px',
                    background: color.glassBg,
                    backdropFilter: 'blur(20px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
                    border: `1px solid ${color.glassBorder}`,
                    borderRadius: '12px',
                    boxShadow: color.glassShadow,
                    overflow: 'hidden',
                    animation: 'cwMenuIn 0.18s cubic-bezier(0.34,1.4,0.64,1)',
                }}
            >
                <div
                    onClick={handleLogoutClick}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        color: '#ff5252',
                        fontSize: '14px',
                        fontWeight: 500,
                        transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,82,82,0.1)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                >
                    Logout
                </div>
            </div>

            <ConfirmLogoutModal
                isOpen={showConfirm}
                onConfirm={handleConfirm}
                onCancel={() => {
                    setShowConfirm(false);
                    onClose();
                }}
                color={color}
                isLoading={isLoading}
            />
        </>
    );
};
