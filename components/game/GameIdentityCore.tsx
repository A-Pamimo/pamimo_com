'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameIdentityCoreProps {
    onBack: () => void;
    initialBounds?: { x: number, y: number, w: number, h: number } | null;
}

type Tab = 'profile' | 'stats' | 'lore';

const GameIdentityCore: React.FC<GameIdentityCoreProps> = ({ onBack, initialBounds }) => {
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const isInitialParamsValid = initialBounds && initialBounds.x !== undefined;

    return (
        <motion.div
            initial={isInitialParamsValid && initialBounds ? {
                opacity: 0,
                left: initialBounds.x,
                top: initialBounds.y,
                width: initialBounds.w,
                height: initialBounds.h,
                scale: 0.1,
                borderRadius: 20
            } : { opacity: 0, scale: 0.98, left: 0, top: 0, width: '100%', height: '100%' }}
            animate={{
                opacity: 1,
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                scale: 1,
                borderRadius: 0,
                transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] }
            }}
            exit={isInitialParamsValid && initialBounds ? {
                opacity: 0,
                left: initialBounds.x,
                top: initialBounds.y,
                width: initialBounds.w,
                height: initialBounds.h,
                scale: 0.1,
                borderRadius: 20,
                transition: { duration: 0.4, ease: "easeInOut" }
            } : { opacity: 0, scale: 0.98 }}
            className="fixed z-[200] flex items-center justify-center p-0 pointer-events-auto bg-black/95 backdrop-blur-sm overflow-hidden origin-top-left"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="w-full max-w-4xl bg-black border-2 border-amber-500/50 relative shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col h-[600px] overflow-hidden">

                {/* Navigation Tabs */}
                <div className="flex border-b border-amber-500/30">
                    {['profile', 'stats', 'lore'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as Tab)}
                            className={`flex-1 py-4 font-mono text-sm uppercase tracking-widest transition-colors border-r border-amber-500/30 last:border-r-0 hover:bg-amber-500/10 ${activeTab === tab ? 'bg-amber-500 text-black font-bold' : 'text-amber-500'
                                }`}
                        >
                            [{tab.toUpperCase()}]
                        </button>
                    ))}
                    <button
                        onClick={onBack}
                        className="px-6 py-4 font-mono text-sm text-amber-500 hover:bg-red-900/20 hover:text-red-500 transition-colors border-l border-amber-500/30"
                    >
                        [X]
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 md:p-12 font-mono text-amber-500 overflow-y-auto relative">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full"
                            >
                                <div className="md:col-span-1 border border-amber-500/30 p-2 bg-black">
                                    <video
                                        src="/IMG_3961.mov"
                                        className="w-full h-full object-cover grayscale opacity-80"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-6">
                                    <h2 className="text-3xl font-bold border-b border-amber-500/30 pb-2">SUBJECT: PAMIMO AKINJIDE</h2>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="opacity-70">CLASS:</div><div>BUILDER</div>
                                        <div className="opacity-70">BASE:</div><div>TORONTO, CA</div>
                                        <div className="opacity-70">STATUS:</div><div>ONLINE</div>
                                    </div>
                                    <div className="bg-amber-500/10 p-4 border border-amber-500/30 mt-4">
                                        <p className="leading-relaxed text-sm opacity-90">
                                            "Primary Directive: To bridge the gap between technical rigor and human-centric strategy. Operates with high agency in complex systems."
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'stats' && (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <h2 className="text-2xl font-bold mb-6">&gt; ATTRIBUTE_MATRIX</h2>

                                <div className="space-y-4">
                                    {[
                                        { label: 'PRODUCT_SENSE', val: 95 },
                                        { label: 'STRATEGIC_ALIGNMENT', val: 90 },
                                        { label: 'TECHNICAL_FLUENCY', val: 85 },
                                        { label: 'STAKEHOLDER_MGMT', val: 90 },
                                        { label: 'DATA_ANALYTICS', val: 80 }
                                    ].map(stat => (
                                        <div key={stat.label}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span>{stat.label}</span>
                                                <span>{stat.val}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-amber-900/30">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stat.val}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                    className="h-full bg-amber-500"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="border border-amber-500/30 p-4 text-center">
                                        <div className="text-3xl font-bold mb-1">NEW</div>
                                        <div className="text-xs opacity-60">GRAD</div>
                                    </div>
                                    <div className="border border-amber-500/30 p-4 text-center">
                                        <div className="text-3xl font-bold mb-1">300K</div>
                                        <div className="text-xs opacity-60">LIVES_IMPACTED</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'lore' && (
                            <motion.div
                                key="lore"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 overflow-y-auto h-full pr-4"
                            >
                                <h2 className="text-2xl font-bold mb-4">&gt; SYSTEM_LOGS</h2>

                                <div className="space-y-6 text-sm">
                                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                                        <span className="text-xs opacity-50 block mb-1">LOG_2025.11</span>
                                        <p className="opacity-90">Impact 100 Methodology deployed. Framework finalized for Western Canada Economic Forum to quantify cultural value.</p>
                                    </div>

                                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                                        <span className="text-xs opacity-50 block mb-1">LOG_2025.05 - 2025.08</span>
                                        <p className="opacity-90">RBC Product Manager (Amplify). Built Agentic AI solution for banking advisors. Filed patent for automated workflows.</p>
                                    </div>

                                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                                        <span className="text-xs opacity-50 block mb-1">LOG_2024.07 - 2025.04</span>
                                        <p className="opacity-90">City Strategy Protocol. Processed $1B+ in budget data for Saskatoon (300k+ citizens). Executed rigorous variance analysis.</p>
                                    </div>

                                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                                        <span className="text-xs opacity-50 block mb-1">LOG_2023.10 - 2024.08</span>
                                        <p className="opacity-90">Business Intelligence (ITS). Automated core data pipelines. Python/SQL/VBA stack. Drastically reduced operational overhead.</p>
                                    </div>

                                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                                        <span className="text-xs opacity-50 block mb-1">LOG_2023.08</span>
                                        <p className="opacity-90">Founded ESS node. Community fragmentation detected. Executed unification protocol. Status: Thriving.</p>
                                    </div>

                                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                                        <span className="text-xs opacity-50 block mb-1">LOG_2022.01 - 2022.07</span>
                                        <p className="opacity-90">Software Engineering Intern (Liviasoft). Deployed low-level C and Z80 Assembly. Bare metal optimization. 8086 architecture.</p>
                                    </div>

                                    <div className="border-l-2 border-amber-500 pl-4 py-1">
                                        <span className="text-xs opacity-50 block mb-1">LOG_2020.01 - 2022.11</span>
                                        <p className="opacity-90">Community Lead (Lead Nigeria). Orchestrated educational resource centers. IDP Camp outreach. Direct human impact.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>
        </motion.div>
    );
};

export default GameIdentityCore;