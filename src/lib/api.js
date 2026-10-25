import { storageGet, storageSet } from './utils.js'

// TheSportsDB: API pública de fútbol. La key "123" es la gratuita oficial.
// Puedes poner tu key premium en un archivo .env como VITE_SPORTSDB_KEY.
const API_KEY = import.meta.env?.VITE_SPORTSDB_KEY || '123'
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`

const CACHE_KEY = 'golazo.teams.v1'
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 horas

export const LEAGUES = [
  { id: 'English Premier League', label: 'Premier League' },
  { id: 'Spanish La Liga', label: 'LaLiga' },
  { id: 'Italian Serie A', label: 'Serie A' },
  { id: 'German Bundesliga', label: 'Bundesliga' },
  { id: 'French Ligue 1', label: 'Ligue 1' },
  { id: 'Colombian Liga DIMAYOR', label: 'Liga BetPlay' },
  { id: 'Argentinian Primera Division', label: 'Liga Argentina' },
  { id: 'Brazilian Serie A', label: 'Brasileirão' },
]

const COUNTRY_ES = {
  England: 'Inglaterra',
  Spain: 'España',
  Italy: 'Italia',
  Germany: 'Alemania',
  France: 'Francia',
  Colombia: 'Colombia',
  Argentina: 'Argentina',
  Brazil: 'Brasil',
  Portugal: 'Portugal',
  Netherlands: 'Países Bajos',
  Mexico: 'México',
  Wales: 'Gales',
  Monaco: 'Mónaco',
}

async function fetchJson(url, timeoutMs = 9000) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

function normalizeTeam(t, league) {
  const year = parseInt(t.intFormedYear, 10)
  return {
    id: t.idTeam,
    name: t.strTeam,
    league: league.label,
    badge: t.strBadge || null,
    stadium: t.strStadium?.trim() || null,
    year: year > 1800 && year < 2030 ? year : null,
    country: COUNTRY_ES[t.strCountry] || t.strCountry || null,
    color: t.strColour1 || null,
  }
}

/**
 * Descarga equipos de varias ligas de TheSportsDB.
 * Devuelve { teams, leagues } y guarda en caché 24 h para cuidar el límite de la API.
 */
export async function fetchTeams({ force = false } = {}) {
  const cached = storageGet(CACHE_KEY, null)
  if (!force && cached && Date.now() - cached.at < CACHE_TTL && cached.teams?.length) {
    return { teams: cached.teams, leagues: cached.leagues, fromCache: true }
  }

  const results = await Promise.allSettled(
    LEAGUES.map(async (league) => {
      const url = `${BASE}/search_all_teams.php?l=${encodeURIComponent(league.id.replaceAll(' ', '_'))}`
      const data = await fetchJson(url)
      const list = (data?.teams || []).filter((t) => t.strSport === 'Soccer')
      return { league, teams: list.map((t) => normalizeTeam(t, league)) }
    }),
  )

  const ok = results.filter((r) => r.status === 'fulfilled' && r.value.teams.length)
  const teams = ok.flatMap((r) => r.value.teams)
  const leagues = ok.map((r) => r.value.league.label)

  if (teams.length) storageSet(CACHE_KEY, { at: Date.now(), teams, leagues })
  return { teams, leagues, fromCache: false }
}

/** TheSportsDB sirve miniaturas agregando /small al final de la URL de la imagen. */
export const badgeSmall = (url) => (url ? `${url}/small` : null)
