import React from 'react';
import { Terminal } from 'lucide-react';
import clsx from 'clsx';
import CyberCard from '../ui/CyberCard';

const AlertItem = ({ alert, isLatest }) => {
    return (
        <div className="font-mono text-xs mb-1 last:mb-0 leading-relaxed">
            <span className="text-slate-500 mr-2">[{alert.timestamp}]</span>
            <span className={clsx("mr-2 font-bold",
                alert.type === 'PHASE_SHIFT' ? 'text-tech-cyan' : '',
                alert.level === 'CRITICAL' ? 'text-signal-crit' : '',
                alert.level === 'ELEVATED' ? 'text-signal-warn' : ''
            )}>
                {alert.level || 'INFO'}
            </span>
            <span className="text-slate-300">
                {alert.message}
            </span>
            {isLatest && (
                <span className="animate-pulse font-bold text-tech-cyan inline-block translate-y-[2px]">_</span>
            )}
        </div>
    );
};

const AlertFeed = ({ logs = [] }) => {
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
                    {logs.length === 0 ? (
                        <div className="text-slate-600 text-[10px] font-mono p-2">NO ACTIVE EVENTS</div>
                    ) : (
                        logs.map((alert, index) => (
                            <AlertItem
                                key={alert.id}
                                alert={alert}
                                isLatest={index === logs.length - 1}
                            />
                        ))
                    )}
                </div>
            </div>
        </CyberCard>
    );
};

export default AlertFeed;
