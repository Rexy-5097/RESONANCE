import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const CyberCard = ({ children, className, hover = true, noPadding = false, title }) => {
    return (
        <motion.div
            className={clsx(
                "relative overflow-hidden rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-800 shadow-lg",
                "shadow-black/40",
                noPadding ? "p-0" : "p-5",
                className
            )}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={hover ? {
                scale: 1.005, // Reduced scale for "Technical" feel
                borderColor: "rgba(6, 182, 212, 0.3)",
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.05)"
            } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }} // Snappier transition
        >
            {/* Corner Accents - Ruggedized Logic */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-tech-cyan/50 rounded-tl" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-tech-cyan/50 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-tech-cyan/50 rounded-bl" />

            {/* Tech ID Label */}
            <div className="absolute bottom-1 right-2 pointer-events-none">
                <span className="text-[10px] text-slate-600 font-mono tracking-widest opacity-50 font-bold">
                    SYS-01
                </span>
            </div>

            {/* Bottom-right Corner Accent (Visual only, behind text) */}
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-tech-cyan/50 rounded-br" />

            {/* Searchlight/Glow effect at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tech-cyan/20 to-transparent opacity-50" />

            {/* Content */}
            <div className="relative z-10 h-full">
                {children}
            </div>

            {/* Subtle Cyan Inner Glow */}
            <div className="absolute inset-0 bg-tech-cyan/5 pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </motion.div>
    );
};

export default CyberCard;
