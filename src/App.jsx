import { Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import SenseGame from './pages/SenseGame'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sentido/:senseId" element={<SenseGame />} />
      </Routes>
    </div>
  )
}

export default App
