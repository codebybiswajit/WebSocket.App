import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import NotFound from './Utils/NotFound';
import { ChatProvider } from './Context/ChatContext';
import { HomeViewApp } from './Component/Home/HomeView';
import ChatWindow from './Component/Chat/ChatWindow';
import { useEffect, useState } from 'react';
import './App.css';
const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const setToken = sessionStorage.getItem('token') ?? localStorage.getItem('token');
    const setUserid = sessionStorage.getItem('userId') ?? localStorage.getItem('userId');
    setLoggedIn((setToken != undefined && setToken !== null) && (setUserid != undefined && setUserid !== null));
  }, []);

  return (
    <ChatProvider>
      <BrowserRouter>
        <Routes>
          {!loggedIn && (
            <>
              <Route path="/" element={<HomeViewApp setLoggedIn={setLoggedIn} loggedIn={loggedIn} />} />
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