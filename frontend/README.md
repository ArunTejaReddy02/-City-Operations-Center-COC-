# VizagOps Unify — Unified Civic Operations Pilot

![VizagOps Unify](https://img.shields.io/badge/Status-Pilot_Phase-emerald) ![Tech Stack](https://img.shields.io/badge/Stack-React_%7C_Vite_%7C_Tailwind-blue) ![Location](https://img.shields.io/badge/City-Visakhapatnam_(GVMC)-orange)

**VizagOps Unify** is a 3-week hackathon pilot project designed for the Visakhapatnam Metropolitan Area (GVMC/GVSCCL). It serves as a lightweight middleware and unified dashboard that connects citizen grievance systems, field-team locations, and City Operations Center (COC) sensor/CCTV events into a single pane of glass.

---

## 🎯 Problem Statement
Currently, civic complaints, field force locations, and COC sensor data live in isolated silos. When a citizen reports a pothole, operators have no immediate way to correlate that complaint with nearby CCTV footage or find the nearest available field crew. This results in manual, slow, and inefficient triage and dispatch processes.

## 💡 Our Solution
**VizagOps Unify** solves this by geospatially and temporally correlating citizen complaints with nearby sensor events. It then auto-suggests the nearest available field team and routes an actionable alert. 

**Goal:** Reduce the time between "complaint filed" and "team dispatched" by **40%**.

---

## ✨ Key Features
- **Unified GIS Dashboard:** A live MapLibre GL JS vector-map interface displaying complaints, sensor events, and active field teams across Visakhapatnam.
- **Automated Incident Matching:** Geospatial matching engine that links citizen complaints to nearby automated CCTV/sensor alerts.
- **Smart Dispatch:** Ranks and suggests the nearest available field teams based on live location feeds, allowing operators to assign tasks in a single click.
- **TEE Security & Enclave Protection:** Trusted Execution Environment (AMD SEV-SNP confidential VMs) architecture protecting citizen PII (Personally Identifiable Information) and CCTV metadata with hardware-level memory encryption and remote attestation.
- **Role-Based Workflows:** Distinct views for Command Center Operators, Field Teams, and Municipal ingest nodes.
- **Modern & Premium UI:** Built with React 19, TailwindCSS, and GSAP for fluid, cinematic animations and micro-interactions.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 + Vite
- **GIS Mapping:** MapLibre GL JS (Vector Map Engine)
- **Security Enclave:** Trusted Execution Environment (TEE - AMD SEV-SNP Confidential VMs)
- **Styling:** Tailwind CSS & Custom CSS System
- **Animations:** GSAP (GreenSock Animation Platform)
- **Icons:** Lucide React
- **Routing:** React Router DOM v7

---

## 🚀 Getting Started (Local Development)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/ArunTejaReddy02/-City-Operations-Center-COC-.git
   cd -City-Operations-Center-COC-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server address provided in the terminal (usually `http://localhost:5173`).

---

## 📂 Project Structure
```text
.
├── src/
│   ├── components/
│   │   ├── Landing/       # Landing page components (Hero, Navbar, Footer, etc.)
│   │   ├── Map/           # Leaflet GIS Map components
│   │   ├── Dashboard/     # Operator command center components
│   │   └── Effects/       # UI animation and background effects
│   ├── pages/             # Route level components (LandingPage, Dashboard, etc.)
│   ├── styles/            # Core design system and global CSS
│   ├── lib/               # Utility functions and helpers
│   ├── App.jsx            # Main application root and routing
│   └── main.jsx           # React entry point
├── public/                # Static assets
├── PRD_GVMC-COC-Unified-Ops-Pilot.md # Project Requirements Document
└── package.json
```

---

## 🤝 Stakeholders & Pilot Scope
This project is a rapid prototype developed as a proof-of-concept for the GVMC IT team and GVSCCL Ops. The current scope is deliberately narrow (focusing on one ward and specific asset types like potholes and waterlogging) to prove technical feasibility and rapid deployment capabilities.

*Built for Visakhapatnam Municipal Corporation (GVMC) & GVSCCL.*
