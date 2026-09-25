# ⛏️ Crush Management System

A modern, full-stack **dispatch tracking and financial management** application for crush (stone/gravel) businesses. Built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**.

---

## ✨ Features

- **📦 Dispatch Records** — Create, view, edit, and delete crush dispatch entries with full audit trails
- **💰 Financial Tracking** — Track purchase rates, transport fares, selling rates, and other expenses per dispatch
- **📊 Live Profit Calculator** — Real-time cost/revenue/profit preview while filling the dispatch form
- **🚛 Vehicle & Driver Info** — Log vehicle type, license plate, owner, driver name, and contact
- **🪨 Crush Details** — Record crush plant, type, quality, and quantity per dispatch
- **📍 Destination Tracking** — City and area-level destination logging
- **🔍 Search & Filter** — Instant search across buyer name, crush type, city, driver, license plate, and plant
- **📈 Dashboard Stats** — Aggregated totals for dispatches, revenue, net profit, and quantity at a glance
- **🔀 Flexible Transport Fare** — Enter transport fare as a fixed total or calculate it automatically via a per-unit rate × quantity mode
- **🗑️ Safe Deletion** — Confirmation modal before any record is permanently deleted

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + Vanilla CSS |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Font | Inter (Google Fonts via `next/font`) |
| Deployment | Vercel |

---

## 📁 Project Structure

```
crush_management_system/
├── app/
│   ├── add/            # Add new dispatch page
│   ├── edit/[id]/      # Edit existing dispatch page
│   ├── dispatch/[id]/  # View dispatch details page
│   ├── globals.css     # Global styles & design tokens
│   ├── layout.tsx      # Root layout with sticky header
│   └── page.tsx        # Dashboard (dispatch list + stats)
├── src/
│   ├── components/
│   │   ├── DeleteModal.tsx   # Confirmation modal for deletion
│   │   ├── DispatchForm.tsx  # Shared add/edit form with live calculator
│   │   └── StatsCards.tsx    # Aggregated stats display cards
│   ├── lib/
│   │   ├── dispatches.ts     # Supabase CRUD helpers for dispatches
│   │   └── supabase.ts       # Supabase client initialization
│   └── types.ts              # TypeScript interfaces (Dispatch, DispatchInsert, etc.)
├── public/             # Static assets
├── .env.local          # Environment variables (not committed)
└── next.config.ts      # Next.js configuration
```

---

## 🗄️ Data Model

The core `Dispatch` entity stores the following fields:

| Field | Type | Description |
|---|---|---|
| `dispatch_date` | date | Date of the dispatch |
| `buyer_name` | string | Name of the buyer |
| `vehicle_type` | string | e.g. Truck, Trailer |
| `license_plate` | string | Vehicle registration number |
| `vehicle_owner` | string | Owner of the vehicle |
| `driver_name` | string | Driver's full name |
| `driver_contact` | string | Driver's phone number |
| `is_owner_driver` | boolean | Whether the owner is also the driver |
| `crush_plant` | string | Source plant name |
| `crush_type` | string | Type of crush (e.g. Stone, Gravel) |
| `crush_quality` | string | Quality grade (e.g. Grade A) |
| `quantity` | number | Units dispatched |
| `destination_city` | string | Delivery city |
| `destination_area` | string | Delivery area / locality |
| `purchase_rate` | number | Cost per unit (Rs.) |
| `transport_fare` | number | Total transport cost (Rs.) |
| `other_expenses` | number | Miscellaneous costs (Rs.) |
| `selling_rate` | number | Revenue per unit (Rs.) |
| `total_cost` | number | **Computed** — `quantity × purchase_rate + transport_fare` |
| `total_revenue` | number | **Computed** — `quantity × selling_rate` |
| `net_profit` | number | **Computed** — `total_revenue − total_cost − other_expenses` |

> Computed columns (`total_cost`, `total_revenue`, `net_profit`) are calculated by Supabase and are read-only in the app.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project with the `dispatches` table set up

### 1. Clone the repository

```bash
git clone https://github.com/niazi003/crush_management_system.git
cd crush_management_system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## ☁️ Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/). Connect your GitHub repository and add the environment variables in the Vercel project settings.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📄 License

This project is private and intended for internal business use.
