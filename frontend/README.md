# VizagOps Unify — Frontend Application

![VizagOps Unify](https://img.shields.io/badge/Status-Pilot_Phase-emerald) ![Tech Stack](https://img.shields.io/badge/Stack-React19_%7C_Vite_%7C_Tailwind-blue) ![Maps](https://img.shields.io/badge/Maps-Google_Maps_JS_API-orange)

The frontend application for **VizagOps Unify** is a real-time, 60 FPS dashboard and citizen portal built for the Greater Visakhapatnam Municipal Corporation (GVMC) & Visakhapatnam Smart City Operations Center (GVSCCL).

---

## ✨ Features
- **Operator Command Center (`/dashboard`)**: Interactive Google Maps JS API vector interface displaying real-time citizen complaints, CCTV sensor pings, and field team GPS markers.
- **Citizen Grievance Portal (`/citizen`)**: Interactive form allowing citizens to report issues with landmark addresses, one-click **GPS auto-detection**, photo evidence upload (file + camera capture with live thumbnail preview), and progress tracking timeline (`Received → Under Review → Team Assigned → In Progress → Resolved`).
- **AI Triage & Prioritization Insights**: Integrates Groq AI (Llama 3.3 70B) for executive summaries and emergency priority scores.
- **Role-Based Auth & Switching**: Seamless role switching for Admins, Ward Officers, Field Agents, and Citizens.

---

## 🛠️ Technology Stack
- **Framework:** React 19 + Vite 8
- **Mapping:** Google Maps JavaScript API (with custom HTML `OverlayView` React portal markers)
- **Styling:** Custom Design System + Tailwind CSS
- **Animations:** GSAP (GreenSock Animation Platform), Lenis Smooth Scroll, Lottie Web
- **Icons:** Lucide React

---

## 🚀 Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

App runs on: `http://localhost:5174`
