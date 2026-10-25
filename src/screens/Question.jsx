import { useCallback, useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'
import { MonitorPlay, Flame, ArrowRight, Check, X, Clock } from 'lucide-react'
import Jersey from '../components/Jersey.jsx'
import TimerRing from '../components/TimerRing.jsx'
import SafeImage from '../components/SafeImage.jsx'
import { CATEGORY_ICONS } from '../components/categoryIcons.js'
import { categoryById } from '../lib/questions.js'
import { sound } from '../lib/sound.js'
import { shuffle } from '../lib/utils.js'

const LETTERS = ['A', 'B', 'C', 'D']
const GOAL_LINES = ['¡Golazo!', '¡Al ángulo!', '¡Qué definición!', '¡Gol de crack!', '¡Adentro!']

export default function Question({ state, dispatch }) {
  const { players, turn, round, settings, questions, last } = state
  const player = players[turn]
  const q = questions[round * players.length + turn]
  const cat = categoryById[q.cat]
  const CatIcon = CATEGORY_ICONS[q.cat]

  const deadline = useRef(Date.now() + settings.seconds * 1000)
  const timeLeftRef = useRef(settings.seconds)
  const lastTick = useRef(null)
  const [timeLeft, setTimeLeft] = useState(settings.seconds)
  const [eliminated, setEliminated] = useState([])
  const [usedVarHere, setUsedVarHere] = useState(false)
  const [goalLine] = useState(() => GOAL_LINES[Math.floor(Math.random() * GOAL_LINES.length)])
  const nextRef = useRef(null)
  const answered = !!last

  const answer = useCallback(
    (chosen) => {
      if (answered) return
      dispatch({ type: 'ANSWER', chosen, timeLeft: timeLeftRef.current, usedVar: usedVarHere })
    },
    [answered, dispatch, usedVarHere],
  )

  // Reloj
  useEffect(() => {
    if (answered) return
    const id = setInterval(() => {
      const left = Math.max(0, (deadline.current - Date.now()) / 1000)
      timeLeftRef.current = left
      setTimeLeft(left)
      const whole = Math.ceil(left)
      if (whole <= 5 && whole > 0 && whole !== lastTick.current) {
        lastTick.current = whole
        sound.tick()
      }
      if (left <= 0) answer(null)
    }, 100)
    return () => clearInterval(id)
  }, [answered, answer])

  // Sonido y celebración al responder
  useEffect(() => {
    if (!last) return
    if (last.correct) {
      sound.goal()
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.75 },
        colors: ['#ffc527', '#f4f7f0', player.color],
        disableForReducedMotion: true,
      })
    } else {
      sound.miss()
    }
    nextRef.current?.focus({ preventScroll: true })
    nextRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [last, player.color])

  // Teclado: 1-4 o A-D para responder
  useEffect(() => {
    const onKey = (e) => {
      if (answered || e.metaKey || e.ctrlKey) return
      const k = e.key.toLowerCase()
      const idx = ['1', '2', '3', '4'].indexOf(k) >= 0 ? Number(k) - 1 : ['a', 'b', 'c', 'd'].indexOf(k)
      if (idx >= 0 && idx < q.options.length && !eliminated.includes(idx)) answer(idx)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [answered, answer, eliminated, q.options.length])

  const requestVar = () => {
    if (player.varUsed || answered) return
    const wrong = shuffle(q.options.map((_, i) => i).filter((i) => i !== q.answer)).slice(0, 2)
    setEliminated(wrong)
    setUsedVarHere(true)
    sound.whistle()
    dispatch({ type: 'USE_VAR', playerId: player.id })
  }

  const isLastTurn = turn === players.length - 1
  const isLastRound = round === settings.rounds - 1
  const nextLabel = !isLastTurn ? 'Siguiente turno' : isLastRound ? 'Ver resultado final' : 'Ver la tabla'

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5 sm:px-6">
      {/* Marcador superior */}
      <div className="board led-grid flex items-center gap-3 p-3 sm:p-4">
        <Jersey color={player.color} number={player.number} className="h-12 w-12 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-cond text-xl font-bold leading-tight">{player.name}</p>
          <p className="text-xs text-chalk/60">
            Ronda {round + 1}/{settings.rounds}, turno {turn + 1}/{players.length}
          </p>
        </div>
        {player.streak >= 2 && !answered && (
          <span className="hidden items-center gap-1 rounded-full bg-redcard/20 px-2.5 py-1 text-sm font-semibold text-orange-300 sm:inline-flex">
            <Flame className="h-4 w-4" /> Racha {player.streak}
          </span>
        )}
        <div className="text-right">
          <p className="text-[11px] text-chalk/50">Puntos</p>
          <p className="led-text font-cond text-3xl font-bold leading-none">{player.score}</p>
        </div>
        <TimerRing timeLeft={answered ? timeLeftRef.current : timeLeft} total={settings.seconds} size={64} />
      </div>

      {/* Pregunta */}
      <section className="mt-5 text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-chalk/25 bg-turf-950/60 px-3 py-1 text-sm">
          <CatIcon className="h-4 w-4 text-led" /> {cat.label}
          {q.detail && <span className="text-chalk/50">{q.detail}</span>}
        </p>

        {q.image && (
          <div className="mx-auto mt-4 grid h-36 w-full max-w-xs place-items-center sm:h-44">
            {q.imageKind === 'flag' ? (
              <SafeImage
                key={q.image}
                src={q.image}
                alt="Bandera de la pregunta"
                className="max-h-full max-w-full rounded-lg border-4 border-chalk/90 object-contain shadow-[0_16px_30px_-10px_rgb(0_0_0/0.7)]"
              />
            ) : (
              <div className="grid h-full aspect-square place-items-center rounded-full bg-[radial-gradient(circle,rgb(244_247_240/0.95)_55%,rgb(244_247_240/0.75))] p-5 shadow-[0_16px_30px_-10px_rgb(0_0_0/0.7)]">
                <SafeImage key={q.image} src={q.image} fallbackSrc={q.imageFull} alt="Escudo del club" className="h-full w-full object-contain" />
              </div>
            )}
          </div>
        )}

        <h1 className="mx-auto mt-5 max-w-2xl text-balance font-cond text-3xl font-bold leading-tight sm:text-4xl">{q.prompt}</h1>
      </section>

      {/* Opciones */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {q.options.map((opt, i) => {
          const out = eliminated.includes(i)
          const isAnswer = i === q.answer
          const isChosen = last?.chosen === i
          let tone = 'border-chalk/25 bg-night/80 hover:border-chalk hover:bg-night-700/80'
          if (answered && isAnswer) tone = 'border-turf-500 bg-turf-600 animate-pop'
          else if (answered && isChosen) tone = 'border-redcard bg-redcard/80 animate-shake'
          else if (answered || out) tone = 'border-chalk/10 bg-night/50 opacity-45'
          return (
            <button
              key={i}
              onClick={() => answer(i)}
              disabled={answered || out}
              className={`group flex min-h-16 items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-lg font-semibold backdrop-blur-sm transition ${tone} ${out ? 'line-through' : ''}`}
            >
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-lg ${
                  answered && isAnswer ? 'bg-chalk text-turf-700' : answered && isChosen ? 'bg-chalk text-redcard' : 'border-2 border-chalk/50 text-chalk/80'
                }`}
              >
                {answered && isAnswer ? <Check className="h-5 w-5" /> : answered && isChosen ? <X className="h-5 w-5" /> : LETTERS[i]}
              </span>
              <span className="min-w-0 flex-1">{opt}</span>
            </button>
          )
        })}
      </div>

      {/* VAR */}
      {!answered && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={requestVar}
            disabled={player.varUsed}
            className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-chalk/40 px-4 py-2 font-cond text-base font-semibold text-chalk/90 hover:border-led hover:text-led disabled:border-chalk/15 disabled:text-chalk/35"
          >
            <MonitorPlay className="h-5 w-5" />
            {player.varUsed ? (usedVarHere ? 'VAR revisado' : 'Ya usaste tu VAR') : 'Pedir VAR (quita 2 opciones, −30)'}
          </button>
        </div>
      )}

      {/* Resultado de la jugada */}
      {answered && (
        <section className="board mt-5 animate-rise p-5 text-center" aria-live="assertive">
          {last.correct ? (
            <>
              <p className="font-display text-5xl text-led">{goalLine}</p>
              <p className="led-text mt-1 font-cond text-3xl font-bold">+{last.points.total}</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
                <li className="rounded-full bg-chalk/10 px-3 py-1">+{last.points.base} acierto</li>
                {last.points.speed > 0 && <li className="rounded-full bg-chalk/10 px-3 py-1">+{last.points.speed} velocidad</li>}
                {last.points.streakBonus > 0 && (
                  <li className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 px-3 py-1 text-orange-200">
                    <Flame className="h-3.5 w-3.5" /> +{last.points.streakBonus} racha de {last.streak}
                  </li>
                )}
                {last.points.varPenalty > 0 && <li className="rounded-full bg-redcard/20 px-3 py-1">−{last.points.varPenalty} VAR</li>}
              </ul>
            </>
          ) : (
            <>
              <p className="inline-flex items-center gap-2 font-display text-5xl text-chalk">
                {last.timeout ? <><Clock className="h-10 w-10" /> Final del tiempo</> : 'Afuera'}
              </p>
              <p className="mt-2 text-chalk/80">
                La respuesta era <strong className="text-chalk">{q.options[q.answer]}</strong>
              </p>
            </>
          )}
          <button ref={nextRef} onClick={() => dispatch({ type: 'NEXT' })} className="btn-primary mt-5">
            {nextLabel} <ArrowRight className="h-5 w-5" />
          </button>
        </section>
      )}

      <p className="mt-6 text-center text-xs text-chalk/40">Fuente: {q.source}. Usa las teclas 1 a 4 para responder.</p>
    </main>
  )
}
