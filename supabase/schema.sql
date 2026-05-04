-- ============================================================
-- Autoscore.ch — Schéma Supabase PostgreSQL
-- À coller dans SQL Editor → New query → Run
-- ============================================================

-- ── Table principale : annonces du marché ────────────────────
CREATE TABLE IF NOT EXISTS market_listings (
  id            BIGSERIAL PRIMARY KEY,
  source        TEXT        NOT NULL DEFAULT 'AutoScout24',
  external_id   TEXT        NOT NULL,
  brand         TEXT        NOT NULL,
  model         TEXT        NOT NULL,
  model_version TEXT,
  year          INTEGER     NOT NULL,
  mileage       INTEGER     NOT NULL,
  price         NUMERIC     NOT NULL,
  body_type     TEXT,
  fuel          TEXT,
  transmission  TEXT,
  power_kw      INTEGER,
  seller_type   TEXT,
  dealer_name   TEXT,
  url           TEXT,
  scraped_at    DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT uq_source_external_id UNIQUE (source, external_id)
);

-- ── Index pour les requêtes de scoring ───────────────────────
CREATE INDEX IF NOT EXISTS idx_ml_brand_model    ON market_listings (brand, model);
CREATE INDEX IF NOT EXISTS idx_ml_year           ON market_listings (year);
CREATE INDEX IF NOT EXISTS idx_ml_mileage        ON market_listings (mileage);
CREATE INDEX IF NOT EXISTS idx_ml_price          ON market_listings (price);
CREATE INDEX IF NOT EXISTS idx_ml_scraped_at     ON market_listings (scraped_at DESC);

-- ── Trigger : met à jour updated_at automatiquement ──────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_market_listings_updated_at ON market_listings;
CREATE TRIGGER trg_market_listings_updated_at
  BEFORE UPDATE ON market_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Table historique des prix ─────────────────────────────────
CREATE TABLE IF NOT EXISTS listing_price_history (
  id          BIGSERIAL PRIMARY KEY,
  listing_id  BIGINT      NOT NULL REFERENCES market_listings(id) ON DELETE CASCADE,
  price       NUMERIC     NOT NULL,
  scraped_at  DATE        NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_lph_listing_id ON listing_price_history (listing_id);

-- ── Table analytics des demandes de score ────────────────────
CREATE TABLE IF NOT EXISTS score_requests (
  id               BIGSERIAL PRIMARY KEY,
  brand            TEXT,
  model            TEXT,
  year             INTEGER,
  mileage          INTEGER,
  asking_price     NUMERIC,
  score            NUMERIC,
  market_price     NUMERIC,
  market_source    TEXT,
  comparable_count INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security (désactivé — accès via service_role) ──
ALTER TABLE market_listings       DISABLE ROW LEVEL SECURITY;
ALTER TABLE listing_price_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE score_requests         DISABLE ROW LEVEL SECURITY;
