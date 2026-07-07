# API Specification (Draft)

## Base URL
- `/api`

## Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Membership
- `GET /api/membership/current`
- `POST /api/membership/upgrade`
- `GET /api/membership/check-limit`

## Strategy
- `GET /api/strategies`
- `POST /api/strategies`
- `PUT /api/strategies/:id`
- `DELETE /api/strategies/:id`

## Forward Test
- `GET /api/forward-tests`
- `GET /api/forward-tests/:id`
- `POST /api/forward-tests`
- `PUT /api/forward-tests/:id`
- `DELETE /api/forward-tests/:id`

## Analytics
- `GET /api/analytics/stats`
- `GET /api/analytics/win-rate-trend`
- `GET /api/analytics/duration`
- `GET /api/analytics/distribution`

## Stock Data
- `GET /api/stocks/search?q=BBCA`
- `GET /api/stocks/:emiten/historical?days=30`
- `GET /api/stocks/:emiten/current`

## Upload + OCR
- `POST /api/uploads/screenshot`
- `POST /api/ocr/parse`

## Admin
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`
- `GET /api/admin/memberships`
- `PUT /api/admin/memberships/:id`
