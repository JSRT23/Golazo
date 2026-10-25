import { useEffect, useState } from 'react'
import { X, Trophy, Trash2 } from 'lucide-react'
import { getHallOfFame, clearHallOfFame } from '../lib/hallOfFame.js'
import Jersey from './Jersey.jsx'

export default function HallOfFame({ open, onClose }) {
  const [list, setList] = useState([])

  useEffect(() => {
    if (!open) return
    setList(getHallOfFame())
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-turf-950/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="hof-title"
        className="board led-grid w-full max-w-md animate-pop p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="hof-title" className="flex items-center gap-2 font-display text-2xl">
            <Trophy className="h-6 w-6 text-led" /> Salón de la fama
          </h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-chalk/10" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {list.length === 0 ? (
          <p className="py-8 text-center text-chalk/70">
            Todavía no hay récords. Juega un partido y tu puntaje quedará aquí.
          </p>
        ) : (
          <ol className="space-y-2">
            {list.map((e, i) => (
              <li key={`${e.name}-${e.date}-${i}`} className="flex items-center gap-3 rounded-xl bg-night-800/70 px-3 py-2">
                <span className="w-6 text-center font-cond text-lg font-bold text-chalk/60">{i + 1}</span>
                <Jersey color={e.color} number={e.number} className="h-9 w-9 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{e.name}</p>
                  <p className="text-xs text-chalk/60">
                    {e.correct}/{e.total} aciertos, {new Date(e.date).toLocaleDateString('es')}
                  </p>
                </div>
                <span className="led-text font-cond text-2xl font-bold">{e.score}</span>
              </li>
            ))}
          </ol>
        )}

        {list.length > 0 && (
          <button
            onClick={() => {
              clearHallOfFame()
              setList([])
            }}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-chalk/60 hover:text-redcard"
          >
            <Trash2 className="h-4 w-4" /> Borrar récords
          </button>
        )}
      </div>
    </div>
  )
}
