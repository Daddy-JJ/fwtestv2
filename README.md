# fwtestv2

SOT-driven project for membership website forward test saham Indonesia.

## Core Docs
- SOT.md
- FE-Prd.md
- FE-UI-guideline.md
- FE-implementation-plan.md
- BE-database-scheme.md
- API-spec.md
- POSTMAN-collection-plan.md
- agents.md

## Current Phase
- Phase 0: complete
- Phase 1: complete
- Phase 2: complete
- Phase 3: complete
- Phase 4: complete
- Phase 5: complete (Newman run pass)
- Phase 6: complete (QA smoke + runtime readiness approved)

## Next Step
Project siap lanjut ke deployment target dan operasionalisasi environment production.

## Dummy Login Accounts (Mock API)
- Admin
	- email: admin@example.com
	- password: Admin123!
- User
	- email: user@example.com
	- password: User123!

Login endpoint:
- POST /api/auth/login

Payload contoh:
{
	"email": "user@example.com",
	"password": "User123!"
}

Response login mengembalikan token bearer yang harus dipakai untuk endpoint private.

Contoh header:
- Authorization: Bearer <token>

Endpoint private (butuh bearer):
- /api/membership/*
- /api/strategies/*
- /api/forward-tests/*
- /api/analytics/*
- /api/uploads/*
- /api/ocr/*

Endpoint admin (butuh role admin):
- /api/admin/*

## Dummy SQL Seed
- File seed: db/seeds/001_dummy.sql

## MySQL Mode (Optional)
- API otomatis pakai mode `mysql` jika env DB tersedia.
- Jika env DB belum ada, API fallback ke mode `mock`.

Langkah setup MySQL lokal:
1. Copy `.env.example` menjadi `.env` lalu isi nilai DB.
2. Jalankan SQL migration: `db/migrations/001_init.sql`.
3. Jalankan SQL seed dummy: `db/seeds/001_dummy.sql`.
4. Start API: `npm run dev`.

Catatan sesi auth:
- Session token disimpan di tabel `auth_sessions` saat mode `mysql`.
- Saat mode `mock`, session disimpan in-memory.

Verifikasi mode aktif:
- `GET /health` -> cek `db.mode` (`mysql` atau `mock`).
