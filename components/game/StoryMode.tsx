'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../../types';
import GameProjectConsole from './GameProjectConsole';
import GameIdentityCore from './GameIdentityCore';
import GameCommsRelay from './GameCommsRelay';
import GameContactTerminal from './GameContactTerminal';
import GameBlogConsole from './GameBlogConsole';
import CRTOverlay from './ui/CRTOverlay';
import { renderGame } from './gameRenderer';

import GameA11yOverlay from './GameA11yOverlay';
import StoryHUD from './StoryHUD';
import { IconArrow } from '../ui/Icons';
import { useGamePhysics, GamePhysicsState, GameObject } from '../../hooks/useGamePhysics';
import { useGameInput } from '../../hooks/useGameInput';
import { CONTACT_EMAIL } from '../../constants';
import { useStoryModals } from '../../hooks/useStoryModals';
import { useLocalStorage } from '../../hooks/useLocalStorage';

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
    const [visitedList, setVisitedList] = useLocalStorage<string[]>('pamimo_visited_nodes', []);
    const visitedNodes = React.useMemo(() => new Set(visitedList), [visitedList]);

    // Track if user has engaged with game mode (for analytics/UX)
    const [, setGamePlayed] = useLocalStorage<boolean>('game_played', false);

    // Mark game as played when component mounts (user entered game mode)
    useEffect(() => {
        setGamePlayed(true);
    }, [setGamePlayed]);

    // --- Interaction Callback ---
    const onInteract = useCallback((target: GameObject) => {
        setVisitedList(prev => {
            if (prev.includes(target.id)) return prev;
            return [...prev, target.id];
        });

        if (target.type === 'project' && target.data) {
            setProjectModal(target.data);
        } else if (target.id === 'contact') {
            setContactModal(true);
        } else if (target.id === 'about') {
            setIdentityModal(true);
        } else if (target.id === 'blog') {
            setBlogModal(true);
        }
    }, [setProjectModal, setContactModal, setIdentityModal, setBlogModal, setVisitedList]);

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
    }, [projectModal, identityModal, contactModal, blogModal, physics.cameraRef, physics.canvasRef, physics.interactionTarget, setModalOriginRect]);

    // Portal Logic: Ensure we are on client and have body access
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!active || !mounted) return null;

    // Use Portal to escape 'app/template.tsx' transforms
    const content = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[9999] bg-black text-white font-mono overflow-hidden touch-none ${physics.isHoveringObject ? 'cursor-pointer' : 'cursor-crosshair'}`}
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
                    <GameBlogConsole
                        onBack={() => setBlogModal(false)}
                    />
                )}
            </AnimatePresence>

            {/* CRT Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <CRTOverlay />
            </div>
        </motion.div>
    );

    // Dynamic Import or Direct Usage? Direct is fine for ReactDOM
    const { createPortal } = require('react-dom');
    return createPortal(content, document.body);
};

export default StoryMode;