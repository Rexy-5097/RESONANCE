import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import CyberCard from '../ui/CyberCard';

const mockAlerts = [
    { id: 1, type: 'warn', message: 'Audio energy spike detected', time: '10:42:33', loc: 'Sector 4' },
    { id: 2, type: 'info', message: 'Motion variance increased', time: '10:41:15', loc: 'Sector 2' },
    { id: 3, type: 'crit', message: 'Sensor connection unstable', time: '10:39:42', loc: 'Cam-04' },
    { id: 4, type: 'info', message: 'System automated check complete', time: '10:30:00', loc: 'SYS' },
];

const AlertItem = ({ alert }) => {
    const colors = {
        warn: 'text-signal-warn border-signal-warn/30 bg-signal-warn/5',
        crit: 'text-signal-crit border-signal-crit/30 bg-signal-crit/5',
        info: 'text-tech-cyan border-tech-cyan/30 bg-tech-cyan/5',
    };

    const Icons = {
        warn: AlertTriangle,
        crit: AlertCircle,
        info: Info,
    };

    const Icon = Icons[alert.type];

    return (
        <div className={`flex items-start gap-3 p-3 rounded border mb-2 last:mb-0 ${colors[alert.type]}`}>
            <Icon size={16} className="mt-0.5 shrink-0" />
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <span className="text-sm font-medium leading-tight">{alert.message}</span>
                    <span className="text-xs opacity-70 font-mono whitespace-nowrap ml-2">{alert.time}</span>
                </div>
                <p className="text-xs opacity-60 mt-1 font-mono uppercase tracking-wide">LOC: {alert.loc}</p>
            </div>
        </div>
    );
};

const AlertFeed = () => {
    return (
        <CyberCard className="flex flex-col h-full">
            <h3 className="text-slate-100 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 glow-text">
                <AlertCircle size={16} className="text-slate-400" />
                Live Feed
            </h3>
            <div className="flex-1 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                {mockAlerts.map(alert => (
                    <AlertItem key={alert.id} alert={alert} />
                ))}
                {/* Gradient fade at bottom */}
                <div className="h-4" />
            </div>
        </CyberCard>
    );
};

export default AlertFeed;
