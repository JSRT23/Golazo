import { NATIONS, flagUrl } from '../data/nations.js'
import { TRIVIA } from '../data/triviaBank.js'
import { badgeSmall } from './api.js'
import { shuffle, pick, uid } from './utils.js'

export const CATEGORIES = [
  { id: 'escudos', label: 'Escudos', hint: 'Adivina el club por su escudo', source: 'TheSportsDB', needsApi: true },
  { id: 'estadios', label: 'Estadios', hint: '¿Dónde juega de local?', source: 'TheSportsDB', needsApi: true },
  { id: 'fundacion', label: 'Fundación', hint: 'El año en que nació el club', source: 'TheSportsDB', needsApi: true },
  { id: 'paises', label: 'Ligas del mundo', hint: '¿En qué país juega el club?', source: 'TheSportsDB', needsApi: true },
  { id: 'banderas', label: 'Selecciones', hint: 'Reconoce la bandera', source: 'flagcdn', needsApi: false },
  { id: 'historia', label: 'Historia y cracks', hint: 'Mundiales, Champions, reglas', source: 'Banco Golazo', needsApi: false },
]

export const categoryById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

function build(correct, distractors) {
  const options = shuffle([correct, ...distractors.slice(0, 3)])
  return { options, answer: options.indexOf(correct) }
}

function uniqueValues(list, exclude) {
  const seen = new Set([exclude])
  const out = []
  for (const v of list) {
    if (v && !seen.has(v)) {
      seen.add(v)
      out.push(v)
    }
  }
  return out
}

// Elige distractores priorizando un grupo "parecido" (misma liga, misma confederación…)
function distractorsFrom(primary, fallback, correct, n = 3) {
  const a = uniqueValues(shuffle(primary), correct)
  if (a.length >= n) return a.slice(0, n)
  const b = uniqueValues(shuffle(fallback), correct).filter((v) => !a.includes(v))
  return [...a, ...b].slice(0, n)
}

const generators = {
  escudos(ctx) {
    const team = ctx.takeTeam('escudos', (t) => t.badge)
    if (!team) return null
    const ds = distractorsFrom(
      ctx.teams.filter((t) => t.league === team.league).map((t) => t.name),
      ctx.teams.map((t) => t.name),
      team.name,
    )
    if (ds.length < 3) return null
    return {
      prompt: '¿De qué club es este escudo?',
      image: badgeSmall(team.badge),
      imageFull: team.badge,
      imageKind: 'badge',
      detail: team.league,
      ...build(team.name, ds),
    }
  },

  estadios(ctx) {
    const team = ctx.takeTeam('estadios', (t) => t.stadium)
    if (!team) return null
    const ds = distractorsFrom(
      ctx.teams.filter((t) => t.league === team.league).map((t) => t.stadium),
      ctx.teams.map((t) => t.stadium),
      team.stadium,
    )
    if (ds.length < 3) return null
    return {
      prompt: `¿Cuál es el estadio de ${team.name}?`,
      image: badgeSmall(team.badge),
      imageFull: team.badge,
      imageKind: 'badge',
      detail: team.league,
      ...build(team.stadium, ds),
    }
  },

  fundacion(ctx) {
    const team = ctx.takeTeam('fundacion', (t) => t.year)
    if (!team) return null
    const others = ctx.teams.map((t) => t.year).filter((y) => y && Math.abs(y - team.year) >= 3)
    const ds = uniqueValues(shuffle(others), team.year).slice(0, 3)
    // Si faltan años, inventamos cercanos pero distinguibles
    let offset = 4
    while (ds.length < 3) {
      const candidate = team.year + (Math.random() < 0.5 ? -offset : offset)
      if (!ds.includes(candidate) && candidate !== team.year && candidate < 2025) ds.push(candidate)
      offset += 3
    }
    return {
      prompt: `¿En qué año se fundó ${team.name}?`,
      image: badgeSmall(team.badge),
      imageFull: team.badge,
      imageKind: 'badge',
      detail: team.league,
      ...build(String(team.year), ds.map(String)),
    }
  },

  paises(ctx) {
    const team = ctx.takeTeam('paises', (t) => t.country)
    if (!team) return null
    const ds = distractorsFrom(
      ctx.teams.map((t) => t.country),
      ['Inglaterra', 'España', 'Italia', 'Alemania', 'Francia', 'Colombia', 'Argentina', 'Brasil', 'Portugal', 'México'],
      team.country,
    )
    return {
      prompt: `¿En qué país juega ${team.name}?`,
      image: badgeSmall(team.badge),
      imageFull: team.badge,
      imageKind: 'badge',
      ...build(team.country, ds),
    }
  },

  banderas(ctx) {
    const nation = ctx.take('banderas', NATIONS, (n) => n.code)
    if (!nation) return null
    const ds = distractorsFrom(
      NATIONS.filter((n) => n.conf === nation.conf).map((n) => n.name),
      NATIONS.map((n) => n.name),
      nation.name,
    )
    return {
      prompt: '¿De qué selección es esta bandera?',
      image: flagUrl(nation.code),
      imageKind: 'flag',
      detail: nation.conf,
      ...build(nation.name, ds),
    }
  },

  historia(ctx) {
    const item = ctx.take('historia', TRIVIA, (t) => t.q)
    if (!item) return null
    const [correct, ...rest] = item.options
    return {
      prompt: item.q,
      level: item.level,
      ...build(correct, rest),
    }
  },
}

/**
 * Genera `count` preguntas mezclando las categorías elegidas.
 * Si la API no respondió, las categorías que dependen de ella se reemplazan
 * por banderas e historia para que el partido nunca se quede sin preguntas.
 */
export function generateQuestions({ teams = [], count, categories }) {
  const used = new Set()
  const ctx = {
    teams,
    take(cat, list, keyOf) {
      const free = list.filter((x) => !used.has(`${cat}:${keyOf(x)}`))
      if (!free.length) return null
      const choice = pick(free)
      used.add(`${cat}:${keyOf(choice)}`)
      return choice
    },
    takeTeam(cat, valid) {
      return this.take(cat, teams.filter(valid), (t) => t.id)
    },
  }

  let active = categories.filter((id) => !categoryById[id]?.needsApi || teams.length >= 4)
  if (!active.length) active = ['historia', 'banderas']

  const questions = []
  let cycle = []
  let guard = 0
  while (questions.length < count && guard < count * 20) {
    guard++
    if (!cycle.length) cycle = shuffle(active)
    const cat = cycle.pop()
    const q = generators[cat]?.(ctx)
    if (q) {
      questions.push({ id: uid(), cat, source: categoryById[cat].source, ...q })
    } else {
      active = active.filter((c) => c !== cat)
      if (!active.length) active = ['historia', 'banderas'].filter((c) => c !== cat)
    }
  }
  return questions
}

/** Puntos de una respuesta correcta. */
export function scoreAnswer({ timeLeft, seconds, streak, usedVar }) {
  const base = 100
  const speed = Math.round(50 * Math.max(0, timeLeft) / seconds)
  const streakBonus = Math.min(100, 25 * Math.max(0, streak - 1))
  const varPenalty = usedVar ? 30 : 0
  return {
    total: Math.max(0, base + speed + streakBonus - varPenalty),
    base,
    speed,
    streakBonus,
    varPenalty,
  }
}
