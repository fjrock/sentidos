export const senses = [
  {
    id: 'vista',
    name: 'La Visión',
    organ: 'Los Ojos',
    icon: '👁️',
    organIcon: '👀',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    bgColor: '#dbeafe',
    description: 'Con los ojos podemos ver los colores, las formas y todo lo que nos rodea.',
    funFact: 'Tus ojos pueden ver millones de colores diferentes!',
    questions: [
      {
        question: 'Que usamos para ver?',
        options: [
          { text: 'Los ojos', icon: '👀', correct: true },
          { text: 'Las manos', icon: '✋', correct: false },
          { text: 'La nariz', icon: '👃', correct: false },
        ]
      },
      {
        question: 'De que color es el sol?',
        options: [
          { text: 'Azul', icon: '🔵', correct: false },
          { text: 'Amarillo', icon: '🟡', correct: true },
          { text: 'Verde', icon: '🟢', correct: false },
        ]
      },
      {
        question: 'Cual de estos es redondo?',
        options: [
          { text: 'Una pelota', icon: '⚽', correct: true },
          { text: 'Un libro', icon: '📖', correct: false },
          { text: 'Una regla', icon: '📏', correct: false },
        ]
      },
      {
        question: 'Que podemos ver en el cielo de noche?',
        options: [
          { text: 'Estrellas', icon: '⭐', correct: true },
          { text: 'Flores', icon: '🌸', correct: false },
          { text: 'Peces', icon: '🐟', correct: false },
        ]
      },
      {
        question: 'De que color es el pasto?',
        options: [
          { text: 'Rojo', icon: '🔴', correct: false },
          { text: 'Verde', icon: '🟢', correct: true },
          { text: 'Morado', icon: '🟣', correct: false },
        ]
      },
    ]
  },
  {
    id: 'oido',
    name: 'La Audición',
    organ: 'Los Oidos',
    icon: '👂',
    organIcon: '👂',
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    bgColor: '#d1fae5',
    description: 'Con los oidos podemos escuchar los sonidos, la musica y las voces.',
    funFact: 'Tus oidos nunca dejan de escuchar, ni cuando duermes!',
    questions: [
      {
        question: 'Que usamos para escuchar?',
        options: [
          { text: 'La boca', icon: '👄', correct: false },
          { text: 'Los oidos', icon: '👂', correct: true },
          { text: 'Los pies', icon: '🦶', correct: false },
        ]
      },
      {
        question: 'Que animal hace "muu"?',
        options: [
          { text: 'El gato', icon: '🐱', correct: false },
          { text: 'La vaca', icon: '🐮', correct: true },
          { text: 'El perro', icon: '🐕', correct: false },
        ]
      },
      {
        question: 'Que instrumento tiene teclas blancas y negras?',
        options: [
          { text: 'La guitarra', icon: '🎸', correct: false },
          { text: 'El tambor', icon: '🥁', correct: false },
          { text: 'El piano', icon: '🎹', correct: true },
        ]
      },
      {
        question: 'Que sonido hace la lluvia?',
        options: [
          { text: 'Ring ring', icon: '🔔', correct: false },
          { text: 'Plic plac', icon: '🌧️', correct: true },
          { text: 'Guau guau', icon: '🐕', correct: false },
        ]
      },
      {
        question: 'Que animal canta por las mananas?',
        options: [
          { text: 'El gallo', icon: '🐓', correct: true },
          { text: 'El pez', icon: '🐟', correct: false },
          { text: 'La tortuga', icon: '🐢', correct: false },
        ]
      },
    ]
  },
  {
    id: 'olfato',
    name: 'El Olfato',
    organ: 'La Nariz',
    icon: '👃',
    organIcon: '👃',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    bgColor: '#ffedd5',
    description: 'Con la nariz podemos oler las flores, la comida y muchas cosas mas.',
    funFact: 'Tu nariz puede reconocer mas de 10,000 olores diferentes!',
    questions: [
      {
        question: 'Que usamos para oler?',
        options: [
          { text: 'Los ojos', icon: '👀', correct: false },
          { text: 'La nariz', icon: '👃', correct: true },
          { text: 'Las orejas', icon: '👂', correct: false },
        ]
      },
      {
        question: 'Que huele muy rico?',
        options: [
          { text: 'Una flor', icon: '🌹', correct: true },
          { text: 'Una piedra', icon: '🪨', correct: false },
          { text: 'Un zapato', icon: '👟', correct: false },
        ]
      },
      {
        question: 'Que huele rico en la cocina?',
        options: [
          { text: 'Galletas horneadas', icon: '🍪', correct: true },
          { text: 'Un vaso vacio', icon: '🥛', correct: false },
          { text: 'Un tenedor', icon: '🍴', correct: false },
        ]
      },
      {
        question: 'Que fruta tiene un olor muy fuerte?',
        options: [
          { text: 'La manzana', icon: '🍎', correct: false },
          { text: 'La naranja', icon: '🍊', correct: true },
          { text: 'La uva', icon: '🍇', correct: false },
        ]
      },
      {
        question: 'Que huele mal?',
        options: [
          { text: 'Un perfume', icon: '🧴', correct: false },
          { text: 'Una rosa', icon: '🌹', correct: false },
          { text: 'La basura', icon: '🗑️', correct: true },
        ]
      },
    ]
  },
  {
    id: 'gusto',
    name: 'El Gusto',
    organ: 'La Lengua',
    icon: '👅',
    organIcon: '👅',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    bgColor: '#fee2e2',
    description: 'Con la lengua podemos saborear si algo es dulce, salado, acido o amargo.',
    funFact: 'Tu lengua tiene mas de 10,000 papilas gustativas!',
    questions: [
      {
        question: 'Que usamos para saborear?',
        options: [
          { text: 'La lengua', icon: '👅', correct: true },
          { text: 'Los dedos', icon: '🖐️', correct: false },
          { text: 'La nariz', icon: '👃', correct: false },
        ]
      },
      {
        question: 'Que sabor tiene un caramelo?',
        options: [
          { text: 'Salado', icon: '🧂', correct: false },
          { text: 'Dulce', icon: '🍬', correct: true },
          { text: 'Amargo', icon: '😖', correct: false },
        ]
      },
      {
        question: 'Que sabor tiene un limon?',
        options: [
          { text: 'Dulce', icon: '🍬', correct: false },
          { text: 'Acido', icon: '🍋', correct: true },
          { text: 'Salado', icon: '🧂', correct: false },
        ]
      },
      {
        question: 'Que comida es dulce?',
        options: [
          { text: 'Papas fritas', icon: '🍟', correct: false },
          { text: 'Un pastel', icon: '🎂', correct: true },
          { text: 'Una ensalada', icon: '🥗', correct: false },
        ]
      },
      {
        question: 'Que es salado?',
        options: [
          { text: 'Un helado', icon: '🍦', correct: false },
          { text: 'Una manzana', icon: '🍎', correct: false },
          { text: 'Las papas fritas', icon: '🍟', correct: true },
        ]
      },
    ]
  },
  {
    id: 'tacto',
    name: 'El Tacto',
    organ: 'La Piel',
    icon: '🖐️',
    organIcon: '✋',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    bgColor: '#ede9fe',
    description: 'Con la piel y las manos podemos sentir si algo es suave, duro, frio o caliente.',
    funFact: 'La piel es el organo mas grande de tu cuerpo!',
    questions: [
      {
        question: 'Que usamos para tocar?',
        options: [
          { text: 'Los ojos', icon: '👀', correct: false },
          { text: 'Las manos y la piel', icon: '🖐️', correct: true },
          { text: 'La boca', icon: '👄', correct: false },
        ]
      },
      {
        question: 'Que es suave?',
        options: [
          { text: 'Una piedra', icon: '🪨', correct: false },
          { text: 'Un gatito', icon: '🐱', correct: true },
          { text: 'Un ladrillo', icon: '🧱', correct: false },
        ]
      },
      {
        question: 'Que es frio?',
        options: [
          { text: 'El sol', icon: '☀️', correct: false },
          { text: 'Un helado', icon: '🍦', correct: true },
          { text: 'Una sopa caliente', icon: '🍲', correct: false },
        ]
      },
      {
        question: 'Que es duro?',
        options: [
          { text: 'Una almohada', icon: '🛏️', correct: false },
          { text: 'Una nube', icon: '☁️', correct: false },
          { text: 'Una roca', icon: '🪨', correct: true },
        ]
      },
      {
        question: 'Que es caliente?',
        options: [
          { text: 'La nieve', icon: '❄️', correct: false },
          { text: 'El fuego', icon: '🔥', correct: true },
          { text: 'Un jugo frio', icon: '🧃', correct: false },
        ]
      },
    ]
  }
]
