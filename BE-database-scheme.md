# BE Database Scheme (MySQL)

## 1. Entities
- users
- memberships
- strategies
- forward_tests
- stock_prices
- uploads
- audit_logs

## 2. ERD Summary
- User 1..N Strategies
- User 1..N ForwardTests
- User 1..1 Membership
- Strategy 1..N ForwardTests
- StockPrices by emiten + date

## 3. SQL Draft (MySQL)

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  union_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NULL,
  email VARCHAR(320) NULL,
  avatar TEXT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_sign_in_at TIMESTAMP NULL
);

CREATE TABLE memberships (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  tier ENUM('free','premium') NOT NULL DEFAULT 'free',
  max_forward_tests INT NOT NULL DEFAULT 10,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_memberships_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE strategies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_strategies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE forward_tests (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  strategy_id BIGINT UNSIGNED NULL,
  emiten VARCHAR(10) NOT NULL,
  entry_price DECIMAL(12,2) NOT NULL,
  take_profit DECIMAL(12,2) NOT NULL,
  stop_loss DECIMAL(12,2) NOT NULL,
  entry_date DATE NOT NULL,
  status ENUM('active','tp_hit','sl_hit','manual_close') NOT NULL DEFAULT 'active',
  close_price DECIMAL(12,2) NULL,
  close_date DATE NULL,
  result_percent DECIMAL(8,4) NULL,
  days_to_target INT NULL,
  screenshot_url TEXT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ft_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_ft_strategy FOREIGN KEY (strategy_id) REFERENCES strategies(id) ON DELETE SET NULL
);

CREATE TABLE stock_prices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  emiten VARCHAR(10) NOT NULL,
  price_date DATE NOT NULL,
  open_price DECIMAL(12,2) NOT NULL,
  high_price DECIMAL(12,2) NOT NULL,
  low_price DECIMAL(12,2) NOT NULL,
  close_price DECIMAL(12,2) NOT NULL,
  volume BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_emiten_date (emiten, price_date)
);

CREATE TABLE uploads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  ocr_payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_upload_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id BIGINT UNSIGNED NULL,
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  payload JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 4. CRUD Scope
- users: read/update profile, role by admin.
- memberships: read current, upgrade.
- strategies: full CRUD.
- forward_tests: full CRUD + analytics.
- stock_prices: ingest/update/read.
- uploads: create/read/delete.

## 5. Notes
- Rule free/premium dipaksa di service layer.
- Index tambahan disesuaikan query produksi.
