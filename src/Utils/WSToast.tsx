// components/UI/WSToast.tsx

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const CFG: Record<ToastType, { color: string; border: string; bg: string; icon: string }> = {
    success: { color: '#25d366', border: 'rgba(37,211,102,0.28)', bg: 'rgba(37,211,102,0.10)', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25d366" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>` },
    error: { color: '#ff5252', border: 'rgba(255,82,82,0.28)', bg: 'rgba(255,82,82,0.10)', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff5252" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>` },
    warning: { color: '#ffa000', border: 'rgba(255,160,0,0.28)', bg: 'rgba(255,160,0,0.10)', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffa000" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>` },
    info: { color: '#4fc3f7', border: 'rgba(79,195,247,0.28)', bg: 'rgba(79,195,247,0.10)', icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4fc3f7" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>` },
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

const ToastCard = ({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) => {
    const [visible, setVisible] = useState(false);
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(1);
    const rafRef = useRef<number>(1);
    const cfg = CFG[item.type];

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));

        const start = Date.now();
        const tick = () => {
            const pct = Math.max(0, 100 - ((Date.now() - start) / item.duration) * 100);
            setProgress(pct);
            if (pct > 0) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        timerRef.current = setTimeout(dismiss, item.duration);
        return () => {
            clearTimeout(timerRef.current);
            cancelAnimationFrame(rafRef.current!);
        };
    }, []);

    const dismiss = () => {
        setExiting(true);
        setTimeout(() => onRemove(item.id), 320);
    };

    return (
        <div
            onClick={dismiss}
            style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '11px',
                padding: '13px 14px',
                borderRadius: '14px',
                minWidth: '280px',
                maxWidth: '360px',
                overflow: 'hidden',
                cursor: 'pointer',
                background: 'rgba(20, 30, 36, 0.88)',
                backdropFilter: 'blur(24px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
                border: `1px solid ${cfg.border}`,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                transform: visible && !exiting ? 'translateX(0) scale(1)' : 'translateX(110%) scale(0.94)',
                opacity: visible && !exiting ? 1 : 0,
                transition: exiting
                    ? 'transform 0.3s cubic-bezier(0.4,0,1,1), opacity 0.3s ease'
                    : 'transform 0.38s cubic-bezier(0.34,1.36,0.64,1), opacity 0.28s ease',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            }}
        >
            {/* Left accent */}
            <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
                background: cfg.color, borderRadius: '14px 0 0 14px',
            }} />

            {/* Icon */}
            <div style={{
                flexShrink: 0, width: '30px', height: '30px', borderRadius: '8px',
                background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '1px',
            }}
                dangerouslySetInnerHTML={{ __html: cfg.icon }}
            />

            {/* Message */}
            <p style={{
                flex: 1, margin: 0, color: '#e9edef',
                fontSize: '14px', lineHeight: '1.5', fontWeight: 450,
                wordBreak: 'break-word', paddingTop: '5px',
            }}>
                {item.message}
            </p>

            {/* Close */}
            <span style={{
                color: '#8696a0', fontSize: '20px', lineHeight: 1,
                marginTop: '2px', flexShrink: 0, opacity: 0.7,
                paddingLeft: '4px',
            }}>
                ×
            </span>

            {/* Progress bar */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0,
                height: '2px', width: `${progress}%`,
                background: cfg.color, opacity: 0.55,
                transition: 'width 0.1s linear',
            }} />
        </div>
    );
};

// ─── Container Component ──────────────────────────────────────────────────────

let _setToasts: React.Dispatch<React.SetStateAction<ToastItem[]>> | null = null;

const ToastContainer = () => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    _setToasts = setToasts;

    const remove = (id: string) =>
        setToasts(prev => prev.filter(t => t.id !== id));

    return (
        <div style={{
            position: 'fixed', bottom: '24px', right: '24px',
            zIndex: 9999, display: 'flex', flexDirection: 'column',
            gap: '10px', alignItems: 'flex-end', pointerEvents: 'none',
        }}>
            {toasts.map(t => (
                <div key={t.id} style={{ pointerEvents: 'all' }}>
                    <ToastCard item={t} onRemove={remove} />
                </div>
            ))}
        </div>
    );
};

// ─── Mount once into a persistent DOM node ────────────────────────────────────

let _mounted = false;

const mount = () => {
    if (_mounted) return;
    _mounted = true;
    const el = document.createElement('div');
    el.id = 'ws-toast-root';
    document.body.appendChild(el);
    ReactDOM.createRoot(el).render(<ToastContainer />);
};

// ─── Public API ───────────────────────────────────────────────────────────────

const show = (message: string, type: ToastType, duration = 3500) => {
    mount();

    // Give React a tick to mount the container and set _setToasts
    const attempt = (retries = 0) => {
        if (_setToasts) {
            const id = Math.random().toString(36).slice(2);
            _setToasts(prev => [...prev.slice(-4), { id, message, type, duration }]);
        } else if (retries < 10) {
            setTimeout(() => attempt(retries + 1), 50);
        }
    };
    attempt();
};

const WSToast = {
    success: (message: string, duration?: number) => show(message, 'success', duration),
    error: (message: string, duration?: number) => show(message, 'error', duration),
    warning: (message: string, duration?: number) => show(message, 'warning', duration),
    info: (message: string, duration?: number) => show(message, 'info', duration),
};

export default WSToast;