import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { usePlayer } from '../context/PlayerContext'
import { playCorrect, playWrong, playClick, playCelebration, speak, stopSpeaking } from '../utils/sounds'
import './LearnMode.css'

const lessons = [
  {
    sense: 'La Visión',
    organ: 'Los Ojos',
    icon: '👁️',
    organIcon: '👀',
    color: '#3b82f6',
    action: 'Tócate los ojos con cuidado!',
    rhyme: 'Con mis ojitos puedo ver, los colores puedo aprender. La visión me ayuda a mirar, todo lo que quiero observar!',
    example: 'Mira a tu alrededor. Todo lo que ves es gracias a la visión!',
    bodyPart: 'ojos',
  },
  {
    sense: 'La Audición',
    organ: 'Los Oídos',
    icon: '👂',
    organIcon: '👂',
    color: '#10b981',
    action: 'Tócate las orejas!',
    rhyme: 'Con mis oídos puedo oír, la música y el reír. La audición me deja escuchar, los sonidos de este lugar!',
    example: 'Cierra los ojos y escucha. Todo lo que oyes es gracias a la audición!',
    bodyPart: 'oídos',
  },
  {
    sense: 'El Olfato',
    organ: 'La Nariz',
    icon: '👃',
    organIcon: '👃',
    color: '#f97316',
    action: 'Tócate la nariz!',
    rhyme: 'Con mi nariz puedo oler, las flores y el pastel. El olfato es genial, huelo rico y huelo mal!',
    example: 'Respira profundo por la nariz. Todo lo que hueles es gracias al olfato!',
    bodyPart: 'nariz',
  },
  {
    sense: 'El Gusto',
    organ: 'La Lengua',
    icon: '👅',
    organIcon: '👅',
    color: '#ef4444',
    action: 'Saca la lengua!',
    rhyme: 'Con mi lengua puedo probar, lo dulce y lo salado al gustar. El gusto me dice el sabor, si es amargo o es mejor!',
    example: 'Piensa en tu comida favorita. Ese rico sabor es gracias al gusto y tu lengua!',
    bodyPart: 'lengua',
  },
  {
    sense: 'El Tacto',
    organ: 'La Piel y las Manos',
    icon: '🖐️',
    organIcon: '✋',
    color: '#8b5cf6',
    action: 'Tócate las manos, los brazos, la cara!',
    rhyme: 'Con mis manos puedo sentir, si es suave o me hace reír. El tacto me dice al tocar, si es frío o me va a quemar!',
    example: 'Toca la mesa, tu ropa, tu cara. Todo lo que sientes es gracias al tacto!',
    bodyPart: 'manos y piel',
  },
]

const STEPS = {
  INTRO: 'intro',
  TEACH: 'teach',
  RHYME: 'rhyme',
  MINI_TEST: 'mini_test',
  MATCH: 'match',
  DONE: 'done',
}

function LearnMode() {
  const navigate = useNavigate()
  const { playerName } = usePlayer()

  const [currentLesson, setCurrentLesson] = useState(0)
  const [step, setStep] = useState(STEPS.INTRO)
  const [miniTestAnswer, setMiniTestAnswer] = useState(null)
  const [matchPairs, setMatchPairs] = useState([])
  const [matchSelected, setMatchSelected] = useState(null)
  const [matchCompleted, setMatchCompleted] = useState([])
  const [matchWrong, setMatchWrong] = useState(null)

  const lesson = lessons[currentLesson]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step, currentLesson])

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  // Speak based on step
  useEffect(() => {
    if (step === STEPS.INTRO) {
      const timer = setTimeout(() => {
        speak(`${playerName}, vamos a aprender los 5 sentidos paso a paso. Yo te enseño y tú repites conmigo. Empecemos!`)
      }, 500)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [step])

  useEffect(() => {
    if (step === STEPS.TEACH) {
      const timer = setTimeout(() => {
        speak(`${playerName}, este es el sentido de ${lesson.sense}. Usamos ${lesson.organ} para ${lesson.sense.toLowerCase().replace('la ', '').replace('el ', '')}. ${lesson.action} ${lesson.example}`)
      }, 400)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [step, currentLesson])

  useEffect(() => {
    if (step === STEPS.RHYME) {
      const timer = setTimeout(() => {
        speak(`${playerName}, repite conmigo esta rima: ${lesson.rhyme}`, 0.8)
      }, 400)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [step, currentLesson])

  useEffect(() => {
    if (step === STEPS.MINI_TEST) {
      const timer = setTimeout(() => {
        speak(`Ahora ${playerName}, si usamos los ${lesson.bodyPart} para ${lesson.sense.toLowerCase().replace('la ', '').replace('el ', '')}... Cómo se llama ese sentido?`)
      }, 400)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [step, currentLesson])

  useEffect(() => {
    if (step === STEPS.MATCH) {
      // Create shuffled pairs for matching game
      const senses = lessons.map(l => ({ type: 'sense', text: l.sense, icon: l.icon, id: l.sense }))
      const organs = lessons.map(l => ({ type: 'organ', text: l.organ, icon: l.organIcon, id: l.sense }))
      const shuffledSenses = [...senses].sort(() => Math.random() - 0.5)
      const shuffledOrgans = [...organs].sort(() => Math.random() - 0.5)
      setMatchPairs({ senses: shuffledSenses, organs: shuffledOrgans })
      setMatchSelected(null)
      setMatchCompleted([])
      setMatchWrong(null)
      const timer = setTimeout(() => {
        speak(`${playerName}, ahora une cada sentido con su parte del cuerpo! Toca un sentido y luego toca el órgano que le corresponde.`)
      }, 400)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [step])

  useEffect(() => {
    if (step === STEPS.DONE) {
      playCelebration()
      setTimeout(() => {
        confetti({ particleCount: 200, spread: 180, origin: { y: 0.5 } })
      }, 300)
      const timer = setTimeout(() => {
        speak(`Felicidades ${playerName}! Aprendiste los 5 sentidos! Recuerda: Visión con los ojos, Audición con los oídos, Olfato con la nariz, Gusto con la lengua, y Tacto con las manos y la piel!`)
      }, 500)
      return () => { clearTimeout(timer); stopSpeaking() }
    }
  }, [step])

  const handleGoHome = () => {
    stopSpeaking()
    playClick()
    navigate('/inicio')
  }

  const handleStartLesson = () => {
    stopSpeaking()
    playClick()
    setStep(STEPS.TEACH)
  }

  const handleNextToRhyme = () => {
    stopSpeaking()
    playClick()
    setStep(STEPS.RHYME)
  }

  const handleNextToTest = () => {
    stopSpeaking()
    playClick()
    setMiniTestAnswer(null)
    setStep(STEPS.MINI_TEST)
  }

  const handleMiniTestAnswer = (answer) => {
    if (miniTestAnswer !== null) return
    stopSpeaking()
    setMiniTestAnswer(answer)

    if (answer === lesson.sense) {
      playCorrect()
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } })
      speak(`Exacto ${playerName}! Es ${lesson.sense}! Usamos ${lesson.organ}!`)

      setTimeout(() => {
        if (currentLesson < lessons.length - 1) {
          setCurrentLesson(c => c + 1)
          setStep(STEPS.TEACH)
          setMiniTestAnswer(null)
        } else {
          setStep(STEPS.MATCH)
        }
      }, 2500)
    } else {
      playWrong()
      speak(`Casi ${playerName}. Recuerda: ${lesson.organ} son para ${lesson.sense}. Inténtalo de nuevo!`)
      setTimeout(() => setMiniTestAnswer(null), 2000)
    }
  }

  const handleMatchSelect = (item) => {
    if (matchCompleted.includes(item.id)) return

    if (!matchSelected) {
      playClick()
      setMatchSelected(item)
      setMatchWrong(null)
    } else {
      if (matchSelected.type === item.type) {
        playClick()
        setMatchSelected(item)
        setMatchWrong(null)
      } else {
        // Check if they match
        if (matchSelected.id === item.id) {
          playCorrect()
          const newCompleted = [...matchCompleted, item.id]
          setMatchCompleted(newCompleted)
          setMatchSelected(null)
          setMatchWrong(null)
          const matchedLesson = lessons.find(l => l.sense === item.id)
          speak(`Correcto ${playerName}! ${matchedLesson.sense} usa ${matchedLesson.organ}!`)
          confetti({ particleCount: 30, spread: 40, origin: { y: 0.7 } })

          if (newCompleted.length === lessons.length) {
            setTimeout(() => setStep(STEPS.DONE), 1500)
          }
        } else {
          playWrong()
          setMatchWrong({ a: matchSelected, b: item })
          setMatchSelected(null)
          speak('Intenta de nuevo!')
          setTimeout(() => setMatchWrong(null), 1000)
        }
      }
    }
  }

  // Generate mini-test options (current sense + 2 random others)
  const getMiniTestOptions = () => {
    const others = lessons.filter(l => l.sense !== lesson.sense)
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 2)
    const options = [lesson, ...shuffled].sort(() => Math.random() - 0.5)
    return options
  }

  const [miniTestOptions] = useState(() => getMiniTestOptions())

  // Regenerate options when lesson changes
  useEffect(() => {
    if (step === STEPS.MINI_TEST) {
      const others = lessons.filter(l => l.sense !== lesson.sense)
      const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 2)
      setMiniTestOpts([lesson, ...shuffled].sort(() => Math.random() - 0.5))
    }
  }, [step, currentLesson])

  const [miniTestOpts, setMiniTestOpts] = useState([])

  return (
    <div className="sense-game" style={{ background: step === STEPS.TEACH || step === STEPS.RHYME || step === STEPS.MINI_TEST ? `linear-gradient(180deg, ${lesson.color}dd 0%, ${lesson.color}88 50%, #764ba2 100%)` : 'linear-gradient(180deg, #f59e0bdd 0%, #f59e0b88 50%, #764ba2 100%)' }}>
      <button className="back-button" onClick={handleGoHome}>←</button>

      {/* INTRO */}
      {step === STEPS.INTRO && (
        <div className="intro-phase slide-up">
          <div className="intro-icon-container">
            <div className="intro-icon float">🧠</div>
          </div>
          <h1 className="intro-title">Aprende los Sentidos</h1>
          <p className="intro-organ">Paso a paso con {playerName}</p>

          <div className="intro-card">
            <p className="intro-description">Vamos a aprender cada sentido con su parte del cuerpo. Yo te enseño, tú repites y después jugamos!</p>
          </div>

          <div className="learn-steps-preview">
            {lessons.map((l, i) => (
              <div key={i} className="learn-step-dot">
                <span className="learn-step-icon">{l.icon}</span>
              </div>
            ))}
          </div>

          <button className="play-button pulse" onClick={handleStartLesson} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <span className="play-button-icon">📚</span>
            <span>Empezar!</span>
          </button>
        </div>
      )}

      {/* TEACH */}
      {step === STEPS.TEACH && (
        <div className="intro-phase slide-up" key={`teach-${currentLesson}`}>
          <div className="learn-progress-dots">
            {lessons.map((l, i) => (
              <span key={i} className={`learn-dot ${i === currentLesson ? 'active' : i < currentLesson ? 'done' : ''}`}>
                {i < currentLesson ? '✅' : l.icon}
              </span>
            ))}
          </div>

          <div className="intro-icon-container">
            <div className="intro-icon float">{lesson.icon}</div>
          </div>

          <h1 className="intro-title">{lesson.sense}</h1>
          <p className="intro-organ">{lesson.organIcon} {lesson.organ}</p>

          <div className="intro-card">
            <p className="learn-action">👆 {lesson.action}</p>
            <div className="learn-divider"></div>
            <p className="intro-description">{lesson.example}</p>
          </div>

          <div className="learn-association">
            <span className="learn-assoc-item">{lesson.organIcon}</span>
            <span className="learn-assoc-arrow">→</span>
            <span className="learn-assoc-item">{lesson.icon}</span>
            <span className="learn-assoc-arrow">→</span>
            <span className="learn-assoc-text">{lesson.sense}</span>
          </div>

          <button className="speaker-button" onClick={() => speak(`${lesson.sense}. ${lesson.organ}. ${lesson.action} ${lesson.example}`)}>🔊 Escuchar de nuevo</button>

          <button className="play-button" onClick={handleNextToRhyme} style={{ background: lesson.color }}>
            <span>Siguiente: La Rima! 🎵</span>
          </button>
        </div>
      )}

      {/* RHYME */}
      {step === STEPS.RHYME && (
        <div className="intro-phase slide-up" key={`rhyme-${currentLesson}`}>
          <div className="intro-icon-container">
            <div className="intro-icon float">🎵</div>
          </div>

          <h1 className="intro-title">Rima de {lesson.sense}</h1>

          <div className="rhyme-card">
            <p className="rhyme-text">{lesson.rhyme}</p>
          </div>

          <button className="speaker-button" onClick={() => speak(lesson.rhyme, 0.8)}>🔊 Escuchar rima</button>

          <button className="play-button" onClick={handleNextToTest} style={{ background: lesson.color }}>
            <span>Ahora te pregunto! 🧠</span>
          </button>
        </div>
      )}

      {/* MINI TEST */}
      {step === STEPS.MINI_TEST && (
        <div className="quiz-phase slide-up" key={`test-${currentLesson}`}>
          <div className="question-container">
            <div className="question-icon">{lesson.organIcon}</div>
            <h2 className="question-text">Usamos los {lesson.bodyPart}... Cómo se llama ese sentido?</h2>
          </div>

          <div className="options-container">
            {miniTestOpts.map((opt, index) => {
              let cls = 'option-button'
              if (miniTestAnswer !== null) {
                if (opt.sense === lesson.sense) cls += ' correct'
                else if (opt.sense === miniTestAnswer && miniTestAnswer !== lesson.sense) cls += ' wrong'
                else cls += ' dimmed'
              }
              return (
                <button key={index} className={cls} onClick={() => handleMiniTestAnswer(opt.sense)} disabled={miniTestAnswer !== null && miniTestAnswer === lesson.sense} style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="option-icon">{opt.icon}</span>
                  <span className="option-text">{opt.sense}</span>
                  {miniTestAnswer !== null && opt.sense === lesson.sense && <span className="option-check">✅</span>}
                  {miniTestAnswer === opt.sense && miniTestAnswer !== lesson.sense && <span className="option-check">❌</span>}
                </button>
              )
            })}
          </div>

          {miniTestAnswer === lesson.sense && (
            <div className="feedback feedback-correct pop-in">
              <span className="feedback-icon">🎉</span>
              <span>Excelente {playerName}!</span>
            </div>
          )}
        </div>
      )}

      {/* MATCH GAME */}
      {step === STEPS.MATCH && matchPairs.senses && (
        <div className="intro-phase slide-up">
          <h1 className="intro-title">Une los Pares!</h1>
          <p className="intro-organ">Toca un sentido y su órgano</p>

          <div className="match-game">
            <div className="match-column">
              <div className="match-column-title">Sentido</div>
              {matchPairs.senses.map((item) => (
                <button
                  key={item.id}
                  className={`match-item ${matchCompleted.includes(item.id) ? 'matched' : ''} ${matchSelected?.id === item.id && matchSelected?.type === 'sense' ? 'selected' : ''} ${matchWrong?.a?.id === item.id || matchWrong?.b?.id === item.id ? 'wrong-flash' : ''}`}
                  onClick={() => handleMatchSelect(item)}
                  disabled={matchCompleted.includes(item.id)}
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </button>
              ))}
            </div>

            <div className="match-column">
              <div className="match-column-title">Órgano</div>
              {matchPairs.organs.map((item) => (
                <button
                  key={item.id}
                  className={`match-item ${matchCompleted.includes(item.id) ? 'matched' : ''} ${matchSelected?.id === item.id && matchSelected?.type === 'organ' ? 'selected' : ''} ${matchWrong?.a?.id === item.id || matchWrong?.b?.id === item.id ? 'wrong-flash' : ''}`}
                  onClick={() => handleMatchSelect(item)}
                  disabled={matchCompleted.includes(item.id)}
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="match-progress">{matchCompleted.length} de {lessons.length} parejas</p>
        </div>
      )}

      {/* DONE */}
      {step === STEPS.DONE && (
        <div className="complete-phase slide-up">
          <div className="complete-icon">🏆</div>

          <h1 className="complete-title">Felicidades {playerName}!</h1>

          <div className="intro-card">
            <p className="learn-summary-title">Los 5 Sentidos:</p>
            <div className="learn-summary">
              {lessons.map((l, i) => (
                <div key={i} className="learn-summary-row">
                  <span>{l.icon}</span>
                  <span className="learn-summary-sense">{l.sense}</span>
                  <span>→</span>
                  <span>{l.organIcon}</span>
                  <span className="learn-summary-organ">{l.organ}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="speaker-button" onClick={() => speak(`Recuerda ${playerName}: Visión con los ojos, Audición con los oídos, Olfato con la nariz, Gusto con la lengua, y Tacto con las manos y la piel!`)}>🔊 Escuchar resumen</button>

          <div className="complete-buttons">
            <button className="play-again-button" onClick={() => { stopSpeaking(); setCurrentLesson(0); setStep(STEPS.INTRO) }} style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>🔄 Repasar de nuevo</button>
            <button className="home-button" onClick={handleGoHome}>🏠 Volver al inicio</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearnMode
