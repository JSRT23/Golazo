# ⚽ Golazo · Trivia futbolera

Juego de preguntas de fútbol por turnos para jugar entre amigos en un mismo dispositivo.
Registra de 1 a 8 jugadores, elige rondas y tiempo, y respondan preguntas de 4 opciones.
Gana el que más puntos sume.

Hecho con **React 19 + Vite + Tailwind CSS v4** e iconos de **lucide-react**.

## Cómo se juega

1. **Alineación:** cada jugador pone su nombre, color de camiseta y dorsal.
2. **Reglas:** 3, 5 u 8 rondas; 10, 20 o 30 segundos por pregunta; eliges las categorías.
3. **Partido:** en cada ronda, cada jugador responde una pregunta. Se pasa el celular entre turnos.
4. **Tabla:** al final de cada ronda se ve la tabla de posiciones con quién sube y quién baja.
5. **Final:** podio, estadísticas y los mejores puntajes quedan en el Salón de la fama.

### Puntuación

| Jugada | Puntos |
| --- | --- |
| Respuesta correcta | +100 |
| Velocidad | hasta +50 (según el tiempo que sobre) |
| Racha | +25 por cada acierto seguido (máx. +100) |
| VAR (quita 2 opciones, una vez por partido) | −30 |

## Categorías y APIs

| Categoría | Fuente |
| --- | --- |
| Escudos, Estadios, Fundación, Ligas del mundo | [TheSportsDB](https://www.thesportsdb.com/documentation) (gratis, key `123`) |
| Selecciones (banderas) | [flagcdn](https://flagcdn.com) (gratis, sin key) |
| Historia y cracks | Banco propio en español (`src/data/triviaBank.js`) |

Las preguntas de clubes se generan en vivo con equipos de Premier League, LaLiga, Serie A,
Bundesliga, Ligue 1, Liga BetPlay, Liga Argentina y Brasileirão. Los datos se guardan
24 h en el navegador para no gastar el límite de la API (30 peticiones/minuto en el plan gratis).
Si la API no responde, el juego sigue con banderas e historia.

> La key gratuita de TheSportsDB devuelve 10 equipos por liga. Si tienes una key premium,
> crea un archivo `.env` con `VITE_SPORTSDB_KEY=tu_key` (y agrégala también en Vercel).

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Subir a GitHub

1. Crea un repositorio vacío en https://github.com/new (por ejemplo `golazo-trivia`), sin README.
2. En la carpeta del proyecto:

```bash
git init
git add .
git commit -m "Golazo: trivia futbolera"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/golazo-trivia.git
git push -u origin main
```

## Publicar en Vercel

1. Entra a https://vercel.com/new e inicia sesión con GitHub.
2. Importa el repositorio `golazo-trivia`.
3. Vercel detecta **Vite** solo. Deja los valores por defecto:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. (Opcional) En *Environment Variables* agrega `VITE_SPORTSDB_KEY` si tienes key premium.
5. Pulsa **Deploy**. Cada `git push` a `main` vuelve a publicar automáticamente.

También puedes hacerlo desde la terminal:

```bash
npm i -g vercel
vercel        # primera vez: vincula el proyecto
vercel --prod # publica en producción
```

## Estructura

```
src/
  App.jsx                 Flujo de pantallas
  game/reducer.js         Estado del partido, turnos y puntuación
  lib/api.js              TheSportsDB + caché
  lib/questions.js        Generador de preguntas y cálculo de puntos
  lib/sound.js            Silbato y efectos con Web Audio (sin archivos)
  lib/hallOfFame.js       Récords en localStorage
  data/triviaBank.js      Preguntas de historia y reglas
  data/nations.js         Selecciones para banderas
  components/             Cancha de fondo, camisetas, reloj, marcador
  screens/                Inicio, Alineación, Reglas, Turno, Pregunta, Tabla, Final
```

## Agregar preguntas

Edita `src/data/triviaBank.js`. La **primera opción es la correcta**; el juego las baraja:

```js
{ q: '¿Quién ganó el Mundial 2018?', options: ['Francia', 'Croacia', 'Bélgica', 'Inglaterra'], level: 1 },
```
