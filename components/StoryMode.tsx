'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { PROJECT_DATA } from '../constants';
import GameProjectConsole from './game/GameProjectConsole';
import GameIdentityCore from './game/GameIdentityCore';
import GameCommsRelay from './game/GameCommsRelay';
import { IconArrow } from './Icons';

interface StoryModeProps {
    active: boolean;
    onExit: () => void;
    onSelectProject: (project: Project) => void;
}

// --- Game Constants ---
const PLAYER_SIZE = 24;
const ACCELERATION = 0.8;
const FRICTION = 0.82;
const MAX_SPEED = 8;
const WORLD_PADDING = 250;

interface Vector { x: number; y: number; }
interface Rect { x: number; y: number; w: number; h: number; }

interface GameObject extends Rect {
    id: string;
    type: 'project' | 'portal' | 'decoration' | 'wall' | 'label';
    label: string;
    data?: Project;
    color: string;
    isSolid?: boolean;
    fontSize?: number;
}

type GameView = 'world' | 'project' | 'identity' | 'comms';

const StoryMode: React.FC<StoryModeProps> = ({ active, onExit, onSelectProject }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    // View State
    const [currentView, setCurrentView] = useState<GameView>('world');
    const [selectedGameProject, setSelectedGameProject] = useState<Project | null>(null);
    const [interactionTarget, setInteractionTarget] = useState<GameObject | null>(null);
    const [isHoveringObject, setIsHoveringObject] = useState(false);

    // Gameplay State
    const [visitedNodes, setVisitedNodes] = useState<Set<string>>(new Set());

    // Mobile Controls State
    const [activeKeys, setActiveKeys] = useState<Record<string, boolean>>({});

    // Mutable Game State
    const player = useRef({ pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, facing: 'down' });
    const keys = useRef<Record<string, boolean>>({});
    const camera = useRef<Vector>({ x: 0, y: 0 });
    const objects = useRef<GameObject[]>([]);
    const bounds = useRef({ minX: -1000, maxX: 1000, minY: -1000, maxY: 1000 });
    const mousePosWorld = useRef<Vector | null>(null);
    const hoveredObject = useRef<GameObject | null>(null);

    // --- Initialization ---
    useEffect(() => {
        if (!active) return;

        // Build the "Data Lab" World
        const worldObjects: GameObject[] = [];

        // Custom Sort: NOVA -> WEG -> Chronological (Newest First)
        const projectList = Object.values(PROJECT_DATA).sort((a, b) => {
            // 1. Force NOVA first
            if (a.id === 'nova') return -1;
            if (b.id === 'nova') return 1;

            // 2. Force WEG second
            if (a.id === 'weg') return -1;
            if (b.id === 'weg') return 1;

            // 3. Chronological (Newest to Oldest)
            return b.year - a.year;
        });

        // Color Palette
        const projectColors: Record<string, string> = {
            nova: '#FFD700', // Gold
            wfp: '#3B82F6',  // Blue
            weg: '#A855F7',  // Purple
            city: '#F97316', // Orange
            sctc: '#EC4899', // Pink
            pasa: '#06B6D4', // Cyan
            ess: '#84CC16'   // Lime
        };

        // 1. Floor Labels (Decorations)
        worldObjects.push({ id: 'lbl_core', x: -60, y: -450, w: 0, h: 0, type: 'label', label: 'CORE SYSTEM', color: '#333', fontSize: 40 });
        worldObjects.push({ id: 'lbl_comms', x: -500, y: -100, w: 0, h: 0, type: 'label', label: 'UPLINK', color: '#333', fontSize: 40 });
        worldObjects.push({ id: 'lbl_archive', x: 400, y: -250, w: 0, h: 0, type: 'label', label: 'PROJECT ARCHIVE', color: '#333', fontSize: 40 });

        // 2. Identity Mainframe (North)
        worldObjects.push({
            id: 'about', x: -80, y: -350, w: 160, h: 100,
            type: 'portal', label: 'IDENTITY_CORE', color: '#eab308', isSolid: true
        });

        // 3. Comms Terminal (West)
        worldObjects.push({
            id: 'contact', x: -500, y: -40, w: 100, h: 100,
            type: 'portal', label: 'COMMS_RELAY', color: '#3b82f6', isSolid: true
        });

        // 4. Project Server Racks (East Grid)
        let row = 0;
        let col = 0;
        const startX = 300;
        const startY = -150;
        const gapX = 220;
        const gapY = 280;

        projectList.forEach((p, i) => {
            if (i > 0 && i % 2 === 0) {
                row++;
                col = 0;
            }

            worldObjects.push({
                id: p.id,
                x: startX + (col * gapX),
                y: startY + (row * gapY),
                w: 120,
                h: 160,
                type: 'project',
                label: p.title,
                data: p,
                color: projectColors[p.id] || '#4ade80',
                isSolid: true
            });
            col++;
        });

        objects.current = worldObjects;

        // Calculate World Bounds
        if (worldObjects.length > 0) {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            worldObjects.forEach(obj => {
                if (obj.type === 'label') return;
                minX = Math.min(minX, obj.x);
                maxX = Math.max(maxX, obj.x + obj.w);
                minY = Math.min(minY, obj.y);
                maxY = Math.max(maxY, obj.y + obj.h);
            });
            bounds.current = {
                minX: minX - WORLD_PADDING,
                maxX: maxX + WORLD_PADDING,
                minY: minY - WORLD_PADDING,
                maxY: maxY + WORLD_PADDING
            };
        }

        player.current.pos = { x: 0, y: 0 };
        player.current.vel = { x: 0, y: 0 };

        // Input Handling
        const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Loop Start
        const loop = () => {
            if (currentView === 'world') {
                update();
            }
            draw();
            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [active, currentView]);

    // --- Interaction Logic ---
    const triggerInteraction = (target: GameObject) => {
        setVisitedNodes(prev => new Set(prev).add(target.id));

        if (target.type === 'project' && target.data) {
            setSelectedGameProject(target.data);
            setCurrentView('project');
        } else if (target.id === 'contact') {
            setCurrentView('comms');
        } else if (target.id === 'about') {
            setCurrentView('identity');
        }
    };

    useEffect(() => {
        if (!active) return;
        const handleInteract = (e: KeyboardEvent) => {
            // Prevent scrolling for game keys
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            if (currentView !== 'world') {
                if (e.key === 'Escape') setCurrentView('world');
                return;
            }

            if ((e.key === 'Enter' || e.key === ' ') && interactionTarget) {
                e.preventDefault();
                triggerInteraction(interactionTarget);
            }
            if (e.key === 'Escape') onExit();
        };
        window.addEventListener('keydown', handleInteract);
        return () => window.removeEventListener('keydown', handleInteract);
    }, [active, interactionTarget, currentView, onExit]);


    // --- Mouse / Touch Handling ---
    const updateCursorPos = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const wx = x - cx + camera.current.x;
        const wy = y - cy + camera.current.y;

        mousePosWorld.current = { x: wx, y: wy };

        // Hit Test 
        const hit = objects.current.find(obj => {
            if (obj.type === 'label') return false;
            const padding = 10;
            return (
                wx >= obj.x - padding && wx <= obj.x + obj.w + padding &&
                wy >= obj.y - padding && wy <= obj.y + obj.h + padding
            );
        });

        hoveredObject.current = hit || null;

        if (hit && !isHoveringObject) setIsHoveringObject(true);
        if (!hit && isHoveringObject) setIsHoveringObject(false);
    };

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (currentView !== 'world') return;
        updateCursorPos(e.clientX, e.clientY);
    };

    const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (currentView !== 'world') return;
        // e.preventDefault(); // removed to allow scrolling if needed, but usually we want to prevent for full screen apps
        const touch = e.touches[0];
        if (touch) {
            updateCursorPos(touch.clientX, touch.clientY);
        }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (currentView !== 'world') return;

        // For touch end where we might not have a current position, we rely on the last updateCursorPos
        // However, it's safer to just check if hoveredObject is set.
        if (hoveredObject.current) {
            triggerInteraction(hoveredObject.current);
        }
    };


    // --- Physics Engine ---
    const update = () => {
        const k = keys.current;

        const up = k['ArrowUp'] || k['w'] || activeKeys['up'];
        const down = k['ArrowDown'] || k['s'] || activeKeys['down'];
        const left = k['ArrowLeft'] || k['a'] || activeKeys['left'];
        const right = k['ArrowRight'] || k['d'] || activeKeys['right'];

        if (up) { player.current.vel.y -= ACCELERATION; player.current.facing = 'up'; }
        if (down) { player.current.vel.y += ACCELERATION; player.current.facing = 'down'; }
        if (left) { player.current.vel.x -= ACCELERATION; player.current.facing = 'left'; }
        if (right) { player.current.vel.x += ACCELERATION; player.current.facing = 'right'; }

        player.current.vel.x *= FRICTION;
        player.current.vel.y *= FRICTION;

        const speed = Math.sqrt(player.current.vel.x ** 2 + player.current.vel.y ** 2);
        if (speed > MAX_SPEED) {
            const ratio = MAX_SPEED / speed;
            player.current.vel.x *= ratio;
            player.current.vel.y *= ratio;
        }

        const nextX = player.current.pos.x + player.current.vel.x;
        const nextY = player.current.pos.y + player.current.vel.y;

        const pRectX = { x: nextX - PLAYER_SIZE / 2, y: player.current.pos.y - PLAYER_SIZE / 2, w: PLAYER_SIZE, h: PLAYER_SIZE };
        const pRectY = { x: player.current.pos.x - PLAYER_SIZE / 2, y: nextY - PLAYER_SIZE / 2, w: PLAYER_SIZE, h: PLAYER_SIZE };

        let collideX = false;
        let collideY = false;

        objects.current.forEach(obj => {
            if (!obj.isSolid) return;
            if (checkCollision(pRectX, obj)) collideX = true;
            if (checkCollision(pRectY, obj)) collideY = true;
        });

        const b = bounds.current;

        if (!collideX) player.current.pos.x = Math.max(b.minX, Math.min(b.maxX, nextX));
        else player.current.vel.x = 0;

        if (!collideY) player.current.pos.y = Math.max(b.minY, Math.min(b.maxY, nextY));
        else player.current.vel.y = 0;

        camera.current.x += (player.current.pos.x - camera.current.x) * 0.1;
        camera.current.y += (player.current.pos.y - camera.current.y) * 0.1;

        // --- INTERACTION CHECK (CONTACT BASED) ---
        // Instead of center distance, we check if the player's interaction box overlaps the object's box.
        let target: GameObject | null = null;
        let closestDist = Infinity;

        const touchBuffer = 10; // Extra pixels to detect "touch" even if collision stops movement exactly at edge
        const pRect = {
            x: player.current.pos.x - PLAYER_SIZE / 2 - touchBuffer,
            y: player.current.pos.y - PLAYER_SIZE / 2 - touchBuffer,
            w: PLAYER_SIZE + (touchBuffer * 2),
            h: PLAYER_SIZE + (touchBuffer * 2)
        };

        objects.current.forEach(obj => {
            if (obj.type === 'label') return;

            // Bounding Box Intersection
            const isTouching = (
                pRect.x < obj.x + obj.w &&
                pRect.x + pRect.w > obj.x &&
                pRect.y < obj.y + obj.h &&
                pRect.y + pRect.h > obj.y
            );

            if (isTouching) {
                // Tie-breaker: use distance to center if touching multiple
                const objCx = obj.x + obj.w / 2;
                const objCy = obj.y + obj.h / 2;
                const dist = Math.hypot(player.current.pos.x - objCx, player.current.pos.y - objCy);

                if (dist < closestDist) {
                    closestDist = dist;
                    target = obj;
                }
            }
        });

        setInteractionTarget(target);
    };

    const checkCollision = (r1: Rect, r2: Rect) => {
        return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
    };

    // --- Rendering ---
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

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
        ctx.translate(cx - camera.current.x, cy - camera.current.y);

        // Floor Bounds
        const b = bounds.current;
        ctx.fillStyle = '#0f0f0f';
        ctx.fillRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);

        // Grid
        const gridSize = 80;
        const startGridX = Math.floor((camera.current.x - cx) / gridSize) * gridSize;
        const startGridY = Math.floor((camera.current.y - cy) / gridSize) * gridSize;

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
        ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);

        // Objects
        objects.current.forEach(obj => {
            if (obj.type === 'label') {
                ctx.font = `bold ${obj.fontSize}px 'Syne'`;
                ctx.fillStyle = '#222';
                ctx.textAlign = 'center';
                ctx.fillText(obj.label, obj.x, obj.y);
                return;
            }

            const isProximityTarget = interactionTarget?.id === obj.id;
            const isMouseTarget = hoveredObject.current?.id === obj.id;
            const isHighlighted = isProximityTarget || isMouseTarget;
            const isVisited = visitedNodes.has(obj.id);

            // --- SHADOW / GLOW ---
            if (isHighlighted) {
                ctx.shadowBlur = 30;
                ctx.shadowColor = obj.color;
            } else {
                ctx.shadowBlur = 0;
            }

            // --- BASE RECT ---
            // If touched/highlighted, fill completely with the neon color (High Feedback)
            ctx.fillStyle = isHighlighted ? obj.color : '#1a1a1a';
            ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

            ctx.strokeStyle = obj.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

            // Reset shadow for details
            ctx.shadowBlur = 0;

            // --- DETAILS INSIDE (Servers) ---
            if (obj.type === 'project' || obj.type === 'portal') {
                // Internal Screen/Panel
                ctx.fillStyle = isHighlighted ? '#000' : '#111';
                ctx.fillRect(obj.x + 10, obj.y + 10, obj.w - 20, 60);

                // Status Light
                const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
                let lightColor = obj.color;
                if (isVisited) lightColor = '#00ff00'; // Green light for visited

                ctx.fillStyle = isHighlighted ? '#fff' : lightColor;
                ctx.globalAlpha = isHighlighted ? 1 : 0.5 + pulse * 0.5;
                ctx.beginPath();
                ctx.arc(obj.x + obj.w - 15, obj.y + 20, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;

                // Text Info Inside
                ctx.fillStyle = isHighlighted ? '#000' : 'rgba(255,255,255,0.6)';
                ctx.textAlign = 'center';

                // Year / Sub-label
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

                // Server Rack Lines (Bottom half)
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

            // --- NEON LABEL ABOVE (Permanent) ---
            ctx.shadowBlur = 10;
            ctx.shadowColor = obj.color;
            ctx.fillStyle = obj.color;
            ctx.font = "bold 13px 'JetBrains Mono'";
            ctx.textAlign = 'center';
            ctx.fillText(obj.label.length > 15 ? obj.label.substring(0, 12) + '...' : obj.label, obj.x + obj.w / 2, obj.y - 15);

            // Extra Category Info for projects
            if (obj.data && isHighlighted) {
                ctx.font = "10px 'JetBrains Mono'";
                ctx.fillStyle = '#fff';
                ctx.fillText(obj.data.category[0].toUpperCase(), obj.x + obj.w / 2, obj.y - 35);
            }

            ctx.shadowBlur = 0;
        });

        // Player
        const px = player.current.pos.x;
        const py = player.current.pos.y;

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FF4400';
        ctx.fillStyle = '#FF4400';
        ctx.beginPath();
        ctx.arc(px, py, PLAYER_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Direction Indicator
        ctx.fillStyle = 'white';
        const eyeOffsetX = player.current.facing === 'left' ? -4 : player.current.facing === 'right' ? 4 : 0;
        const eyeOffsetY = player.current.facing === 'up' ? -4 : player.current.facing === 'down' ? 4 : 0;
        ctx.fillRect(px - 2 + eyeOffsetX, py - 2 + eyeOffsetY, 4, 4);

        ctx.restore();
    };

    const MobileBtn = ({ dir }: { dir: string }) => (
        <button
            className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:bg-pop/50 flex items-center justify-center transition-colors touch-none"
            onPointerDown={() => setActiveKeys(p => ({ ...p, [dir]: true }))}
            onPointerUp={() => setActiveKeys(p => ({ ...p, [dir]: false }))}
            onPointerLeave={() => setActiveKeys(p => ({ ...p, [dir]: false }))}
        >
            <IconArrow className={`w-6 h-6 text-white ${dir === 'up' ? '-rotate-90' :
                dir === 'down' ? 'rotate-90' :
                    dir === 'left' ? 'rotate-180' : ''
                }`} />
        </button>
    );

    // Stats Logic
    const totalNodes = objects.current.filter(o => o.type === 'project' || o.type === 'portal').length;
    const progressPercent = totalNodes > 0 ? Math.round((visitedNodes.size / totalNodes) * 100) : 0;

    if (!active) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] bg-black text-white font-mono overflow-hidden touch-none ${isHoveringObject ? 'cursor-pointer' : 'cursor-crosshair'}`}
        >
            <canvas
                ref={canvasRef}
                className="block w-full h-full"
                onMouseMove={handleCanvasMouseMove}
                onTouchStart={handleCanvasTouch}
                onClick={handleCanvasClick}
            />

            {currentView === 'world' && (
                <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
                    {/* HUD Top */}
                    <div className="flex justify-between items-start">
                        <div className="bg-black/80 backdrop-blur border border-white/20 p-4 rounded-sm flex gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2 h-2 bg-green-500 animate-pulse rounded-full"></div>
                                    <h1 className="text-sm font-bold tracking-widest text-white">SYSTEM_STATUS: ONLINE</h1>
                                </div>
                                <div className="text-[10px] text-white/50">
                                    MOUSE: ENABLED // TOUCH: ENABLED
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="border-l border-white/20 pl-6 flex flex-col justify-center min-w-[140px]">
                                <div className="flex justify-between text-[10px] text-pop mb-1 font-bold">
                                    <span>DATA_RECOVERY</span>
                                    <span>{progressPercent}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/10 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-pop"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        transition={{ type: 'spring', stiffness: 50 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onExit}
                            className="pointer-events-auto bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/50 text-red-500 px-4 py-2 text-xs font-bold tracking-widest transition-colors"
                        >
                            [DISCONNECT]
                        </button>
                    </div>

                    {/* Interaction Prompt */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                        <AnimatePresence>
                            {interactionTarget && !hoveredObject.current && (
                                <motion.button
                                    onClick={() => triggerInteraction(interactionTarget)}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    className="bg-white text-black px-6 py-3 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-3 border-2 border-white cursor-pointer"
                                >
                                    <span className="text-xs tracking-widest">ACCESS: {interactionTarget.label}</span>
                                    <span className="bg-black text-white text-[10px] px-2 py-1 hidden md:inline">SPACE</span>
                                    <span className="bg-black text-white text-[10px] px-2 py-1 md:hidden">TAP</span>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Controls (Bottom) */}
                    <div className="pointer-events-auto md:hidden grid grid-cols-3 gap-2 w-48 mx-auto mb-8">
                        <div></div>
                        <MobileBtn dir="up" />
                        <div></div>
                        <MobileBtn dir="left" />
                        <MobileBtn dir="down" />
                        <MobileBtn dir="right" />
                    </div>

                    <div className="text-center space-y-2 bg-black/60 backdrop-blur-sm border border-white/10 p-4 rounded">
                        <div className="text-xs text-white/60 tracking-widest uppercase mb-3">
                            🎮 NAVIGATION GUIDE
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 text-[10px] text-white/50 tracking-wider">
                            <div className="hidden md:block">
                                <span className="text-pop">KEYBOARD:</span> WASD or Arrow Keys to Move
                            </div>
                            <div className="hidden md:block">
                                <span className="text-pop">MOUSE:</span> Click objects to interact
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-pop">MOBILE:</span> Use D-pad below • Tap highlighted objects
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-pop">INTERACT:</span> Press SPACE when near objects or click/tap them
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-pop">EXIT:</span> Press ESC or click [DISCONNECT] button
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Internal Monitor Overlays */}
            <AnimatePresence>
                {currentView === 'project' && selectedGameProject && (
                    <GameProjectConsole
                        project={selectedGameProject}
                        onBack={() => setCurrentView('world')}
                    />
                )}
                {currentView === 'identity' && (
                    <GameIdentityCore onBack={() => setCurrentView('world')} />
                )}
                {currentView === 'comms' && (
                    <GameCommsRelay onBack={() => setCurrentView('world')} />
                )}
            </AnimatePresence>

            {/* CRT Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[5] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
        </motion.div>
    );
};

export default StoryMode;