import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const CyberCard = ({ children, className, hover = true, noPadding = false }) => {
    return (
        <motion.div
            className={clsx(
                "relative overflow-hidden rounded-lg bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg",
                "shadow-black/40",
                noPadding ? "p-0" : "p-5",
                className
            )}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={hover ? {
                scale: 1.01,
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(6, 182, 212, 0.1)"
            } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Searchlight/Glow effect at top */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-tech-cyan/50 to-transparent opacity-50" />

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
