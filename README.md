# PROJECT RESONANCE

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-0.1.0-lightgrey.svg)

## 📡 System Overview

**Project RESONANCE** is a deterministic, real-time sensor fusion array for environmental awareness. It processes audio-visual telemetry on-device to derive crowd kinetic energy and distress metrics without cloud dependencies. Built with a "defense-grade" aesthetic, it prioritizes data clarity and cinematic visual feedback.

The interface transforms raw telemetry into a cohesive visual language, allowing for immediate identification of system anomalies, thermal spikes, and network integrity issues.

### Key Capabilities
- **Pulse Monitor**: Real-time visualization of data streams with dynamic motion metrics.
- **Sensor Grid**: Live status tracking of distributed sensor nodes (Online/Offline/Warning).
- **System Health**: Consolidated view of core metrics including Integrity, Power Draw, and Thermal status.
- **Alert Feed**: Chronological log of system notifications and critical warnings.

---

## 🛠 Technology Stack

This project is engineered using a modern, performance-first frontend stack:

- **Core Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
  - utilizing the latest React features for concurrent rendering and state management.
- **Styling System**: [TailwindCSS](https://tailwindcss.com/)
  - Utility-first architecture for rapid, consistent styling.
  - `clsx` & `tailwind-merge` for robust class composition.
- **Motion Engine**: [Framer Motion](https://www.framer.com/motion/)
  - Physics-based animations for fluid, organic interface interactions.
- **Iconography**: [Lucide React](https://lucide.dev/)
  - Clean, consistent SVG icons optimized for performance.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Start-Up-Inc/Resonance.git
   cd Resonance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Initialize Development Server**
   ```bash
   npm run dev
   ```
   The application will become available at `http://localhost:5173` (or the next available port).

### Building for Production

To create a production-ready build:
```bash
npm run build
```
This will compile assets to the `dist` directory, optimized for deployment.

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── dashboard/       # Core visualization widgets (Pulse, Sensors, Health)
│   ├── layout/          # Main application shell and structure
│   └── ui/              # Reusable design system primitives
├── App.jsx              # Main application entry point
└── main.jsx             # React DOM root
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
