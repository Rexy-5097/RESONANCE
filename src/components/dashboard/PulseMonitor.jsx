import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import CyberCard from '../ui/CyberCard';

const PulseMonitor = ({ fusionScore = 50, audioLevel = 0, kineticEnergy = 0 }) => {
    const [data, setData] = useState(Array(50).fill(50));

    // Update history with incoming fusionScore
    useEffect(() => {
        setData(prev => {
            const next = [...prev.slice(1), fusionScore];
            return next;
        });
    }, [fusionScore]);

    const width = 600;
    const height = 200;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d / 100) * height);
        return `${x},${y}`;
    }).join(' ');

    const currentValue = data[data.length - 1];

    const getStatusColor = (val) => {
        if (val > 80) return 'text-signal-crit shadow-signal-crit/20';
        if (val > 60) return 'text-signal-warn shadow-signal-warn/20';
        return 'text-tech-cyan shadow-tech-cyan/20';
    }

    const statusClass = getStatusColor(currentValue);
    // Use Cyan as default, Red/Orange for alerts
    const glowColor = currentValue > 80 ? '#EF4444' : currentValue > 60 ? '#F59E0B' : '#06B6D4';

    return (
        <CyberCard className="col-span-2 group">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-900 border border-slate-700">
                        <Activity size={20} className={statusClass.split(' ')[0]} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest glow-text font-mono">Crowd Stress Index</h3>
                        <p className="text-xs text-slate-500 font-mono">
                            FUSION: AUDIO {audioLevel.toFixed(0)}% • VISUAL {kineticEnergy.toFixed(0)}%
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={clsx("text-3xl font-mono font-bold transition-colors duration-300 glow-text", statusClass.split(' ')[0])}>
                        {currentValue.toFixed(1)}
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-medium tracking-wider font-mono">Index Level</p>
                </div>
            </div>

            <div className="h-64 bg-slate-950 rounded border border-slate-800 relative w-full overflow-hidden">
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0">
                    <defs>
                        {/* Grid Pattern */}
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                        </pattern>

                        {/* Stroke Gradient: Fade from transparent (left/old) to color (right/new) */}
                        <linearGradient id="stroke-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={glowColor} stopOpacity="0" />
                            <stop offset="20%" stopColor={glowColor} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={glowColor} stopOpacity="1" />
                        </linearGradient>

                        {/* Fill Gradient */}
                        <linearGradient id="fill-gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor={glowColor} stopOpacity="0.1" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Background Grid */}
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Filled Area - Subtle */}
                    <path
                        d={`M0,${height} L${points} L${width},${height} Z`}
                        fill="url(#fill-gradient)"
                        className="transition-colors duration-300"
                    />

                    {/* Main Trace using Gradient Stroke */}
                    <motion.path
                        d={`M${points.split(' ')[0]} L${points}`}
                        fill="none"
                        stroke="url(#stroke-gradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ filter: `drop-shadow(0 0 4px ${glowColor})` }}
                        className="transition-colors duration-300"
                    />
                </svg>
            </div>
        </CyberCard>
    );
};

export default PulseMonitor;
