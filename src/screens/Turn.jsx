import { WifiOff, Smartphone } from 'lucide-react'
import Jersey from '../components/Jersey.jsx'
import { sound } from '../lib/sound.js'

export default function Turn({ state, dispatch }) {
  const { players, round, turn, settings, apiInfo } = state
  const player = players[turn]
  const showOffline = apiInfo?.needsApi && apiInfo?.failed && round === 0 && turn === 0

  function start() {
    sound.whistle()
    dispatch({ type: 'BEGIN_TURN' })
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-center">
      <p className="led-text font-cond text-xl font-bold">
        Ronda {round + 1} de {settings.rounds}
      </p>

      <div key={player.id} className="mt-4 animate-rise">
        <Jersey color={player.color} number={player.number} className="mx-auto h-40 w-40 drop-shadow-[0_18px_24px_rgb(0_0_0/0.5)] sm:h-48 sm:w-48" />
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">Le toca a {player.name}</h1>
        {players.length > 1 && (
          <p className="mt-3 inline-flex items-center gap-2 text-chalk/70">
            <Smartphone className="h-4 w-4" /> Pásale el celular sin mirar la pregunta
          </p>
        )}
        <p className="mt-2 text-chalk/60">
          Lleva <span className="led-text font-bold">{player.score}</span> puntos
          {player.streak >= 2 && <> y una racha de {player.streak}</>}
        </p>
      </div>

      {showOffline && (
        <p className="mt-6 inline-flex max-w-md items-start gap-2 rounded-xl border border-redcard/40 bg-redcard/10 px-4 py-3 text-left text-sm">
          <WifiOff className="mt-0.5 h-4 w-4 shrink-0 text-redcard" />
          TheSportsDB no respondió, así que este partido usa solo selecciones e historia. Revisa tu conexión para jugar con escudos y estadios.
        </p>
      )}

      <button onClick={start} className="btn-primary mt-8 text-xl" autoFocus>
        Estoy listo
      </button>
    </main>
  )
}
