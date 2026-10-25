import { useState } from 'react'
import { Volume2, VolumeX, Trophy, House } from 'lucide-react'
import SoccerBall from './SoccerBall.jsx'
import { sound } from '../lib/sound.js'

export default function Header({ onHome, onHallOfFame, inGame }) {
  const [muted, setMuted] = useState(sound.isMuted())

  const toggle = () => {
    sound.setMuted(!muted)
    setMuted(!muted)
  }

  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 pt-4 sm:px-6">
      <button onClick={onHome} className="group flex items-center gap-2" aria-label="Ir al inicio">
        <SoccerBall className="h-8 w-8 transition-transform group-hover:rotate-45" />
        <span className="font-display text-2xl tracking-wide text-chalk">Golazo</span>
      </button>
      <nav className="flex items-center gap-1">
        {inGame && (
          <button onClick={onHome} className="rounded-full p-2.5 text-chalk/80 hover:bg-chalk/10 hover:text-chalk" aria-label="Abandonar partido">
            <House className="h-5 w-5" />
          </button>
        )}
        <button onClick={onHallOfFame} className="rounded-full p-2.5 text-chalk/80 hover:bg-chalk/10 hover:text-chalk" aria-label="Salón de la fama">
          <Trophy className="h-5 w-5" />
        </button>
        <button onClick={toggle} className="rounded-full p-2.5 text-chalk/80 hover:bg-chalk/10 hover:text-chalk" aria-label={muted ? 'Activar sonido' : 'Silenciar'}>
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      </nav>
    </header>
  )
}
