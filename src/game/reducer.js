import { CATEGORIES, scoreAnswer } from '../lib/questions.js'
import { uid } from '../lib/utils.js'

export const KIT_COLORS = [
  { id: 'rojo', hex: '#e23b3b', name: 'Rojo' },
  { id: 'azul', hex: '#2563eb', name: 'Azul' },
  { id: 'amarillo', hex: '#facc15', name: 'Amarillo' },
  { id: 'blanco', hex: '#f4f7f0', name: 'Blanco' },
  { id: 'negro', hex: '#1f2937', name: 'Negro' },
  { id: 'celeste', hex: '#7dd3fc', name: 'Celeste' },
  { id: 'naranja', hex: '#f97316', name: 'Naranja' },
  { id: 'morado', hex: '#8b5cf6', name: 'Morado' },
]

export const MAX_PLAYERS = 8

export const initialState = {
  phase: 'home', // home | players | setup | loading | turn | question | roundEnd | final
  players: [],
  settings: {
    rounds: 3,
    seconds: 20,
    categories: CATEGORIES.map((c) => c.id),
  },
  questions: [],
  round: 0,
  turn: 0,
  last: null,
  prevRanking: [],
  apiInfo: null,
}

const freshStats = { score: 0, correct: 0, answered: 0, streak: 0, bestStreak: 0, varUsed: false }

export function ranking(players) {
  return [...players].sort((a, b) => b.score - a.score || b.correct - a.correct || a.name.localeCompare(b.name))
}

export function reducer(state, action) {
  switch (action.type) {
    case 'GO':
      return { ...state, phase: action.phase }

    case 'ADD_PLAYER': {
      if (state.players.length >= MAX_PLAYERS) return state
      const player = { id: uid(), name: action.name, color: action.color, number: action.number, ...freshStats }
      return { ...state, players: [...state.players, player] }
    }

    case 'REMOVE_PLAYER':
      return { ...state, players: state.players.filter((p) => p.id !== action.id) }

    case 'SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } }

    case 'START_LOADING':
      return {
        ...state,
        phase: 'loading',
        players: state.players.map((p) => ({ ...p, ...freshStats })),
        questions: [],
        round: 0,
        turn: 0,
        last: null,
        prevRanking: [],
      }

    case 'QUESTIONS_READY':
      return { ...state, questions: action.questions, apiInfo: action.apiInfo, phase: 'turn' }

    case 'BEGIN_TURN':
      return { ...state, phase: 'question', last: null }

    case 'USE_VAR':
      return {
        ...state,
        players: state.players.map((p) => (p.id === action.playerId ? { ...p, varUsed: true } : p)),
      }

    case 'ANSWER': {
      if (state.last) return state // evita doble respuesta
      const idx = state.round * state.players.length + state.turn
      const q = state.questions[idx]
      const player = state.players[state.turn]
      const correct = action.chosen === q.answer
      const streak = correct ? player.streak + 1 : 0
      const points = correct
        ? scoreAnswer({ timeLeft: action.timeLeft, seconds: state.settings.seconds, streak, usedVar: action.usedVar })
        : null
      const players = state.players.map((p) =>
        p.id === player.id
          ? {
              ...p,
              score: p.score + (points?.total || 0),
              correct: p.correct + (correct ? 1 : 0),
              answered: p.answered + 1,
              streak,
              bestStreak: Math.max(p.bestStreak, streak),
            }
          : p,
      )
      return {
        ...state,
        players,
        last: { chosen: action.chosen, correct, timeout: action.chosen === null, points, streak },
      }
    }

    case 'NEXT': {
      const lastTurn = state.turn >= state.players.length - 1
      if (!lastTurn) return { ...state, turn: state.turn + 1, phase: 'turn', last: null }
      const lastRound = state.round >= state.settings.rounds - 1
      return { ...state, phase: lastRound ? 'final' : 'roundEnd', last: null }
    }

    case 'NEXT_ROUND':
      return {
        ...state,
        prevRanking: ranking(state.players).map((p) => p.id),
        round: state.round + 1,
        turn: 0,
        phase: 'turn',
      }

    case 'NEW_GAME':
      return { ...initialState, settings: state.settings }

    default:
      return state
  }
}
