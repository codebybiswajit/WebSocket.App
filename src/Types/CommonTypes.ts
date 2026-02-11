export type Theme = 'light' | 'dark';

export interface NavbarProps {
    theme: Theme;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    sidebarCollapsed: boolean;
    onLoginClick: () => void;
    onSignupClick: () => void;
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