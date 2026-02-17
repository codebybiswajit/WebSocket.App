import type { CSSProperties } from "react";
import type { SignupModalProps } from "../../Types/CommonTypes";
import type ThemeConfig from "../../Utils/ThemeConfig";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import UserService from "../../Services/UserService";

// ── Role enum ──────────────────────────────────────────────────────────────────
export enum UserRole {
    Admin = 1,
    User = 2,
    Guest = 3,
}


const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
    { label: "User", value: UserRole.User },
    { label: "Admin", value: UserRole.Admin },
    { label: "Guest", value: UserRole.Guest },
];

// ── Payload ────────────────────────────────────────────────────────────────────
export interface UserSignup {
    name: string;
    password: string;
    email: string;
    role: UserRole;
}

// ── Validation ─────────────────────────────────────────────────────────────────
const SignUpSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    password: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("Password is required"),
    email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),
    role: Yup.number()
        .oneOf(ROLE_OPTIONS.map((o) => o.value), "Select a valid role")
        .required("Role is required"),
});

// ── Component ──────────────────────────────────────────────────────────────────
const SignupModal = ({
    onClose,
    onSwitchToLogin,
    setLoading,
    colors,
}: SignupModalProps & { colors: typeof ThemeConfig.light }) => {

    const initialValues: UserSignup = {
        name: "",
        password: "",
        email: "",
        role: UserRole.User,
    };

    const handleSubmit = async (
        values: UserSignup,
        formikHelpers: FormikHelpers<UserSignup>
    ) => {
        const param = {
            name: values.name,
            password: values.password,
            email: values.email,
            role: Number(values.role) as UserRole,
        };
        try {
            setLoading(true);
            await UserService.signup({ user: param });
            onClose();
        } catch (err: any) {
            formikHelpers.setFieldError(
                "name",
                err?.result?.error?.message ?? "Signup failed — user may already exist."
            );
        } finally {
            setLoading(false);
        }
    };

    // ── Styles ─────────────────────────────────────────────────────────────────
    const overlayStyle: CSSProperties = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "1rem",
    };

    const modalStyle: CSSProperties = {
        width: "100%",
        maxWidth: "520px",
        borderRadius: "20px",
        padding: "2rem 2rem 1.5rem",
        position: "relative",
        background: colors.glassBg,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid ${colors.glassBorder}`,
        boxShadow: `0 8px 40px ${colors.glassShadow}`,
        boxSizing: "border-box",
        // No overflow / maxHeight — no scrollbar
    };

    const closeStyle: CSSProperties = {
        position: "absolute",
        top: "1.1rem",
        right: "1.1rem",
        background: "transparent",
        border: "none",
        fontSize: "1.4rem",
        color: colors.textSecondary,
        cursor: "pointer",
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const headerStyle: CSSProperties = {
        textAlign: "center",
        marginBottom: "1.25rem",
    };

    const titleStyle: CSSProperties = {
        fontFamily: "'Syne', sans-serif",
        fontSize: "1.75rem",
        fontWeight: 800,
        marginBottom: "0.25rem",
        color: colors.textPrimary,
    };

    const subtitleStyle: CSSProperties = {
        color: colors.textSecondary,
        fontSize: "0.875rem",
    };

    const labelStyle: CSSProperties = {
        display: "block",
        marginBottom: "0.35rem",
        fontWeight: 600,
        color: colors.textPrimary,
        fontSize: "0.825rem",
    };

    const inputStyle: CSSProperties = {
        width: "100%",
        padding: "0.7rem 1rem",
        borderRadius: "10px",
        border: `2px solid ${colors.glassBorder}`,
        background: colors.glassBg,
        color: colors.textPrimary,
        fontSize: "0.9rem",
        fontFamily: "'DM Sans', sans-serif",
        transition: "border-color 0.2s",
        backdropFilter: "blur(10px)",
        boxSizing: "border-box",
        appearance: "none",
        outline: "none",
    };

    const errorStyle: CSSProperties = {
        color: "#ff6b6b",
        fontSize: "0.75rem",
        marginTop: "0.25rem",
    };

    const btnFullStyle: CSSProperties = {
        width: "100%",
        padding: "0.85rem",
        fontSize: "0.95rem",
        marginTop: "0.5rem",
        borderRadius: "10px",
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.bgGradientEnd})`,
        color: "white",
        border: "none",
        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    };

    const dividerStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        margin: "1rem 0",
        color: colors.textTertiary,
        fontSize: "0.8rem",
    };

    const dividerLineStyle: CSSProperties = {
        flex: 1,
        height: "1px",
        background: colors.glassBorder,
    };

    const socialButtonsStyle: CSSProperties = {
        display: "flex",
        gap: "0.75rem",
    };

    const btnSocialStyle: CSSProperties = {
        flex: 1,
        padding: "0.7rem",
        borderRadius: "10px",
        border: `2px solid ${colors.glassBorder}`,
        background: colors.glassBg,
        color: colors.textPrimary,
        cursor: "pointer",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.4rem",
        fontSize: "0.875rem",
    };

    const footerStyle: CSSProperties = {
        textAlign: "center",
        marginTop: "1rem",
        color: colors.textSecondary,
        fontSize: "0.85rem",
    };

    const linkStyle: CSSProperties = {
        color: colors.accentPrimary,
        textDecoration: "none",
        fontWeight: 600,
        cursor: "pointer",
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <>
            {/*
             * Inject a single <style> block so we can use a real @media query
             * for the 2-col → 1-col grid switch without any runtime JS resize logic.
             */}
            <style>{`
                .signup-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0 1rem;
                }
                .signup-grid .field-group {
                    margin-bottom: 1rem;
                }
                /* On screens narrower than 480 px → single column */
                @media (max-width: 480px) {
                    .signup-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            <div
                style={overlayStyle}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div style={modalStyle}>
                    <button style={closeStyle} onClick={onClose} aria-label="Close">
                        ×
                    </button>

                    <div style={headerStyle}>
                        <h2 style={titleStyle}>Create Account</h2>
                        <p style={subtitleStyle}>Join My Chat and start connecting</p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={SignUpSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form noValidate>
                                {/*
                                 * 2-column grid on desktop  |  1-column on mobile
                                 * Layout:  [ Name ]  [ Email ]
                                 *          [ Password ]  [ Role ]
                                 */}
                                <div className="signup-grid">

                                    {/* Name */}
                                    <div className="field-group">
                                        <label style={labelStyle} htmlFor="name">Name</label>
                                        <Field
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Full name"
                                            style={inputStyle}
                                        />
                                        <ErrorMessage name="name">
                                            {(msg) => <div style={errorStyle}>{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    {/* Email */}
                                    <div className="field-group">
                                        <label style={labelStyle} htmlFor="email">Email</label>
                                        <Field
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            style={inputStyle}
                                        />
                                        <ErrorMessage name="email">
                                            {(msg) => <div style={errorStyle}>{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    {/* Password */}
                                    <div className="field-group">
                                        <label style={labelStyle} htmlFor="password">Password</label>
                                        <Field
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Min. 8 characters"
                                            style={inputStyle}
                                        />
                                        <ErrorMessage name="password">
                                            {(msg) => <div style={errorStyle}>{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    {/* Role */}
                                    <div className="field-group">
                                        <label style={labelStyle} htmlFor="role">Role</label>
                                        <Field
                                            as="select"
                                            id="role"
                                            name="role"
                                            style={inputStyle}
                                        >
                                            {ROLE_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="role">
                                            {(msg) => <div style={errorStyle}>{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                </div>{/* /signup-grid */}

                                <button
                                    type="submit"
                                    style={btnFullStyle}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Creating account…" : "Create Account"}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div style={dividerStyle}>
                        <div style={dividerLineStyle} />
                        OR
                        <div style={dividerLineStyle} />
                    </div>

                    <div style={socialButtonsStyle}>
                        <button style={btnSocialStyle} type="button">
                            <span>🔵</span> Google
                        </button>
                        <button style={btnSocialStyle} type="button">
                            <span>⚫</span> GitHub
                        </button>
                    </div>

                    <div style={footerStyle}>
                        Already have an account?{" "}
                        <a style={linkStyle} onClick={onSwitchToLogin}>
                            Log in
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignupModal;