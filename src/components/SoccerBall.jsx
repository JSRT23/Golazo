export default function SoccerBall({ className = '', spinning = false }) {
  return (
    <svg viewBox="0 0 64 64" className={`${className} ${spinning ? 'animate-roll' : ''}`} aria-hidden="true">
      <circle cx="32" cy="32" r="29" fill="#f4f7f0" stroke="#04210f" strokeWidth="2.5" />
      <path d="M32 20l10 7.3-3.8 11.8H25.8L22 27.3z" fill="#04210f" />
      <path
        d="M32 3.5V20M42 27.3l14.6-5.2M38.2 39.1l9 12.4M25.8 39.1l-9 12.4M22 27.3L7.4 22.1"
        stroke="#04210f"
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M24 5.5l8 4 8-4M56.6 22.1l-1 8.8 5.2 6.4M47.2 51.5l-8.4 1.6-3.8 7.2M16.8 51.5l8.4 1.6 3.8 7.2M7.4 22.1l1 8.8-5.2 6.4" stroke="#04210f" strokeWidth="2" fill="none" />
    </svg>
  )
}
