<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:offline-first-rules -->
# Offline-first con Turso + IndexedDB

## Setup inicial (una sola vez)

1. **Crear base de datos en Turso** (ver `.env.example` para instrucciones)
2. Copiar `.env.example` → `.env.local` y llenar credenciales
3. Ejecutar el schema SQL contra Turso:
   ```
   turso db shell <db-name> < lib/schema.sql
   ```
4. Poblar la DB con los 256 Odus:
   ```
   node scripts/generate-odus-data.js
   turso db shell <db-name> - <<< "INSERT INTO odus ..." -- o usar un script de migración
   ```

## Arquitectura

```
Turso (edge DB)  ←→  API Route (/api/odu)  ←→  Cliente (Next.js)
                                                    ↓
                                            IndexedDB (offline)
```

- **`lib/turso.ts`** — Cliente singleton de Turso (server-side only)
- **`app/api/odu/route.ts`** — API REST para servir Odus desde Turso (renombrar a `.bak` para export estático)
- **`lib/local-db.ts`** — Wrapper IndexedDB usando `idb`
- **`lib/sync.ts`** — Lógica de sincronización (pull con `updated_at`)
- **`lib/hooks/use-sync.ts`** — Hook React: carga desde IndexedDB, seed desde bundle JSON

## Flujo offline

1. App monta → `useSync` verifica si IndexedDB tiene datos
2. Si no hay datos → seed desde `public/data/odus.json` (bundled)
3. Datos cacheados en IndexedDB para acceso offline total
4. Sin conexión a backend — app 100% static

## Convenciones

- Todo Odu tiene `updated_at` para sincronización incremental
- `SyncMeta` guarda `lastSyncedAt` en IndexedDB
- Los placeholders locales (en `FALLBACK_TEXT`) se usan solo si falla el seed
- Las variables de entorno van en `.env.local` (no commiteado)
<!-- END:offline-first-rules -->

<!-- BEGIN:github-pages-rules -->
# Deploy a GitHub Pages

## Config automática

El CI en `.github/workflows/deploy.yml` se encarga de todo:

1. `npm ci` — instala dependencias
2. `node scripts/generate-odus-data.js` — genera los 256 Odus
3. `rm -rf app/api` — elimina API routes (incompatibles con export estático)
4. `next build` — genera `out/` con `output: "export"`
5. `actions/upload-pages-artifact` — sube el artifact
6. `actions/deploy-pages` — despliega a GitHub Pages

## Para activar manualmente

1. Ir a Settings → Pages → Source: "GitHub Actions"
2. Pushear a `main` → el workflow deploya automáticamente

## Config local

- `basePath: "/ifa-studio"` en `next.config.ts`
- Para desarrollo local: `npm run dev` (sin basePath, funciona igual)
- El bundle JSON se genera con: `npm run generate-odus`

## Restaurar API routes (para deploy server-side)

Si se despliega a Vercel/Railway u otro con soporte server-side:
```bash
git mv app/api/odu/route.ts.bak app/api/odu/route.ts
# y en next.config.ts, quitar output: "export"
```
<!-- END:github-pages-rules -->