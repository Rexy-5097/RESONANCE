import React from 'react';
import { WifiOff } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 bg-safety-bg border-b border-slate-800 flex items-center justify-between px-6 z-40 relative shadow-md">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-wider text-white">
                    RESONANCE <span className="text-slate-500 font-normal ml-2 text-sm">// PRE-INCIDENT DETECTION</span>
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
