import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { usePlayer } from '../context/PlayerContext'
import { playCorrect, playWrong, playCelebration, playClick, speak, stopSpeaking } from '../utils/sounds'
import './SenseGame.css'

const quizQuestions = [
  {
    question: 'Cuál es el sentido que ocupa la vista?',
    options: [
      { text: 'El Olfato', icon: '👃', correct: false },
      { text: 'La Visión', icon: '👁️', correct: true },
      { text: 'El Tacto', icon: '🖐️', correct: false },
    ]
  },
  {
    question: 'Cuál es el sentido con el que olemos?',
    options: [
      { text: 'La Audición', icon: '👂', correct: false },
      { text: 'El Gusto', icon: '👅', correct: false },
      { text: 'El Olfato', icon: '👃', correct: true },
    ]
  },
  {
    question: 'Cuál es el sentido con el que escuchamos?',
    options: [
      { text: 'La Audición', icon: '👂', correct: true },
      { text: 'La Visión', icon: '👁️', correct: false },
      { text: 'El Gusto', icon: '👅', correct: false },
    ]
  },
  {
    question: 'Cuál es el sentido con el que tocamos las cosas?',
    options: [
      { text: 'El Olfato', icon: '👃', correct: false },
      { text: 'El Tacto', icon: '🖐️', correct: true },
      { text: 'La Audición', icon: '👂', correct: false },
    ]
  },
  {
    question: 'Cuál es el sentido con el que sentimos la comida?',
    options: [
      { text: 'El Tacto', icon: '🖐️', correct: false },
      { text: 'La Visión', icon: '👁️', correct: false },
      { text: 'El Gusto', icon: '👅', correct: true },
    ]
  },
  {
    question: 'Qué es lo que tenemos en la lengua?',
    options: [
      { text: 'Las papilas gustativas', icon: '👅', correct: true },
      { text: 'Los oídos', icon: '👂', correct: false },
      { text: 'Las pestañas', icon: '👁️', correct: false },
    ]
  },
]

function FinalQuiz() {
  const navigate = useNavigate()
  const { playerName } = usePlayer()

  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [phase, setPhase] = useState('intro') // intro, quiz, complete

  const total = quizQuestions.length
  const question = quizQuestions[currentQ]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [phase, currentQ])

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => {
        speak(`${playerName}, esta es la prueba final! Vamos a ver cuánto aprendiste sobre los 5 sentidos. Hay ${total} preguntas. Estás listo?`)
      }, 500)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'quiz') {
      const timer = setTimeout(() => {
        const q = quizQuestions[currentQ]
        const optionsText = q.options.map((o, i) => `${i + 1}, ${o.text}`).join('. ')
        speak(`Pregunta ${currentQ + 1}. ${q.question} Las opciones son: ${optionsText}`)
      }, 400)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase, currentQ])

  useEffect(() => {
    if (phase === 'complete') {
      const timer = setTimeout(() => {
        if (score === total) {
          speak(`Perfecto ${playerName}! Sacaste ${score} de ${total}! Respondiste todas correctamente! Eres un experto en los 5 sentidos!`)
        } else if (score >= 4) {
          speak(`Excelente ${playerName}! Sacaste ${score} de ${total}! Aprendiste muy bien los 5 sentidos!`)
        } else {
          speak(`Buen intento ${playerName}! Sacaste ${score} de ${total}. Sigue practicando los sentidos!`)
        }
      }, 500)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase, score])

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  const handleStart = () => {
    stopSpeaking()
    playClick()
    setPhase('quiz')
  }

  const replayQuestionAudio = () => {
    const q = quizQuestions[currentQ]
    const optionsText = q.options.map((o, i) => `${i + 1}, ${o.text}`).join('. ')
    speak(`${q.question} Las opciones son: ${optionsText}`)
  }

  const handleAnswer = (option, index) => {
    if (selected !== null) return
    stopSpeaking()
    setSelected(index)
    setIsCorrect(option.correct)

    if (option.correct) {
      playCorrect()
      setScore(s => s + 1)
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: ['#ffd700', '#ff6b6b', '#48dbfb', '#54a0ff'] })
      setTimeout(() => speak(`Correcto ${playerName}! Muy bien!`), 300)
    } else {
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
        const finalScore = score + (option.correct ? 1 : 0)
        setScore(finalScore)
        setPhase('complete')
        if (finalScore >= 4) {
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
    setPhase('intro')
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setIsCorrect(null)
  }

  return (
    <div className="sense-game" style={{ background: 'linear-gradient(180deg, #f59e0bdd 0%, #f59e0b88 50%, #764ba2 100%)' }}>
      <button className="back-button" onClick={handleGoHome}>←</button>
      <div className="stars-counter">⭐ {score}</div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div className="intro-phase slide-up">
          <div className="intro-icon-container">
            <div className="intro-icon float">🏆</div>
            <div className="intro-sparkles">
              <span className="sparkle s1">✨</span>
              <span className="sparkle s2">✨</span>
              <span className="sparkle s3">✨</span>
            </div>
          </div>

          <h1 className="intro-title">Prueba Final</h1>
          <p className="intro-organ">🧠 Los 5 Sentidos</p>

          <div className="intro-card">
            <p className="intro-description">Vamos a ver cuánto aprendiste sobre los 5 sentidos, {playerName}! Responde las {total} preguntas.</p>
          </div>

          <div className="intro-funfact">
            <span className="funfact-icon">💡</span>
            <p>Esta prueba mezcla preguntas de todos los sentidos. Demuestra lo que sabes!</p>
          </div>

          <button className="play-button pulse" onClick={handleStart} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <span className="play-button-icon">📝</span>
            <span>Comenzar Prueba!</span>
          </button>
        </div>
      )}

      {/* QUIZ */}
      {phase === 'quiz' && (
        <div className="quiz-phase slide-up" key={currentQ}>
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQ + 1) / total) * 100}%`, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} />
            </div>
            <div className="progress-text">{currentQ + 1} de {total}</div>
          </div>

          <div className="question-container">
            <div className="question-icon">🧠</div>
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
                <><span className="feedback-icon">🎉</span><span>Correcto {playerName}!</span></>
              ) : (
                <><span className="feedback-icon">💪</span><span>Casi {playerName}!</span></>
              )}
            </div>
          )}
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div className="complete-phase slide-up">
          <div className="complete-icon-container">
            {score === total ? <div className="complete-icon">🏆</div>
              : score >= 4 ? <div className="complete-icon">🌟</div>
              : <div className="complete-icon">💪</div>}
          </div>

          <h1 className="complete-title">
            {score === total ? `Perfecto ${playerName}!`
              : score >= 4 ? `Excelente ${playerName}!`
              : `Buen intento ${playerName}!`}
          </h1>

          <div className="complete-score">
            <div className="score-big">{score}/{total}</div>
            <div className="score-stars">
              {[...Array(total)].map((_, i) => (
                <span key={i} className={`score-star ${i < score ? 'earned' : ''}`}>
                  {i < score ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="score-text">{score} de {total} correctas</p>
          </div>

          <div className="complete-message">
            {score === total ? <p>{playerName}, eres un experto en los 5 sentidos! 🧠</p>
              : score >= 4 ? <p>{playerName}, aprendiste muy bien los 5 sentidos! 🧠</p>
              : <p>{playerName}, sigue practicando los sentidos! 🧠</p>}
          </div>

          <div className="complete-buttons">
            <button className="play-again-button" onClick={handlePlayAgain} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>🔄 Intentar de nuevo</button>
            <button className="home-button" onClick={handleGoHome}>🏠 Volver al inicio</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FinalQuiz
