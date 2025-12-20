'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GameCommsRelayProps {
  onBack: () => void;
}

const GameCommsRelay: React.FC<GameCommsRelayProps> = ({ onBack }) => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 pointer-events-auto bg-black/95 backdrop-blur-md"
    >
      <div className="w-full max-w-2xl bg-black border-2 border-cyan-500/50 p-6 md:p-12 relative shadow-[0_0_40px_rgba(6,182,212,0.15)] min-h-[500px] flex flex-col">
         
         {/* Header */}
         <div className="flex justify-between items-end border-b border-cyan-500/30 pb-4 mb-8 font-mono text-cyan-500">
             <div>
                <h1 className="text-2xl font-bold tracking-widest">COMMS_UPLINK</h1>
                <p className="text-xs opacity-60">SECURE CHANNEL // ENCRYPTED</p>
             </div>
             <div className="text-xs animate-pulse">
                SIGNAL: STRONG
             </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 font-mono text-cyan-500">

            <div className="h-full flex flex-col justify-center">
                <div className="space-y-6">
                    <p className="opacity-80 mb-8">&gt; WELCOME, GUEST. SELECT PROTOCOL:</p>

                    <a
                        href="mailto:oluwapamimoakinjide@gmail.com"
                        className="w-full text-left border border-cyan-500/30 p-4 hover:bg-cyan-500 hover:text-black transition-all group flex justify-between items-center"
                    >
                        <span>[1] SEND_EMAIL_TRANSMISSION</span>
                        <span className="opacity-0 group-hover:opacity-100">&lt;&lt;</span>
                    </a>

                    <a
                        href="https://www.linkedin.com/in/pamimo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full text-left border border-cyan-500/30 p-4 hover:bg-cyan-500 hover:text-black transition-all group block flex justify-between items-center"
                    >
                        <span>[2] ACCESS_LINKEDIN_DATABASE</span>
                        <span className="opacity-0 group-hover:opacity-100">EXT_LINK</span>
                    </a>

                    <div className="border border-cyan-500/30 p-4 bg-cyan-500/5">
                        <p className="text-xs opacity-60 mb-2">DIRECT_CONTACT:</p>
                        <p className="text-sm">oluwapamimoakinjide@gmail.com</p>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full text-left border border-cyan-500/30 p-4 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all group flex justify-between items-center"
                    >
                        <span>[ESC] TERMINATE_CONNECTION</span>
                        <span className="opacity-0 group-hover:opacity-100">X</span>
                    </button>
                </div>
            </div>

         </div>

         {/* Scanlines */}
         <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
    </motion.div>
  );
};

export default GameCommsRelay;