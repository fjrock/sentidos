import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { senses } from '../data/senses'
import { playClick, speak, stopSpeaking } from '../utils/sounds'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      speak('Bienvenido a Mis 5 Sentidos! Toca un sentido para aprender y jugar. Los sentidos son: La Visión, La Audición, El Olfato, El Gusto y El Tacto.')
    }, 600)
    return () => { clearTimeout(timer); stopSpeaking() }
  }, [])

  const handleSenseClick = (senseId) => {
    stopSpeaking()
    playClick()
    navigate(`/sentido/${senseId}`)
  }

  return (
    <div className="home">
      <div className="home-clouds">
        <span className="cloud cloud-1">☁️</span>
        <span className="cloud cloud-2">☁️</span>
        <span className="cloud cloud-3">☁️</span>
      </div>

      <header className="home-header slide-up">
        <div className="home-title-icon">🧒</div>
        <h1 className="home-title">Mis 5 Sentidos</h1>
        <p className="home-subtitle">Toca un sentido para aprender y jugar</p>
      </header>

      <div className="senses-grid">
        {senses.map((sense, index) => (
          <button
            key={sense.id}
            className="sense-card bounce-in"
            style={{
              background: sense.gradient,
              animationDelay: `${index * 0.1}s`,
            }}
            onClick={() => handleSenseClick(sense.id)}
          >
            <div className="sense-card-icon">{sense.icon}</div>
            <div className="sense-card-name">{sense.name}</div>
            <div className="sense-card-organ">{sense.organ}</div>
            <div className="sense-card-arrow">▶</div>
          </button>
        ))}
      </div>

      <footer className="home-footer">
        <div className="home-footer-icons">
          👁️ 👂 👃 👅 🖐️
        </div>
      </footer>
    </div>
  )
}

export default Home
