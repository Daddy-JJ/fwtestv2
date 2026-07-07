# Postman Collection Plan

## Collection Name
- `FWTestV2 API`

## Folders
1. Auth
2. Membership
3. Strategy
4. Forward Test
5. Analytics
6. Stock Data
7. Upload/OCR
8. Admin

## Environment Variables
- `base_url`
- `token`
- `user_id`
- `strategy_id`
- `forward_test_id`

## Required Scenarios
- Login success/fail.
- Free tier limit enforcement.
- Upgrade premium and retest limit.
- Forward test CRUD lifecycle.
- Analytics with data + empty state.
- Admin endpoints authorization.

## Exit Criteria
- Semua endpoint punya example request/response.
- Ada test script dasar status code + schema minimal.
- Collection bisa dijalankan end-to-end di CI/newman.

## Current Progress
- Draft collection file: `postman/fwtestv2.collection.json`
- Folder coverage: Auth, Membership, Strategy, Forward Test, Analytics, Stock Data, Upload/OCR, Admin
- Variable baseline: base_url, token, admin_token, strategy_id, forward_test_id
- Newman run result: pass (17 requests executed, 0 failed, assertions pass)
