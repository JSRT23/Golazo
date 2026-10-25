import { ArrowLeft, Check } from 'lucide-react'
import { CATEGORIES } from '../lib/questions.js'
import { CATEGORY_ICONS } from '../components/categoryIcons.js'
import SoccerBall from '../components/SoccerBall.jsx'

const ROUNDS = [3, 5, 8]
const SECONDS = [10, 20, 30]

function Segmented({ label, options, value, onChange, suffix }) {
  return (
    <fieldset>
      <legend className="font-cond text-lg font-bold">{label}</legend>
      <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup">
        {options.map((o) => (
          <button
            key={o}
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(o)}
            className={`rounded-xl border-2 py-3 font-display text-2xl transition ${
              value === o ? 'border-led bg-led text-night' : 'border-chalk/20 bg-night-800/70 text-chalk hover:border-chalk/50'
            }`}
          >
            {o}
            <span className="ml-1 font-cond text-sm font-semibold">{suffix}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default function Setup({ players, settings, dispatch }) {
  const set = (s) => dispatch({ type: 'SETTINGS', settings: s })
  const toggleCat = (id) => {
    const has = settings.categories.includes(id)
    const next = has ? settings.categories.filter((c) => c !== id) : [...settings.categories, id]
    if (next.length) set({ categories: next })
  }
  const total = settings.rounds * players.length

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">Reglas del partido</h1>
      <p className="mt-1 text-chalk/70">
        {players.length === 1 ? 'Juegas en solitario.' : `${players.length} jugadores.`} Cada ronda, cada uno responde una pregunta.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <section className="board space-y-6 p-5 sm:p-6">
          <Segmented label="Rondas" options={ROUNDS} value={settings.rounds} onChange={(rounds) => set({ rounds })} />
          <Segmented label="Tiempo por pregunta" options={SECONDS} value={settings.seconds} onChange={(seconds) => set({ seconds })} suffix="s" />
          <div className="rounded-xl bg-turf-950/60 p-4 text-sm text-chalk/80">
            <p className="font-cond text-base font-bold text-chalk">Cómo se puntúa</p>
            <ul className="mt-1 space-y-1">
              <li><span className="led-text font-bold">100</span> por acierto</li>
              <li><span className="led-text font-bold">+50</span> como máximo por responder rápido</li>
              <li><span className="led-text font-bold">+25</span> por cada acierto seguido en racha (hasta +100)</li>
              <li><span className="font-bold text-redcard">−30</span> si usas el VAR, que elimina dos opciones</li>
            </ul>
          </div>
        </section>

        <section className="board p-5 sm:p-6">
          <h2 className="font-cond text-lg font-bold">Categorías</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c.id]
              const on = settings.categories.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCat(c.id)}
                  aria-pressed={on}
                  className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                    on ? 'border-chalk/80 bg-turf-700/60' : 'border-chalk/15 bg-night-800/60 opacity-60 hover:opacity-90'
                  }`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${on ? 'bg-led text-night' : 'bg-chalk/10'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{c.label}</span>
                    <span className="block text-xs text-chalk/60">{c.hint}</span>
                  </span>
                  {on && <Check className="h-5 w-5 text-led" />}
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-xs text-chalk/50">
            Escudos, estadios, fundación y ligas se arman en vivo con datos de TheSportsDB. Las banderas vienen de flagcdn.
          </p>
        </section>
      </div>

      <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <button onClick={() => dispatch({ type: 'GO', phase: 'players' })} className="btn-ghost">
          <ArrowLeft className="h-5 w-5" /> Alineación
        </button>
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-4">
          <span className="text-sm text-chalk/70">{total} preguntas en total</span>
          <button onClick={() => dispatch({ type: 'START_LOADING' })} className="btn-primary text-xl">
            <SoccerBall className="h-6 w-6" /> Pitar el inicio
          </button>
        </div>
      </div>
    </main>
  )
}
