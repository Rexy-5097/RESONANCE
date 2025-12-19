import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import clsx from 'clsx';

const PulseMonitor = () => {
    const [data, setData] = useState(Array(50).fill(50));
    const requestRef = useRef();

    // Deterministic-ish simulation
    useEffect(() => {
        const updateSignal = () => {
            setData(prev => {
                const time = Date.now() / 1000;
                // Base sine wave + structured noise (simulating crowd stress)
                const base = Math.sin(time * 2) * 15;
                const noise = Math.sin(time * 5) * 5 + (Math.random() - 0.5) * 4;
                const val = Math.max(0, Math.min(100, 50 + base + noise));

                const newData = [...prev.slice(1), val];
                return newData;
            });
        };

        const interval = setInterval(updateSignal, 500);
        return () => clearInterval(interval);
    }, []);

    // Calculate SVG path
    const width = 600;
    const height = 200;
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d / 100) * height);
        return `${x},${y}`;
    }).join(' ');

    const currentValue = data[data.length - 1].toFixed(1);

    // Determine color based on value
    const getStatusColor = (val) => {
        if (val > 80) return 'text-signal-crit border-signal-crit shadow-signal-crit/20';
        if (val > 60) return 'text-signal-warn border-signal-warn shadow-signal-warn/20';
        return 'text-signal-safe border-signal-safe shadow-signal-safe/20';
    }

    const statusClass = getStatusColor(data[data.length - 1]);

    return (
        <div className="bg-safety-panel border border-slate-700 rounded-lg p-5 col-span-2 shadow-lg relative overflow-hidden group hover:border-slate-600 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded bg-slate-900 border transition-colors duration-300", statusClass.split(' ')[1])}>
                        <Activity size={20} className={statusClass.split(' ')[0]} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Crowd Stress Index</h3>
                        <p className="text-xs text-slate-500 font-mono">LIVE SIGNAL • 500ms</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className={clsx("text-3xl font-mono font-bold transition-colors duration-300", statusClass.split(' ')[0])}>
                        {currentValue}
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-medium tracking-wider">Index Level</p>
                </div>
            </div>

            <div className="h-64 bg-slate-900/50 rounded border border-slate-800 relative w-full overflow-hidden">
                {/* Grid lines */}
                {[0.25, 0.5, 0.75].map(p => (
                    <div key={p} className="absolute w-full border-t border-slate-800/50" style={{ top: `${p * 100}%` }} />
                ))}

                {/* SVG Chart */}
                <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="absolute inset-0">
                    <path
                        d={`M0,${height} L${points} L${width},${height} Z`}
                        fill="url(#gradient)"
                        className="opacity-20"
                    />
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        points={points}
                        className={clsx("transition-colors duration-300", statusClass.split(' ')[0])}
                        vectorEffect="non-scaling-stroke"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="currentColor" className={statusClass.split(' ')[0]} />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Scanline effect */}
                <div className="absolute inset-0 bg-scanline pointer-events-none opacity-10"></div>
            </div>
        </div>
    );
};

export default PulseMonitor;
