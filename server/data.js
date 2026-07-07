export const users = [
  {
    id: 1,
    union_id: "dummy-admin",
    name: "Admin Test",
    email: "admin@example.com",
    password: "Admin123!",
    role: "admin",
  },
  {
    id: 2,
    union_id: "dummy-user",
    name: "User Test",
    email: "user@example.com",
    password: "User123!",
    role: "user",
  },
];

export const memberships = [
  { id: 1, user_id: 1, tier: "premium", max_forward_tests: -1 },
  { id: 2, user_id: 2, tier: "free", max_forward_tests: 10 },
];

export const strategies = [
  { id: 1, user_id: 2, name: "Breakout Pullback", description: "Entry saat retest breakout" },
  { id: 2, user_id: 2, name: "Momentum Weekly", description: "Momentum dengan volume tinggi" },
];

export const forwardTests = [
  {
    id: 1,
    user_id: 2,
    strategy_id: 1,
    emiten: "BBCA",
    entry_price: 9200,
    take_profit: 9800,
    stop_loss: 8900,
    entry_date: "2026-07-01",
    status: "active",
    notes: "Mock data user",
  },
  {
    id: 2,
    user_id: 2,
    strategy_id: 2,
    emiten: "TLKM",
    entry_price: 3850,
    take_profit: 4050,
    stop_loss: 3720,
    entry_date: "2026-06-28",
    status: "tp_hit",
    notes: "Dummy profit case",
  },
  {
    id: 3,
    user_id: 1,
    strategy_id: null,
    emiten: "BMRI",
    entry_price: 6150,
    take_profit: 6600,
    stop_loss: 5900,
    entry_date: "2026-06-25",
    status: "manual_close",
    notes: "Dummy admin case",
  },
];

export const uploads = [];
