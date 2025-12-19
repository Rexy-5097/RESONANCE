import React from 'react';
import { WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <header className="h-16 bg-safety-bg border-b border-white/5 flex items-center justify-between px-6 z-40 relative shadow-md shadow-black/20">
            <div className="flex items-center gap-4">
                {/* Live Status Indicator */}
                <div className="flex items-center gap-2 mr-2">
                    <motion.div
                        className="w-2 h-2 rounded-full bg-signal-safe"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                <h1 className="text-xl font-bold tracking-wider text-white flex items-center gap-2">
                    RESONANCE <span className="text-slate-500 font-normal ml-2 text-sm hidden md:inline-block tracking-normal">// PRE-INCIDENT DETECTION</span>
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <div className="items-center flex gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700">
                    <WifiOff size={14} className="text-slate-400" />
                    <span className="text-xs font-mono font-medium text-slate-400 tracking-widest">OFFLINE</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
