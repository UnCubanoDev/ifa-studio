export interface Odu {
  id: string
  leftBinary: string
  rightBinary: string
  name: string
  nameLeft: string
  nameRight: string
  contentNace: string
  contentRefranes: string
  contentDescripcion: string
  contentPataki: string
  updatedAt: string
}

export interface SyncMeta {
  lastSyncedAt: string | null
  version: number
}
