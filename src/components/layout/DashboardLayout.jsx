import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen bg-safety-bg overflow-hidden text-slate-200 font-sans selection:bg-tech-cyan selection:text-black">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Global atmospheric overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-safety-bg to-[#0f172a] opacity-50 pointer-events-none z-0" />

                <Header />

                <main className="flex-1 overflow-auto p-6 relative z-10 w-full h-full">
                    <motion.div
                        className="max-w-[1600px] mx-auto h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.15, delayChildren: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
