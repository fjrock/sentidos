import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { senses } from '../data/senses'
import { playCorrect, playWrong, playCelebration, playClick } from '../utils/sounds'
import './SenseGame.css'

const PHASES = {
  INTRO: 'intro',
  QUIZ: 'quiz',
  RESULT: 'result',
  COMPLETE: 'complete',
}

function SenseGame() {
  const { senseId } = useParams()
  const navigate = useNavigate()
  const sense = senses.find(s => s.id === senseId)

  const [phase, setPhase] = useState(PHASES.INTRO)
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [stars, setStars] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [phase, currentQ])

  if (!sense) {
    navigate('/')
    return null
  }

  const question = sense.questions[currentQ]

  const handleStartQuiz = () => {
    playClick()
    setPhase(PHASES.QUIZ)
  }

  const handleAnswer = (option, index) => {
    if (selected !== null) return

    setSelected(index)
    setIsCorrect(option.correct)

    if (option.correct) {
      playCorrect()
      setScore(s => s + 1)
      setStars(prev => [...prev, currentQ])
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [sense.color, '#ffd700', '#ff6b6b', '#48dbfb'],
      })
    } else {
      playWrong()
    }

    setTimeout(() => {
      if (currentQ < sense.questions.length - 1) {
        setCurrentQ(q => q + 1)
        setSelected(null)
        setIsCorrect(null)
      } else {
        setPhase(PHASES.COMPLETE)
        if (score + (option.correct ? 1 : 0) >= 3) {
          playCelebration()
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 180,
              origin: { y: 0.5 },
              colors: ['#ffd700', '#ff6b6b', '#48dbfb', '#ff9ff3', '#54a0ff'],
            })
          }, 300)
        }
      }
    }, 1500)
  }

  const handleGoHome = () => {
    playClick()
    navigate('/')
  }

  const handlePlayAgain = () => {
    playClick()
    setPhase(PHASES.INTRO)
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setIsCorrect(null)
    setStars([])
  }

  const finalScore = score
  const total = sense.questions.length

  return (
    <div className="sense-game" style={{ background: `linear-gradient(180deg, ${sense.color}dd 0%, ${sense.color}88 50%, #764ba2 100%)` }}>
      {/* Back button */}
      <button className="back-button" onClick={handleGoHome}>
        ←
      </button>

      {/* Stars counter */}
      <div className="stars-counter">
        ⭐ {score}
      </div>

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

          <button
            className="play-button pulse"
            onClick={handleStartQuiz}
            style={{ background: sense.gradient }}
          >
            <span className="play-button-icon">🎮</span>
            <span>A Jugar!</span>
          </button>
        </div>
      )}

      {/* QUIZ PHASE */}
      {phase === PHASES.QUIZ && (
        <div className="quiz-phase slide-up" key={currentQ}>
          {/* Progress */}
          <div className="quiz-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentQ + 1) / total) * 100}%`,
                  background: sense.gradient,
                }}
              />
            </div>
            <div className="progress-text">
              {currentQ + 1} de {total}
            </div>
          </div>

          {/* Question */}
          <div className="question-container">
            <div className="question-icon">{sense.icon}</div>
            <h2 className="question-text">{question.question}</h2>
          </div>

          {/* Options */}
          <div className="options-container">
            {question.options.map((option, index) => {
              let optionClass = 'option-button'
              if (selected !== null) {
                if (option.correct) {
                  optionClass += ' correct'
                } else if (index === selected && !option.correct) {
                  optionClass += ' wrong'
                } else {
                  optionClass += ' dimmed'
                }
              }

              return (
                <button
                  key={index}
                  className={optionClass}
                  onClick={() => handleAnswer(option, index)}
                  disabled={selected !== null}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <span className="option-icon">{option.icon}</span>
                  <span className="option-text">{option.text}</span>
                  {selected !== null && option.correct && (
                    <span className="option-check">✅</span>
                  )}
                  {selected === index && !option.correct && (
                    <span className="option-check">❌</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {selected !== null && (
            <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'} pop-in`}>
              {isCorrect ? (
                <>
                  <span className="feedback-icon">🎉</span>
                  <span>Muy bien!</span>
                </>
              ) : (
                <>
                  <span className="feedback-icon">💪</span>
                  <span>Casi! Sigue intentando!</span>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* COMPLETE PHASE */}
      {phase === PHASES.COMPLETE && (
        <div className="complete-phase slide-up">
          <div className="complete-icon-container">
            {finalScore >= 4 ? (
              <div className="complete-icon">🏆</div>
            ) : finalScore >= 3 ? (
              <div className="complete-icon">⭐</div>
            ) : (
              <div className="complete-icon">💪</div>
            )}
          </div>

          <h1 className="complete-title">
            {finalScore >= 4 ? 'Excelente!' : finalScore >= 3 ? 'Muy bien!' : 'Buen intento!'}
          </h1>

          <div className="complete-score">
            <div className="score-stars">
              {Array.from({ length: total }).map((_, i) => (
                <span key={i} className={`score-star ${i < finalScore ? 'earned' : ''}`}>
                  {i < finalScore ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="score-text">
              {finalScore} de {total} correctas
            </p>
          </div>

          <div className="complete-message">
            {finalScore >= 4 ? (
              <p>Eres un experto en {sense.name.toLowerCase()}! {sense.icon}</p>
            ) : finalScore >= 3 ? (
              <p>Aprendiste mucho sobre {sense.name.toLowerCase()}! {sense.icon}</p>
            ) : (
              <p>Sigue practicando sobre {sense.name.toLowerCase()}! {sense.icon}</p>
            )}
          </div>

          <div className="complete-buttons">
            <button
              className="play-again-button"
              onClick={handlePlayAgain}
              style={{ background: sense.gradient }}
            >
              🔄 Jugar de nuevo
            </button>
            <button
              className="home-button"
              onClick={handleGoHome}
            >
              🏠 Otros sentidos
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SenseGame
