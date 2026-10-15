# CarePulse HMS — Hospital Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Commercial-teal?style=flat)](./LICENSE.md)

**CarePulse HMS** is an enterprise-grade Hospital Management System and Clinical Operations Platform designed for hospitals, polyclinics, and nursing homes. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Lucide Icons.

---

## Key Features

- **Outpatient Department (OPD)**: Live token queue, appointment schedule calendar, doctor chamber roster, and 1-click 80mm ESC/POS thermal slip print preview.
- **Inpatient Department (IPD)**: Interactive color-coded Ward Bed Grid (General Ward, Semi-Private, ICU, Post-Op) with real-time bed states (Available, Occupied, Reserved, Cleaning).
- **Central Diagnostic Laboratory**: Specimen collection accessioning, analyzer test entries, reference ranges, and NABL-format diagnostic reports.
- **Formulary Pharmacy POS**: High-speed medicine dispensing terminal, prescription sales, batch and expiry tracking, and inventory control.
- **Financial Accounts & Cash Desk**: Day Book cash register, advance patient deposits, final consolidated IP discharge bill settlements, and expense vouchers.
- **Doctors Directory**: Duty schedules, chamber numbers, consultation fee catalog, and specialty rosters.
- **Hospital Services Catalog**: 86 pre-cataloged medical, surgical, diagnostic, and nursing tariff items.
- **Clinical MIS Reports**: Census charts, occupancy analytics, revenue reports with PDF and CSV export triggers.
- **Role-Based Access Control (RBAC)**: Strict role segregation between CMO, Doctor, Nurse, Receptionist, Cashier, Pharmacist, and Lab Technician.
- **Terminal Workstation Security**: 1-click **Clinical Terminal Lock Screen** with 4-digit PIN unlock (`1234`) and duty shift handover sign-off modal.
- **Mobile-First PWA**: Dedicated floating 5-action bottom navigation bar and slide-out drawer optimized for bedside nursing rounds on tablets and smartphones down to 360px viewport width.

---

## Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js 18.17+** or higher installed on your machine.

### 2. Installation
```bash
# Install project dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
npm run start
```

---

## Pre-Configured Demo Credentials

The application includes 1-click role presets on the [`/login`](http://localhost:3000/login) page for instant simulation:

| Role | Demo Staff Name | Staff ID / Login | Default Password | Terminal Quick PIN |
| :--- | :--- | :--- | :--- | :--- |
| **Chief Medical Officer (CMO)** | Dr. Bhargav | `CP-CMO-100` | `Hospital@2026` | `1234` |
| **Consultant Doctor** | Dr. Priya Nair | `CP-DOC-401` | `Hospital@2026` | `1234` |
| **Head Nurse** | Sister Philomena | `CP-NUR-302` | `Hospital@2026` | `1234` |
| **Front Desk Receptionist** | Sneha Mukherjee | `CP-REC-204` | `Hospital@2026` | `1234` |
| **Senior Pharmacist** | G. Venkatesh | `CP-PHARM-505` | `Hospital@2026` | `1234` |
| **Lab Biochemist** | Dr. Kavita Deshmukh | `CP-LAB-602` | `Hospital@2026` | `1234` |
| **Billing Cashier** | Ramesh Sharma | `CP-CASH-701` | `Hospital@2026` | `1234` |

---

## Project Structure

```
├── docs/
│   └── CAREPULSE_CLIENT_DEMO_BLUEPRINT.md  # Step-by-step client presentation & sales pitch script
├── public/
│   ├── manifest.json                       # Progressive Web App (PWA) configuration
│   └── favicon.ico
├── src/
│   ├── app/                                # Next.js 14 App Router routes
│   │   ├── accounts/                       # Cash Desk & Day Book
│   │   ├── admin/                          # RBAC Permissions & Audit logs
│   │   ├── doctors/                        # Specialists directory & rosters
│   │   ├── forgot-password/                # 3-step OTP password recovery
│   │   ├── ipd/                            # Inpatient Wards & Bed Grid
│   │   ├── laboratory/                     # Diagnostic test orders & reports
│   │   ├── login/                          # Terminal authentication with 1-click role presets
│   │   ├── opd/                            # Outpatient Clinic & Queues
│   │   ├── pharmacy/                       # Prescription POS & Formulary
│   │   ├── register/                       # Role-conditional staff onboarding
│   │   ├── reports/                        # Clinical census & financial MIS
│   │   ├── services/                       # Hospital tariff service catalog (86 items)
│   │   ├── settings/                       # Clinic profile & hardware config
│   │   ├── layout.tsx
│   │   └── page.tsx                        # Live Census & Patient Registry
│   ├── components/                         # Modular UI widgets, modals & tables
│   │   ├── auth/                           # LogoutModal, LockScreenModal, ChangePasswordModal
│   │   ├── ipd/                            # Ward bed grid & admissions table
│   │   ├── opd/                            # Queue, appointments, and print slip modals
│   │   ├── Header.tsx                      # Desktop header & mobile drawer
│   │   ├── MobileBottomNav.tsx             # Floating 5-action mobile bottom navigation
│   │   └── QuickMenuModal.tsx              # ⌘K Global Action Tray
│   ├── context/
│   │   └── RoleContext.tsx                 # Real-time RBAC engine & auth state
│   └── data/
│       ├── mockData.ts                     # Patient registry & clinical dataset
│       └── notificationsMockData.ts
├── LICENSE.md                              # Commercial Software License Agreement
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Commercial License

This project is licensed under the **Commercial Software License Agreement**. See [`LICENSE.md`](./LICENSE.md) for full permissions and terms.

For commercial enterprise licensing, customizations, or support, please contact the author via your Gumroad order channel.
