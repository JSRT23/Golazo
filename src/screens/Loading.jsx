import { useEffect, useState } from 'react'
import SoccerBall from '../components/SoccerBall.jsx'
import { fetchTeams } from '../lib/api.js'
import { generateQuestions, categoryById } from '../lib/questions.js'

const MESSAGES = ['Calentando en la banda', 'Revisando los escudos', 'Inflando los balones', 'Marcando la cancha con cal']

export default function Loading({ players, settings, dispatch }) {
  const [msg, setMsg] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 900)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    const started = Date.now()

    async function prepare() {
      const needsApi = settings.categories.some((c) => categoryById[c]?.needsApi)
      let teams = []
      let leagues = []
      let failed = false
      if (needsApi) {
        try {
          const res = await fetchTeams()
          teams = res.teams
          leagues = res.leagues
          failed = teams.length === 0
        } catch {
          failed = true
        }
      }
      const questions = generateQuestions({
        teams,
        count: settings.rounds * players.length,
        categories: settings.categories,
      })
      // Pequeña pausa para que la animación se vea aunque la API responda rápido
      const wait = Math.max(0, 1200 - (Date.now() - started))
      setTimeout(() => {
        if (!cancelled) dispatch({ type: 'QUESTIONS_READY', questions, apiInfo: { needsApi, failed, leagues } })
      }, wait)
    }

    prepare()
    return () => {
      cancelled = true
    }
  }, [players.length, settings, dispatch])

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center" aria-live="polite">
      <SoccerBall spinning className="h-24 w-24 drop-shadow-[0_12px_20px_rgb(0_0_0/0.5)]" />
      <p className="mt-6 font-display text-3xl">{MESSAGES[msg]}</p>
      <p className="mt-2 text-chalk/60">Preparando {settings.rounds * players.length} preguntas</p>
    </main>
  )
}
