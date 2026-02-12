# Virtual Quantum Lab – Advanced Physics Simulation Platform

[![Deployed on Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=quantum-vision&style=flat-square)](https://virtual-quantum-lab1.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

**Virtual Quantum Lab** is an interactive physics simulation laboratory designed for students, educators, and enthusiasts. It bridges the gap between abstract theoretical concepts and visual understanding through real-time simulations, immersive 3D environments, and AI‑assisted learning. The project is available as a web app and as a desktop application powered by Electron.

**[🔴 Live Demo](https://virtual-quantum-lab1.vercel.app/)**

---

## 🚀 Key Features

### 🔬 Interactive Physics Simulations

Explore complex physical phenomena through hands-on manipulation of variables in real time:

- **Classical Mechanics**
  - **Projectile Motion:** Analyze trajectories with adjustable velocity, angle, and gravity.
  - **Collisions:** Simulate elastic and inelastic collisions in 2D space.
  - **Pendulum Dynamics:** Observe harmonic motion and damping effects.
- **Electromagnetism**
  - **Electric & Magnetic Fields:** Visualize field lines and charge interactions.
  - **Faraday's Law:** Interactive generator and motor simulations demonstrating electromagnetic induction.
- **Waves & Optics**
  - **Wave Interference:** Observe constructive and destructive interference patterns.
  - **Diffraction & Refraction:** Visualize how waves interact with obstacles and media.
- **Quantum Mechanics**
  - **Quantum Tunneling:** Visualize probability distributions and barrier penetration.
  - **Wave Functions:** Interactive representations of quantum states.
- **Relativity**
  - **Spacetime Diagrams:** Visualize time dilation, length contraction, and reference frames.

### 🧠 AI‑Powered Learning (QubitAI)

Integrated **QubitAI** assistant, powered by **OpenRouter**, serves as a personal physics tutor:

- **Context‑aware help** for questions related to physics concepts and simulations.
- **Concept explanations** with formulas and intuition.
- **Experiment guidance** with suggestions for parameters to try in simulations.

### 🖥️ Desktop Application (Electron)

Virtual Quantum Lab also ships as a desktop application for Windows, built with **Electron**:

- **Offline‑friendly experience** for running simulations without a browser.
- **Custom window chrome and tray integration** with minimize‑to‑tray behavior.
- **Export tools** for saving simulation views as PNG or PDF.
- **Global shortcuts**
  - `Ctrl/Cmd + S` – export current view.
  - `Ctrl/Cmd + F` – toggle fullscreen.
  - `Ctrl/Cmd + Q` – quit the app.

### 🎨 Modern Engineering & Design

- **Immersive UI:** Glassmorphism‑inspired design built with **Tailwind CSS**.
- **Dynamic theming:** Seamless dark/light mode switching with persistent state.
- **3D visualization:** **Three.js** and **React Three Fiber** for 3D effects and animated scenes.
- **Custom physics engines:** Dedicated JavaScript modules in `src/physics/` for accurate physical calculations independent of the rendering layer.

---

## 🛠️ Tech Stack

### Core Framework

- **React 18** – component‑based UI architecture.
- **Vite 5** – next‑generation frontend tooling for fast dev and builds.

### Styling & Animation

- **Tailwind CSS** – utility‑first CSS framework.
- **Framer Motion** – production‑ready animation library for React.
- **PostCSS** – CSS transformation pipeline.

### Visualization & Graphics

- **Three.js / React Three Fiber** – WebGL‑based 3D graphics and scenes.
- **Chart.js / React‑Chartjs‑2** – data visualization for simulation graphs and analytics.

### Routing, State & AI

- **React Router v6** – client‑side routing.
- **React Context API** – global state management (theme and layout).
- **OpenRouter SDK** – AI model integration for QubitAI.

### Desktop

- **Electron 39** – desktop application shell.
- **electron‑builder / electron‑updater** – packaging and auto‑update support.

---

## 📂 Project Structure

```bash
virtual-quantum-lab/
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── charts/             # Chart.js wrapper components for physics data
│   │   ├── desktop/            # Desktop-specific layout and title bar components
│   │   ├── physics/            # Physics-specific UI controls (sliders, buttons, tooltips)
│   │   └── visualizations/     # Core simulation rendering (Canvas / WebGL / 3D views)
│   ├── context/
│   │   └── ThemeContext.jsx    # Global theme provider (dark/light, layout)
│   ├── pages/                  # Application routes
│   │   ├── demos/              # Individual simulation pages (e.g., FaradaysLaw.jsx)
│   │   ├── learning/           # Educational text and tutorials
│   │   ├── QubitAI.jsx         # AI assistant interface
│   │   ├── AIAssistant.jsx     # Additional AI helper UI
│   │   ├── Download.jsx        # Desktop app download information
│   │   ├── Home.jsx            # Landing page
│   │   └── Simulations.jsx     # Simulations index and navigation
│   ├── physics/                # Pure JS physics engines (calculations only)
│   │   ├── ClassicalMechanics.js
│   │   ├── Electromagnetism.js
│   │   ├── QuantumMechanics.js
│   │   ├── Relativity.js
│   │   └── WavesOptics.js
│   ├── utils/                  # Helper functions (AI API, animations, formulas)
│   │   ├── openRouterService.js
│   │   ├── physicsAnimations.js
│   │   └── physicsFormulas.js
│   ├── App.jsx                 # Main application layout and routing
│   └── main.jsx                # React/Vite entry point
├── electron/                   # Electron main & preload processes
│   ├── main.cjs
│   └── preload.cjs
├── public/                     # Static assets (icons, favicon)
├── vercel.json                 # Vercel deployment configuration
├── vite.config.js              # Vite configuration (React, dev server)
└── package.json                # Scripts, dependencies, and Electron build config
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root to configure optional integrations:

```env
# Required for QubitAI (OpenRouter)
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here

# Alternative name also supported by the OpenRouter SDK
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

The app will run without these variables, but QubitAI features will be disabled until an API key is provided.

---

## 📦 Getting Started (Web)

### Prerequisites

- Node.js **v16+**
- **npm** (or another Node package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yasirimran733/virtual-quantum-lab.git
   cd virtual-quantum-lab
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment (optional for AI)**

   Create a `.env` file as described in the **Environment Variables** section if you want to enable QubitAI.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   By default Vite is configured to run on `http://localhost:3000`.

---

## 🖥️ Running the Desktop App (Electron)

During development, you can run the Electron desktop app alongside the Vite dev server:

```bash
npm run start        # or: npm run electron:dev
```

This will:

- Start the Vite dev server for the React app.
- Launch the Electron shell pointing at the dev server.

### Building Desktop Packages

To build the web bundle only:

```bash
npm run build
```

To build the Electron application for distribution:

```bash
# Build unpacked Electron app into dist_electron/
npm run build-electron

# Build installer (e.g., NSIS installer on Windows)
npm run build-installer
```

The Electron build configuration lives under the `build` key in `package.json`, and output is written to the `dist_electron` directory.

---

## 🚀 Building for Production (Web)

To create an optimized web build for deployment:

```bash
npm run build
```

The static assets will be generated in the `dist` folder and can be deployed to any static hosting provider (e.g., Vercel, Netlify).

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/NewSimulation`).
3. Commit your changes (`git commit -m "Add NewSimulation"`).
4. Push to the branch (`git push origin feature/NewSimulation`).
5. Open a Pull Request.

---

## 📝 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

_Developed by Code Fusion Company_
