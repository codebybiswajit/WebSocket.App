import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { HomeViewApp } from "./Component/Home/HomeView";
import UserService from "./Services/UserService";
import { Theme } from "./Types/CommonTypes";
import NotFound from "./Utils/NotFound";
import ThemeConfig from "./Utils/ThemeConfig";
import MobileChatWindowPreview from "./Component/Chat/MobileChatWindow";
import ChatWindowPreview from "./Component/Chat/ChatWindow";
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const [theme, setTheme] = useState<Theme>(() => {
    return (
      (localStorage.getItem("theme") as Theme) ||
      (sessionStorage.getItem("theme") as Theme) ||
      Theme.Dark
    );
  });
  const [tokens, setTokens] = useState<string>(() => {
    return (
      (localStorage.getItem("token") ?? sessionStorage.getItem("token")) || ""
    );
  });
  const setUserid =
    sessionStorage.getItem("userId") ?? localStorage.getItem("userId") ?? "";
  useEffect(() => {
    UserService.getSession(setUserid ?? "")
      .then((res) => {
        if (res.status === 200 && res?.data?.result?.id !== null) {
          localStorage.setItem("token", res.data.tokens);
          sessionStorage.setItem("token", res.data.tokens);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      })
      .catch((err) => {
        setLoggedIn(false);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("userId");
        }
      });
  }, [setUserid]);
  useEffect(() => {
    setTokens(
      sessionStorage.getItem("token") ?? localStorage.getItem("token") ?? "",
    );
    const tempSetUserid =
      sessionStorage.getItem("userId") ?? localStorage.getItem("userId") ?? "";
    setLoggedIn(
      tokens != undefined &&
        tokens !== null &&
        tokens !== "" &&
        tempSetUserid != undefined &&
        tempSetUserid !== null &&
        tempSetUserid !== "",
    );
  }, [loggedIn]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const colors = ThemeConfig[theme];
  return (
    <>
      <BrowserRouter>
        <Routes>
          {!loggedIn && (
            <>
              <Route
                path="/"
                element={
                  <HomeViewApp
                    setLoggedIn={setLoggedIn}
                    setTheme={setTheme}
                    theme={theme}
                    showLoginModal={showLoginModal}
                    setShowLoginModal={setShowLoginModal}
                    showSignupModal={showSignupModal}
                    setShowSignupModal={setShowSignupModal}
                  />
                }
              />
              <Route path="/chat" element={<Navigate to="/" replace />} />
            </>
          )}
          {loggedIn && isMobile && (
            <>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route
                path="/chat"
                element={
                  <MobileChatWindowPreview
                    color={colors}
                    setTheme={setTheme}
                    theme={theme}
                    tokens={tokens}
                  />
                }
              />
              {/* <Route path="/chat" element={<NotFoundThreeJS />} /> */}
            </>
          )}
          {loggedIn && !isMobile && (
            <>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route
                path="/chat"
                element={
                  <ChatWindowPreview
                    color={colors}
                    setTheme={setTheme}
                    theme={theme}
                    tokens={tokens}
                  />
                }
              />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {!isMobile && (
        <div
          style={{
            textAlign: "center",
            padding: "10px",
            fontSize: "14px",
            background: ThemeConfig[theme].bgPrimary,
            color: ThemeConfig[theme].textPrimary,
          }}
        >
          © 2026{" "}
          <a href="https://websocket-app-codebybiswajit.onrender.com">
            websocket-app-codebybiswajit.onrender.com
          </a>{" "}
          — All rights reserved. || All trademarks and copyrights belong to
          Biswajit Mohapatra.
        </div>
      )}
    </>
  );
};

export default App;
