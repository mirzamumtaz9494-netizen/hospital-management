# Master AI Prompt: Premium Healthcare UI/UX Design System for Next.js & Tailwind

> **Instructions for Use:** Copy and paste the prompt below directly into Gemini (or Gemini Advanced / ChatGPT / Claude). It instructs the AI to design an ultra-modern, award-winning, Envato-ready design system and component blueprints for our Hospital Management System.

---

```markdown
You are a Principal Product Designer and Lead Frontend Architect specializing in high-end Enterprise Healthcare SaaS and top-selling ThemeForest / Envato dashboard templates.

### Context:
I am building a next-generation Hospital Management System (HMS) called "VitalSync HMS" (formerly Expert HMS) using Next.js 14+ (App Router), Tailwind CSS, TypeScript, and Lucide icons.
The application will be sold as a premium UI template on marketplaces (Envato / CodeCanyon / UI8) and deployed to clinics and multi-specialty hospitals as a leased SaaS platform.

The original legacy system had rich functionality (OP, IP, Bed Management, Laboratory Test Master, Pharmacy Inventory, and Billing), but the visual design looked dated. I want you to completely modernize and elevate it into a sleek, clean, trustworthy 2026 medical enterprise UI (inspired by the aesthetics of Stripe, Linear, and Tailwind UI / Shadcn UI).

---

### Key Requirements to Design:

#### 1. Design Tokens & Color Palette
- **Brand Colors:** Trustworthy medical slate/navy base with a primary modern surgical teal/cyan (`#0ea5e9` / `#06b6d4` / `#0284c7`).
- **KPI Gradient Cards:** Elegant, subtle gradient/glass styles for 6 daily KPI cards (replacing harsh flat gradients):
  - Today OP Revenue (Cyan / Blue)
  - Today IP Revenue (Rose / Coral)
  - Laboratory Sales (Amber / Warm Orange)
  - Pharmacy Sales (Violet / Purple)
  - Bed Occupancy (Teal / Emerald)
  - Beds Available (Indigo / Slate)
- **Status Badges & Tokens:** Clean pill badges for:
  - Active (`emerald-50 text-emerald-700 ring-1 ring-emerald-600/20`)
  - Discharged / Inactive (`slate-100 text-slate-700`)
  - Critical / Emergency (`rose-50 text-rose-700 ring-1 ring-rose-600/20`)
  - Pending / Revisit (`amber-50 text-amber-700 ring-1 ring-amber-600/20`)

#### 2. Layout & Shell Architecture
- **Header Navigation Bar:**
  - Slim dark navy/slate bar (`bg-slate-900 border-b border-slate-800 text-white`)
  - Hospital brand logo + branch selector
  - Clean dropdown menus (OP, IP, Lab, Pharmacy, Others, Settings)
  - User avatar with role indicator ("Dr. Bhargava • Chief Medical Officer")
  - High-visibility "ShortMenus" Quick-Action pill button with keyboard shortcut hint (`⌘K` or `Ctrl+K`)
- **Dashboard Grid:**
  - 6 KPI Stat Cards with trend indicators (e.g., "+8.4% from yesterday") and mini progress indicators.
  - 12 Core Hospital Module Cards (Patient Registry, OP, IP, Laboratories, Pharmacy, Doctors, Wards, Reports, Services, Admin, Accounts, Settings) styled with clean white cards, soft borders (`border-slate-200/80`), subtle hover lift, and dual-tone Lucide icons.
- **ShortMenus Tray (Command Bar / Quick Modal):**
  - Instant modal with 9 quick action tiles (Create New OP, Create New IP, Lab Billing, Pharmacy POS, Add Services, Record Expense, Emergency Intake, Advance Deposit, Bill Settlement).

#### 3. High-Density Medical Data Tables (Patient Registry & OP/IP Lists)
- Clean, readable typography with numeric font alignment (`tabular-nums`)
- Instant search bar with clear button + filter chips
- Segmented controls (e.g., `Active Patients` vs `Discharged Patients`)
- Contextual action dropdowns (`Action ▾`, `Reports ▾`, `Billings ▾`) with icons and smooth dropdown transitions
- Patient MR ID and OP ID styled with subtle code-badge formatting (e.g., `font-mono bg-slate-100 px-2 py-0.5 rounded text-xs`)

#### 4. Print-Ready Template Specifications
- Clean CSS print layouts for:
  - Outpatient (OP) Consultation Slip / Token with QR/Barcode placeholder
  - Doctor OPD Letterhead with clinical notes section
  - Itemized Inpatient Final Settlement Bill

---

### What I need from you:
1. **Tailwind Config Extensions (`tailwind.config.ts`):** Complete color palette, custom gradients, box shadows, and border radii.
2. **Design Guidelines:** Typography scale, spacing rules, and elevation/shadow tokens.
3. **Copy-Paste React/Tailwind Component Code:**
   - The **Header & Navigation Shell** component.
   - The **Modernized KPI Metric Card** component (with gradient border, icon, and stat).
   - The **ShortMenus Quick-Action Modal** component.
   - The **High-Density Patient Data Table** component with action dropdowns.
4. **Envato Packaging Advice:** 3 visual touches that will immediately make marketplace reviewers rate this 5 stars.
```
