import { storageGet, storageSet } from './utils.js'

const KEY = 'golazo.hof.v1'

export const getHallOfFame = () => storageGet(KEY, [])

export function saveToHallOfFame(entries) {
  const list = [...getHallOfFame(), ...entries]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
  storageSet(KEY, list)
  return list
}

export const clearHallOfFame = () => storageSet(KEY, [])
