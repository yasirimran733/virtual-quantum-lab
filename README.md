# Virtual Quantum Lab - Advanced Physics Simulation Platform

[![Deployed on Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=quantum-vision&style=flat-square)](https://virtual-quantum-lab1.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

**Virtual Quantum Lab** is a state-of-the-art, interactive physics simulation laboratory designed for students, educators, and enthusiasts. It bridges the gap between abstract theoretical concepts and visual understanding through real-time simulations, immersive 3D environments, and AI-assisted learning.

**[🔴 Live Demo](https://virtual-quantum-lab1.vercel.app/)**

---

## 🚀 Key Features

### 🔬 Interactive Physics Simulations

Explore complex physical phenomena through hands-on manipulation of variables in real-time.

- **Classical Mechanics:**
  - **Projectile Motion:** Analyze trajectories with adjustable velocity, angle, and gravity.
  - **Collisions:** Simulate elastic and inelastic collisions in 2D space.
  - **Pendulum Dynamics:** Observe harmonic motion and damping effects.
- **Electromagnetism:**
  - **Electric & Magnetic Fields:** Visualize field lines and charge interactions.
  - **Faraday's Law:** Interactive generator and motor simulations demonstrating electromagnetic induction.
- **Waves & Optics:**
  - **Wave Interference:** Observe constructive and destructive interference patterns.
  - **Diffraction & Refraction:** Visualize how waves interact with obstacles and mediums.
- **Quantum Mechanics:**
  - **Quantum Tunneling:** Visualize probability distributions and barrier penetration.
  - **Wave Functions:** Interactive representations of quantum states.
- **Relativity:**
  - **Spacetime Diagrams:** Visualize time dilation and length contraction.

### 🧠 AI-Powered Learning (QubitAI)

Integrated **QubitAI** assistant, powered by **OpenRouter**, serves as a personal physics tutor.

- **Context-Aware:** Ask questions about the current simulation.
- **Concept Explanation:** Get detailed breakdowns of complex theories.
- **Experiment Guide:** Receive suggestions for parameters to try in simulations.

### 🎲 Quantum Random Number Generator (QRNG)

A professional-grade random number generation tool.

- **True Randomness:** Fetches data from the **ANU Quantum Random Numbers API**, measuring quantum vacuum fluctuations.
- **Classical Fallback:** Robust pseudo-random generation (Math.random) with identical UI/UX for offline use.
- **Statistical Analysis:** Real-time visualization of distribution, mean, and standard deviation using **Chart.js**.
- **Export Options:** Generate Hex, Binary, or Integer streams.

### 🎨 Modern Engineering & Design

- **Immersive UI:** Glassmorphism design system built with **Tailwind CSS**.
- **Dynamic Theming:** Seamless Dark/Light mode switching with persistent state.
- **3D Visualization:** Utilizes **Three.js** and **React Three Fiber** for stunning background effects and 3D simulation elements.
- **Custom Physics Engines:** Dedicated JavaScript modules (`src/physics/`) for accurate physical calculations independent of the rendering layer.

---

## 🛠️ Tech Stack

### Core Framework

- **React 18:** Component-based UI architecture.
- **Vite:** Next-generation frontend tooling for lightning-fast builds.

### Styling & Animation

- **Tailwind CSS:** Utility-first CSS framework.
- **Framer Motion:** Production-ready animation library for React.
- **PostCSS:** Tool for transforming CSS with JavaScript.

### Visualization & Graphics

- **Three.js / React Three Fiber:** WebGL-based 3D graphics.
- **Chart.js / React-Chartjs-2:** Data visualization for QRNG and physics graphs.

### Logic & State

- **React Router v6:** Client-side routing.
- **Context API:** Global state management (Theme, User Preferences).
- **OpenRouter SDK:** AI model integration.

---

## 📂 Project Structure

```bash
quantum-vision/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── charts/          # Chart.js wrapper components
│   │   ├── physics/         # Physics-specific UI controls (Sliders, Inputs)
│   │   └── visualizations/  # Core simulation rendering logic (Canvas/WebGL)
│   ├── context/             # Global state providers (ThemeContext)
│   ├── pages/               # Application routes
│   │   ├── demos/           # Individual simulation pages (e.g., FaradaysLaw.jsx)
│   │   ├── learning/        # Educational text and tutorials
│   │   ├── QRNG.jsx         # Quantum Random Number Generator page
│   │   └── QubitAI.jsx      # AI Assistant interface
│   ├── physics/             # Pure JS physics engines (calculations only)
│   │   ├── ClassicalMechanics.js
│   │   ├── Electromagnetism.js
│   │   └── QuantumMechanics.js
│   ├── utils/               # Helper functions (API, Math, Animations)
│   ├── App.jsx              # Main application layout and routing
│   └── main.jsx             # Entry point
├── public/                  # Static assets
├── vercel.json              # Vercel deployment configuration
└── vite.config.js           # Vite configuration
```

---

## 📦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/YasirDev786/quantum-vision.git
    cd quantum-vision
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Setup (Optional)**
    To enable the AI features, create a `.env` file in the root directory:

    ```env
    VITE_OPENROUTER_API_KEY=your_api_key_here
    ```

4.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

## 🏗️ Building for Production

To create an optimized build for deployment:

```bash
npm run build
```

The output will be generated in the `dist` folder.

---

## 🤝 Contributing

We welcome contributions from the community!

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/NewSimulation`).
3.  Commit your changes (`git commit -m 'Add NewSimulation'`).
4.  Push to the branch (`git push origin feature/NewSimulation`).
5.  Open a Pull Request.

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

_Developed by Code Fusion Company_
