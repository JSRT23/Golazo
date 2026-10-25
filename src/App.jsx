import { useReducer, useState, useCallback } from 'react'
import PitchBackground from './components/PitchBackground.jsx'
import Header from './components/Header.jsx'
import HallOfFame from './components/HallOfFame.jsx'
import Home from './screens/Home.jsx'
import Players from './screens/Players.jsx'
import Setup from './screens/Setup.jsx'
import Loading from './screens/Loading.jsx'
import Turn from './screens/Turn.jsx'
import Question from './screens/Question.jsx'
import RoundEnd from './screens/RoundEnd.jsx'
import Final from './screens/Final.jsx'
import { reducer, initialState } from './game/reducer.js'

const IN_GAME = ['loading', 'turn', 'question', 'roundEnd']

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [hofOpen, setHofOpen] = useState(false)
  const inGame = IN_GAME.includes(state.phase)

  const goHome = () => {
    if (inGame && !window.confirm('¿Abandonar el partido? Se perderá el marcador.')) return
    dispatch({ type: 'NEW_GAME' })
  }
  const closeHof = useCallback(() => setHofOpen(false), [])

  const { phase, players, settings } = state
  const currentQ = state.questions[state.round * players.length + state.turn]

  return (
    <div className="relative isolate flex min-h-dvh flex-col">
      <PitchBackground />
      <Header onHome={goHome} onHallOfFame={() => setHofOpen(true)} inGame={inGame} />

      {phase === 'home' && <Home onStart={() => dispatch({ type: 'GO', phase: 'players' })} onHallOfFame={() => setHofOpen(true)} />}
      {phase === 'players' && <Players players={players} dispatch={dispatch} />}
      {phase === 'setup' && <Setup players={players} settings={settings} dispatch={dispatch} />}
      {phase === 'loading' && <Loading players={players} settings={settings} dispatch={dispatch} />}
      {phase === 'turn' && <Turn key={`${state.round}-${state.turn}`} state={state} dispatch={dispatch} />}
      {phase === 'question' && currentQ && <Question key={currentQ.id} state={state} dispatch={dispatch} />}
      {phase === 'roundEnd' && <RoundEnd state={state} dispatch={dispatch} />}
      {phase === 'final' && <Final state={state} dispatch={dispatch} />}

      <footer className="px-4 pb-4 pt-6 text-center text-xs text-chalk/40">
        Datos de clubes por TheSportsDB. Banderas por flagcdn.
      </footer>

      <HallOfFame open={hofOpen} onClose={closeHof} />
    </div>
  )
}
