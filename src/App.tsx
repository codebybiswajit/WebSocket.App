import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ChatWindow from './Component/Chat/ChatWindow';
import { HomeViewApp } from './Component/Home/HomeView';
import { ChatProvider } from './Context/ChatContext';
import UserService from './Services/UserService';
import NotFound from './Utils/NotFound';
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const setUserid = sessionStorage.getItem('userId') ?? localStorage.getItem('userId');
  useEffect(() => {
    UserService.getSession(setUserid ?? "").then(res => {
      debugger;
      if (res.status === 200 && res?.data?.result?.id !== null) {
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
    const setToken = sessionStorage.getItem('token') ?? localStorage.getItem('token');
    const tempSetUserid = sessionStorage.getItem('userId') ?? localStorage.getItem('userId');
    setLoggedIn((setToken != undefined && setToken !== null) && (tempSetUserid != undefined && tempSetUserid !== null));
  }, []);
  console.log('User is logged in with userId:', loggedIn);
  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          {!loggedIn && (
            <>
              <Route path="/" element={<HomeViewApp setLoggedIn={setLoggedIn} />} />
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
  );
};

export default App;