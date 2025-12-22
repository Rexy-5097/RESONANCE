import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity } from 'lucide-react';
import CyberCard from '../ui/CyberCard';

const HQIntelligence = ({ analysis, systemState }) => {
    return (
        <AnimatePresence>
            {analysis && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="fixed bottom-6 right-6 z-50 w-full max-w-md"
                >
                    <CyberCard className="bg-slate-900/90 backdrop-blur-md border-tech-cyan/50 shadow-2xl">
                        <div className="flex items-start gap-4">
                            {/* Icon Pulse */}
                            <div className="relative mt-1">
                                <div className="absolute inset-0 bg-tech-cyan animate-ping rounded-full opacity-20" />
                                <ShieldAlert className="text-tech-cyan relative z-10" size={24} />
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-tech-cyan font-bold tracking-widest text-sm uppercase">
                                        HQ Intelligence Uplink
                                    </h4>
                                    <span className="text-[10px] font-mono text-slate-500">
                                        {analysis.timestamp}
                                    </span>
                                </div>

                                <p className="text-slate-200 text-sm font-mono leading-relaxed border-l-2 border-slate-700 pl-3">
                                    {analysis.analysis}
                                </p>

                                <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-2">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                                        Confidence: {(analysis.confidence * 100).toFixed(0)}%
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] text-tech-cyan/70">
                                        <Activity size={10} />
                                        <span>LIVE DATA STREAM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CyberCard>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HQIntelligence;
