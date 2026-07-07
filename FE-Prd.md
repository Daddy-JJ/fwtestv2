# FE Product Requirement Document (FE-PRD)

## 1. Overview
Website membership untuk forward test strategi saham Indonesia.

## 2. Goals
- Memudahkan user mencatat dan mengevaluasi forward test.
- Menyediakan insight performa strategi.
- Menyediakan batas penggunaan berdasarkan membership.

## 3. User Roles
- User:
  - Login, input test, lihat dashboard, analisis, kelola strategi pribadi.
- Admin:
  - Monitoring user, membership, konten, dan konfigurasi.

## 4. Information Architecture
- Dashboard
- Forward Test
- Analisis
- Pengaturan
- Admin Control Panel

## 5. Feature Requirements

### 5.1 Dashboard
- Kartu Statistik:
  - Strategy Type
  - Total Uji Coba
  - Win Rate
  - Rata-rata Durasi TP/SL
- Chart Win Rate (area bulanan).
- Chart Durasi (bar TP vs SL).
- Tabel 5 forward test terbaru (dengan badge status).

### 5.2 Forward Test
- Input Manual:
  - Emiten, entry, TP, SL, tanggal, strategi, catatan.
- Upload Screenshot:
  - Drag-drop file.
  - Simulasi OCR (phase frontend): tampilkan hasil auto-fill yang bisa diedit.
- Filter/Search:
  - Filter status.
  - Search emiten.
- Detail View:
  - Chart harga + marker Entry/TP/SL.
  - Ringkasan risk/reward.

### 5.3 Analisis
- Ringkasan performa.
- Distribusi hasil (pie TP/SL/Manual).
- Tren bulanan win rate (area).
- Analisis durasi target (bar).
- Breakdown performa per strategi.

### 5.4 Pengaturan
- Profil user.
- Membership:
  - Free: 10 test.
  - Premium: unlimited.
  - Upgrade CTA.
- Manajemen strategi:
  - CRUD strategi custom.

### 5.5 Admin Control Panel
- Daftar user + role + status membership.
- Statistik global platform.
- Approve/review laporan konten jika diperlukan.
- Manajemen paket membership.

## 6. Non-Functional Requirements
- Responsive desktop/tablet/mobile.
- Performa frontend baik di koneksi standar.
- Aksesibilitas dasar (kontras, keyboard focus, semantic).

## 7. Acceptance Criteria (High Level)
- Semua halaman utama dapat diakses dan navigasi konsisten.
- Semua komponen utama (cards/charts/tables/forms) tampil sesuai guideline.
- Simulasi OCR berfungsi pada UI (phase frontend).
- Membership free/premium tervisualisasi jelas.

## 8. Out of Scope (Phase 1)
- OCR real production-grade.
- Live broker execution.
- Auto-trading.
