# Source of Truth (SOT)

## Purpose
Dokumen ini menjadi sumber kebenaran tunggal untuk pengembangan website membership forward test saham Indonesia.

## Product Vision
Membangun platform membership untuk investor/trader yang ingin:
- Mencatat forward test strategi stock pick.
- Memantau performa strategi (win rate, durasi TP/SL).
- Menganalisis hasil per periode dan per strategi.
- Mengelola batas penggunaan berdasarkan tier membership.

## Target Users
- User: melakukan forward test, analisis, dan monitoring.
- Admin: mengelola user, membership, dan pengaturan global.

## Core Business Rules
- Tier Free: maksimal 10 forward test aktif/total (configurable).
- Tier Premium: unlimited.
- Status forward test: active, tp_hit, sl_hit, manual_close.
- Data harga harian: open, high, low, close, volume.

## Development Phases
- Phase 0: SOT & Documentation.
- Phase 1: Frontend static responsive (HTML + Tailwind CDN).
- Phase 2: Frontend interaction + mock data + admin panel static.
- Phase 3: Backend Node.js + Express + MySQL CRUD.
- Phase 4: Integration frontend-backend + auth + membership enforcement.
- Phase 5: API hardening + Postman collection.
- Phase 6: QA/Quality Assurance + deploy readiness.

## Phase Status
- Phase 0: complete
- Phase 1: complete
- Phase 2: complete
- Phase 3: complete
- Phase 4: complete
- Phase 5: complete
- Phase 6: complete

## Latest QA Evidence
- Phase 6 functional smoke: pass (auth, membership, strategy/forward flow, analytics, admin action).
- Auth guard post-logout: pass (private endpoint unauthorized as expected).
- Runtime readiness: `npm run start` boots API successfully on local environment.

## Constraints
- Frontend-first approach.
- UI style: light, modern, clean financial dashboard.
- Deploy target: Vercel.
- Semua perubahan besar harus mengikuti status fase dan review gate.

## Definition of Done (Per Phase)
- Requirement fase terpenuhi.
- Dokumen phase update.
- QA checklist fase clear.
- Tidak melanggar SOT ini.
