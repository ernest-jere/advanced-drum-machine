# 🥁 Advanced Synthesizer Drum Machine

A high-performance, fully interactive web-based drum machine and sequencer application built with **React**, **Vite**, and **Tailwind CSS**. The project features an ultra-low latency audio processing architecture powered by the native **Web Audio API** and is fully optimized using **Oxlint**, a blazing fast Rust-based linter.

🚀 **Live Deployment:** https://advanced-drum-machine.vercel.app/

---

## ✨ Features

- **🎯 Zero-Latency Synthesized Engine:** Utilizes the web browser's native `AudioContext` and dynamic oscillators to completely eliminate standard CORS cross-origin media network blockages and audio lag.
- **🎙️ Built-in Step Sequencer:** Record your rhythm patterns in real time, calculate precise time offsets, and play back your custom recorded sequences perfectly.
- **⚡ Modern Build & Code Quality Ecosystem:** Fully integrated with Vite 6, Tailwind CSS v4 (handling styles natively without legacy configuration files), and Oxlint for sub-millisecond static code analysis.
- **📱 Responsive Audio Deck Design:** Beautiful dark-mode dashboard tailored with dynamic hardware layouts, audio sliders, power toggles, and instant visual flash feedback on active drum pads.
- **⌨️ Dual Control Setup:** Seamlessly trigger pads via manual mouse clicks or using global keyboard hotkeys (`Q`, `W`, `E`, `A`, `S`, `D`, `Z`, `X`, `C`).

---

## 🛠️ Tech Stack & Architecture

| Technology | Purpose | Core Layer Benefits |
| :--- | :--- | :--- |
| **React 19** | User Interface | Component abstraction, stable hook matrix dependencies (`useCallback`, `useRef`). |
| **Vite 6** | Build Tooling | Lightning-fast Hot Module Replacement (HMR) and native CSS module processing. |
| **Tailwind CSS v4** | Utility Styling | Native CSS configuration injection via single `@import "tailwindcss"` layer. |
| **Oxlint** | Performance Linter | Rust-powered engine processing codebase checks in less than 10 milliseconds. |
| **Web Audio API** | Core Sound Engine | Generates clean modular synthesiser waveforms directly out of sound cards. |

---

## 📦 Project Directory Layout

```text
advanced-drum-machine/
├── public/
│   └── favicon.ico
├── src/
│   ├── audioBank.js     # Embedded mini-data audio resource array
│   ├── App.jsx          # Primary UI, sequencer state loop, and audio hooks
│   ├── main.jsx         # React application entry pipeline point
│   └── index.css        # Tailwind v4 import layer and base resets
├── package.json         # Automated scripts setup and dependencies matrix
└── vite.config.js       # Config containing integrated Tailwind Vite plugin
```

---

## 🚀 Local Workspace Quick Start

### 1. Installation
Clone the repository path and install the workspace dependency nodes:
```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/advanced-drum-machine.git
cd advanced-drum-machine
npm install
```

### 2. Development Execution
Launch the local Vite server environment:
```bash
npm run dev
```
Open your browser to `http://localhost:5173` to interact with your audio deck layout.

### 3. Automated Code Diagnostics & Fixing (Oxlint)
- **Run Quick Scan:** `npm run lint:fast` (Checks syntax correctness and performance bottlenecks instantly).
- **Run Auto-Fix Tool:** `npm run lint:fix` (Automatically repairs minor code format anomalies).

---

## ☁️ Deployment Guides

### Part A: Uploading to GitHub
Initialize your Git tracker and push your codebase assets to your profile repository:
```bash
git init
git add .
git commit -m "feat: complete performance synthesizer drum machine integration"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/advanced-drum-machine.git
git push -u origin main
```

### Part B: Publishing on Vercel
1. Go to the [Vercel Dashboard](https://vercel.com) and click **"New Project"**.
2. Connect your GitHub account and import your `advanced-drum-machine` repository block.
3. Vercel automatically detects the **Vite** configuration profile settings. Leave the default values untouched:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. Your app will be live globally in less than a minute!
