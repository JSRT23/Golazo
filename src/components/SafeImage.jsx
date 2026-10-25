import { useState } from 'react'
import { ImageOff } from 'lucide-react'

// Imagen con respaldo: si la miniatura falla prueba la original y si no, muestra un icono.
export default function SafeImage({ src, fallbackSrc, alt, className }) {
  const [current, setCurrent] = useState(src)
  const [failed, setFailed] = useState(false)

  if (failed || !current) {
    return (
      <div className={`grid place-items-center text-chalk/40 ${className}`} role="img" aria-label={alt}>
        <ImageOff className="h-10 w-10" />
      </div>
    )
  }
  return (
    <img
      src={current}
      alt={alt}
      className={className}
      draggable="false"
      onError={() => {
        if (fallbackSrc && current !== fallbackSrc) setCurrent(fallbackSrc)
        else setFailed(true)
      }}
    />
  )
}
