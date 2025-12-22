import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import PulseMonitor from './components/dashboard/PulseMonitor';
import SensorStatus from './components/dashboard/SensorStatus';
import AlertFeed from './components/dashboard/AlertFeed';
import SystemHealth from './components/dashboard/SystemHealth';
import useAudioMonitor from './hooks/useAudioMonitor';
import useVisualEnergy from './hooks/useVisualEnergy';

function App() {
  const { audioLevel, distressIndex } = useAudioMonitor();
  const { kineticEnergy, isCameraActive } = useVisualEnergy();

  // Sensor Fusion Logic: Simple average for now
  // In a real system, this would be a weighted Kalman filter
  const fusionScore = (audioLevel + kineticEnergy) / 2;

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-6 h-full content-start">
        {/* Top Row: Pulse Monitor (Wide) */}
        <div className="lg:col-span-3">
          <PulseMonitor
            fusionScore={fusionScore}
            audioLevel={audioLevel}
            kineticEnergy={kineticEnergy}
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
          <AlertFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default App;
