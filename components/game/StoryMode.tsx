'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types';
import GameProjectConsole from './GameProjectConsole';
import GameIdentityCore from './GameIdentityCore';
import GameCommsRelay from './GameCommsRelay';
import GameContactTerminal from './GameContactTerminal';
import { IconArrow } from '../ui/Icons';
import { useGamePhysics, GamePhysicsState, GameObject } from '../../hooks/useGamePhysics';
import { CONTACT_EMAIL } from '../../constants';

interface StoryModeProps {
    active: boolean;
    onExit: () => void;
    onSelectProject: (project: Project) => void;
}

type GameView = 'world' | 'project' | 'identity' | 'comms';

const StoryMode: React.FC<StoryModeProps> = ({ active, onExit, onSelectProject }) => {
    // View State
    const [currentView, setCurrentView] = useState<GameView>('world');

    // Modals State - these drive the overlays
    const [projectModal, setProjectModal] = useState<Project | null>(null);
    const [identityModal, setIdentityModal] = useState(false);
    const [contactModal, setContactModal] = useState(false);
    const [modalOriginRect, setModalOriginRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

    // Gameplay State
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());

    // --- Interaction Callback ---
    const onInteract = useCallback((target: GameObject) => {
        setVisitedNodes(prev => new Set(prev).add(target.id));

        // Spatial Transition Calculation
        // Since we are inside the hook's callback, accessing refs directly is hard
        // But we can just use the target's position relative to the last known camera?
        // Actually, the hook handles the loop, but we need screen coords.
        // We will calc this roughly or use a center default if needed.
        // Better: We can access the camera ref if we pass it back?
        // Hook returns `cameraRef`.

        // We defer this briefly to let the physics hook usage settle.
        // For now, let's just trigger the state.

        if (target.type === 'project' && target.data) {
            setProjectModal(target.data);
            // We also select it in the parent app?
            // User requested: "onSelectProject(project)". 
            // In the original code, it set `currentView` to `project`.
            // Let's keep internal state for the modal.
            // onSelectProject(target.data); // This might close StoryMode if not handled carefully in page.tsx
        } else if (target.id === 'contact') {
            setContactModal(true);
        } else if (target.id === 'about') {
            setIdentityModal(true);
        }
    }, [onSelectProject]); // Dependencies

    // --- Physics Hook ---
    // We need to define `draw` before calling the hook? No, useCallback handles it.

    const draw = useCallback((ctx: CanvasRenderingContext2D, state: GamePhysicsState) => {
        const { camera, objects, bounds, interactionTarget, hoveredObject, player } = state;
        const canvas = ctx.canvas;

        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(cx - camera.x, cy - camera.y);

        // Floor Bounds
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

        // Grid
        const gridSize = 80;
        const startGridX = Math.floor((camera.x - cx) / gridSize) * gridSize;
        const startGridY = Math.floor((camera.y - cy) / gridSize) * gridSize;

        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = startGridX - gridSize * 2; x < startGridX + canvas.width + gridSize * 2; x += gridSize) {
            ctx.moveTo(x, startGridY - gridSize * 10);
            ctx.lineTo(x, startGridY + canvas.height + gridSize * 10);
        }
        for (let y = startGridY - gridSize * 2; y < startGridY + canvas.height + gridSize * 2; y += gridSize) {
            ctx.moveTo(startGridX - gridSize * 10, y);
            ctx.lineTo(startGridX + canvas.width + gridSize * 10, y);
        }
        ctx.stroke();

        // Border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.strokeRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

        // Objects
        objects.forEach(obj => {
            if (obj.type === 'label') {
                const computedFont = getComputedStyle(canvas).fontFamily;
                ctx.font = `bold ${obj.fontSize}px ${computedFont}`;
                ctx.shadowBlur = 20;
                ctx.shadowColor = obj.color;
                ctx.fillStyle = obj.color;
                ctx.textAlign = 'center';
                ctx.fillText(obj.label, obj.x, obj.y);
                ctx.shadowBlur = 0;
                return;
            }

            const isProximityTarget = interactionTarget?.id === obj.id;
            const isMouseTarget = hoveredObject?.id === obj.id;
            const isHighlighted = isProximityTarget || isMouseTarget;
            // VisitedNodes is a closure from component state.
            // Since `draw` is in useCallback with `[visitedNodes]`, this is fresh.
            const isVisited = visitedNodes.has(obj.id);

            // --- SHADOW / GLOW ---
            if (isHighlighted) {
                ctx.shadowBlur = 30;
                ctx.shadowColor = obj.color;
            } else {
                ctx.shadowBlur = 0;
            }

            // --- BASE RECT ---
            ctx.fillStyle = (isHighlighted || isVisited) ? obj.color : '#1a1a1a';
            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

            ctx.strokeStyle = obj.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

            ctx.shadowBlur = 0;

            // --- DETAILS INSIDE (Servers) ---
            if (obj.type === 'project' || obj.type === 'portal') {
                // Internal Screen/Panel
                ctx.fillStyle = isHighlighted ? '#000' : '#111';
                ctx.fillRect(obj.x + 10, obj.y + 10, obj.w - 20, 60);

                // Status Light
                const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
                let lightColor = obj.color;
                if (isVisited) lightColor = '#00ff00';

                ctx.fillStyle = isHighlighted ? '#fff' : lightColor;
                ctx.globalAlpha = isHighlighted ? 1 : 0.5 + pulse * 0.5;
                ctx.beginPath();
                ctx.arc(obj.x + obj.w - 15, obj.y + 20, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // Text Info
                ctx.fillStyle = isHighlighted ? '#000' : 'rgba(255,255,255,0.6)';
                ctx.textAlign = 'center';
                ctx.font = "bold 12px 'JetBrains Mono'";

                if (obj.data) {
                    let yearText = `${obj.data.year}`;
                    if (obj.id === 'city') yearText = '2024-25';
                    if (obj.id === 'weg') yearText = 'LIVE';
                    ctx.fillText(yearText, obj.x + obj.w / 2, obj.y + 45);
                } else if (obj.id === 'contact') {
                    ctx.fillText("SEND", obj.x + obj.w / 2, obj.y + 45);
                } else {
                    ctx.fillText("DATA", obj.x + obj.w / 2, obj.y + 45);
                }

                // Rack Lines
                ctx.strokeStyle = isHighlighted ? '#000' : '#333';
                ctx.lineWidth = 1;
                for (let i = 0; i < 4; i++) {
                    const yLine = obj.y + 80 + (i * 15);
                    if (yLine < obj.y + obj.h - 10) {
                        ctx.beginPath();
                        ctx.moveTo(obj.x + 10, yLine);
                        ctx.lineTo(obj.x + obj.w - 10, yLine);
                        ctx.stroke();
                    }
                }
            }

            // --- NEON LABEL (Always visible if highlighted, or if it's a Server/Portal on touch) ---
            if (isHighlighted) {
                ctx.save();
                ctx.translate(0, -10); // Float up slightly

                // Background Pill
                const labelWidth = ctx.measureText(obj.label).width + 20;
                ctx.fillStyle = '#000';
                ctx.globalAlpha = 0.8;
                ctx.fillRect(obj.x + obj.w / 2 - labelWidth / 2, obj.y - 30, labelWidth, 24);
                ctx.globalAlpha = 1.0;

                // Border
                ctx.strokeStyle = obj.color;
                ctx.lineWidth = 1;
                ctx.strokeRect(obj.x + obj.w / 2 - labelWidth / 2, obj.y - 30, labelWidth, 24);

                // Text
                ctx.shadowBlur = 10;
                ctx.shadowColor = obj.color;
                ctx.fillStyle = obj.color;
                ctx.font = "bold 13px 'JetBrains Mono'";
                ctx.textAlign = 'center';
                ctx.fillText(obj.label, obj.x + obj.w / 2, obj.y - 14);

                ctx.restore();
            } else {
                // Default subtle label
                ctx.shadowBlur = 0;
                ctx.fillStyle = propsOpacity > 0 ? obj.color : 'rgba(255,255,255,0.3)'; // Fallback
                ctx.font = "bold 13px 'JetBrains Mono'";
                ctx.textAlign = 'center';
                // Only show if close enough or it's a main label
                ctx.fillText(obj.label.length > 15 ? obj.label.substring(0, 12) + '...' : obj.label, obj.x + obj.w / 2, obj.y - 15);
            }

            // Subtitle
            if (obj.data && isHighlighted) {
                // Already handled in pill logic above basically, but let's keep it simple
            }

            ctx.shadowBlur = 0;
        });

        // Add propsOpacity hack to silence linter if needed, but logic is:
        const propsOpacity = 1;

        // Player
        const px = player.pos.x;
        const py = player.pos.y;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF4400';
        ctx.fillStyle = '#FF4400';
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2); // 12 = PLAYER_SIZE/2
        ctx.fill();
        ctx.shadowBlur = 0;

        // Direction Indicator
        ctx.fillStyle = 'white';
        const eyeOffsetX = player.facing === 'left' ? -4 : player.facing === 'right' ? 4 : 0;
        const eyeOffsetY = player.facing === 'up' ? -4 : player.facing === 'down' ? 4 : 0;
        ctx.fillRect(px - 2 + eyeOffsetX, py - 2 + eyeOffsetY, 4, 4);

        ctx.restore();

    }, [visitedNodes]);

    // Use the Hook
    const physics = useGamePhysics({
        active,
        onInteract,
        onDraw: draw,
        onExit, // Escape key triggers this
        currentView
    });

    // We must handle setting modalOriginRect when interaction occurs.
    useEffect(() => {
        if (physics.interactionTarget && (physics.interactionTarget.type === 'project' || physics.interactionTarget.id === 'contact' || physics.interactionTarget.id === 'about')) {
            // But this effect runs whenever interactionTarget changes, which happens every frame during proximity.
            // We only want to set bounds when we *actually enter* the modal (triggered by onInteract).
            // So we do it in onInteract?
            // Yes, but we need camera pos.
            // onInteract is above. We need 'physics' variable to access cameraRef.
            // But 'physics' is defined *after* 'onInteract' because 'onInteract' is passed TO 'useGamePhysics'.
            // CIRCULAR DEPENDENCY.

            // Fix: Use a ref for camera that we pass TO the hook? Or let the hook return it and we use it in a separate effect?
            // The hook *returns* cameraRef.
            // But onInteract is a callback passed *to* the hook.
            // So inside onInteract, we can't see the 'physics' object constant yet.

            // Yes. When `projectModal` becomes non-null, capture current camera pos.
        }
    }, [physics]); // Added physics as dependency

    // Unified Escape Key Handler & Interaction
    useEffect(() => {
        if (!active) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                // Priority 1: Close Modals
                if (projectModal) {
                    setProjectModal(null);
                    return;
                }
                if (identityModal) {
                    setIdentityModal(false);
                    return;
                }
                if (contactModal) {
                    setContactModal(false);
                    return;
                }

                // Priority 2: Exit Game
                onExit();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [active, projectModal, identityModal, contactModal, onExit]);

    // Effect to Capture Bounds on Modal Open
    useEffect(() => {
        if (projectModal || identityModal || contactModal) {
            const cam = physics.cameraRef.current;
            const cvs = physics.canvasRef.current;
            // We need the target object.
            // It's likely `physics.interactionTarget`.
            const target = physics.interactionTarget;

            if (cam && cvs && target) {
                const cx = cvs.width / 2;
                const cy = cvs.height / 2;
                setModalOriginRect({
                    x: target.x - cam.x + cx,
                    y: target.y - cam.y + cy,
                    w: target.w,
                    h: target.h
                });
            }
        }
    }, [projectModal, identityModal, contactModal]);

    // Helpers
    const MobileBtn = ({ dir }: { dir: string }) => (
        <button
            className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:bg-pop/50 flex items-center justify-center transition-colors touch-none"
            onPointerDown={() => physics.handleMobileInput(dir, true)}
            onPointerUp={() => physics.handleMobileInput(dir, false)}
            onPointerLeave={() => physics.handleMobileInput(dir, false)}
        >
            <IconArrow className={`w-6 h-6 text-white ${dir === 'up' ? '-rotate-90' : dir === 'down' ? 'rotate-90' : dir === 'left' ? 'rotate-180' : ''}`} />
        </button>
    );

    if (!active) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] bg-black text-white font-mono overflow-hidden touch-none ${physics.isHoveringObject ? 'cursor-pointer' : 'cursor-crosshair'}`}
        >
            <canvas
                ref={physics.canvasRef}
                className="block w-full h-full"
                {...physics.canvasHandlers}
            />

            {/* HUD */}
            {!projectModal && !identityModal && !contactModal && (
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

                    {/* Interaction Prompt - Only if near target AND not modal open */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                        <AnimatePresence>
                            {physics.interactionTarget && !physics.hoveredObject && (
                                <motion.button
                                    onClick={() => onInteract(physics.interactionTarget!)}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    className="bg-white text-black px-6 py-3 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-3 border-2 border-white cursor-pointer"
                                    onPointerDown={(e) => e.stopPropagation()}
                                >
                                    <span className="text-xs tracking-widest">ACCESS: {physics.interactionTarget.label}</span>
                                    <span className="bg-black text-white text-[10px] px-2 py-1 hidden md:inline">SPACE</span>
                                    <span className="bg-black text-white text-[10px] px-2 py-1 md:hidden">TAP</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Controls */}
                    <div className="pointer-events-auto md:hidden grid grid-cols-3 gap-2 w-48 mx-auto mb-8">
                        <div></div><MobileBtn dir="up" /><div></div>
                        <MobileBtn dir="left" /><MobileBtn dir="down" /><MobileBtn dir="right" />
                    </div>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {projectModal && (
                    <GameProjectConsole
                        project={projectModal}
                        onBack={() => setProjectModal(null)}
                        initialBounds={modalOriginRect}
                    />
                )}
                {identityModal && (
                    <GameIdentityCore
                        onBack={() => setIdentityModal(false)}
                        initialBounds={modalOriginRect}
                    />
                )}
                {contactModal && (
                    <GameContactTerminal
                        onBack={() => setContactModal(false)}
                        initialBounds={modalOriginRect}
                    />
                )}
            </AnimatePresence>

            {/* CRT Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
        </motion.div>
    );
};

export default StoryMode;