import { ArrowRight, ChevronUp, ChevronDown, Minus, Flame } from 'lucide-react'
import Jersey from '../components/Jersey.jsx'
import { ranking } from '../game/reducer.js'

function Movement({ from, to }) {
  if (from < 0) return <span className="w-5" />
  if (to < from) return <ChevronUp className="h-5 w-5 text-turf-500" aria-label="Sube" />
  if (to > from) return <ChevronDown className="h-5 w-5 text-redcard" aria-label="Baja" />
  return <Minus className="h-4 w-4 text-chalk/40" aria-label="Se mantiene" />
}

export default function RoundEnd({ state, dispatch }) {
  const { players, round, settings, prevRanking } = state
  const table = ranking(players)

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
      <p className="led-text font-cond text-xl font-bold">
        Fin de la ronda {round + 1} de {settings.rounds}
      </p>
      <h1 className="font-display text-5xl">Tabla de posiciones</h1>

      <ol className="board led-grid mt-6 divide-y divide-chalk/10 overflow-hidden">
        {table.map((p, i) => (
          <li key={p.id} className={`flex items-center gap-3 px-4 py-3 ${i === 0 ? 'bg-led/10' : ''}`}>
            <span className={`w-7 text-center font-display text-2xl ${i === 0 ? 'text-led' : 'text-chalk/70'}`}>{i + 1}</span>
            <Movement from={prevRanking.indexOf(p.id)} to={i} />
            <Jersey color={p.color} number={p.number} className="h-10 w-10 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{p.name}</p>
              <p className="flex items-center gap-2 text-xs text-chalk/60">
                {p.correct}/{p.answered} aciertos
                {p.streak >= 2 && (
                  <span className="inline-flex items-center gap-0.5 text-orange-300">
                    <Flame className="h-3 w-3" /> {p.streak}
                  </span>
                )}
              </p>
            </div>
            <span className="led-text font-cond text-3xl font-bold">{p.score}</span>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex justify-end">
        <button onClick={() => dispatch({ type: 'NEXT_ROUND' })} className="btn-primary" autoFocus>
          {round + 2 === settings.rounds ? 'Jugar la última ronda' : `Ir a la ronda ${round + 2}`} <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </main>
  )
}
