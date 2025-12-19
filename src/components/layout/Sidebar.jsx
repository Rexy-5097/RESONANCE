import React from 'react';
import { Activity, FileText, Settings, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
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
                    <motion.button
                        key={index}
                        className={clsx(
                            "p-3 rounded-lg relative",
                            item.active
                                ? "text-tech-cyan"
                                : "text-slate-400"
                        )}
                        title={item.label}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {/* Active Background Glow */}
                        {item.active && (
                            <motion.div
                                layoutId="sidebar-active"
                                className="absolute inset-0 bg-slate-800 border border-slate-700 rounded-lg -z-10 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                            />
                        )}

                        {/* Hover Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-slate-800/50 rounded-lg opacity-0 -z-10"
                            whileHover={{ opacity: 1 }}
                        />

                        <item.icon size={20} />
                    </motion.button>
                ))}
            </nav>

            <div className="mt-auto pb-4">
                <div className="w-2 h-2 rounded-full bg-signal-safe animate-pulse" title="System Active" />
            </div>
        </aside>
    );
};

export default Sidebar;
