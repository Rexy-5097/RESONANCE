import React from 'react';
import { Eye, Mic, Wifi } from 'lucide-react';
import clsx from 'clsx';

const StatusCard = ({ icon: Icon, label, status, type }) => {
    const isOk = status === 'ACTIVE' || status === 'LISTENING';

    return (
        <div className="bg-safety-panel border border-slate-700 rounded-lg p-4 flex items-center justify-between shadow-lg relative overflow-hidden group">
            <div className="flex items-center gap-4 z-10">
                <div className={clsx(
                    "p-3 rounded-full border",
                    isOk ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" : "bg-red-500/10 border-red-500/50 text-red-400"
                )}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <div className={clsx("w-2 h-2 rounded-full", isOk ? "bg-emerald-400 animate-pulse" : "bg-red-400")} />
                        <span className={clsx("font-mono font-bold text-sm", isOk ? "text-emerald-400" : "text-red-400")}>
                            {status}
                        </span>
                    </div>
                </div>
            </div>
            {/* Decorative BG Icon */}
            <Icon className="absolute -right-4 -bottom-4 text-slate-800/50 transform rotate-12 group-hover:scale-110 transition-transform duration-500" size={80} />
        </div>
    );
};

const SensorStatus = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatusCard icon={Eye} label="Visual Feed" status="ACTIVE" type="visual" />
            <StatusCard icon={Mic} label="Audio Feed" status="LISTENING" type="audio" />
        </div>
    );
};

export default SensorStatus;
