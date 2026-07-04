CREATE TABLE IF NOT EXISTS odus (
  id            TEXT PRIMARY KEY,
  left_binary   TEXT NOT NULL,
  right_binary  TEXT NOT NULL,
  name          TEXT NOT NULL,
  name_left     TEXT NOT NULL,
  name_right    TEXT NOT NULL,
  content_nace  TEXT NOT NULL DEFAULT '',
  content_refranes  TEXT NOT NULL DEFAULT '',
  content_descripcion TEXT NOT NULL DEFAULT '',
  content_pataki     TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_odus_updated_at ON odus(updated_at);
