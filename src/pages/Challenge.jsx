import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { usePlayer } from '../context/PlayerContext'
import { playCorrect, playWrong, playClick, playCelebration, speak, stopSpeaking } from '../utils/sounds'
import './SenseGame.css'

const allSenses = [
  { sense: 'La Visión', organ: 'Los Ojos', icon: '👁️', organIcon: '👀', bodyPart: 'ojos', color: '#3b82f6', verb: 'VER' },
  { sense: 'La Audición', organ: 'Los Oídos', icon: '👂', organIcon: '👂', bodyPart: 'oídos', color: '#10b981', verb: 'OÍR' },
  { sense: 'El Olfato', organ: 'La Nariz', icon: '👃', organIcon: '👃', bodyPart: 'nariz', color: '#f97316', verb: 'OLER' },
  { sense: 'El Gusto', organ: 'La Lengua', icon: '👅', organIcon: '👅', bodyPart: 'lengua', color: '#ef4444', verb: 'GUSTAR' },
  { sense: 'El Tacto', organ: 'La Piel y las Manos', icon: '🖐️', organIcon: '✋', bodyPart: 'manos y piel', color: '#8b5cf6', verb: 'TOCAR' },
]

// Level 1: Show the VERB as hint → pick sense name
// Level 2: Show the verb → pick organ (no sense name shown)
// Level 3: Only audio, no hints at all → pick sense name

function generateQuestions(level) {
  const questions = []

  if (level === 1) {
    // Show VERB → pick sense name (verb is the bridge hint)
    const shuffled = [...allSenses].sort(() => Math.random() - 0.5)
    shuffled.forEach(s => {
      const others = allSenses.filter(x => x.sense !== s.sense).sort(() => Math.random() - 0.5).slice(0, 2)
      const options = [s, ...others].sort(() => Math.random() - 0.5)
      questions.push({
        type: 'verb_to_sense',
        prompt: `${s.verb}... Cómo se llama ese sentido?`,
        audioPrompt: `Si la acción es ${s.verb}... Cómo se llama el sentido de ${s.verb}? Recuerda el truco!`,
        showIcon: '🔑',
        showText: s.verb,
        answer: s.sense,
        verbHint: s.verb,
        options: options.map(o => ({ text: o.sense, correct: o.sense === s.sense })),
      })
    })
  } else if (level === 2) {
    // Show verb → pick the organ
    const shuffled = [...allSenses].sort(() => Math.random() - 0.5)
    shuffled.forEach(s => {
      const others = allSenses.filter(x => x.sense !== s.sense).sort(() => Math.random() - 0.5).slice(0, 2)
      const options = [s, ...others].sort(() => Math.random() - 0.5)
      questions.push({
        type: 'verb_to_organ',
        prompt: `${s.verb}... Qué parte del cuerpo usamos?`,
        audioPrompt: `Si la acción es ${s.verb}... Con qué parte del cuerpo lo hacemos? Piensa bien!`,
        showIcon: '🔑',
        showText: s.verb,
        answer: s.organ,
        verbHint: s.verb,
        options: options.map(o => ({ text: o.organ, correct: o.organ === s.organ })),
      })
    })
  } else if (level === 3) {
    // No hints at all - pure recall, mixed questions
    const shuffled = [...allSenses].sort(() => Math.random() - 0.5)
    shuffled.forEach(s => {
      const others = allSenses.filter(x => x.sense !== s.sense).sort(() => Math.random() - 0.5).slice(0, 2)
      const options = [s, ...others].sort(() => Math.random() - 0.5)
      questions.push({
        type: 'pure_recall',
        prompt: `Con los ${s.bodyPart}... Cuál es el sentido?`,
        audioPrompt: `Usando los ${s.bodyPart}, cuál es el sentido? Sin pistas! Tú lo sabes!`,
        showIcon: '🧠',
        showText: '',
        answer: s.sense,
        options: options.map(o => ({ text: o.sense, correct: o.sense === s.sense })),
      })
    })
  }

  return questions
}

function Challenge() {
  const navigate = useNavigate()
  const { playerName } = usePlayer()

  const [level, setLevel] = useState(null) // null = select level
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [phase, setPhase] = useState('select') // select, quiz, complete

  const total = questions.length

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [phase, currentQ])

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  useEffect(() => {
    if (phase === 'select') {
      const timer = setTimeout(() => {
        speak(`${playerName}, este es el desafío! Recuerda los trucos: VER es la Visión, OÍR es la Audición, OLER es el Olfato, GUSTAR es el Gusto, y TOCAR es el Tacto! Elige un nivel!`)
      }, 500)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'quiz' && questions.length > 0) {
      const q = questions[currentQ]
      const timer = setTimeout(() => {
        speak(q.audioPrompt)
      }, 400)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase, currentQ, questions])

  useEffect(() => {
    if (phase === 'complete') {
      const timer = setTimeout(() => {
        if (score === total) {
          speak(`Perfecto ${playerName}! ${score} de ${total}! Lo recordaste todo sin pistas! Eres un campeón de los sentidos!`)
          playCelebration()
          confetti({ particleCount: 200, spread: 180, origin: { y: 0.5 } })
        } else if (score >= 3) {
          speak(`Muy bien ${playerName}! ${score} de ${total}! Casi lo tienes todo! Sigue practicando!`)
          confetti({ particleCount: 80, spread: 100, origin: { y: 0.6 } })
        } else {
          speak(`Buen intento ${playerName}! ${score} de ${total}. Ve al modo Aprende para repasar y vuelve a intentarlo!`)
        }
      }, 500)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [phase, score])

  const handleSelectLevel = (lvl) => {
    stopSpeaking()
    playClick()
    setLevel(lvl)
    setQuestions(generateQuestions(lvl))
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setPhase('quiz')
  }

  const handleAnswer = (option, index) => {
    if (selected !== null) return
    stopSpeaking()
    setSelected(index)

    if (option.correct) {
      playCorrect()
      setScore(s => s + 1)
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } })
      const q = questions[currentQ]
      if (q.verbHint) {
        speak(`Correcto ${playerName}! ${q.verbHint} es ${q.answer}! Lo recordaste!`)
      } else {
        speak(`Correcto ${playerName}! Lo recordaste!`)
      }
    } else {
      playWrong()
      const q = questions[currentQ]
      const senseData = allSenses.find(s => s.sense === q.answer || s.organ === q.answer)
      if (senseData) {
        speak(`No ${playerName}. Recuerda: ${senseData.verb} es ${senseData.sense} y usa ${senseData.organ}. ${senseData.verb}... ${senseData.sense}!`)
      } else {
        speak(`No ${playerName}, la respuesta es ${q.answer}. Recuérdalo!`)
      }
    }

    setTimeout(() => {
      if (currentQ < total - 1) {
        setCurrentQ(q => q + 1)
        setSelected(null)
      } else {
        setPhase('complete')
      }
    }, 2500)
  }

  const handleGoHome = () => {
    stopSpeaking()
    playClick()
    navigate('/inicio')
  }

  const handleRetry = () => {
    stopSpeaking()
    playClick()
    setPhase('select')
    setSelected(null)
  }

  const levelNames = { 1: 'Fácil', 2: 'Difícil', 3: 'Experto' }
  const question = questions[currentQ]

  return (
    <div className="sense-game" style={{ background: 'linear-gradient(180deg, #e11d48dd 0%, #e11d4888 50%, #764ba2 100%)' }}>
      <button className="back-button" onClick={handleGoHome}>←</button>
      {phase === 'quiz' && <div className="stars-counter">⭐ {score}</div>}

      {/* SELECT LEVEL */}
      {phase === 'select' && (
        <div className="intro-phase slide-up">
          <div className="intro-icon-container">
            <div className="intro-icon float">🧠</div>
          </div>
          <h1 className="intro-title">Desafío</h1>
          <p className="intro-organ">Usa los trucos para recordar!</p>

          <div className="intro-card">
            <p className="intro-description">{playerName}, recuerda: cada sentido viene de un verbo que ya conoces. VER, OÍR, OLER, GUSTAR, TOCAR!</p>
          </div>

          <div className="challenge-levels">
            <button className="challenge-level-btn" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }} onClick={() => handleSelectLevel(1)}>
              <span className="challenge-level-icon">⭐</span>
              <div>
                <div className="challenge-level-name">Fácil</div>
                <div className="challenge-level-desc">Te digo el verbo, dices el sentido</div>
              </div>
            </button>

            <button className="challenge-level-btn" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} onClick={() => handleSelectLevel(2)}>
              <span className="challenge-level-icon">⭐⭐</span>
              <div>
                <div className="challenge-level-name">Difícil</div>
                <div className="challenge-level-desc">Te digo el verbo, dices el órgano</div>
              </div>
            </button>

            <button className="challenge-level-btn" style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)' }} onClick={() => handleSelectLevel(3)}>
              <span className="challenge-level-icon">⭐⭐⭐</span>
              <div>
                <div className="challenge-level-name">Experto</div>
                <div className="challenge-level-desc">Sin pistas! Solo tu memoria</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* QUIZ */}
      {phase === 'quiz' && question && (
        <div className="quiz-phase slide-up" key={currentQ}>
          <div className="quiz-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((currentQ + 1) / total) * 100}%`, background: 'linear-gradient(135deg, #e11d48, #be123c)' }} />
            </div>
            <div className="progress-text">
              {levelNames[level]} - {currentQ + 1} de {total}
            </div>
          </div>

          <div className="question-container">
            {question.verbHint ? (
              <>
                <div className="question-icon" style={{ fontSize: '50px' }}>🔑</div>
                <div className="challenge-verb-hint">{question.verbHint}</div>
                <h2 className="question-text">{question.prompt}</h2>
              </>
            ) : (
              <>
                <div className="question-icon" style={{ fontSize: '80px' }}>{question.showIcon}</div>
                <h2 className="question-text">{question.prompt}</h2>
              </>
            )}
            <button className="speaker-button-small" onClick={() => speak(question.audioPrompt)}>🔊</button>
          </div>

          <div className="options-container">
            {question.options.map((option, index) => {
              let cls = 'option-button challenge-option'
              if (selected !== null) {
                if (option.correct) cls += ' correct'
                else if (index === selected && !option.correct) cls += ' wrong'
                else cls += ' dimmed'
              }
              return (
                <button key={index} className={cls} onClick={() => handleAnswer(option, index)} disabled={selected !== null} style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="option-text">{option.text}</span>
                  {selected !== null && option.correct && <span className="option-check">✅</span>}
                  {selected === index && !option.correct && <span className="option-check">❌</span>}
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <div className={`feedback ${question.options[selected]?.correct ? 'feedback-correct' : 'feedback-wrong'} pop-in`}>
              {question.options[selected]?.correct ? (
                <><span className="feedback-icon">🎉</span><span>Lo recordaste {playerName}!</span></>
              ) : (
                <><span className="feedback-icon">💪</span><span>Era: {question.answer}</span></>
              )}
            </div>
          )}
        </div>
      )}

      {/* COMPLETE */}
      {phase === 'complete' && (
        <div className="complete-phase slide-up">
          <div className="complete-icon">
            {score === total ? '🏆' : score >= 3 ? '🌟' : '💪'}
          </div>

          <h1 className="complete-title">
            {score === total ? `Perfecto ${playerName}!` : score >= 3 ? `Muy bien ${playerName}!` : `Sigue practicando ${playerName}!`}
          </h1>

          <div className="complete-score">
            <div className="score-big">{score}/{total}</div>
            <p className="score-text">{levelNames[level]} - {score} de {total} sin pistas!</p>
          </div>

          {score < total && (
            <div className="intro-funfact" style={{ marginBottom: '20px' }}>
              <span className="funfact-icon">💡</span>
              <p>Consejo: Ve al modo 🧠 Aprende y repite las rimas. Después vuelve aquí!</p>
            </div>
          )}

          <div className="complete-buttons">
            <button className="play-again-button" onClick={handleRetry} style={{ background: 'linear-gradient(135deg, #e11d48, #be123c)' }}>🔄 Intentar de nuevo</button>
            <button className="home-button" onClick={handleGoHome}>🏠 Volver al inicio</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Challenge
