# 🎬 AI Screenplay Analytics & Budget Prediction

A browser-based tool that parses screenplays and instantly generates a detailed production budget estimate, feature breakdown, and comparable film titles — no backend required.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat&logo=vercel)](https://your-project.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite)](https://vitejs.dev)

---

## Overview

Upload a screenplay in `.fountain`, `.fdx`, `.pdf`, or `.txt` format and get back:

- **Script Breakdown** — scenes, cast tiers, locations, VFX, stunts, night shoots
- **Budget Estimate** — P10 / P50 / P90 cost ranges across all production departments
- **Comp Titles** — similar produced films with their actual budgets for reference
- **Production Warnings** — flags for anachronisms, large casts, international shoots, heavy VFX, and more
- **Export** — download the full report as `.xlsx` or `.json`

Everything runs entirely in the browser. No data is sent to any server.

---

## Features

| Feature | Details |
|---|---|
| **Multi-format parsing** | `.fountain`, `.fdx` (Final Draft XML), `.pdf`, `.txt` |
| **Feature extraction** | Genre, period setting, cast breakdown, dialogue ratio, VFX/stunt pages, unique locations |
| **Budget engine** | Heuristic cost model with P10/P50/P90 ranges per department |
| **Comp matching** | Finds comparable produced titles by genre, budget range, and feature similarity |
| **Smart warnings** | Detects anachronisms, night-heavy shoots, large casts, international complexity |
| **Export** | Excel (`.xlsx`) and JSON reports |
| **Fully client-side** | No backend, no API keys, no data leaves the browser |

---

## Tech Stack

- **React 19** — UI framework
- **TypeScript 5.9** — type safety across the entire codebase
- **Vite 7** — build tool and dev server
- **Tailwind CSS 4** — styling
- **pdfjs-dist** — in-browser PDF parsing
- **xlsx** — Excel export
- **Recharts** — budget visualizations
- **Lucide React** — icons

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/mattperrymatt45-pixel/AI-Screenplay-Analytics-and-Budget-Prediction.git

# 2. Enter the project directory
cd AI-Screenplay-Analytics-and-Budget-Prediction

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder — ready to deploy.

---

## Deploying to Vercel

This project is optimized for Vercel with zero configuration needed.

### Option A — Vercel Dashboard (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repository
4. Vercel auto-detects Vite — no settings to change
5. Click **Deploy**

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Build Settings (auto-detected, no changes needed)

| Setting | Value |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

---

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Header.tsx          # App header
│   │   ├── FileUpload.tsx      # Drag-and-drop upload zone
│   │   ├── BreakdownPanel.tsx  # Script feature breakdown tab
│   │   ├── BudgetPanel.tsx     # Budget estimates tab
│   │   ├── CompsPanel.tsx      # Comparable titles tab
│   │   └── WarningsPanel.tsx   # Production warnings
│   ├── lib/
│   │   ├── parser.ts           # Screenplay format parser (.fountain, .fdx, .pdf, .txt)
│   │   ├── featureExtractor.ts # Extracts genre, cast, locations, VFX, stunts, etc.
│   │   ├── costEstimator.ts    # Heuristic budget model
│   │   ├── compTitles.ts       # Comparable title database + matching logic
│   │   ├── pipeline.ts         # Orchestrates parse → extract → estimate → comps
│   │   ├── excelExport.ts      # Excel report generation
│   │   └── demoScripts.ts      # Built-in demo screenplays
│   ├── utils/
│   │   └── cn.ts               # Tailwind class utility
│   ├── types.ts                # Shared TypeScript interfaces
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## How It Works

The app runs a 5-stage pipeline entirely in the browser:

```
Upload → Parse → Extract Features → Estimate Costs → Find Comps → Report
```

**Stage 1 — Parse**
Detects the screenplay format (Fountain, FDX, PDF, plain text) and converts it into a normalized list of typed elements (scene headings, action lines, dialogue, characters, etc.).

**Stage 2 — Extract Features**
Analyzes the parsed elements to compute ~20 features: total scenes, unique locations, speaking roles, cast tiers, VFX/stunt page counts, night scene ratio, dialogue ratio, genre classification, period setting, and more.

**Stage 3 — Estimate Costs**
Applies a heuristic cost model to produce P10 / P50 / P90 budget ranges across standard production departments (above-the-line, camera, locations, VFX, cast, etc.).

**Stage 4 — Find Comps**
Matches extracted features against a curated database of produced films to surface the most comparable titles by genre, budget tier, and feature profile.

**Stage 5 — Generate Warnings**
Flags production complexity issues that may cause the estimates to have higher-than-normal variance.

---

## Supported Script Formats

| Format | Extension | Notes |
|---|---|---|
| Fountain | `.fountain` | Standard plain-text screenplay format |
| Final Draft | `.fdx` | Final Draft XML format |
| PDF | `.pdf` | Text-layer PDFs; scanned PDFs may have reduced accuracy |
| Plain text | `.txt` | Best-effort parsing |

---

## Disclaimer

Budget estimates are generated by a heuristic model and are intended **for demonstration and early development purposes only**. They should not be used as the basis for actual production financing decisions. Always consult a professional line producer for accurate budgets.

---

## Author

**Rihen Moradia**

---

## License

MIT
