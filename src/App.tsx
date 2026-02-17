import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ChatWindow from './Component/Chat/ChatWindow';
import { HomeViewApp } from './Component/Home/HomeView';
import { ChatProvider } from './Context/ChatContext';
import UserService from './Services/UserService';
import NotFound from './Utils/NotFound';
import ThemeConfig from './Utils/ThemeConfig';
import { Theme } from './Types/CommonTypes';
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.Light);
  const setUserid = JSON.parse(sessionStorage.getItem('userId') ?? localStorage.getItem('userId') ?? 'null');
  useEffect(() => {
    UserService.getSession(setUserid ?? "").then(res => {
      if (res.status === 200 && res?.data?.result?.id !== null) {
        localStorage.setItem("tokens", res.data.tokens);
        sessionStorage.setItem("tokens", res.data.tokens);
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }).catch(err => {
      setLoggedIn(false);
      console.error('Session check error:', err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
      }
    });
  }, []);
  useEffect(() => {
    const setToken = JSON.parse(sessionStorage.getItem('token') ?? localStorage.getItem('token') ?? 'null');
    const tempSetUserid = JSON.parse(sessionStorage.getItem('userId') ?? localStorage.getItem('userId') ?? 'null');
    setLoggedIn((setToken != undefined && setToken !== null) && (tempSetUserid != undefined && tempSetUserid !== null));
  }, []);
  return (
    <>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            {!loggedIn && (
              <>
                <Route path="/" element={<HomeViewApp setLoggedIn={setLoggedIn} setTheme={setTheme} theme={theme} />} />
                <Route path="/chat" element={<Navigate to="/" replace />} />
              </>
            )}
            {loggedIn && (
              <>
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="/chat" element={<ChatWindow />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
      <div style={{ textAlign: "center", padding: "10px", fontSize: "14px", background: ThemeConfig[theme].bgPrimary, color: ThemeConfig[theme].textPrimary }}>
        © 2026 <a href="https://websocket-app-codebybiswajit.onrender.com">websocket-app-codebybiswajit.onrender.com</a> — All rights reserved. || All trademarks and copyrights belong to Biswajit Mohapatra.
      </div>
    </>

  );
};

export default App;