CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  zone VARCHAR(20) NOT NULL
    CHECK (zone IN ('norte', 'pasillo', 'sur')),
  location_text VARCHAR(180) NOT NULL,
  opening_hours VARCHAR(120) NOT NULL,
  image_url TEXT,
  price_min NUMERIC(8,2) NOT NULL CHECK (price_min >= 0),
  price_max NUMERIC(8,2) NOT NULL CHECK (price_max >= price_min),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  description TEXT,
  price NUMERIC(8,2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  overall SMALLINT NOT NULL CHECK (overall BETWEEN 1 AND 5),
  food SMALLINT NOT NULL CHECK (food BETWEEN 1 AND 5),
  price SMALLINT NOT NULL CHECK (price BETWEEN 1 AND 5),
  service SMALLINT NOT NULL CHECK (service BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, place_id)
);

CREATE INDEX IF NOT EXISTS idx_places_zone ON places(zone);
CREATE INDEX IF NOT EXISTS idx_products_place_id ON products(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_place_id ON reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
