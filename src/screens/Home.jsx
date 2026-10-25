import { Users, Timer, Trophy, Play } from 'lucide-react'
import SoccerBall from '../components/SoccerBall.jsx'

const STEPS = [
  { icon: Users, title: 'Arma la alineación', text: 'De 1 a 8 jugadores, cada uno con su camiseta y dorsal.' },
  { icon: Timer, title: 'Responde por turnos', text: 'Cuatro opciones, reloj corriendo y un VAR por partido.' },
  { icon: Trophy, title: 'Levanta la copa', text: 'Velocidad y rachas suman. El que más goles meta, gana.' },
]

export default function Home({ onStart, onHallOfFame }) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-4 py-10 sm:px-6">
      <section className="board led-grid relative overflow-hidden px-6 py-10 text-center sm:px-12 sm:py-14">
        <SoccerBall className="absolute -right-10 -top-10 h-40 w-40 opacity-10 sm:h-56 sm:w-56" />
        <p className="led-text font-cond text-lg font-semibold">Trivia futbolera</p>
        <h1 className="mt-2 font-display text-[clamp(4.5rem,16vw,10rem)] leading-[0.9] text-chalk [text-shadow:0_6px_0_rgb(4_33_15/0.6)]">
          Golazo
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-chalk/80">
          Escudos, estadios, selecciones e historia del fútbol. Pásense el celular y que gane el que más sabe.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={onStart} className="btn-primary text-xl">
            <Play className="h-5 w-5 fill-current" /> Jugar ahora
          </button>
          <button onClick={onHallOfFame} className="btn-ghost">
            <Trophy className="h-5 w-5" /> Salón de la fama
          </button>
        </div>
      </section>

      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="flex gap-3 rounded-2xl border border-chalk/10 bg-turf-950/50 p-4 backdrop-blur-sm">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-chalk/70 font-display text-lg">
              {i + 1}
            </span>
            <div>
              <h2 className="flex items-center gap-1.5 font-cond text-lg font-bold">
                <Icon className="h-4 w-4 text-led" /> {title}
              </h2>
              <p className="text-sm text-chalk/70">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}
