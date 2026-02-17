export enum Theme {
    Light = 'light',
    Dark = 'dark',
    AuroraBorealis = 'auroraBorealis',
    SunsetBlaze = 'sunsetBlaze',
    MidnightRose = 'midnightRose',
    ArcticSteel = 'arcticSteel',
    GoldenHour = 'goldenHour',
    ForestDepths = 'forestDepths',
    NeonAbyss = 'neonAbyss',
}

export interface ThemeColors {
    bgPrimary: string;
    bgSecondary: string;
    bgGradientStart: string;
    bgGradientEnd: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    glassBg: string;
    glassBorder: string;
    glassShadow: string;
    accentPrimary: string;
    accentHover: string;
}

export interface ThemeMeta {
    id?: string;
    key?: string;
    label?: string;
    icon?: string;
    visual?: string;
    colors?: ThemeColors;
}

export interface NavbarProps {
    theme: Theme;
    toggleTheme: (theme: Theme) => void;
    toggleSidebar?: () => void;
    sidebarCollapsed?: boolean;
    onLoginClick: () => void;
    onSignupClick: () => void;
    colors: ThemeColors;
    // setTheme: (theme: Theme) => void;
}

export interface SidebarProps {
    collapsed: boolean;
}

export interface ModalProps {
    onClose: () => void;
    setLoading: (loading: boolean) => void;
}

export interface LoginModalProps extends ModalProps {
    onSwitchToSignup: () => void;
    onSuccessfulLogin: () => void;
}

export interface SignupModalProps extends ModalProps {
    onSwitchToLogin: () => void;
}

export interface Message {
    sent: boolean;
    avatar: string;
    text: string;
    time: string;
}

export interface Feature {
    icon: string;
    title: string;
    description: string;
}

export interface SidebarItem {
    icon: string;
    label: string;
    active?: boolean;
}

export const THEME_META: Record<string, ThemeMeta> = {
    [Theme.Light]: { label: 'Light', icon: '☀️', visual: '🌤️', id: Theme.Light },
    [Theme.Dark]: { label: 'Dark', icon: '🌙', visual: '🌌', id: Theme.Dark },
    [Theme.AuroraBorealis]: { label: 'Aurora', icon: '🌊', visual: '🏔️', id: Theme.AuroraBorealis },
    [Theme.SunsetBlaze]: { label: 'Sunset', icon: '🔥', visual: '🌅', id: Theme.SunsetBlaze },
    [Theme.MidnightRose]: { label: 'Rose', icon: '🌸', visual: '🥀', id: Theme.MidnightRose },
    [Theme.ArcticSteel]: { label: 'Arctic', icon: '❄️', visual: '🧊', id: Theme.ArcticSteel },
    [Theme.GoldenHour]: { label: 'Golden', icon: '✨', visual: '🌻', id: Theme.GoldenHour },
    [Theme.ForestDepths]: { label: 'Forest', icon: '🌿', visual: '🌲', id: Theme.ForestDepths },
    [Theme.NeonAbyss]: { label: 'Neon', icon: '⚡', visual: '🌃', id: Theme.NeonAbyss },
};

export const THEME_GRADIENTS: Record<string, [string, string]> = {
    light: ['#667eea', '#764ba2'],
    dark: ['#4c1d95', '#1e1b4b'],
    auroraBorealis: ['#134e4a', '#064e3b'],
    sunsetBlaze: ['#7c2d12', '#450a0a'],
    midnightRose: ['#831843', '#4a044e'],
    arcticSteel: ['#1e3a5f', '#0c1a3b'],
    goldenHour: ['#78350f', '#451a03'],
    forestDepths: ['#14532d', '#052e16'],
    neonAbyss: ['#164e63', '#1e1b4b'],
};
export interface IdName {
    id: string;
    name: string;
}