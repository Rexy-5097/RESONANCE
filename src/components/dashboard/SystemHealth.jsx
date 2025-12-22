import React from 'react';
import { Cpu, HardDrive, Zap } from 'lucide-react';
import CyberCard from '../ui/CyberCard';

const MetricRow = ({ label, value, unit, icon: Icon }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
        <div className="flex items-center gap-3 text-slate-400">
            <Icon size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-lg font-mono font-bold text-tech-cyan">{value}</span>
            <span className="text-xs text-slate-600 font-bold">{unit}</span>
        </div>
    </div>
);

const SystemHealth = () => {
    return (
        <CyberCard>
            <h3 className="text-slate-100 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2 glow-text">
                <Zap size={16} className="text-slate-400" />
                System Health
            </h3>

            <div className="flex flex-col">
                <MetricRow label="CPU Load" value="---" unit="%" icon={Cpu} />
                <MetricRow label="Memory" value="---" unit="GB" icon={HardDrive} />
                <MetricRow label="Uptime" value="00:00:00" unit="H:M:S" icon={Zap} />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/50">
                <div className="text-xs text-slate-500 font-mono text-center opacity-60">
                    VERSION 0.1.0-ALPHA
                </div>
            </div>
        </CyberCard>
    );
};

export default SystemHealth;
