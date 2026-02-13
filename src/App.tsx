
import './App.css'
import { HomeViewApp } from './Component/Home/HomeView'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<HomeViewApp />} path={'/'} />
        </Routes>
        {/* <HomeViewApp /> */}
      </BrowserRouter>
    </>
  )
}

export default App
