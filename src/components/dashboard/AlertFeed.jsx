import React from 'react';
import { Terminal } from 'lucide-react';
import CyberCard from '../ui/CyberCard';

// Mock data (Chronological: Oldest -> Newest for Terminal handling)
// Initial System Log
const mockAlerts = [
    { id: 1, type: 'info', message: 'Sensor Array Initialized', time: '00:00:00', loc: 'SYS' },
];

const AlertItem = ({ alert, isLatest }) => {
    const typeLabel = {
        warn: 'WARN',
        crit: 'CRIT',
        info: 'INFO',
    };

    const colors = {
        warn: 'text-signal-warn',
        crit: 'text-signal-crit',
        info: 'text-tech-cyan',
    };

    return (
        <div className="font-mono text-xs mb-1 last:mb-0 leading-relaxed">
            <span className="text-slate-500 mr-2">[{alert.time}]</span>
            <span className={`${colors[alert.type]} mr-2 font-bold`}>
                {typeLabel[alert.type]}
            </span>
            <span className="text-slate-300">
                {alert.message}
            </span>
            <span className="text-slate-600 mx-2 text-[10px] uppercase">
                //{alert.loc}
            </span>
            {isLatest && (
                <span className="animate-pulse font-bold text-tech-cyan inline-block translate-y-[2px]">_</span>
            )}
        </div>
    );
};

const AlertFeed = () => {
    return (
        <CyberCard className="flex flex-col h-full relative" title="System Logs">
            <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none" />

            <h3 className="text-slate-100 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 glow-text relative z-20">
                <Terminal size={16} className="text-tech-cyan" />
                Terminal Output
            </h3>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col justify-end min-h-0 relative">
                {/* Mask to fade top (older logs) */}
                <div className="space-y-0.5 pb-2">
                    {mockAlerts.map((alert, index) => (
                        <AlertItem
                            key={alert.id}
                            alert={alert}
                            isLatest={index === mockAlerts.length - 1}
                        />
                    ))}
                </div>
            </div>
        </CyberCard>
    );
};

export default AlertFeed;
