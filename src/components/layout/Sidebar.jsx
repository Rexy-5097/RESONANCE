import React from 'react';
import { Activity, FileText, Settings, Shield } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const navItems = [
        { icon: Activity, label: 'Monitor', active: true },
        { icon: Shield, label: 'Sensors', active: false },
        { icon: FileText, label: 'Logs', active: false },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <aside className="w-16 h-full bg-safety-panel border-r border-slate-800 flex flex-col items-center py-6 gap-6 z-50">
            <div className="text-tech-cyan mb-4">
                <Shield size={28} />
            </div>

            <nav className="flex flex-col gap-4 w-full items-center">
                {navItems.map((item, index) => (
                    <button
                        key={index}
                        className={clsx(
                            "p-3 rounded-lg transition-colors duration-200",
                            item.active
                                ? "bg-slate-800 text-tech-cyan border border-slate-700"
                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                        )}
                        title={item.label}
                    >
                        <item.icon size={20} />
                    </button>
                ))}
            </nav>

            <div className="mt-auto pb-4">
                <div className="w-2 h-2 rounded-full bg-signal-safe animate-pulse" title="System Active" />
            </div>
        </aside>
    );
};

export default Sidebar;
