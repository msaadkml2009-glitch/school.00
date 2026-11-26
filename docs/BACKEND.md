# Production Backend Plan — School Management System

## Current demo state (2026-11-25 update)
- First screen: 4 portal cards (Admin / Teacher / Student / Parent) -> per-portal sign-in.
- Permissions are enforced in the demo UI and router: admin full access; teachers scoped to their own section(s) (attendance, marks, result sheets, section announcements only); students/parents read-only on their own / linked children's data.
- Exams are categorised: Weekly Test, Monthly Test, Midterm Exam, Final Exam, Quiz — every result carries its category.
- Typography: Inter system font stack, no external font downloads.

> **Status: plan only.** The app in this folder is client-side with `localStorage`
> (`sms_db_v2` — v1 data migrates automatically on first load). No PostgreSQL server, API, or real authentication runs here.
> This document is the design for the production backend that would replace
> the localStorage layer — it is **not** running code.

## Recommended stack

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS — the same
  views, calling the API below instead of `localStorage`.
- **Backend:** Next.js API routes (or NestJS) + **Prisma ORM** + **PostgreSQL**.
- **Auth:** NextAuth / Auth.js with credentials + optional TOTP 2FA, bcrypt/argon2
  password hashing, HTTP-only session cookies, server-side role checks on
  **every** route (never trust the frontend role).
- **Storage:** S3-compatible object storage for uploads (documents, homework
  files), with signed URLs and MIME/size validation.
- **Jobs:** queue (e.g. BullMQ) for fee reminders, report generation, notifications.
- **Deployment:** Postgres (managed), app on Vercel / VPS, daily backups, audit logs.

## Core schema (Prisma-style, simplified)

```prisma
model School   { id String @id @default(cuid()); name String; branches Branch[]; academicYears AcademicYear[]; settings Json? }
model Branch   { id String @id @default(cuid()); schoolId String; name String; users User[]; students Student[] }
model User     { id String @id @default(cuid()); branchId String; email String @unique; passwordHash String; role Role; twoFactorSecret String?; isActive Boolean @default(true); teacherId String?; studentId String?; parentId String?; auditLogs AuditLog[] }
enum Role { SUPER_ADMIN SCHOOL_ADMIN PRINCIPAL VICE_PRINCIPAL ACCOUNTANT HR ADMISSIONS TEACHER CLASS_TEACHER STUDENT PARENT LIBRARIAN TRANSPORT RECEPTIONIST NURSE STAFF }
model Class    { id String @id @default(cuid()); branchId String; name String; section String; teacherId String?; roomId String?; capacity Int; students Student[]; timetableEntries TimetableEntry[] }
model Subject  { id String @id @default(cuid()); name String; code String @unique }
model Student  { id String @id @default(cuid()); branchId String; admissionNo String @unique; name String; dob DateTime; gender String; bloodGroup String?; classId String; section String; rollNo Int; parentId String; status StudentStatus; medicalNotes String?; // medicalNotes: read only by role NURSE / SCHOOL_ADMIN — enforce in API
  attendance Attendance[]; marks Mark[]; fees FeeInvoice[]; libraryIssues LibraryIssue[]; discipline Discipline[] }
model Parent   { id String @id @default(cuid()); name String; email String; phone String; children Student[] }
model Teacher  { id String @id @default(cuid()); name String; email String @unique; subjects Subject[]; classes Class[]; salary Decimal; }
model Attendance { id String @id @default(cuid()); date DateTime; studentId String; classId String; status AttendanceStatus; markedBy String; @@unique([date, studentId]) }
enum AttendanceStatus { PRESENT ABSENT LATE LEAVE HALF_DAY }
model TimetableEntry { id String @id @default(cuid()); classId String; day Int; period Int; subjectId String; teacherId String; roomId String;
  @@unique([day, period, teacherId]); @@unique([day, period, roomId]); @@unique([day, period, classId]) } // DB-level conflict prevention
model Exam     { id String @id @default(cuid()); name String; term String; start DateTime; end DateTime; status String }
model Mark     { id String @id @default(cuid()); examId String; studentId String; subjectId String; obtained Int; total Int; @@unique([examId, studentId, subjectId]) }
model FeeInvoice { id String @id @default(cuid()); studentId String; month String; amount Decimal; paid Decimal @default(0); discount Decimal @default(0); dueDate DateTime; status FeeStatus; payments Payment[] }
model Payment  { id String @id @default(cuid()); receiptNo String @unique; invoiceId String; amount Decimal; method String; date DateTime; receivedBy String }
model Homework { id String @id @default(cuid()); title String; subjectId String; classId String; teacherId String; dueDate DateTime; submissions HomeworkSubmission[] }
model Assignment { id String @id @default(cuid()); title String; subjectId String; classId String; dueDate DateTime; total Int; submissions AssignmentSubmission[] }
model Book     { id String @id @default(cuid()); title String; author String; isbn String; copies Int; }
model LibraryIssue { id String @id @default(cuid()); bookId String; studentId String; issueDate DateTime; dueDate DateTime; returnedAt DateTime? }
model Bus      { id String @id @default(cuid()); number String; route String; driverId String; capacity Int }
model Announcement { id String @id @default(cuid()); title String; body String; audience String; pinned Boolean @default(false) }
model Message  { id String @id @default(cuid()); fromId String; toId String; subject String; body String; read Boolean @default(false) }
model AuditLog { id String @id @default(cuid()); userId String; action String; createdAt DateTime @default(now()) }
```

Key rules: every query is scoped by `branchId` and by the caller's role
(parent → only `children` ids; teacher → only assigned `classId`s; student →
only own `studentId`). A user must not be able to read another student's data
by changing an ID in a URL — enforce with a server-side ownership check on
every endpoint, plus Prisma row filters.

## API sketch (REST, `/api/v1/...`)

- `POST /auth/login`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password`
- `GET /dashboard/:role` — aggregates computed in SQL, not hard-coded
- `GET|POST /students`, `GET|PUT|DELETE /students/:id`, `POST /students/import` (CSV, validated, duplicates rejected), `GET /students/:id/report-card`
- `GET|POST /admissions`, `POST /admissions/:id/approve|reject|convert`
- `GET|POST /attendance`, `POST /attendance/bulk`
- `GET|POST /timetable` (conflict check in a transaction; unique constraints above)
- `GET|POST /exams/:id/marks`, `GET /results/:studentId`
- `GET|POST /fees/invoices`, `POST /fees/payments` (generates unique `receiptNo`, ledger entry in the same transaction)
- `GET|POST /library/books|issues`, `POST /library/issues/:id/return`
- `GET|POST /homework`, `GET|POST /assignments`, `POST /assignments/:id/submit|grade`
- `GET|POST /announcements`, `GET|POST /messages`, `GET /notifications`
- `GET /reports/:type?from&to&classId` (CSV / PDF export)
- `GET|PUT /settings`, `GET /audit-logs`

All endpoints: Zod validation, rate limiting, pagination (`?page&limit`),
`X-Request-Id` logging, and per-endpoint permission middleware.

## Integrations (integration-ready in the demo — configure here)

| Integration | Provider options (Pakistan) | Notes |
|---|---|---|
| SMS | Twilio / local SMS gateway | Fee-due + absent alerts; queue, don't block requests |
| WhatsApp | WhatsApp Business API | Parent notifications; opt-in only |
| Email | SMTP / SendGrid / SES | Receipts, announcements, password reset |
| Payments | JazzCash / EasyPaisa / bank gateway | Never store raw card data; use provider-hosted checkout + webhooks; reconcile by `receiptNo` |
| Biometric / QR attendance | Device vendor SDK | Sync attendance via a secure device API, never trust client timestamps alone |
| GPS transport | Tracking provider API | Bus location polling; parent view is read-only |
| Push | FCM / web push | In-app notification mirror |

## Migration path from this demo

1. Keep the UI and `localStorage` seed shape as the contract; replace the
   `DB` object in `assets/app.js` with `fetch()` calls to the API above.
2. Import the demo seed into Postgres with a one-off Prisma seed script
   (same students / teachers / fees / marks).
3. Turn off demo logins; create real accounts with hashed passwords and
   per-branch roles. Remove `sms_db_v2` from production builds.
