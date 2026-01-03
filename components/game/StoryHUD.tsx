import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameObject } from '../../hooks/useGamePhysics';
import { IconArrow } from '../ui/Icons';

interface StoryHUDProps {
    onExit: () => void;
    interactionTarget: GameObject | null;
    onInteract: (target: GameObject) => void;
    onMobileInput: (dir: string, active: boolean) => void;
}

const StoryHUD: React.FC<StoryHUDProps> = ({
    onExit,
    interactionTarget,
    onInteract,
    onMobileInput
}) => {
    const MobileBtn = ({ dir }: { dir: string }) => (
        <button
            className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:bg-pop/50 flex items-center justify-center transition-colors touch-none"
            onPointerDown={() => onMobileInput(dir, true)}
            onPointerUp={() => onMobileInput(dir, false)}
            onPointerLeave={() => onMobileInput(dir, false)}
        >
            <IconArrow className={`w-6 h-6 text-white ${dir === 'up' ? '-rotate-90' : dir === 'down' ? 'rotate-90' : dir === 'left' ? 'rotate-180' : ''}`} />
        </button>
    );

    return (
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="bg-black/80 backdrop-blur border border-white/20 p-4 rounded-sm flex gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
                            <h1 className="text-sm font-bold tracking-widest text-white">SYSTEM_STATUS: ACTIVE</h1>
                        </div>
                        <div className="text-[10px] text-white/50">
                            MOUSE: ENABLED // TOUCH: ENABLED
                        </div>
                    </div>
                </div>
                <button onClick={onExit} className="pointer-events-auto bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/50 text-red-500 px-4 py-2 text-xs font-bold tracking-widest transition-colors">[DISCONNECT]</button>
            </div>

            {/* Interaction Prompt - Always show if near target, regardless of hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                <AnimatePresence>
                    {interactionTarget && (
                        <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.9 }}
                            animate={{
                                y: [0, -5, 0],
                                opacity: 1,
                                scale: 1,
                            }}
                            exit={{ y: 20, opacity: 0, scale: 0.9 }}
                            transition={{
                                y: {
                                    repeat: Infinity,
                                    duration: 1.5,
                                    ease: "easeInOut"
                                },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 }
                            }}
                            className="flex flex-col items-center gap-2"
                        >
                            <motion.button
                                onClick={() => onInteract(interactionTarget)}
                                className="bg-white text-black px-8 py-4 font-bold shadow-[0_0_30px_rgba(255,255,255,0.5)] flex flex-col items-center gap-2 border-4 border-white cursor-pointer hover:bg-black hover:text-white transition-colors"
                                onPointerDown={(e) => e.stopPropagation()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-sm tracking-widest">PRESS SPACE TO ENTER</span>
                                <span className="text-xs tracking-wider opacity-80">{interactionTarget.label}</span>
                            </motion.button>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="bg-black/80 backdrop-blur border border-white/40 px-4 py-2 text-[10px] tracking-widest text-white/90 hidden md:block"
                            >
                                [ SPACEBAR ] OR CLICK
                            </motion.div>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="bg-black/80 backdrop-blur border border-white/40 px-4 py-2 text-[10px] tracking-widest text-white/90 md:hidden"
                            >
                                TAP TO ENTER
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Controls */}
            <div className="pointer-events-auto md:hidden grid grid-cols-3 gap-2 w-48 mx-auto mb-8">
                <div></div><MobileBtn dir="up" /><div></div>
                <MobileBtn dir="left" /><MobileBtn dir="down" /><MobileBtn dir="right" />
            </div>
        </div>
    );
};

export default StoryHUD;
