import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../context/PlayerContext'
import { speak, stopSpeaking, playClick } from '../utils/sounds'
import './Welcome.css'

function Welcome() {
  const { playerName, saveName } = usePlayer()
  const [name, setName] = useState(playerName)
  const navigate = useNavigate()

  useEffect(() => {
    if (playerName) {
      navigate('/inicio')
      return
    }
    const timer = setTimeout(() => {
      speak('Hola! Bienvenido a Mis 5 Sentidos! Escribe tu nombre para comenzar a jugar.')
    }, 500)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    stopSpeaking()
    playClick()
    saveName(trimmed)
    speak(`Hola ${trimmed}! Vamos a aprender los 5 sentidos juntos!`)
    setTimeout(() => navigate('/inicio'), 2000)
  }

  return (
    <div className="welcome">
      <div className="welcome-stars">
        <span className="wstar w1">⭐</span>
        <span className="wstar w2">✨</span>
        <span className="wstar w3">⭐</span>
        <span className="wstar w4">✨</span>
        <span className="wstar w5">⭐</span>
      </div>

      <div className="welcome-content slide-up">
        <div className="welcome-emoji float">🧒</div>
        <h1 className="welcome-title">Mis 5 Sentidos</h1>
        <p className="welcome-subtitle">Aprende jugando!</p>

        <form className="name-form" onSubmit={handleSubmit}>
          <label className="name-label">Como te llamas?</label>
          <input
            className="name-input"
            type="text"
            placeholder="Escribe tu nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={20}
          />
          <button
            className="name-button pulse"
            type="submit"
            disabled={!name.trim()}
          >
            🚀 Comenzar!
          </button>
        </form>

        <div className="welcome-senses">
          👁️ 👂 👃 👅 🖐️
        </div>
      </div>
    </div>
  )
}

export default Welcome
