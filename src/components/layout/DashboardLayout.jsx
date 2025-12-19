import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen bg-safety-bg overflow-hidden text-slate-200 font-sans selection:bg-tech-cyan selection:text-black">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-safety-bg to-[#0f172a] opacity-50 pointer-events-none" />
                <Header />
                <main className="flex-1 overflow-auto p-6 relative z-10">
                    <div className="max-w-[1600px] mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
