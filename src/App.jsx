import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import PulseMonitor from './components/dashboard/PulseMonitor';
import SensorStatus from './components/dashboard/SensorStatus';
import AlertFeed from './components/dashboard/AlertFeed';
import SystemHealth from './components/dashboard/SystemHealth';
import useAudioMonitor from './hooks/useAudioMonitor';
import useVisualEnergy from './hooks/useVisualEnergy';
import useResonanceLogic from './hooks/useResonanceLogic';

function App() {
  // 1. Raw Signals
  const { audioLevel, distressIndex } = useAudioMonitor();
  const { kineticEnergy, isCameraActive } = useVisualEnergy();

  // 2. Decision Engine (The "Brain")
  const { systemState, fusionScore, alertLog } = useResonanceLogic({
    audioLevel,
    kineticEnergy
  });

  return (
    <DashboardLayout systemState={systemState}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-6 h-full content-start">
        {/* Top Row: Pulse Monitor (Wide) */}
        <div className="lg:col-span-3">
          <PulseMonitor
            fusionScore={fusionScore}
            audioLevel={audioLevel}
            kineticEnergy={kineticEnergy}
            systemState={systemState}
          />
        </div>

        {/* Right Column: System Health */}
        <div className="lg:col-span-1 h-full">
          <SystemHealth />
        </div>

        {/* Bottom Row: Sensors & Alerts */}
        <div className="lg:col-span-2">
          <SensorStatus />
        </div>
        <div className="lg:col-span-2 h-64 lg:h-auto">
          <AlertFeed logs={alertLog} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
