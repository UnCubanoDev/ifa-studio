const fs = require('fs')
const path = require('path')

const ODU_NAMES = {
  '0000': 'Ogbe', '0001': 'Ogunda', '0010': 'Irete', '0011': 'Irosun',
  '0100': 'Otura', '0101': 'Oshe', '0110': 'Odi', '0111': 'Obara',
  '1000': 'Osa', '1001': 'Iwori', '1010': 'Ofun', '1011': 'Ika',
  '1100': 'Ojuani', '1101': 'Otrupon', '1110': 'Okana', '1111': 'Oyeku',
}

const BINARIES = Object.keys(ODU_NAMES)

function getOduName(left, right) {
  const ln = ODU_NAMES[left]
  const rn = ODU_NAMES[right]
  return ln === rn ? `${ln} Meyi` : `${ln} ${rn}`
}

const TAB_CONTENT = {
  nace: (name, leftName, rightName) =>
    leftName === rightName
      ? `${name} es el Odu que surge cuando ambos caminos se unifican en un solo destino. Representa la fuerza primordial del origen, el momento exacto en que la creación encontró su equilibrio. Quien nace bajo este signo lleva consigo la memoria del principio de todas las cosas.\nLos mayores enseñan que ${leftName} Meyi guarda el secreto de la dualidad hecha unidad. Su influencia se manifiesta en los rituales de apertura y en las ceremonias que invocan el amanecer del destino.`
      : `${name} es la combinación sagrada de ${leftName} y ${rightName}. Cada Odu aporta su esencia única, creando un camino nuevo en el entramado del destino. Esta unión revela las encrucijadas donde el libre albedrío se encuentra con la voluntad divina.\nLos antiguos babalawos enseñan que esta combinación surgió cuando Olodumare entretejió los hilos de la existencia, creando un puente entre lo visible y lo invisible.`,

  refranes: (name, leftName, rightName) =>
    leftName === rightName
      ? `Donde el eco del tambor se encuentra a sí mismo, nace la verdad. ${leftName} Meyi nos recuerda que el sabio escucha el doble del necio.\nEl proverbio es la sombra del conocimiento: cuando la luz del entendimiento brilla, la sabiduría se proyecta en palabras. Quien camina con Ifá no tropieza dos veces con la misma piedra.`
      : `El refrán de ${name} nos enseña que dos caminos pueden converger en una sola verdad. Como enseñan ${leftName} y ${rightName}: la hormiga sabe más del invierno que el viento que anuncia la tormenta.\nLa palabra del anciano es el bastón que sostiene al que tropieza. Quien no pregunta, camina a ciegas; quien pregunta, lleva la luz en la lengua.`,

  descripcion: (name, leftName, rightName) =>
    leftName === rightName
      ? `${leftName} Meyi pertenece al grupo de los Odus principales del sistema de Ifá. Su energía es de una profundidad serena, como el agua quieta que esconde corrientes poderosas bajo su superficie. Su temperatura espiritual es templada, su estación es la del equilibrio entre el fuego y la tierra.\nGobierna sobre los misterios de la paciencia divina y la perseverancia. Su color es el blanco inmaculado que contiene todos los colores, y su número es el del principio que se repite en ciclos infinitos.`
      : `${name} pertenece a la familia de los Odus compuestos del sistema de Ifá. Su energía surge de la interacción entre ${leftName} (que aporta su cualidad primordial) y ${rightName} (que contribuye con su naturaleza complementaria).\nEsta combinación crea un campo de influencia único, gobernando sobre aspectos de la vida donde la colaboración entre fuerzas opuestas genera armonía. Su temperatura espiritual varía según el signo dominante.`,

  pataki: (name, leftName, rightName) =>
    leftName === rightName
      ? `Cuenta la tradición oral que cuando Olodumare creó los caminos del destino, ${leftName} Meyi fue el primer eco que resonó en el universo. Los orishas se reunieron en el mercado celestial y escucharon su historia: la del principio que contiene todos los finales.\nSe dice que Orunmila, el dueño de Ifá, escribió este Odu con el polvo de las estrellas recién nacidas. Por eso, quienes llevan este signo tienen la capacidad de ver más allá del velo del tiempo.`
      : `Los ancianos cuentan que ${name} nació cuando ${leftName} encontró a ${rightName} en el cruce de los caminos sagrados. Ese encuentro, acontecido en los albores del tiempo, selló una alianza entre dos fuerzas que hasta entonces habían recorrido senderos separados.\nDesde entonces, este Odu recuerda a los mortales que ninguna fuerza actúa sola en el universo. Hasta el río más poderoso necesita de la lluvia para cantar su canción.`,
}

const odus = []

for (const left of BINARIES) {
  for (const right of BINARIES) {
    const id = left + right
    const nameLeft = ODU_NAMES[left]
    const nameRight = ODU_NAMES[right]
    const name = getOduName(left, right)

    odus.push({
      id,
      leftBinary: left,
      rightBinary: right,
      name,
      nameLeft,
      nameRight,
      contentNace: TAB_CONTENT.nace(name, nameLeft, nameRight),
      contentRefranes: TAB_CONTENT.refranes(name, nameLeft, nameRight),
      contentDescripcion: TAB_CONTENT.descripcion(name, nameLeft, nameRight),
      contentPataki: TAB_CONTENT.pataki(name, nameLeft, nameRight),
      updatedAt: new Date('2026-01-01T00:00:00Z').toISOString(),
    })
  }
}

const outDir = path.join(__dirname, '..', 'public', 'data')
fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(path.join(outDir, 'odus.json'), JSON.stringify(odus, null, 2), 'utf-8')

console.log(`✔ Generados ${odus.length} Odus en public/data/odus.json`)
