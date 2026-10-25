// Efectos sintetizados con Web Audio API: sin archivos de audio que descargar.
import { storageGet, storageSet } from './utils.js'

let ctx = null
let muted = storageGet('golazo.muted', false)

function audio() {
  if (muted) return null
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone({ freq, type = 'sine', start = 0, dur = 0.2, gain = 0.15, vibrato = 0, slideTo }) {
  const ac = audio()
  if (!ac) return
  const t0 = ac.currentTime + start
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
  if (vibrato) {
    const lfo = ac.createOscillator()
    const lfoGain = ac.createGain()
    lfo.frequency.value = 38
    lfoGain.gain.value = vibrato
    lfo.connect(lfoGain).connect(osc.frequency)
    lfo.start(t0)
    lfo.stop(t0 + dur)
  }
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export const sound = {
  isMuted: () => muted,
  setMuted(v) {
    muted = v
    storageSet('golazo.muted', v)
  },
  // Silbato del árbitro: dos pitidos con trino
  whistle(long = false) {
    tone({ freq: 2600, type: 'square', dur: 0.18, gain: 0.05, vibrato: 140 })
    tone({ freq: 2600, type: 'square', start: 0.24, dur: long ? 0.7 : 0.3, gain: 0.05, vibrato: 140 })
  },
  goal() {
    ;[523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, type: 'triangle', start: i * 0.08, dur: 0.35, gain: 0.18 }))
  },
  miss() {
    tone({ freq: 220, type: 'sawtooth', dur: 0.35, gain: 0.08, slideTo: 110 })
  },
  tick() {
    tone({ freq: 1200, type: 'sine', dur: 0.05, gain: 0.06 })
  },
  tap() {
    tone({ freq: 660, type: 'sine', dur: 0.06, gain: 0.05 })
  },
}
