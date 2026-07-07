# agents.md

## Agent Operating Rules
- Selalu patuh pada `SOT.md`.
- Gunakan phase-gated workflow.
- Jangan lompat fase tanpa approval.
- Update status phase setiap perubahan signifikan.

## Phase Gate Policy
- Gate A: Documentation approved.
- Gate B: Frontend static approved.
- Gate C: Backend/API approved.
- Gate D: Integration + QA approved.

## Required Outputs
- Dokumentasi wajib tetap sinkron:
  - FE-Prd.md
  - FE-UI-guideline.md
  - FE-implementation-plan.md
  - BE-database-scheme.md
  - API-spec.md
  - POSTMAN-collection-plan.md

## Change Management
- Semua perubahan harus traceable ke dokumen requirement.
- Jika requirement ambigu, minta klarifikasi sebelum implementasi.

## Definition of Complete
- Fase selesai jika checklist fase terpenuhi dan status menjadi `complete`.
- Jika menunggu approval user, status `wait for review`.
