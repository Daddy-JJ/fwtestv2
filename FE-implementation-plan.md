# FE Implementation Plan

## Status Legend
- in progress
- complete
- wait for review

## Phase Roadmap

### Phase 0 - Documentation & SOT
- Finalisasi SOT dan requirement dokumen.
- Status: complete

### Phase 1 - Frontend Foundation (Static)
- Setup `index.html` responsive + Tailwind Play CDN.
- Layout shell: sidebar/topbar/content.
- Halaman statis:
  - Dashboard
  - Forward Test
  - Analisis
  - Pengaturan
  - Admin Panel
- Status: complete

### Phase 2 - Frontend Interaction + Mock
- Form validation client-side.
- Mock OCR flow upload screenshot.
- Mock chart data + filter/search.
- Status: complete
- Progress:
  - Client-side validation for forward test form: done
  - Mock OCR auto-fill fields: done
  - Filter/search on mock forward test table: done
  - Remaining: finalize interaction QA checklist

### Phase 3 - Backend API (Node.js + Express + MySQL)
- Setup server, database connection, migration SQL.
- Auth, membership, strategy, forward test, analytics endpoints.
- Status: complete
- Progress:
  - Express app bootstrap + API router surface: done
  - CRUD/auth route wired to MySQL store layer with mock fallback: done
  - Bearer session middleware + protected private/admin routes: done
  - Session persistence ready via `auth_sessions` table (MySQL) + memory fallback: done
  - Stocks/uploads routes wired to real data query layer with fallback mock: done
  - Dummy admin/user credentials + auth validation: done
  - Dummy SQL seed data untuk MySQL lokal: done
  - Initial MySQL migration file (`001_init.sql`): done
  - Gate C smoke checklist:
    - Auth login/me/logout + bearer guard: pass
    - Membership endpoints: pass
    - Strategy CRUD surface: pass
    - Forward test CRUD surface: pass
    - Analytics endpoints: pass
    - Stocks endpoints: pass
    - Upload/OCR endpoints: pass
    - Admin role endpoints: pass
  - Remaining: none

### Phase 4 - Integration
- Connect frontend to backend API.
- Enforce membership rules.
- Error handling, loading states.
- Status: complete
- Progress:
  - Frontend login/logout wired to backend bearer auth: done
  - Forward test create wired to API + membership limit check: done
  - OCR parse wired to API: done
  - Initial profile/membership/strategies/admin user hydration from API: done
  - Dashboard + analisis key metrics wired from API: done
  - Admin role/membership update actions wired from UI: done
  - Remaining: none

### Phase 5 - Postman Collection + API Verification
- Generate Postman Collection.
- API testing scenario lengkap.
- Newman run minimal smoke test.
- Status: wait for review
- Progress:
  - Draft collection JSON created with folder scenario coverage: done
  - Collection variable base_url/token/admin_token wiring: done
  - Newman run end-to-end: pass (17 requests, 0 failed, 3 assertions pass)
  - Remaining: user approval Gate E prep

### Phase 6 - QA/Quality Assurance + Deploy Readiness
- Functional QA:
  - Auth/login/logout
  - Membership limit enforcement
  - Forward test CRUD
  - Analytics calculations
- Non-functional QA:
  - Responsive behavior (mobile/tablet/desktop)
  - Basic accessibility (focus, semantic, contrast)
  - Error state dan empty state
- Deployment QA:
  - Vercel build pass
  - Environment variable checklist
  - No blocking console/runtime error
- Status: complete
- Progress:
  - Functional API smoke checklist: pass (auth, membership limit, strategy+forward CRUD, analytics, admin action)
  - Auth invalidation check after logout: pass (private endpoint returns Unauthorized)
  - Runtime boot check: pass (`npm run start` starts server without crash)
  - Environment mode verification: mock mode detected when DB env not configured
  - Remaining: none (Gate E approved)

## Tracking Table
| Item | Owner | Status | Notes |
|---|---|---|---|
| SOT docs | AI Agent | complete | Baseline done |
| Static FE shell | AI Agent | complete | Gate B approved |
| FE interaction + mock | AI Agent | complete | Approved |
| API spec alignment | AI Agent | complete | Gate C approved |
| FE-BE integration | AI Agent | complete | Gate D approved |
| Postman collection verification | AI Agent | complete | Newman run pass |
| QA matrix | AI Agent | complete | Gate E approved |

## Review Gates
- Gate A: approve docs.
- Gate B: approve FE static.
- Gate C: approve backend schema/API.
- Gate D: approve integration.
- Gate E: approve QA sign-off + deploy readiness.
