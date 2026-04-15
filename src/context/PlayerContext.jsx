import { createContext, useContext, useState } from 'react'

const PlayerContext = createContext()

export function PlayerProvider({ children }) {
  const [playerName, setPlayerName] = useState(() => {
    try {
      return localStorage.getItem('playerName') || ''
    } catch {
      return ''
    }
  })

  const saveName = (name) => {
    setPlayerName(name)
    try {
      localStorage.setItem('playerName', name)
    } catch {}
  }

  return (
    <PlayerContext.Provider value={{ playerName, saveName }}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  return useContext(PlayerContext)
}
