import { createClient } from '@libsql/client'

let client: ReturnType<typeof createClient> | null = null

export function getTursoClient() {
  if (client) return client

  const url = process.env.TURSO_DB_URL
  const token = process.env.TURSO_DB_TOKEN

  if (!url || !token) {
    throw new Error(
      'Faltan variables de entorno TURSO_DB_URL y/o TURSO_DB_TOKEN. ' +
      'Créalas en un archivo .env.local.local:\n' +
      'TURSO_DB_URL=libsql://<db-name>.turso.io\n' +
      'TURSO_DB_TOKEN=<token>'
    )
  }

  client = createClient({ url, authToken: token })
  return client
}
