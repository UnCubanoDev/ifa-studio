const fs = require('fs')
const path = require('path')

const src = path.resolve(__dirname, '..', 'public', 'data', 'odus.json')
const dest = path.resolve(__dirname, '..', 'lib', 'odus-data.json')

if (!fs.existsSync(src)) {
  console.error('ERROR: no se encuentra public/data/odus.json')
  process.exit(1)
}

fs.copyFileSync(src, dest)
console.log(`✔ odus-data.json copiado (${(fs.statSync(src).size / 1024).toFixed(0)} KB)`)
