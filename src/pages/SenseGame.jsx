import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { senses } from '../data/senses'
import { usePlayer } from '../context/PlayerContext'
import { playCorrect, playWrong, playCelebration, playClick, speak, stopSpeaking } from '../utils/sounds'
import './SenseGame.css'

const PHASES = {
  INTRO: 'intro',
  QUIZ: 'quiz',
  COMPLETE: 'complete',
}

function SenseGame() {
  const { senseId } = useParams()
  const navigate = useNavigate()
  const { playerName } = usePlayer()
  const sense = senses.find(s => s.id === senseId)

  const [phase, setPhase] = useState(PHASES.INTRO)
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [phase, currentQ])

  // Speak intro
  useEffect(() => {
    if (phase === PHASES.INTRO && sense) {
      const timer = setTimeout(() => {
        speak(`${playerName}, vamos a aprender sobre ${sense.name}! ${sense.organ}. ${sense.description} ${sense.funFact}`)
      }, 500)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase, sense])

  // Speak question
  useEffect(() => {
    if (phase === PHASES.QUIZ && sense) {
      const q = sense.questions[currentQ]
      const timer = setTimeout(() => {
        const optionsText = q.options.map((o, i) => `${i + 1}, ${o.text}`).join('. ')
        speak(`Pregunta ${currentQ + 1}. ${q.question} Las opciones son: ${optionsText}`)
      }, 400)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase, currentQ, sense])

  // Speak completion
  useEffect(() => {
    if (phase === PHASES.COMPLETE && sense) {
      const total = sense.questions.length
      const timer = setTimeout(() => {
        if (score >= 18) {
          speak(`Increíble ${playerName}! Sacaste ${score} de ${total}! Eres un genio de ${sense.name}!`)
        } else if (score >= 14) {
          speak(`Excelente ${playerName}! Sacaste ${score} de ${total}! Aprendiste muchísimo sobre ${sense.name}!`)
        } else if (score >= 10) {
          speak(`Muy bien ${playerName}! Sacaste ${score} de ${total}! Vas muy bien con ${sense.name}!`)
        } else {
          speak(`Buen intento ${playerName}! Sacaste ${score} de ${total}. Sigue practicando ${sense.name}!`)
        }
      }, 500)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase, sense, score])

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  if (!sense) {
    navigate('/inicio')
    return null
  }

  const question = sense.questions[currentQ]
  const total = sense.questions.length

  const handleStartQuiz = () => {
    stopSpeaking()
    playClick()
    setPhase(PHASES.QUIZ)
  }

  const replayIntroAudio = () => {
    speak(`${playerName}, vamos a aprender sobre ${sense.name}! ${sense.organ}. ${sense.description} ${sense.funFact}`)
  }

  const replayQuestionAudio = () => {
    const q = sense.questions[currentQ]
    const optionsText = q.options.map((o, i) => `${i + 1}, ${o.text}`).join('. ')
    speak(`${q.question} Las opciones son: ${optionsText}`)
  }

  const handleAnswer = (option, index) => {
    if (selected !== null) return

    stopSpeaking()
    setSelected(index)
    setIsCorrect(option.correct)

    if (option.correct) {
      const newStreak = streak + 1
      setStreak(newStreak)
      playCorrect()
      setScore(s => s + 1)
      confetti({
        particleCount: 40,
        spread: 55,
        origin: { y: 0.7 },
        colors: [sense.color, '#ffd700', '#ff6b6b', '#48dbfb'],
      })

      // Personalized encouragement messages
      const cheers = [
        `Muy bien ${playerName}!`,
        `Excelente ${playerName}!`,
        `Genial ${playerName}! Correcto!`,
        `Bravo ${playerName}!`,
        `Así se hace ${playerName}!`,
        `Increíble ${playerName}!`,
        `Fantástico ${playerName}!`,
        `Eres muy inteligente ${playerName}!`,
      ]

      let msg = cheers[Math.floor(Math.random() * cheers.length)]

      // Streak bonuses
      if (newStreak === 3) {
        msg = `${playerName} llevas 3 seguidas! Eres genial!`
        confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } })
      } else if (newStreak === 5) {
        msg = `Wow ${playerName}! 5 seguidas! Eres un campeón!`
        confetti({ particleCount: 120, spread: 140, origin: { y: 0.5 } })
      } else if (newStreak === 10) {
        msg = `Impresionante ${playerName}! 10 seguidas! Eres un súper genio!`
        confetti({ particleCount: 200, spread: 180, origin: { y: 0.5 }, colors: ['#ffd700', '#ff6b6b', '#48dbfb', '#ff9ff3', '#54a0ff'] })
      }

      setTimeout(() => speak(msg), 300)
    } else {
      setStreak(0)
      playWrong()
      const correctAnswer = question.options.find(o => o.correct)?.text
      setTimeout(() => speak(`Casi ${playerName}! La respuesta correcta es: ${correctAnswer}`), 300)
    }

    setTimeout(() => {
      if (currentQ < total - 1) {
        setCurrentQ(q => q + 1)
        setSelected(null)
        setIsCorrect(null)
      } else {
        setPhase(PHASES.COMPLETE)
        const finalScore = score + (option.correct ? 1 : 0)
        if (finalScore >= 14) {
          playCelebration()
          setTimeout(() => {
            confetti({ particleCount: 200, spread: 180, origin: { y: 0.5 }, colors: ['#ffd700', '#ff6b6b', '#48dbfb', '#ff9ff3', '#54a0ff'] })
          }, 300)
        }
      }
    }, 2500)
  }

  const handleGoHome = () => {
    stopSpeaking()
    playClick()
    navigate('/inicio')
  }

  const handlePlayAgain = () => {
    stopSpeaking()
    playClick()
    setPhase(PHASES.INTRO)
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setIsCorrect(null)
    setStreak(0)
  }

  return (
    <div className="sense-game" style={{ background: `linear-gradient(180deg, ${sense.color}dd 0%, ${sense.color}88 50%, #764ba2 100%)` }}>
      <button className="back-button" onClick={handleGoHome}>←</button>
      <div className="stars-counter">⭐ {score}</div>

      {/* INTRO PHASE */}
      {phase === PHASES.INTRO && (
        <div className="intro-phase slide-up">
          <div className="intro-icon-container">
            <div className="intro-icon float">{sense.icon}</div>
            <div className="intro-sparkles">
              <span className="sparkle s1">✨</span>
              <span className="sparkle s2">✨</span>
              <span className="sparkle s3">✨</span>
            </div>
          </div>

          <h1 className="intro-title">{sense.name}</h1>
          <p className="intro-organ">{sense.organIcon} {sense.organ}</p>

          <div className="intro-card">
            <p className="intro-description">{sense.description}</p>
          </div>

          <div className="intro-funfact">
            <span className="funfact-icon">💡</span>
            <p>{sense.funFact}</p>
          </div>

          <button className="speaker-button" onClick={replayIntroAudio}>🔊 Escuchar</button>

          <button className="play-button pulse" onClick={handleStartQuiz} style={{ background: sense.gradient }}>
            <span className="play-button-icon">🎮</span>
            <span>A Jugar {playerName}!</span>
          </button>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase === PHASES.QUIZ && (
        <div className="quiz-phase slide-up" key={currentQ}>
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQ + 1) / total) * 100}%`, background: sense.gradient }} />
            </div>
            <div className="progress-text">{currentQ + 1} de {total}</div>
          </div>

          <div className="question-container">
            <div className="question-icon">{sense.icon}</div>
            <h2 className="question-text">{question.question}</h2>
            <button className="speaker-button-small" onClick={replayQuestionAudio}>🔊</button>
          </div>

          <div className="options-container">
            {question.options.map((option, index) => {
              let optionClass = 'option-button'
              if (selected !== null) {
                if (option.correct) optionClass += ' correct'
                else if (index === selected && !option.correct) optionClass += ' wrong'
                else optionClass += ' dimmed'
              }
              return (
                <button key={index} className={optionClass} onClick={() => handleAnswer(option, index)} disabled={selected !== null} style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-text">{option.text}</span>
                  {selected !== null && option.correct && <span className="option-check">✅</span>}
                  {selected === index && !option.correct && <span className="option-check">❌</span>}
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'} pop-in`}>
              {isCorrect ? (
                <><span className="feedback-icon">🎉</span><span>Muy bien {playerName}!</span></>
              ) : (
                <><span className="feedback-icon">💪</span><span>Casi {playerName}! Sigue!</span></>
              )}
            </div>
          )}
        </div>
      )}

      {/* COMPLETE PHASE */}
      {phase === PHASES.COMPLETE && (
        <div className="complete-phase slide-up">
          <div className="complete-icon-container">
            {score >= 18 ? <div className="complete-icon">🏆</div>
              : score >= 14 ? <div className="complete-icon">🌟</div>
              : score >= 10 ? <div className="complete-icon">⭐</div>
              : <div className="complete-icon">💪</div>}
          </div>

          <h1 className="complete-title">
            {score >= 18 ? `Increíble ${playerName}!`
              : score >= 14 ? `Excelente ${playerName}!`
              : score >= 10 ? `Muy bien ${playerName}!`
              : `Buen intento ${playerName}!`}
          </h1>

          <div className="complete-score">
            <div className="score-big">{score}/{total}</div>
            <div className="score-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`score-star ${i < Math.ceil(score / 4) ? 'earned' : ''}`}>
                  {i < Math.ceil(score / 4) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="score-text">{score} de {total} correctas</p>
          </div>

          <div className="complete-message">
            {score >= 18 ? <p>{playerName}, eres un genio de {sense.name.toLowerCase()}! {sense.icon}</p>
              : score >= 14 ? <p>{playerName}, aprendiste muchísimo sobre {sense.name.toLowerCase()}! {sense.icon}</p>
              : score >= 10 ? <p>{playerName}, vas muy bien con {sense.name.toLowerCase()}! {sense.icon}</p>
              : <p>{playerName}, sigue practicando {sense.name.toLowerCase()}! {sense.icon}</p>}
          </div>

          <div className="complete-buttons">
            <button className="play-again-button" onClick={handlePlayAgain} style={{ background: sense.gradient }}>🔄 Jugar de nuevo</button>
            <button className="home-button" onClick={handleGoHome}>🏠 Otros sentidos</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SenseGame
