// Banco propio de preguntas en español.
// La primera opción de cada pregunta es la correcta; el juego las baraja.
// level: 1 fácil, 2 media, 3 difícil
export const TRIVIA = [
  // Mundiales
  { q: '¿Qué selección ganó el Mundial de Catar 2022?', options: ['Argentina', 'Francia', 'Croacia', 'Brasil'], level: 1 },
  { q: '¿Quién marcó un hat-trick en la final del Mundial 2022?', options: ['Kylian Mbappé', 'Lionel Messi', 'Ángel Di María', 'Olivier Giroud'], level: 2 },
  { q: '¿Qué selección tiene más Copas del Mundo?', options: ['Brasil', 'Alemania', 'Italia', 'Argentina'], level: 1 },
  { q: '¿En qué país se jugó el primer Mundial, en 1930?', options: ['Uruguay', 'Italia', 'Brasil', 'Francia'], level: 2 },
  { q: '¿Qué selección ganó el Mundial de Sudáfrica 2010?', options: ['España', 'Países Bajos', 'Alemania', 'Uruguay'], level: 1 },
  { q: '¿Quién marcó el gol del título de España en la final del Mundial 2010?', options: ['Andrés Iniesta', 'David Villa', 'Fernando Torres', 'Xavi Hernández'], level: 2 },
  { q: '¿Quién es el máximo goleador en la historia de los Mundiales?', options: ['Miroslav Klose', 'Ronaldo Nazário', 'Lionel Messi', 'Gerd Müller'], level: 2 },
  { q: '¿Con qué marcador ganó Alemania a Brasil en la semifinal del Mundial 2014?', options: ['7-1', '5-0', '4-1', '6-2'], level: 1 },
  { q: '¿Quién ganó la Bota de Oro del Mundial 2014?', options: ['James Rodríguez', 'Thomas Müller', 'Lionel Messi', 'Neymar'], level: 2 },
  { q: '¿Cuántos Mundiales ganó Pelé como jugador?', options: ['3', '2', '4', '1'], level: 2 },
  { q: '¿Contra qué selección marcó Maradona "la mano de Dios" en 1986?', options: ['Inglaterra', 'Alemania', 'Bélgica', 'Italia'], level: 1 },
  { q: '¿Qué selección ganó el Mundial de Francia 1998?', options: ['Francia', 'Brasil', 'Croacia', 'Italia'], level: 1 },
  { q: '¿Con qué país organizó Japón el Mundial 2002?', options: ['Corea del Sur', 'China', 'Australia', 'Catar'], level: 2 },
  { q: '¿Qué selección africana llegó a semifinales en Catar 2022?', options: ['Marruecos', 'Senegal', 'Camerún', 'Ghana'], level: 2 },
  { q: '¿Qué tres países organizan el Mundial 2026?', options: ['Estados Unidos, México y Canadá', 'Estados Unidos, México y Costa Rica', 'Canadá, Estados Unidos y Jamaica', 'México, Colombia y Estados Unidos'], level: 1 },
  { q: '¿Qué selección ganó el Mundial Femenino 2023?', options: ['España', 'Inglaterra', 'Estados Unidos', 'Suecia'], level: 2 },

  // Selecciones y torneos continentales
  { q: '¿Qué selección ganó la Eurocopa 2024?', options: ['España', 'Inglaterra', 'Francia', 'Países Bajos'], level: 1 },
  { q: '¿Contra quién ganó Argentina la final de la Copa América 2024?', options: ['Colombia', 'Uruguay', 'Brasil', 'Canadá'], level: 2 },
  { q: '¿En qué año ganó Colombia su primera Copa América?', options: ['2001', '1995', '2004', '1990'], level: 2 },
  { q: '¿Quién es el máximo goleador histórico de la Selección Colombia?', options: ['Radamel Falcao', 'James Rodríguez', 'Arnoldo Iguarán', 'Carlos Valderrama'], level: 2 },
  { q: '¿Qué arquero colombiano hizo famoso el "escorpión" en Wembley en 1995?', options: ['René Higuita', 'Óscar Córdoba', 'David Ospina', 'Faryd Mondragón'], level: 1 },
  { q: '¿Qué club colombiano ganó la Copa Libertadores en 2004?', options: ['Once Caldas', 'Atlético Nacional', 'América de Cali', 'Deportivo Cali'], level: 3 },
  { q: '¿Qué club tiene más Copas Libertadores?', options: ['Independiente', 'Boca Juniors', 'River Plate', 'Peñarol'], level: 3 },
  { q: '¿Qué equipos juegan el Superclásico argentino?', options: ['Boca Juniors y River Plate', 'Racing e Independiente', 'San Lorenzo y Huracán', 'Rosario Central y Newell\'s'], level: 1 },

  // Clubes y competiciones europeas
  { q: '¿Qué club ha ganado más veces la Champions League?', options: ['Real Madrid', 'AC Milan', 'Bayern Múnich', 'Liverpool'], level: 1 },
  { q: '¿Qué club ganó la Champions League 2024-25?', options: ['Paris Saint-Germain', 'Inter de Milán', 'Arsenal', 'Barcelona'], level: 2 },
  { q: '¿Qué club ganó la Premier League 2024-25?', options: ['Liverpool', 'Arsenal', 'Manchester City', 'Chelsea'], level: 2 },
  { q: '¿Qué club ganó la Premier League sin perder un partido en 2003-04?', options: ['Arsenal', 'Chelsea', 'Manchester United', 'Liverpool'], level: 2 },
  { q: '¿Quién es el máximo goleador en la historia de la Champions League?', options: ['Cristiano Ronaldo', 'Lionel Messi', 'Robert Lewandowski', 'Raúl González'], level: 1 },
  { q: '¿Qué entrenador dirigió al Barcelona en el sextete de 2009?', options: ['Pep Guardiola', 'Frank Rijkaard', 'Luis Enrique', 'Tito Vilanova'], level: 2 },
  { q: '¿Qué apodo tiene el Manchester United?', options: ['Los Diablos Rojos', 'Los Citizens', 'Los Gunners', 'Los Reds'], level: 1 },
  { q: '¿Cuántos goles marcó Erling Haaland en su récord de la Premier 2022-23?', options: ['36', '32', '34', '38'], level: 3 },
  { q: '¿En qué club debutó Lionel Messi como profesional?', options: ['FC Barcelona', 'Newell\'s Old Boys', 'River Plate', 'PSG'], level: 1 },

  // Balón de Oro
  { q: '¿Qué jugador tiene más Balones de Oro?', options: ['Lionel Messi', 'Cristiano Ronaldo', 'Michel Platini', 'Johan Cruyff'], level: 1 },
  { q: '¿Quién ganó el Balón de Oro 2024?', options: ['Rodri', 'Vinícius Júnior', 'Jude Bellingham', 'Dani Carvajal'], level: 2 },
  { q: '¿Quién ganó el Balón de Oro 2025?', options: ['Ousmane Dembélé', 'Lamine Yamal', 'Mohamed Salah', 'Raphinha'], level: 2 },

  // Reglas
  { q: '¿Cuántos jugadores tiene cada equipo en la cancha?', options: ['11', '10', '12', '9'], level: 1 },
  { q: '¿Cuántos minutos dura un partido sin contar el añadido?', options: ['90', '80', '100', '120'], level: 1 },
  { q: '¿Desde qué distancia se cobra un penal?', options: ['11 metros', '9 metros', '12 metros', '16 metros'], level: 2 },
  { q: '¿Cuántas amarillas en un mismo partido equivalen a una expulsión?', options: ['2', '3', '1', '4'], level: 1 },
  { q: '¿Cuántos cambios permite hoy el reglamento en un partido oficial (sin prórroga)?', options: ['5', '3', '4', '6'], level: 2 },
  { q: '¿Qué significa VAR?', options: ['Árbitro asistente de video', 'Video de análisis de repetición', 'Validación automática de resultado', 'Vista amplia del réferi'], level: 1 },
  { q: '¿A cuántos metros de la pelota debe ponerse la barrera en un tiro libre?', options: ['9,15 metros', '7 metros', '11 metros', '10,5 metros'], level: 3 },
  { q: '¿Qué se cobra si el balón sale por la línea de fondo tocado por un defensor?', options: ['Tiro de esquina', 'Saque de meta', 'Saque de banda', 'Tiro libre indirecto'], level: 1 },
]
