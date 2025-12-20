'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconMail } from '../Icons';

interface GameCommsRelayProps {
  onBack: () => void;
}

const GameCommsRelay: React.FC<GameCommsRelayProps> = ({ onBack }) => {
  const [step, setStep] = useState<'menu' | 'compose' | 'sending' | 'sent'>('menu');
  const [formData, setFormData] = useState({ name: '', message: '' });

  const handleSend = () => {
    setStep('sending');
    setTimeout(() => {
        setStep('sent');
    }, 2000);
  };

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
                {step === 'sending' ? 'TRANSMITTING...' : 'SIGNAL: STRONG'}
             </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 font-mono text-cyan-500">
            
            {step === 'menu' && (
                <div className="space-y-6">
                    <p className="opacity-80 mb-8"> > WELCOME, GUEST. SELECT PROTOCOL:</p>
                    
                    <button 
                        onClick={() => setStep('compose')}
                        className="w-full text-left border border-cyan-500/30 p-4 hover:bg-cyan-500 hover:text-black transition-all group flex justify-between items-center"
                    >
                        <span>[1] INITIATE_MESSAGE_SEQUENCE</span>
                        <span className="opacity-0 group-hover:opacity-100">&lt;&lt;</span>
                    </button>

                    <a 
                        href="https://www.linkedin.com/in/pamimo" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full text-left border border-cyan-500/30 p-4 hover:bg-cyan-500 hover:text-black transition-all group block flex justify-between items-center"
                    >
                        <span>[2] ACCESS_LINKEDIN_DATABASE</span>
                        <span className="opacity-0 group-hover:opacity-100">EXT_LINK</span>
                    </a>

                    <button 
                        onClick={onBack}
                        className="w-full text-left border border-cyan-500/30 p-4 hover:bg-red-500 hover:border-red-500 hover:text-white transition-all group flex justify-between items-center"
                    >
                        <span>[ESC] TERMINATE_CONNECTION</span>
                        <span className="opacity-0 group-hover:opacity-100">X</span>
                    </button>
                </div>
            )}

            {step === 'compose' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs opacity-50 block"> > ENTER_IDENTITY</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-cyan-900/10 border-b border-cyan-500/50 p-2 focus:outline-none focus:border-cyan-500 text-cyan-100"
                            placeholder="Identify yourself..."
                            autoFocus
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs opacity-50 block"> > ENTER_PAYLOAD</label>
                        <textarea 
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-cyan-900/10 border-b border-cyan-500/50 p-2 focus:outline-none focus:border-cyan-500 text-cyan-100 h-32 resize-none"
                            placeholder="Type your message..."
                        />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                        <button 
                            onClick={handleSend}
                            disabled={!formData.name || !formData.message}
                            className="flex-1 bg-cyan-500 text-black font-bold py-3 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            [TRANSMIT]
                        </button>
                        <button 
                            onClick={() => setStep('menu')}
                            className="px-6 border border-cyan-500/50 hover:bg-cyan-900/20 transition-colors"
                        >
                            CANCEL
                        </button>
                    </div>
                </div>
            )}

            {step === 'sending' && (
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-center">
                        <p className="animate-pulse">UPLOADING PACKETS...</p>
                        <p className="text-xs opacity-50 mt-2">ENCRYPTING DATA STREAM</p>
                    </div>
                    
                    {/* Simulated Progress Bar */}
                    <div className="w-64 h-2 bg-cyan-900/30 mt-4 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2 }}
                            className="h-full bg-cyan-500"
                        />
                    </div>
                </div>
            )}

            {step === 'sent' && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center border-2 border-cyan-500">
                        <IconMail className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">TRANSMISSION COMPLETE</h2>
                        <p className="opacity-70 text-sm max-w-xs mx-auto">
                            Your message has been logged in the central mainframe. I will respond to your frequency shortly.
                        </p>
                    </div>
                    <button 
                        onClick={onBack}
                        className="bg-cyan-500 text-black px-8 py-3 font-bold hover:bg-white transition-colors"
                    >
                        [CLOSE TERMINAL]
                    </button>
                </div>
            )}

         </div>

         {/* Scanlines */}
         <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
    </motion.div>
  );
};

export default GameCommsRelay;