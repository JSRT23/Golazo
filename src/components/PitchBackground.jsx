// Cancha nocturna: franjas de corte de césped, líneas de cal en perspectiva y reflectores.
export default function PitchBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-turf-900">
      {/* Franjas del césped */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'repeating-linear-gradient(180deg, #0e5a2e 0px, #0e5a2e 72px, #0b4f28 72px, #0b4f28 144px)',
        }}
      />

      {/* Líneas de la cancha en perspectiva */}
      <div className="absolute inset-x-0 bottom-[-18%] flex justify-center" style={{ perspective: '900px' }}>
        <svg
          viewBox="0 0 680 1050"
          className="w-[150vw] max-w-[1500px] opacity-50"
          style={{ transform: 'rotateX(58deg)', transformOrigin: '50% 100%' }}
          fill="none"
          stroke="#f4f7f0"
          strokeWidth="5"
        >
          <rect x="20" y="20" width="640" height="1010" />
          <line x1="20" y1="525" x2="660" y2="525" />
          <circle cx="340" cy="525" r="92" />
          <circle cx="340" cy="525" r="5" fill="#f4f7f0" />
          {/* Área superior */}
          <rect x="138" y="20" width="404" height="165" />
          <rect x="248" y="20" width="184" height="55" />
          <path d="M 266 185 A 92 92 0 0 0 414 185" />
          <circle cx="340" cy="130" r="4" fill="#f4f7f0" />
          {/* Área inferior */}
          <rect x="138" y="865" width="404" height="165" />
          <rect x="248" y="975" width="184" height="55" />
          <path d="M 266 865 A 92 92 0 0 1 414 865" />
          <circle cx="340" cy="920" r="4" fill="#f4f7f0" />
          {/* Esquinas */}
          <path d="M20 40 A20 20 0 0 0 40 20 M640 20 A20 20 0 0 0 660 40 M20 1010 A20 20 0 0 1 40 1030 M660 1010 A20 20 0 0 0 640 1030" />
        </svg>
      </div>

      {/* Reflectores del estadio */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 45% at 8% -5%, rgb(255 250 220 / 0.22), transparent 60%), radial-gradient(60% 45% at 92% -5%, rgb(255 250 220 / 0.22), transparent 60%)',
        }}
      />
      {/* Viñeta para que el contenido se lea bien */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 40%, transparent 30%, rgb(4 33 15 / 0.75) 100%), linear-gradient(180deg, rgb(4 33 15 / 0.55), transparent 30%, transparent 70%, rgb(4 33 15 / 0.6))',
        }}
      />
    </div>
  )
}
