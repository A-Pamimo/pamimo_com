'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types';
import GameProjectConsole from './GameProjectConsole';
import GameIdentityCore from './GameIdentityCore';
import GameCommsRelay from './GameCommsRelay';
import GameContactTerminal from './GameContactTerminal';
import GameBlogPlaceholder from './GameBlogPlaceholder';
import { renderGame } from './gameRenderer';

import GameA11yOverlay from './GameA11yOverlay';
import StoryHUD from './StoryHUD';
import { IconArrow } from '../ui/Icons';
import { useGamePhysics, GamePhysicsState, GameObject } from '../../hooks/useGamePhysics';
import { useGameInput } from '../../hooks/useGameInput';
import { CONTACT_EMAIL } from '../../constants';
import { useStoryModals } from '../../hooks/useStoryModals';

interface StoryModeProps {
    active: boolean;
    onExit: () => void;
    onSelectProject: (project: Project) => void;
}

type GameView = 'world' | 'project' | 'identity' | 'comms';

// --- ARCHITECTURAL NOTE ---
// This component acts as the "Game Kernel". It orchestrates:
// 1. Rendering (via gameRenderer.ts)
// 2. Physics & Collisions (via useGamePhysics hook)
// 3. Input Handling (via useGameInput hook)
// 4. State Management (via useStoryModals hook)
//
// We explicitly DECOUPLED the HUD and specific Modals to keep this file focused
// on the "Game Loop" and coordination logic. This is the "Controller" in MVC.
// --------------------------

const StoryMode: React.FC<StoryModeProps> = ({ active, onExit, onSelectProject }) => {
    // View State
    const [currentView, setCurrentView] = useState<GameView>('world');

    // Modals State
    const modals = useStoryModals();
    const {
        projectModal, identityModal, contactModal, blogModal, modalOriginRect
    } = modals.state;
    const {
        setProjectModal, setIdentityModal, setContactModal, setBlogModal, setModalOriginRect, closeAll
    } = modals.actions;

    // Gameplay State
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());

    // --- Interaction Callback ---
    const onInteract = useCallback((target: GameObject) => {
        setVisitedNodes(prev => new Set(prev).add(target.id));

        if (target.type === 'project' && target.data) {
            setProjectModal(target.data);
        } else if (target.id === 'contact') {
            setContactModal(true);
        } else if (target.id === 'about') {
            setIdentityModal(true);
        } else if (target.id === 'blog') {
            setBlogModal(true);
        }
    }, [setProjectModal, setContactModal, setIdentityModal, setBlogModal]);

    // --- Input & Physics Ref Sync ---
    const latestInteractionTarget = React.useRef<GameObject | null>(null);

    // --- Input Handlers ---
    const handleEscape = useCallback(() => {
        // Priority 1: Close Modals
        if (modals.isAnyOpen) {
            closeAll();
            return;
        }

        // Priority 2: Exit Game
        onExit();
    }, [modals.isAnyOpen, closeAll, onExit]);

    const handleInputInteract = useCallback(() => {
        if (latestInteractionTarget.current) {
            onInteract(latestInteractionTarget.current);
        }
    }, [onInteract]);

    // --- Input Hook ---
    const inputKeys = useGameInput({
        active,
        onEscape: handleEscape,
        onInteract: handleInputInteract
    });

    // --- Physics Hook ---

    // Extracted Renderer
    const draw = useCallback((ctx: CanvasRenderingContext2D, state: GamePhysicsState) => {
        renderGame(ctx, state, visitedNodes);
    }, [visitedNodes]);

    // Use the Hook
    const physics = useGamePhysics({
        active,
        onInteract,
        onDraw: draw,
        onExit, // Legacy exit handler (passed for completeness)
        currentView,
        keys: inputKeys
    });

    // Sync Ref for Input Handler
    useEffect(() => {
        latestInteractionTarget.current = physics.interactionTarget;
    }, [physics.interactionTarget]);

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
    // --- Manual Escape Logic Removed (Handled by useGameInput) ---

    // Effect to Capture Bounds on Modal Open
    useEffect(() => {
        if (projectModal || identityModal || contactModal || blogModal) {
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
    }, [projectModal, identityModal, contactModal, blogModal, physics.cameraRef, physics.canvasRef, physics.interactionTarget]);

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

            {/* Accessibility Overlay */}
            <GameA11yOverlay
                active={active}
                objects={physics.objects.current}
                onInteract={onInteract}
            />

            {/* HUD */}
            {!projectModal && !identityModal && !contactModal && (
                <StoryHUD
                    onExit={onExit}
                    interactionTarget={physics.interactionTarget || null}
                    onInteract={onInteract}
                    onMobileInput={physics.handleMobileInput}
                />
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
                {blogModal && (
                    <GameBlogPlaceholder
                        onBack={() => setBlogModal(false)}
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