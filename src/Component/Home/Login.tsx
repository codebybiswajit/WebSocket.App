import { type CSSProperties, type MouseEvent } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import * as Yup from "yup";
import type { LoginModalProps } from "../../Types/CommonTypes";
import type ThemeConfig from "../../Utils/ThemeConfig";
import UserService from "../../Services/UserService";

type Props = LoginModalProps & { colors: typeof ThemeConfig.light };

const LoginSchema = Yup.object().shape({
    userName: Yup.string().trim().required("User name is required"),
    password: Yup.string().required("Password is required"),
});

const LoginModal = ({ onClose, onSwitchToSignup, setLoading, colors }: Props) => {
    const overlayStyle: CSSProperties = {
        position: "fixed",
        inset: 0,
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

    const headerStyle: CSSProperties = { textAlign: "center", marginBottom: "2rem" };
    const titleStyle: CSSProperties = { fontFamily: "'Syne', sans-serif", fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" };
    const subtitleStyle: CSSProperties = { color: colors.textSecondary, fontSize: "0.95rem" };
    const formGroupStyle: CSSProperties = { marginBottom: "1.5rem" };
    const labelStyle: CSSProperties = { display: "block", marginBottom: "0.5rem", fontWeight: 600, color: colors.textPrimary, fontSize: "0.9rem" };
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
    const errorStyle: CSSProperties = { color: "#ff6b6b", fontSize: "0.85rem", marginTop: "0.35rem" };
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
    const footerStyle: CSSProperties = { textAlign: "center", marginTop: "1.5rem", color: colors.textSecondary, fontSize: "0.9rem" };
    const linkStyle: CSSProperties = { color: colors.accentPrimary, textDecoration: "none", fontWeight: 600, cursor: "pointer" };

    // Prevent closing when clicking inside the modal
    const stopPropagation = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

    const handleSubmit = async (
        values: { userName: string; password: string },
        formikHelpers: FormikHelpers<{ userName: string; password: string }>
    ) => {
        try {
            setLoading(true);               // show global loading (before closing)
            await UserService.login(values.userName.trim(), values.password);
            onClose();                      // close modal on success
        } catch (err) {
            // Show a friendly error; replace with toast if you use one
            alert("Login failed! Please check your credentials.");
            // Optionally set Formik errors:
            formikHelpers.setFieldError("password", "Invalid credentials");
        } finally {
            setLoading(false);              // stop loading (or keep true if navigation happens elsewhere)
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={stopPropagation}>
                <button style={closeStyle} onClick={onClose} aria-label="Close login modal">×</button>

                <div style={headerStyle}>
                    <h2 style={titleStyle}>Welcome Back</h2>
                    <p style={subtitleStyle}>Sign in to continue to Nexus</p>
                </div>

                <Formik
                    initialValues={{ userName: "", password: "" }}
                    validationSchema={LoginSchema}
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

                <div style={footerStyle}>
                    Don&apos;t have an account?{" "}
                    <a style={linkStyle} onClick={onSwitchToSignup}>Sign up</a>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;