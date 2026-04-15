import { Routes, Route } from 'react-router-dom'
import { PlayerProvider } from './context/PlayerContext'
import './App.css'
import Welcome from './pages/Welcome'
import Home from './pages/Home'
import SenseGame from './pages/SenseGame'
import FinalQuiz from './pages/FinalQuiz'
import LearnMode from './pages/LearnMode'

function App() {
  return (
    <PlayerProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/sentido/:senseId" element={<SenseGame />} />
          <Route path="/prueba-final" element={<FinalQuiz />} />
          <Route path="/aprender" element={<LearnMode />} />
        </Routes>
      </div>
    </PlayerProvider>
  )
}

export default App
