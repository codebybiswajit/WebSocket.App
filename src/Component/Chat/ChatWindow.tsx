import { type CSSProperties, useEffect, useRef, useState } from "react";
import { useChat } from "../../Context/useChat";
import UserService from "../../Services/UserService";
import { ConnectionStatus } from "../../Types/Chat";
import type { IdName, Theme, ThemeColors } from "../../Types/CommonTypes";
import {
  BackIcon,
  CheckIcon,
  CloseIcon,
  DotsIcon,
  GroupIcon,
  PhoneIcon,
  SearchIcon,
  UserIcon,
  UserPlusIcon,
  VideoIcon,
} from "../../Utils/svg";
import WSToast from "../../Utils/WSToast";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import ThemePicker from "../../Utils/ThemePicker";
import { ChatProvider } from "../../Context/ChatContext";

interface Contact {
  id: string;
  name: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
  online?: boolean;
}

type ModalType = "addContact" | "createGroup" | null;

// ─── Icons ────────────────────────────────────────────────────────────────────

// ─── Global Styles ────────────────────────────────────────────────────────────

const GlobalStyles = () => (
  <style>{`
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
    @keyframes cwMenuIn { from{opacity:0;transform:scale(0.93) translateY(-8px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes cwOverlayIn { from{opacity:0} to{opacity:1} }
    @keyframes cwModalIn { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-track{background:transparent}
    ::-webkit-scrollbar-thumb{background:#374955;border-radius:4px}
    .cw-contact:hover{background-color:#2a3942!important}
    .cw-icon-btn{display:flex;align-items:center;justify-content:center;overflow:visible;}
    .cw-icon-btn:hover{background-color:rgba(255,255,255,0.07)!important;border-radius:50%}
    .cw-icon-btn svg{display:block;}
    .cw-menu-item:hover{background:rgba(255,255,255,0.09)!important}
    .cw-search-row:hover{background:rgba(255,255,255,0.07)!important}
    .cw-modal-input{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:10px 14px;color:#e9edef;font-size:14px;width:100%;outline:none;transition:border-color .2s,box-shadow .2s;font-family:inherit}
    .cw-modal-input:focus{border-color:#25d366!important;box-shadow:0 0 0 3px rgba(37,211,102,0.12)}
    .cw-submit-btn:not(:disabled):hover{background:#1fa855!important;transform:translateY(-1px);box-shadow:0 4px 16px rgba(37,211,102,0.3)}
    .cw-submit-btn:not(:disabled):active{transform:translateY(0)}
  `}</style>
);

// ─── Dot Menu ─────────────────────────────────────────────────────────────────

const DotMenu = ({
  onSelect,
  color,
}: {
  onSelect: (t: ModalType) => void;
  color: ThemeColors;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const items = [
    {
      type: "addContact" as ModalType,
      icon: <UserPlusIcon color={color.textSecondary} />,
      label: "Add Contact",
    },
    {
      type: "createGroup" as ModalType,
      icon: <GroupIcon color={color.textSecondary} />,
      label: "Create Group",
    },
  ];

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="cw-icon-btn"
        style={{
          background: open ? "rgba(255,255,255,0.09)" : "transparent",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
          overflow: "visible",
          padding: 0,
        }}
      >
        <DotsIcon color={color.textSecondary} />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "46px",
            right: 0,
            width: "196px",
            background: color.glassBg,
            backdropFilter: "blur(20px) saturate(1.6)",
            WebkitBackdropFilter: "blur(20px) saturate(1.6)",
            border: `1px solid ${color.glassBorder}`,
            borderRadius: "14px",
            boxShadow: color.glassShadow,
            overflow: "hidden",
            zIndex: 500,
            animation: "cwMenuIn 0.18s cubic-bezier(0.34,1.4,0.64,1)",
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.type}
              className="cw-menu-item"
              onClick={() => {
                setOpen(false);
                onSelect(item.type);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "13px 16px",
                cursor: "pointer",
                color: color.textPrimary,
                fontSize: "14px",
                fontWeight: 450,
                borderBottom:
                  i < items.length - 1
                    ? `1px solid ${color.glassBorder}`
                    : "none",
                transition: "background 0.12s",
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Glass Modal Shell ────────────────────────────────────────────────────────

const GlassModal = ({
  title,
  onClose,
  children,
  color,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  color: ThemeColors;
}) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(7px)",
      WebkitBackdropFilter: "blur(7px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "cwOverlayIn 0.2s ease",
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "420px",
        maxWidth: "95vw",
        background: color.glassBg,
        backdropFilter: "blur(32px) saturate(1.8)",
        WebkitBackdropFilter: "blur(32px) saturate(1.8)",
        border: `1px solid ${color.glassBorder}`,
        borderRadius: "20px",
        boxShadow: color.glassShadow,
        overflow: "hidden",
        animation: "cwModalIn 0.26s cubic-bezier(0.34,1.2,0.64,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 20px 14px",
          borderBottom: `1px solid ${color.glassBorder}`,
        }}
      >
        <span
          style={{
            color: color.textPrimary,
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {title}
        </span>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            padding: "4px",
          }}
        >
          <CloseIcon color={color.textSecondary} />
        </button>
      </div>
      <div style={{ padding: "18px 20px 22px" }}>{children}</div>
    </div>
  </div>
);

// ─── Modal Search ─────────────────────────────────────────────────────────────

const ModalSearch = ({
  value,
  onChange,
  placeholder,
  color,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  color: ThemeColors;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: color.glassBg,
      border: `1px solid ${color.glassBorder}`,
      borderRadius: "12px",
      padding: "9px 13px",
    }}
  >
    <SearchIcon color={color.textTertiary} />
    <input
      className="cw-modal-input"
      type="text"
      placeholder={placeholder ?? "Search…"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        width: "100%",
      }}
    />
  </div>
);

// ─── Result List ──────────────────────────────────────────────────────────────

const ResultList = ({
  results,
  selected,
  multi,
  onToggle,
  loading,
  color,
}: {
  results: IdName[];
  selected: string[];
  multi?: boolean;
  onToggle: (id: string) => void;
  loading?: boolean;
  color: ThemeColors;
}) => {
  if (loading)
    return (
      <p
        style={{
          color: color.textSecondary,
          fontSize: "13px",
          textAlign: "center",
          padding: "16px 0",
        }}
      >
        Searching…
      </p>
    );
  if (!results.length)
    return (
      <p
        style={{
          color: color.textSecondary,
          fontSize: "13px",
          textAlign: "center",
          padding: "16px 0",
        }}
      >
        No users found
      </p>
    );
  return (
    <div
      style={{
        maxHeight: "210px",
        overflowY: "auto",
        borderRadius: "12px",
        border: `1px solid ${color.glassBorder}`,
        background: color.glassBg,
      }}
    >
      {results.map((u, i) => {
        const sel = selected.includes(u.id);
        return (
          <div
            key={u.id}
            className="cw-search-row"
            onClick={() => onToggle(u.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "11px",
              padding: "10px 13px",
              cursor: "pointer",
              background: sel ? `${color.accentPrimary}14` : "transparent",
              borderBottom:
                i < results.length - 1
                  ? `1px solid ${color.glassBorder}`
                  : "none",
              transition: "background 0.12s",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                background: color.bgSecondary,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserIcon size={16} color={color.textSecondary} />
            </div>
            <span
              style={{ flex: 1, color: color.textPrimary, fontSize: "14px" }}
            >
              {u.name}
            </span>
            {multi ? (
              <div
                style={{
                  width: "19px",
                  height: "19px",
                  borderRadius: "5px",
                  flexShrink: 0,
                  border: sel
                    ? `2px solid ${color.accentPrimary}`
                    : `2px solid ${color.glassBorder}`,
                  background: sel ? color.accentPrimary : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.14s",
                }}
              >
                {sel && <CheckIcon />}
              </div>
            ) : (
              <div
                style={{
                  width: "17px",
                  height: "17px",
                  borderRadius: "50%",
                  flexShrink: 0,
                  border: sel
                    ? `2px solid ${color.accentPrimary}`
                    : `2px solid ${color.glassBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.14s",
                }}
              >
                {sel && (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: color.accentPrimary,
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Submit Btn ───────────────────────────────────────────────────────────────

const SubmitBtn = ({
  label,
  disabled,
  onClick,
  color,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  color: ThemeColors;
}) => (
  <button
    className="cw-submit-btn"
    onClick={onClick}
    disabled={disabled}
    style={{
      width: "100%",
      padding: "12px 0",
      background: disabled ? `${color.accentPrimary}30` : color.accentPrimary,
      color: disabled ? color.textTertiary : "#111b21",
      border: "none",
      borderRadius: "12px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: disabled ? "not-allowed" : "pointer",
      transition: "all 0.18s",
      fontFamily: "inherit",
    }}
  >
    {label}
  </button>
);

// ─── Add Contact Modal ────────────────────────────────────────────────────────

const AddContactModal = ({
  onClose,
  color,
}: {
  onClose: () => void;
  color: ThemeColors;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IdName[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>(1);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await UserService.getSearchResult(query);
        setResults(r.data?.result ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  const submit = async () => {
    if (!selected[0]) return;
    setBusy(true);
    try {
      await UserService.createFriend(
        sessionStorage.getItem("userId") ||
          localStorage.getItem("userId") ||
          "",
        selected[0],
      )
        .then((res: any) => {
          if (res.data.statusCode === 400) {
            WSToast.warning(res.data.message);
          } else {
            WSToast.success(res.data.message || "Contact added successfully!");
          }
          onClose();
        })
        .catch((ex) => {
          WSToast.error(
            ex.message || "Failed to add contact. Please try again.",
          );
        });
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <GlassModal title="Add Contact" onClose={onClose} color={color}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <ModalSearch
          value={query}
          onChange={setQuery}
          placeholder="Search by name…"
          color={color}
        />
        {query.trim() && (
          <ResultList
            results={results}
            selected={selected}
            onToggle={(id) => setSelected([id])}
            loading={loading}
            color={color}
          />
        )}
        <SubmitBtn
          label={busy ? "Adding…" : "Add Contact"}
          disabled={!selected[0] || busy}
          onClick={submit}
          color={color}
        />
      </div>
    </GlassModal>
  );
};

// ─── Create Group Modal ───────────────────────────────────────────────────────

const CreateGroupModal = ({
  onClose,
  color,
}: {
  onClose: () => void;
  color: ThemeColors;
}) => {
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IdName[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout>>(1);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const r = await UserService.getSearchResult(query);
        setResults(r.data?.result ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query]);

  const toggle = (id: string) =>
    setSelected((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const submit = async () => {
    if (!name.trim() || !selected.length) return;
    setBusy(true);
    try {
      WSToast.success("This feature is coming soon!");
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <GlassModal title="Create Group" onClose={onClose} color={color}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          className="cw-modal-input"
          type="text"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <ModalSearch
          value={query}
          onChange={setQuery}
          placeholder="Search members…"
          color={color}
        />
        {selected.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {selected.map((id) => {
              const u = results.find((r) => r.id === id);
              return (
                <div
                  key={id}
                  onClick={() => toggle(id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: `${color.accentPrimary}22`,
                    border: `1px solid ${color.accentPrimary}50`,
                    borderRadius: "20px",
                    padding: "3px 10px 3px 8px",
                    fontSize: "13px",
                    color: color.accentPrimary,
                    cursor: "pointer",
                  }}
                >
                  {u?.name ?? id} <span style={{ opacity: 0.65 }}>×</span>
                </div>
              );
            })}
          </div>
        )}
        {query.trim() && (
          <ResultList
            results={results}
            selected={selected}
            multi
            onToggle={toggle}
            loading={loading}
            color={color}
          />
        )}
        <SubmitBtn
          label={
            busy
              ? "Creating…"
              : `Create Group${selected.length ? ` · ${selected.length}` : ""}`
          }
          disabled={!name.trim() || !selected.length || busy}
          onClick={submit}
          color={color}
        />
      </div>
    </GlassModal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ChatWindow = ({
  color,
  setTheme,
  theme,
}: {
  color: ThemeColors;
  setTheme: (theme: Theme) => void;
  theme: Theme;
}) => {
  const {
    getMessages,
    onlineUsers,
    connectionStatus,
    currentUser,
    isTyping,
    typingUser,
    sendPrivateMessage,
    setActiveConversation,
    notifyTyping,
    notifyStopTyping,
    loadConversationHistory,
  } = useChat();

  const [selectedContact, setSelectedContact] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId") || "";

  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
    sessionStorage.setItem("theme", theme);
  };

  useEffect(() => {
    UserService.getContacts(userId).then((res) => {
      const raw: IdName[] = res.data?.result ?? [];
      const mapped: Contact[] = Array.from(raw)?.map((c) => ({
        id: c.id,
        name: c.name,
      }));
      setContacts(mapped);
      if (mapped.length > 0) {
        setSelectedContact(mapped[0].id);
        setActiveConversation(mapped[0].id);
      }
    });
  }, [userId, setActiveConversation, activeModal, loadConversationHistory]);

  // Update contact online status when onlineUsers changes
  useEffect(() => {
    setContacts((prev) =>
      prev.map((contact) => ({
        ...contact,
        online: onlineUsers.some((u) => u.userId === contact.id),
      })),
    );
  }, [onlineUsers]);

  const handleContactSelect = async (c: Contact) => {
    setSelectedContact(c.id);
    setActiveConversation(c.id);
    setShowRightSidebar(true);
    // Load chat history from API on contact selection
    try {
      await loadConversationHistory(c.id);
    } catch (e) {
      console.warn("Failed to load message history:", e);
    }
  };

  const handleSendMessage = async (msg: string) => {
    if (!selectedContact) return;
    try {
      await sendPrivateMessage(selectedContact, msg);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    const id =
      sessionStorage.getItem("userId") || localStorage.getItem("userId") || "";
    await UserService.logOut(id)
      .then((res) => {
        if (res.data.statusCode === 200) {
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userId");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          WSToast.success(res.data.message || "Logged out successfully!");
        } else {
          WSToast.warning(
            res.data.message || "Logout may have failed. Please try again.",
          );
        }
      })
      .catch((ex: any) => {
        WSToast.error(ex.message || "Logout failed. Please try again.");
      });
    window.location.reload();
  };

  const isConnected = connectionStatus === ConnectionStatus.Connected;

  const connColor =
    (
      {
        [ConnectionStatus.Connected]: color.accentPrimary,
        [ConnectionStatus.Connecting]: "#ffa000",
        [ConnectionStatus.Reconnecting]: "#ffa000",
        [ConnectionStatus.Disconnected]: "#ff5252",
        [ConnectionStatus.ConnectionFailed]: "#ff5252",
      } as Record<string, string>
    )[connectionStatus] ?? color.textTertiary;

  const messages = getMessages(selectedContact);
  const activeContact = contacts.find((c) => c.id === selectedContact);

  // ── Contact List ──────────────────────────────────────────────────────────
  const contactListJSX = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: color.bgPrimary,
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: color.bgSecondary,
          padding: "0 16px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            onClick={handleLogout}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: color.accentPrimary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <UserIcon size={22} color="#111b21" />
          </div>
          <span
            style={{
              color: color.textPrimary,
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            Chats
          </span>
        </div>
        {/* Theme Picker Component */}
        <ThemePicker
          theme={theme}
          colors={color}
          toggleTheme={toggleTheme}
          isMobile={true}
        />
      </div>

      {/* Search + Dot Menu */}
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: color.bgPrimary,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: color.bgSecondary,
            borderRadius: "9px",
            padding: "9px 14px",
          }}
        >
          <SearchIcon color={color.textTertiary} />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: color.textPrimary,
              fontSize: "15px",
            }}
          />
        </div>

        {/* ───── 3-DOT MENU ───── */}
        <DotMenu onSelect={setActiveModal} color={color} />
      </div>

      {/* Connection banner */}
      {!isConnected && (
        <div
          style={{
            backgroundColor: color.bgSecondary,
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: connColor,
              animation: "pulse 2s infinite",
            }}
          />
          <span style={{ color: color.textSecondary, fontSize: "13px" }}>
            {connectionStatus}
          </span>
        </div>
      )}

      {/* Contacts */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {contacts.length === 0 && (
          <p
            style={{
              color: color.textSecondary,
              textAlign: "center",
              padding: "32px 16px",
              fontSize: "14px",
            }}
          >
            No contacts
          </p>
        )}
        {contacts
          .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
          .map((contact) => (
            <div
              key={contact.id}
              className="cw-contact"
              onClick={() => handleContactSelect(contact)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 16px",
                cursor: "pointer",
                backgroundColor:
                  selectedContact === contact.id
                    ? color.bgSecondary
                    : "transparent",
                transition: "background-color 0.12s",
                borderBottom: `1px solid ${color.glassBorder}`,
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: color.bgSecondary,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <UserIcon size={26} color={color.textSecondary} />
                {contact.online && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1px",
                      right: "1px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: color.accentPrimary,
                      border: `2px solid ${color.bgPrimary}`,
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "3px",
                  }}
                >
                  <span
                    style={{
                      color: color.textPrimary,
                      fontSize: "16px",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "65%",
                    }}
                  >
                    {contact.name}
                  </span>
                  <span
                    style={{
                      color: contact.unread
                        ? color.accentPrimary
                        : color.textSecondary,
                      fontSize: "12px",
                      flexShrink: 0,
                    }}
                  >
                    {contact.time ?? ""}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    textAlign: "start",
                  }}
                >
                  <span
                    style={{
                      color: color.textSecondary,
                      fontSize: "14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {contact.lastMessage ?? "Tap to chat"}
                  </span>
                  {(contact.unread ?? 0) > 0 && (
                    <div
                      style={{
                        backgroundColor: color.accentPrimary,
                        color: "#111b21",
                        fontSize: "12px",
                        fontWeight: 700,
                        borderRadius: "12px",
                        padding: "1px 7px",
                        minWidth: "20px",
                        textAlign: "center",
                        marginLeft: "6px",
                        flexShrink: 0,
                      }}
                    >
                      {contact.unread}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  // ── Chat Area ─────────────────────────────────────────────────────────────
  const chatAreaJSX = (onBack: () => void) => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Chat header */}
      <div
        style={{
          backgroundColor: color.bgSecondary,
          height: "60px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 8px 0 4px",
          gap: "4px",
          borderBottom: `1px solid ${color.glassBorder}`,
        }}
      >
        <button
          className="cw-icon-btn"
          style={iconBtnStyle}
          onClick={onBack ?? (() => setShowSidebar((s) => !s))}
        >
          <BackIcon color={color.textSecondary} />
        </button>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: color.bgPrimary,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "4px",
          }}
        >
          <UserIcon size={22} color={color.textSecondary} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: color.textPrimary,
              fontSize: "16px",
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {activeContact?.name ?? "Select a contact"}
          </div>
          <div style={{ color: color.textSecondary, fontSize: "13px" }}>
            {isConnected ? (activeContact?.online ? "online" : "offline") : ""}
          </div>
        </div>

        <button className="cw-icon-btn" style={iconBtnStyle}>
          <PhoneIcon color={color.textSecondary} />
        </button>
        <button className="cw-icon-btn" style={iconBtnStyle}>
          <VideoIcon color={color.textSecondary} />
        </button>
        <button className="cw-icon-btn" style={iconBtnStyle}>
          <SearchIcon color={color.textSecondary} />
        </button>
        <button className="cw-icon-btn" style={iconBtnStyle}>
          <DotsIcon color={color.textSecondary} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0,
          backgroundColor: color.bgPrimary,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23182229' fill-opacity='0.9'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          padding: "8px 4px",
        }}
      >
        <MessageList
          messages={messages}
          currentUserId={currentUser?.userId ?? ""}
        />
      </div>

      {/* Typing indicator */}
      {isTyping && typingUser && (
        <div
          style={{
            padding: "6px 16px",
            backgroundColor: color.bgPrimary,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              backgroundColor: color.bgSecondary,
              borderRadius: "12px 12px 12px 0",
              padding: "8px 12px",
              display: "flex",
              gap: "4px",
              alignItems: "center",
            }}
          >
            {[0, 0.2, 0.4].map((d, i) => (
              <span
                key={i}
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: color.textSecondary,
                  display: "inline-block",
                  animation: `bounce 1.4s infinite ease-in-out ${d}s`,
                }}
              />
            ))}
          </div>
          <span
            style={{
              color: color.textSecondary,
              fontSize: "13px",
              fontStyle: "italic",
            }}
          >
            {typingUser} is typing
          </span>
        </div>
      )}

      {/* Message Input */}
      <div
        style={{
          backgroundColor: color.bgSecondary,
          borderTop: `1px solid ${color.glassBorder}`,
          flexShrink: 0,
        }}
      >
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={() => notifyTyping(selectedContact)}
          onStopTyping={() => notifyStopTyping(selectedContact)}
          disabled={!isConnected}
        />
      </div>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <GlobalStyles />

      {/* Modals */}
      {activeModal === "addContact" && (
        <AddContactModal onClose={() => setActiveModal(null)} color={color} />
      )}
      {activeModal === "createGroup" && (
        <CreateGroupModal onClose={() => setActiveModal(null)} color={color} />
      )}

      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          backgroundColor: color.bgPrimary,
          overflow: "hidden",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        {showSidebar && (
          <div
            style={{
              width: "380px",
              minWidth: "320px",
              flexShrink: 0,
              borderRight: `1px solid ${color.glassBorder}`,
              height: "100%",
            }}
          >
            {contactListJSX}
          </div>
        )}
        {showRightSidebar && (
          <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
            {chatAreaJSX(() => setShowRightSidebar(false))}
          </div>
        )}
      </div>
    </>
  );
};

// ─── Shared style ─────────────────────────────────────────────────────────────

const iconBtnStyle: CSSProperties = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "40px",
  height: "40px",
  flexShrink: 0,
  overflow: "visible",
};

const ChatWindowPreview = ({
  color,
  setTheme,
  theme,
  tokens,
}: {
  color: ThemeColors;
  setTheme: (theme: Theme) => void;
  theme: Theme;
  tokens: string;
}) => {
  return (
    <ChatProvider tokens={tokens}>
      <ChatWindow color={color} setTheme={setTheme} theme={theme} />
    </ChatProvider>
  );
};
export default ChatWindowPreview;
