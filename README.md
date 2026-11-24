# Al-Noor Public School — School Management System (SMS)

A complete, working School Management System as a **static web app** — no build step, no server needed. Open `index.html` or serve the folder and it works.

## How to run

```bash
# Option 1 — just open it
open index.html          # or double-click index.html

# Option 2 — local server (recommended)
python3 -m http.server 8000
# then visit http://localhost:8000
```

Works from GitHub Pages / any static host: push the contents of this folder to a repo, enable Pages (branch `main`, folder `/ (root)`).

## Demo logins (development only)

| Portal | Email | Password |
|---|---|---|
| Admin | admin@school.pk | admin123 |
| Teacher (Ayesha Khan, Class 5-A, Maths) | ayesha@school.pk | teacher123 |
| Student (Ahmed Ali, Class 5-A) | ahmed@school.pk | student123 |
| Parent (Bilal Ahmed — father of Ahmed & Sara) | bilal@school.pk | parent123 |

Or use the one-click demo cards on the login screen. Demo passwords are **not** production security — see `docs/BACKEND.md`.

## What is built (and actually works)

- **4 portals** — Admin, Teacher, Student, Parent — each with its own sidebar, dashboard and role scoping. Parents see only their linked children (child switcher for 2 children); teachers see only their assigned classes/subjects; students see only their own data.
- **Admin:** Dashboard (stats calculated live from data), Students (search / filter / sort / pagination / CSV export, add / edit / view / delete with confirmation), Admissions pipeline (Inquiry → Admitted, approve / reject, convert to student), Teachers, Staff & HR (leave + payroll view), Academics (classes / sections / subjects), Attendance, Timetable (weekly grid + automatic conflict detection), Examinations & Results (marks entry, automatic grades, printable report cards), Fees & Finance (fee structure, invoices, record payment with a unique receipt number, outstanding / overdue), Accounting ledger, Homework, Assignments (submit + grade), Library (catalog, issue / return), Transport, Communication (announcements + messages), Events & Calendar, Discipline, Health (restricted to admin / teacher / nurse), Inventory, Canteen, Reports & Analytics (live figures + CSV / print), Users & Permissions (audit log), Settings (school profile, PKR, academic year).
- **Teacher:** dashboard with today's timetable, My Classes, attendance marking, timetable, homework, assignments, exams / marks, student progress, messages, leave, profile.
- **Student:** dashboard, profile, attendance %, timetable, homework, assignments (submit), exams & results (report card), fees (view), library, events, messages, documents (printable ID card, bonafide certificate).
- **Parent:** dashboard, My Children switcher, attendance, academic progress, homework / assignments, fees & payments (receipts), timetable, messages, parent meetings, transport, events, documents, profile.
- **Design:** premium SaaS look — dark navy `#0f2238` header/sidebar, purple `#6d28d9` → pink `#db2777` gradient primary buttons, orange `#f97316` used sparingly, background `#f6f7fb`, white rounded cards (18px radius, soft shadow, hover lift), small pretty typography (body 15px/1.6/400, headings only slightly bolder), max-width 1200px centred content, stacked form fields (bold dark label above a light `#f6f7fb` input, full-width gradient button on its own row), distinct icon at every card, mobile bottom nav, touch targets ≥44px.
- **Fastest daily flows first:** dashboard quick actions — mark attendance, record a fee payment (3 clicks), enter marks, find any student in one search. Every table has search / filter / sort / pagination. Deletes ask for confirmation; every save shows success feedback; empty states are designed, not blank.
- **Language:** English / اردو toggle with RTL support. Currency PKR. Classes Playgroup, Nursery, KG, 1–10. Light / dark mode.
- **Data:** a single in-browser database in `localStorage` (`sms_db_v1`), seeded with realistic demo data: 1 school (Al-Noor Public School, Lahore), 8 classes, 10 subjects, 8 teachers, 24 students, 12 parents, 5 staff, a week of attendance, homework / assignments, a Midterm exam with marks, fee records, 20 books, 3 buses / routes, events and announcements. All CRUD persists after refresh. "Reset demo data" in the sidebar restores the seed.

## Honest limits — what is NOT built

- **There is no real backend in this folder.** Data lives in the browser's `localStorage`. It is per-browser, per-device, and anyone with the demo password can log in. Do **not** put real student data in this demo.
- **Integration-ready only (shown as "requires configuration" in the UI, never faked):** SMS, WhatsApp, email sending, online payment gateways / card processing, biometric / QR / RFID attendance, GPS bus tracking, push notifications, two-factor authentication, file uploads (submissions record a file name only). The production backend plan for all of these is in `docs/BACKEND.md`.
- No PWA packaging yet; the app is responsive and mobile-friendly but is not an installed app.

## Files

```
index.html            — app shell (login + portal shell)
assets/style.css      — full design system (all styling lives here, no hidden inline tricks)
assets/app.js         — all logic: seed data, auth, role scoping, every portal view
docs/BACKEND.md       — production backend plan: Prisma/PostgreSQL schema + API design
README.md             — this file
```

## Verified

See the verification notes in the delivery summary: HTML/JS syntax checked, app served over HTTP, all 4 demo logins exercised, and add-student / mark-attendance / record-payment / enter-marks / create-homework flows tested against the localStorage data layer.
