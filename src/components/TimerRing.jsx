export default function TimerRing({ timeLeft, total, size = 72 }) {
  const r = 30
  const c = 2 * Math.PI * r
  const ratio = Math.max(0, timeLeft / total)
  const danger = timeLeft <= 5
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} role="timer" aria-label={`${Math.ceil(timeLeft)} segundos`}>
      <svg viewBox="0 0 72 72" className="absolute inset-0 -rotate-90">
        <circle cx="36" cy="36" r={r} fill="rgb(10 26 47 / 0.85)" stroke="rgb(244 247 240 / 0.15)" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={danger ? '#e23b3b' : '#ffc527'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          style={{ transition: 'stroke-dashoffset 0.25s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={`relative font-cond text-2xl font-bold tabular-nums ${danger ? 'text-redcard' : 'led-text'}`}>
        {Math.ceil(timeLeft)}
      </span>
    </div>
  )
}
