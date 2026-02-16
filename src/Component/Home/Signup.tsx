import type { CSSProperties } from "react";
import type { SignupModalProps } from "../../Types/CommonTypes";
import type ThemeConfig from "../../Utils/ThemeConfig";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import UserService from "../../Services/UserService";
// Payload interface
export interface UserSignup {
    name: string;
    password: string;
    role: number;
    email: string;
}
const SignUpSchema = Yup.object().shape({
    userName: Yup.string().trim().required("User name is required"),
    password: Yup.string().required("Password is required"),
});

// Signup Modal Component
const SignupModal = ({
    onClose,
    onSwitchToLogin,
    setLoading,
    colors,
}: SignupModalProps & { colors: typeof ThemeConfig.light }) => {

    const errorStyle: CSSProperties = { color: "#ff6b6b", fontSize: "0.85rem", marginTop: "0.35rem" };
    const initialValues: UserSignup = {
        name: "",
        password: "",
        role: 0,
        email: "",
    };
    // ----- Styles (unchanged design) -----
    const overlayStyle: CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
    };

    const modalStyle: CSSProperties = {
        width: "90%",
        maxWidth: "450px",
        borderRadius: "24px",
        padding: "3rem 2.5rem",
        position: "relative",
        background: colors.glassBg,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: `1px solid ${colors.glassBorder}`,
        boxShadow: `0 8px 32px ${colors.glassShadow}`,
    };

    const closeStyle: CSSProperties = {
        position: "absolute",
        top: "1.5rem",
        right: "1.5rem",
        background: "transparent",
        border: "none",
        fontSize: "1.5rem",
        color: colors.textSecondary,
        cursor: "pointer",
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s",
    };

    const headerStyle: CSSProperties = {
        textAlign: "center",
        marginBottom: "2rem",
    };

    const titleStyle: CSSProperties = {
        fontFamily: "'Syne', sans-serif",
        fontSize: "2rem",
        fontWeight: 800,
        marginBottom: "0.5rem",
    };

    const subtitleStyle: CSSProperties = {
        color: colors.textSecondary,
        fontSize: "0.95rem",
    };

    const formGroupStyle: CSSProperties = {
        marginBottom: "1.5rem",
    };

    const labelStyle: CSSProperties = {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: 600,
        color: colors.textPrimary,
        fontSize: "0.9rem",
    };

    const inputStyle: CSSProperties = {
        width: "100%",
        padding: "0.875rem 1.25rem",
        borderRadius: "12px",
        border: `2px solid ${colors.glassBorder}`,
        background: colors.glassBg,
        color: colors.textPrimary,
        fontSize: "1rem",
        fontFamily: "'DM Sans', sans-serif",
        transition: "all 0.3s",
        backdropFilter: "blur(10px)",
    };

    const btnFullStyle: CSSProperties = {
        width: "100%",
        padding: "1rem",
        fontSize: "1rem",
        marginTop: "0.5rem",
        borderRadius: "12px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s",
        fontFamily: "'DM Sans', sans-serif",
        background: `linear-gradient(135deg, ${colors.accentPrimary}, ${colors.bgGradientEnd})`,
        color: "white",
        border: "none",
        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
    };

    const dividerStyle: CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        margin: "1.5rem 0",
        color: colors.textTertiary,
        fontSize: "0.85rem",
    };

    const dividerLineStyle: CSSProperties = {
        flex: 1,
        height: "1px",
        background: colors.glassBorder,
    };

    const socialButtonsStyle: CSSProperties = {
        display: "flex",
        gap: "1rem",
    };

    const btnSocialStyle: CSSProperties = {
        flex: 1,
        padding: "0.875rem",
        borderRadius: "12px",
        border: `2px solid ${colors.glassBorder}`,
        background: colors.glassBg,
        color: colors.textPrimary,
        cursor: "pointer",
        transition: "all 0.3s",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    };

    const footerStyle: CSSProperties = {
        textAlign: "center",
        marginTop: "1.5rem",
        color: colors.textSecondary,
        fontSize: "0.9rem",
    };

    const linkStyle: CSSProperties = {
        color: colors.accentPrimary,
        textDecoration: "none",
        fontWeight: 600,
        cursor: "pointer",
    };
    const handleSubmit = async (
        values: UserSignup,
        formikHelpers: FormikHelpers<UserSignup>
    ) => {
        try {
            setLoading(true);
            await UserService.signup({ rq: values }).then(() => {
                onClose();
            }).catch((err: any) => {
                formikHelpers.setFieldError("username", err.result?.erro?.message || "Signup failed (duplicate user)",);
            });
        } catch (err) {
            formikHelpers.setFieldError("password", "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div
            style={overlayStyle}
            onClick={(e) =>
                (e.target as HTMLElement).style.position === "fixed" && onClose()
            }
        >
            <div style={modalStyle}>
                <button style={closeStyle} onClick={onClose}>
                    ×
                </button>

                <div style={headerStyle}>
                    <h2 style={titleStyle}>Create Account</h2>
                    <p style={subtitleStyle}>Join Nexus and start connecting</p>
                </div>

                {/* Formik Form */}
                <Formik
                    initialValues={initialValues}
                    validationSchema={SignUpSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div style={formGroupStyle}>
                                <label style={labelStyle} htmlFor="userName">User Name</label>
                                <Field id="userName" name="userName" type="text" placeholder="Enter your user name" style={inputStyle} />
                                <ErrorMessage name="userName">
                                    {(msg) => <div style={errorStyle}>{msg}</div>}
                                </ErrorMessage>
                            </div>

                            <div style={formGroupStyle}>
                                <label style={labelStyle} htmlFor="password">Password</label>
                                <Field id="password" name="password" type="password" placeholder="Enter your password" style={inputStyle} />
                                <ErrorMessage name="password">
                                    {(msg) => <div style={errorStyle}>{msg}</div>}
                                </ErrorMessage>
                            </div>

                            <button type="submit" style={btnFullStyle} disabled={isSubmitting}>
                                {isSubmitting ? "Signing In..." : "Sign In"}
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
    );
};

export default SignupModal;
