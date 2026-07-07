INSERT INTO users (id, union_id, name, email, password_plain, role, last_sign_in_at)
VALUES
  (1, 'dummy-admin', 'Admin Test', 'admin@example.com', 'Admin123!', 'admin', NOW()),
  (2, 'dummy-user', 'User Test', 'user@example.com', 'User123!', 'user', NOW())
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  email = VALUES(email),
  password_plain = VALUES(password_plain),
  role = VALUES(role),
  last_sign_in_at = VALUES(last_sign_in_at);

INSERT INTO memberships (id, user_id, tier, max_forward_tests, expires_at)
VALUES
  (1, 1, 'premium', -1, NULL),
  (2, 2, 'free', 10, NULL)
ON DUPLICATE KEY UPDATE
  tier = VALUES(tier),
  max_forward_tests = VALUES(max_forward_tests),
  expires_at = VALUES(expires_at);

INSERT INTO strategies (id, user_id, name, description)
VALUES
  (1, 2, 'Breakout Pullback', 'Entry saat retest breakout'),
  (2, 2, 'Momentum Weekly', 'Momentum dengan volume tinggi')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

INSERT INTO forward_tests (id, user_id, strategy_id, emiten, entry_price, take_profit, stop_loss, entry_date, status, notes)
VALUES
  (1, 2, 1, 'BBCA', 9200, 9800, 8900, '2026-07-01', 'active', 'Mock data user'),
  (2, 2, 2, 'TLKM', 3850, 4050, 3720, '2026-06-28', 'tp_hit', 'Dummy profit case'),
  (3, 1, NULL, 'BMRI', 6150, 6600, 5900, '2026-06-25', 'manual_close', 'Dummy admin case')
ON DUPLICATE KEY UPDATE
  strategy_id = VALUES(strategy_id),
  emiten = VALUES(emiten),
  entry_price = VALUES(entry_price),
  take_profit = VALUES(take_profit),
  stop_loss = VALUES(stop_loss),
  entry_date = VALUES(entry_date),
  status = VALUES(status),
  notes = VALUES(notes);
