
import './App.css'
import { HomeViewApp } from './Component/Home/HomeView'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ChatProvider } from './Context/ChatContext'
import ChatWindow from './Component/Chat/ChatWindow'
function App() {

  return (
    <>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<HomeViewApp />} path={'/'} />
            <Route element={<ChatWindow />} path={'/chat'} />
          </Routes>
          {/* <HomeViewApp /> */}
        </BrowserRouter>
      </ChatProvider>
    </>
  )
}

export default App
