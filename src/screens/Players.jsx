import { useState, useRef } from 'react'
import { UserPlus, X, ArrowRight, ArrowLeft } from 'lucide-react'
import Jersey from '../components/Jersey.jsx'
import { KIT_COLORS, MAX_PLAYERS } from '../game/reducer.js'
import { sound } from '../lib/sound.js'

export default function Players({ players, dispatch }) {
  const usedColors = players.map((p) => p.color)
  const firstFree = KIT_COLORS.find((c) => !usedColors.includes(c.hex))?.hex || KIT_COLORS[0].hex
  const [name, setName] = useState('')
  const [color, setColor] = useState(firstFree)
  const [number, setNumber] = useState(10)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const full = players.length >= MAX_PLAYERS

  const add = (e) => {
    e.preventDefault()
    const clean = name.trim()
    if (!clean) return setError('Escribe el nombre del jugador.')
    if (players.some((p) => p.name.toLowerCase() === clean.toLowerCase())) return setError('Ese nombre ya está en la alineación.')
    const dorsal = Math.min(99, Math.max(1, parseInt(number, 10) || 10))
    dispatch({ type: 'ADD_PLAYER', name: clean.slice(0, 18), color, number: dorsal })
    sound.tap()
    setName('')
    setError('')
    const nextUsed = [...usedColors, color]
    setColor(KIT_COLORS.find((c) => !nextUsed.includes(c.hex))?.hex || KIT_COLORS[0].hex)
    setNumber(Math.floor(Math.random() * 23) + 1)
    inputRef.current?.focus()
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
      <h1 className="font-display text-4xl sm:text-5xl">Alineación</h1>
      <p className="mt-1 text-chalk/70">Registra a cada participante. Juegan por turnos en el mismo dispositivo.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form onSubmit={add} className="board p-5 sm:p-6" noValidate>
          <div className="flex items-start gap-4">
            <Jersey color={color} number={number || 10} className="h-24 w-24 shrink-0 sm:h-28 sm:w-28" label="Vista previa de la camiseta" />
            <div className="min-w-0 flex-1 space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-chalk/80">Nombre</span>
                <input
                  ref={inputRef}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError('')
                  }}
                  maxLength={18}
                  disabled={full}
                  placeholder="Ej. Pibe"
                  className="mt-1 w-full rounded-xl border-2 border-chalk/20 bg-night-800 px-3 py-2.5 text-lg text-chalk placeholder:text-chalk/30 focus:border-led focus:outline-none"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'player-error' : undefined}
                />
              </label>
              <label className="block w-28">
                <span className="text-sm font-semibold text-chalk/80">Dorsal</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  disabled={full}
                  className="mt-1 w-full rounded-xl border-2 border-chalk/20 bg-night-800 px-3 py-2.5 font-cond text-lg text-chalk focus:border-led focus:outline-none"
                />
              </label>
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-chalk/80">Color de camiseta</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {KIT_COLORS.map((c) => {
                const taken = usedColors.includes(c.hex)
                const selected = color === c.hex
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setColor(c.hex)}
                    disabled={full}
                    aria-label={`${c.name}${taken ? ' (ya en uso)' : ''}`}
                    aria-pressed={selected}
                    className={`h-10 w-10 rounded-full border-2 transition ${selected ? 'scale-110 border-led ring-2 ring-led/40' : 'border-chalk/25'} ${taken && !selected ? 'opacity-35' : ''}`}
                    style={{ background: c.hex }}
                  />
                )
              })}
            </div>
          </fieldset>

          {error && (
            <p id="player-error" className="mt-3 text-sm font-semibold text-redcard">
              {error}
            </p>
          )}

          <button type="submit" disabled={full} className="btn-primary mt-5 w-full">
            <UserPlus className="h-5 w-5" /> {full ? 'Alineación completa' : 'Agregar jugador'}
          </button>
        </form>

        <section className="board led-grid flex flex-col p-5 sm:p-6" aria-labelledby="roster-title">
          <div className="flex items-baseline justify-between">
            <h2 id="roster-title" className="font-cond text-xl font-bold">En cancha</h2>
            <span className="led-text font-cond text-xl font-bold">
              {players.length}/{MAX_PLAYERS}
            </span>
          </div>

          {players.length === 0 ? (
            <p className="flex flex-1 items-center justify-center py-10 text-center text-chalk/60">
              Agrega al primer jugador para empezar.
            </p>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {players.map((p) => (
                <li key={p.id} className="relative flex animate-pop flex-col items-center rounded-xl bg-night-800/80 px-2 pb-3 pt-2">
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_PLAYER', id: p.id })}
                    className="absolute right-1 top-1 rounded-full p-1.5 text-chalk/50 hover:bg-redcard/20 hover:text-redcard"
                    aria-label={`Quitar a ${p.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Jersey color={p.color} number={p.number} className="h-16 w-16" />
                  <span className="mt-1 w-full truncate text-center font-semibold">{p.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <button onClick={() => dispatch({ type: 'GO', phase: 'home' })} className="btn-ghost">
          <ArrowLeft className="h-5 w-5" /> Volver
        </button>
        <button onClick={() => dispatch({ type: 'GO', phase: 'setup' })} disabled={players.length === 0} className="btn-primary">
          Configurar partido <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </main>
  )
}
