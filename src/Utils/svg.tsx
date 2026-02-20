export const UserIcon = ({
  size = 24,
  color = "#aebac1",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{ fill: color, flexShrink: 0 }}
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export const DotsIcon = ({ color = "#aebac1" }: { color?: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    style={{ fill: color, flexShrink: 0, display: "block" }}
  >
    <circle cx="12" cy="5" r="2.5" />
    <circle cx="12" cy="12" r="2.5" />
    <circle cx="12" cy="19" r="2.5" />
  </svg>
);

export const SearchIcon = ({ color = "#aebac1" }: { color?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    style={{ flexShrink: 0 }}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const BackIcon = ({ color = "#aebac1" }: { color?: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

export const PhoneIcon = ({ color = "#aebac1" }: { color?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    style={{ fill: color, flexShrink: 0 }}
  >
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);

export const VideoIcon = ({ color = "#aebac1" }: { color?: string }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    style={{ fill: color, flexShrink: 0 }}
  >
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

export const CloseIcon = ({ color = "#aebac1" }: { color?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const UserPlusIcon = ({ color = "#aebac1" }: { color?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    style={{ fill: color, flexShrink: 0 }}
  >
    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export const GroupIcon = ({ color = "#aebac1" }: { color?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    style={{ fill: color, flexShrink: 0 }}
  >
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);

export const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    style={{ fill: "white", flexShrink: 0 }}
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);
