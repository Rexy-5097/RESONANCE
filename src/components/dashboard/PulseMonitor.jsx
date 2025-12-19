import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import CyberCard from '../ui/CyberCard';

const PulseMonitor = () => {
    const [data, setData] = useState(Array(50).fill(50));

    useEffect(() => {
        const updateSignal = () => {
            setData(prev => {
                const time = Date.now() / 1000;
                const base = Math.sin(time * 2) * 15;
                const noise = Math.sin(time * 5) * 5 + (Math.random() - 0.5) * 4;
                const val = Math.max(0, Math.min(100, 50 + base + noise));
                return [...prev.slice(1), val];
            });
        };
        const interval = setInterval(updateSignal, 500);
        return () => clearInterval(interval);
    }, []);

    const width = 600;
    const height = 200;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d / 100) * height);
        return `${x},${y}`;
    }).join(' ');

    const currentValue = data[data.length - 1];

    const getStatusColor = (val) => {
        if (val > 80) return 'text-signal-crit border-signal-crit shadow-signal-crit/20';
        if (val > 60) return 'text-signal-warn border-signal-warn shadow-signal-warn/20';
        return 'text-signal-safe border-signal-safe shadow-signal-safe/20';
    }

    const statusClass = getStatusColor(currentValue);
    const glowColor = currentValue > 80 ? '#EF4444' : currentValue > 60 ? '#F59E0B' : '#10B981';

    return (
        <CyberCard className="col-span-2 group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded bg-slate-900 border transition-colors duration-500", statusClass.split(' ')[1])}>
                        <Activity size={20} className={statusClass.split(' ')[0]} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest glow-text">Crowd Stress Index</h3>
                        <p className="text-xs text-slate-500 font-mono">LIVE SIGNAL • 500ms</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={clsx("text-3xl font-mono font-bold transition-colors duration-300 glow-text", statusClass.split(' ')[0])}>
                        {currentValue.toFixed(1)}
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">Index Level</p>
                </div>
            </div>

            <div className="h-64 bg-slate-900/50 rounded border border-slate-800 relative w-full overflow-hidden">
                {/* Grid Lines */}
                {[0.25, 0.5, 0.75].map(p => (
                    <div key={p} className="absolute w-full border-t border-slate-800/30" style={{ top: `${p * 100}%` }} />
                ))}

                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0 overflow-visible">

                    <defs>
                        <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                        <linearGradient id="fill-gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={glowColor} stopOpacity="0.2" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Filled Area */}
                    <path
                        d={`M0,${height} L${points} L${width},${height} Z`}
                        fill="url(#fill-gradient)"
                        className="transition-colors duration-500"
                    />

                    {/* Animated Path */}
                    <motion.path
                        d={`M${points.split(' ')[0]} L${points}`} // Move to start then draw line
                        fill="none"
                        stroke={glowColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#glow-filter)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        vectorEffect="non-scaling-stroke"
                        className="transition-colors duration-500"
                    />
                </svg>
            </div>
        </CyberCard>
    );
};

export default PulseMonitor;
