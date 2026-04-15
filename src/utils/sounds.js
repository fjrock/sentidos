const AudioContext = window.AudioContext || window.webkitAudioContext

let audioCtx = null

function getContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

// Text-to-Speech in Spanish
let spanishVoice = null

function findSpanishVoice() {
  const voices = window.speechSynthesis.getVoices()
  spanishVoice = voices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('female'))
    || voices.find(v => v.lang.startsWith('es'))
    || null
  return spanishVoice
}

// Load voices (they load async in some browsers)
if (window.speechSynthesis) {
  findSpanishVoice()
  window.speechSynthesis.onvoiceschanged = findSpanishVoice
}

export function speak(text, rate = 0.85) {
  try {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = rate
    utterance.pitch = 1.1
    utterance.volume = 1
    if (!spanishVoice) findSpanishVoice()
    if (spanishVoice) utterance.voice = spanishVoice
    window.speechSynthesis.speak(utterance)
  } catch {}
}

export function stopSpeaking() {
  try {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  } catch {}
}

export function playCorrect() {
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.value = 0.15

    osc.type = 'sine'
    osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1) // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2) // G5

    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch {}
}

export function playWrong() {
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.value = 0.1

    osc.type = 'sine'
    osc.frequency.setValueAtTime(300, ctx.currentTime)
    osc.frequency.setValueAtTime(250, ctx.currentTime + 0.15)

    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch {}
}

export function playClick() {
  try {
    const ctx = getContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    gain.gain.value = 0.08

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)

    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.1)
  } catch {}
}

export function playCelebration() {
  try {
    const ctx = getContext()
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      gain.gain.value = 0.1
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.3)
      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.3)
    })
  } catch {}
}
