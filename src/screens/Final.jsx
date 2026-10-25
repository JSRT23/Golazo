import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { Trophy, RotateCcw, Users, House, Flame } from 'lucide-react'
import Jersey from '../components/Jersey.jsx'
import { ranking } from '../game/reducer.js'
import { saveToHallOfFame } from '../lib/hallOfFame.js'
import { sound } from '../lib/sound.js'

const PODIUM = [
  { place: 2, height: 'h-24 sm:h-28', delay: '0.25s' },
  { place: 1, height: 'h-36 sm:h-40', delay: '0s' },
  { place: 3, height: 'h-16 sm:h-20', delay: '0.45s' },
]

export default function Final({ state, dispatch }) {
  const table = ranking(state.players)
  const champ = table[0]
  const tie = table.length > 1 && table[1].score === champ.score
  const saved = useRef(false)

  useEffect(() => {
    if (saved.current) return
    saved.current = true
    sound.whistle(true)
    saveToHallOfFame(
      state.players.map((p) => ({
        name: p.name,
        color: p.color,
        number: p.number,
        score: p.score,
        correct: p.correct,
        total: p.answered,
        date: Date.now(),
      })),
    )
    const end = Date.now() + 1500
    const colors = ['#ffc527', '#f4f7f0', champ.color]
    ;(function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors, disableForReducedMotion: true })
      confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors, disableForReducedMotion: true })
      if (Date.now() < end) requestAnimationFrame(frame)
    })()
  }, [state.players, champ.color])

  const podium = PODIUM.filter((s) => table[s.place - 1])

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 text-center sm:px-6">
      <Trophy className="mx-auto h-16 w-16 text-led drop-shadow-[0_0_24px_rgb(255_197_39/0.6)]" />
      <p className="led-text mt-2 font-cond text-xl font-bold">Final del partido</p>
      <h1 className="font-display text-[clamp(2.6rem,9vw,4.5rem)] leading-none">
        {tie ? 'Empate en la cima' : `${champ.name} levanta la copa`}
      </h1>

      {/* Podio */}
      {table.length > 1 && (
        <div className="mx-auto mt-10 flex max-w-lg items-end justify-center gap-2 sm:gap-4">
          {podium.map(({ place, height, delay }) => {
            const p = table[place - 1]
            return (
              <div key={p.id} className="flex flex-1 animate-rise flex-col items-center" style={{ animationDelay: delay }}>
                <Jersey color={p.color} number={p.number} className={place === 1 ? 'h-20 w-20' : 'h-14 w-14'} />
                <p className="mt-1 w-full truncate font-semibold">{p.name}</p>
                <p className="led-text font-cond text-xl font-bold">{p.score}</p>
                <div
                  className={`mt-2 grid w-full place-items-start justify-center rounded-t-xl border-2 border-b-0 border-chalk/70 bg-turf-700/80 pt-2 font-display text-4xl ${height}`}
                >
                  {place}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Estadísticas */}
      <div className={`board overflow-x-auto text-left ${table.length > 1 ? "mt-0" : "mt-8"}`}>
        <table className="w-full min-w-[420px] text-sm">
          <caption className="sr-only">Estadísticas finales</caption>
          <thead>
            <tr className="border-b border-chalk/10 text-chalk/60">
              <th className="px-4 py-3 font-semibold">Jugador</th>
              <th className="px-2 py-3 text-center font-semibold">Aciertos</th>
              <th className="px-2 py-3 text-center font-semibold">Efectividad</th>
              <th className="px-2 py-3 text-center font-semibold">Mejor racha</th>
              <th className="px-4 py-3 text-right font-semibold">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {table.map((p, i) => (
              <tr key={p.id} className="border-b border-chalk/5 last:border-0">
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2">
                    <span className="w-4 font-cond font-bold text-chalk/60">{i + 1}</span>
                    <Jersey color={p.color} number={p.number} className="h-8 w-8 shrink-0" />
                    <span className="truncate font-semibold">{p.name}</span>
                  </span>
                </td>
                <td className="px-2 text-center tabular-nums">
                  {p.correct}/{p.answered}
                </td>
                <td className="px-2 text-center tabular-nums">{p.answered ? Math.round((p.correct / p.answered) * 100) : 0}%</td>
                <td className="px-2 text-center">
                  <span className="inline-flex items-center gap-1">
                    {p.bestStreak >= 2 && <Flame className="h-3.5 w-3.5 text-orange-300" />}
                    {p.bestStreak}
                  </span>
                </td>
                <td className="led-text px-4 text-right font-cond text-xl font-bold">{p.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <button onClick={() => dispatch({ type: 'START_LOADING' })} className="btn-primary">
          <RotateCcw className="h-5 w-5" /> Revancha
        </button>
        <button onClick={() => dispatch({ type: 'GO', phase: 'players' })} className="btn-ghost">
          <Users className="h-5 w-5" /> Cambiar jugadores
        </button>
        <button onClick={() => dispatch({ type: 'NEW_GAME' })} className="btn-ghost">
          <House className="h-5 w-5" /> Inicio
        </button>
      </div>
    </main>
  )
}
