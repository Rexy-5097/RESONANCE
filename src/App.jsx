import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import PulseMonitor from './components/dashboard/PulseMonitor';
import SensorStatus from './components/dashboard/SensorStatus';
import AlertFeed from './components/dashboard/AlertFeed';
import SystemHealth from './components/dashboard/SystemHealth';
import useAudioMonitor from './hooks/useAudioMonitor';
import useVisualEnergy from './hooks/useVisualEnergy';
import useResonanceLogic from './hooks/useResonanceLogic';
import HQIntelligence from './components/dashboard/HQIntelligence';
import { analyzeThreat } from './services/azureService';
import { useState, useEffect, useRef } from 'react';

function App() {
  // 1. Raw Signals
  const { audioLevel, distressIndex } = useAudioMonitor();
  const { kineticEnergy, isCameraActive, takeSnapshot } = useVisualEnergy(); // Added takeSnapshot

  // Cloud Analysis State
  const [hqAnalysis, setHqAnalysis] = useState(null);
  const hasTriggeredCloud = useRef(false);

  // 2. Decision Engine (The "Brain")
  const { systemState, fusionScore, alertLog, addExternalLog } = useResonanceLogic({
    audioLevel,
    kineticEnergy
  });

  // 3. Cloud Uplink Trigger (Phase 5)
  useEffect(() => {
    // Only trigger on FRESH critical state
    if (systemState === 'CRITICAL' && !hasTriggeredCloud.current) {
      hasTriggeredCloud.current = true;

      // 1. Capture Context
      const snapshot = takeSnapshot();
      if (snapshot) {
        // 2. Request Analysis
        analyzeThreat(snapshot, { audioLevel, kineticEnergy })
          .then(result => {
            setHqAnalysis(result);
            // 3. Log the Uplink
            addExternalLog({
              type: 'CLOUD_SYNC',
              timestamp: result.timestamp,
              level: 'INFO',
              message: 'HQ INTELLIGENCE: Contextual analysis received'
            });
          });
      }
    }

    // Reset trigger if we go back to stable (allow re-trigger if crisis returns)
    if (systemState === 'STABLE') {
      hasTriggeredCloud.current = false;
      setHqAnalysis(null); // Clear old analysis
    }
  }, [systemState, takeSnapshot, audioLevel, kineticEnergy]);

  return (
    <DashboardLayout systemState={systemState}>
      <HQIntelligence analysis={hqAnalysis} systemState={systemState} />
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
