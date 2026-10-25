// Camiseta del jugador con su color y dorsal
function contrast(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#0a1a2f' : '#f4f7f0'
}

export default function Jersey({ color = '#e23b3b', number = 10, className = 'w-12 h-12', label }) {
  const ink = contrast(color)
  return (
    <svg viewBox="0 0 100 100" className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <path
        d="M34 8 L20 14 L4 30 L16 44 L24 38 L24 94 L76 94 L76 38 L84 44 L96 30 L80 14 L66 8 C62 16 38 16 34 8 Z"
        fill={color}
        stroke="rgb(4 33 15 / 0.6)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M34 8 C38 16 62 16 66 8" fill="none" stroke={ink} strokeOpacity="0.5" strokeWidth="3" />
      <text
        x="50"
        y="74"
        textAnchor="middle"
        fontFamily="Anton, Impact, sans-serif"
        fontSize="38"
        fill={ink}
      >
        {number}
      </text>
    </svg>
  )
}
