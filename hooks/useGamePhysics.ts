import { useEffect, useRef, useState, useCallback } from 'react';
import { Project } from '../types';
import { PROJECT_DATA } from '../constants';

// --- Types ---
export interface Vector { x: number; y: number; }
export interface Rect { x: number; y: number; w: number; h: number; }

export interface GameObject extends Rect {
    id: string;
    type: 'project' | 'portal' | 'decoration' | 'wall' | 'label';
    label: string;
    data?: Project;
    color: string;
    isSolid?: boolean;
    fontSize?: number;
}

export interface Player {
    pos: Vector;
    vel: Vector;
    facing: 'up' | 'down' | 'left' | 'right';
}

export interface GamePhysicsState {
    player: Player;
    camera: Vector;
    objects: GameObject[];
    bounds: { minX: number; maxX: number; minY: number; maxY: number };
    hoveredObject: GameObject | null;
    interactionTarget: GameObject | null;
}

import { GAME_CONFIG } from '../config/gameConfig';

// --- Constants ---
const { PLAYER_SIZE, ACCELERATION, FRICTION, MAX_SPEED, WORLD_PADDING } = GAME_CONFIG;

interface UseGamePhysicsProps {
    active: boolean;
    onInteract: (target: GameObject) => void;
    onDraw: (ctx: CanvasRenderingContext2D, state: GamePhysicsState) => void;
    onExit: () => void;
    currentView: 'world' | 'project' | 'identity' | 'comms';
}

export const useGamePhysics = ({ active, onInteract, onDraw, onExit, currentView }: UseGamePhysicsProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    // State exposed to UI
    const [interactionTarget, setInteractionTarget] = useState<GameObject | null>(null);
    const [isHoveringObject, setIsHoveringObject] = useState(false);

    // Refs (Physics State)
    const player = useRef<Player>({ pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, facing: 'down' });
    const keys = useRef<Record<string, boolean>>({});
    const activeKeys = useRef<Record<string, boolean>>({}); // For mobile controls
    const camera = useRef<Vector>({ x: 0, y: 0 });
    const objects = useRef<GameObject[]>([]);
    const bounds = useRef({ minX: -1000, maxX: 1000, minY: -1000, maxY: 1000 });
    const mousePosWorld = useRef<Vector | null>(null);
    const hoveredObject = useRef<GameObject | null>(null);

    // Keep onDraw fresh without re-triggering effect
    const drawCallback = useRef(onDraw);
    useEffect(() => { drawCallback.current = onDraw; }, [onDraw]);

    // --- Initialization ---
    useEffect(() => {
        if (!active) return;

        // Build World
        const worldObjects: GameObject[] = [];

        // Custom Sort: NOVA -> HarvestLink -> WEG -> Chronological
        const projectList = Object.values(PROJECT_DATA)
            .filter(p => !p.archived) // Exclude archived from Game Mode
            .sort((a, b) => {
                // 1. Force NOVA first
                if (a.id === 'nova') return -1;
                if (b.id === 'nova') return 1;

                // 2. Force HarvestLink Second
                if (a.id === 'harvest_link') return -1;
                if (b.id === 'harvest_link') return 1;

                // 3. Force WEG Third
                if (a.id === 'weg') return -1;
                if (b.id === 'weg') return 1;

                return b.year - a.year;
            });

        const projectColors: Record<string, string> = {
            nova: '#FFD700',          // Gold
            harvest_link: '#22C55E',  // Leaf Green (Harvest)
            weg: '#A855F7',           // Purple
            wfp: '#3B82F6',           // Blue
            city: '#F97316',          // Orange
            its: '#14B8A6',           // Teal (Data)
            uos_research: '#06B6D4',  // Cyan (Ice/Climate)
            sctc: '#EC4899',          // Pink
            pasa: '#6366f1',          // Indigo
            ess: '#84CC16'            // Lime
        };

        // 1. Deco
        worldObjects.push({ id: 'lbl_core', x: 0, y: -450, w: 0, h: 0, type: 'label', label: 'CORE SYSTEM', color: '#eab308', fontSize: 40 });
        worldObjects.push({ id: 'lbl_comms', x: -450, y: -100, w: 0, h: 0, type: 'label', label: 'UPLINK', color: '#3b82f6', fontSize: 40 });
        worldObjects.push({ id: 'lbl_archive', x: 470, y: -250, w: 0, h: 0, type: 'label', label: 'PROJECT ARCHIVE', color: '#a855f7', fontSize: 40 });

        // 2. Portals
        worldObjects.push({ id: 'about', x: -80, y: -350, w: 160, h: 100, type: 'portal', label: 'IDENTITY_CORE', color: '#eab308', isSolid: true });
        worldObjects.push({ id: 'contact', x: -500, y: -40, w: 100, h: 100, type: 'portal', label: 'COMMS_RELAY', color: '#3b82f6', isSolid: true });

        // 3. Projects
        let row = 0; let col = 0;
        const startX = 300; const startY = -150;
        const gapX = 220; const gapY = 280;

        projectList.forEach((p, i) => {
            if (i > 0 && i % 2 === 0) { row++; col = 0; }
            worldObjects.push({
                id: p.id, x: startX + (col * gapX), y: startY + (row * gapY),
                w: 120, h: 160, type: 'project', label: p.title, data: p,
                color: projectColors[p.id] || '#4ade80', isSolid: true
            });
            col++;
        });

        objects.current = worldObjects;

        // Bounds
        if (worldObjects.length > 0) {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            worldObjects.forEach(obj => {
                if (obj.type === 'label') return;
                minX = Math.min(minX, obj.x); maxX = Math.max(maxX, obj.x + obj.w);
                minY = Math.min(minY, obj.y); maxY = Math.max(maxY, obj.y + obj.h);
            });
            bounds.current = {
                minX: minX - WORLD_PADDING, maxX: maxX + WORLD_PADDING,
                minY: minY - WORLD_PADDING, maxY: maxY + WORLD_PADDING
            };
        }

        player.current.pos = { x: 0, y: 0 };
        player.current.vel = { x: 0, y: 0 };

        // Event Listeners
        const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Loop
        const loop = () => {
            if (currentView === 'world') update();

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    drawCallback.current(ctx, {
                        player: player.current,
                        camera: camera.current,
                        objects: objects.current,
                        bounds: bounds.current,
                        hoveredObject: hoveredObject.current,
                        interactionTarget: interactionTarget // Use component state
                    });
                }
            }
            // Update checking is done inside update() which calls setInteractionTarget
            // We do not need to check target vs interactionTarget here again.

            requestRef.current = requestAnimationFrame(loop);
        };
        requestRef.current = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [active, currentView]);

    // --- Physics Engine ---
    const checkCollision = (r1: Rect, r2: Rect) => {
        return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
    };

    const update = () => {
        const k = keys.current;
        const ak = activeKeys.current;

        const up = k['ArrowUp'] || k['w'] || ak['up'];
        const down = k['ArrowDown'] || k['s'] || ak['down'];
        const left = k['ArrowLeft'] || k['a'] || ak['left'];
        const right = k['ArrowRight'] || k['d'] || ak['right'];

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

        if (!collideX) player.current.pos.x = Math.max(b.minX, Math.min(b.maxX, nextX));
        else player.current.vel.x = 0;

        // Y-Axis Bound Check + Infinite Scroll Protection
        if (!collideY) {
            let nextYCheck = nextY;
            // Limit player to safe zone to prevent "Far Lands" glitch
            if (nextYCheck > GAME_CONFIG.MAX_SCROLL_LIMIT) nextYCheck = GAME_CONFIG.MAX_SCROLL_LIMIT;
            if (nextYCheck < -GAME_CONFIG.MAX_SCROLL_LIMIT) nextYCheck = -GAME_CONFIG.MAX_SCROLL_LIMIT;

            player.current.pos.y = Math.max(b.minY, Math.min(b.maxY, nextYCheck));
        } else {
            player.current.vel.y = 0;
        }

        camera.current.x += (player.current.pos.x - camera.current.x) * 0.1;
        camera.current.y += (player.current.pos.y - camera.current.y) * 0.1;

        // Interaction Check
        let target: GameObject | null = null;
        let closestDist = Infinity;
        const touchBuffer = 10;
        const pRect = {
            x: player.current.pos.x - PLAYER_SIZE / 2 - touchBuffer,
            y: player.current.pos.y - PLAYER_SIZE / 2 - touchBuffer,
            w: PLAYER_SIZE + (touchBuffer * 2),
            h: PLAYER_SIZE + (touchBuffer * 2)
        };

        objects.current.forEach(obj => {
            if (obj.type === 'label') return;
            const isTouching = (
                pRect.x < obj.x + obj.w && pRect.x + pRect.w > obj.x &&
                pRect.y < obj.y + obj.h && pRect.y + pRect.h > obj.y
            );

            if (isTouching) {
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

    // --- Interaction Listener ---
    useEffect(() => {
        if (!active) return;
        const handleInteract = (e: KeyboardEvent) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

            if (e.key === 'Escape') {
                // Priority: Close interaction first, then exit game
                if (interactionTarget && (currentView !== 'world' || isHoveringObject /* Logic handled by hook but effect is here */)) {
                    // Actually, useGamePhysics doesn't know about `projectModal` state of StoryMode.
                    // So we let StoryMode handle the Escape logic for modals.
                    // The hook should only call onExit if we are "clean".
                    // BUT the hook receives onExit.
                }

                // If we are in the hook, we don't know about StoryMode state.
                // We should remove onExit call from here and handle it in StoryMode?
                // Or: Pass a customized onExit to the hook.
            }

            // Since we moved modal logic to standard React state in StoryMode,
            // the Hook's "currentView" might be desynced or irrelevant for Escape logic.
            // Let's rely on the Parent (StoryMode)'s useEffect for Escape.

            // MOVED ESCAPE LOGIC TO STORYMODE COMPONENT

            if ((e.key === 'Enter' || e.key === ' ') && interactionTarget) {
                e.preventDefault();
                onInteract(interactionTarget);
            }
        };
        window.addEventListener('keydown', handleInteract);
        return () => window.removeEventListener('keydown', handleInteract);
    }, [active, interactionTarget, currentView, onInteract]); // Removed onExit dependency as we handle it elsewhere or manually

    // --- Mouse/Touch Handlers ---
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

        const hit = objects.current.find(obj => {
            if (obj.type === 'label') return false;
            const padding = 10;
            return (wx >= obj.x - padding && wx <= obj.x + obj.w + padding && wy >= obj.y - padding && wy <= obj.y + obj.h + padding);
        });

        hoveredObject.current = hit || null;
        if (hit && !isHoveringObject) setIsHoveringObject(true);
        if (!hit && isHoveringObject) setIsHoveringObject(false);
    };

    const canvasHandlers = {
        onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (currentView !== 'world') return;
            updateCursorPos(e.clientX, e.clientY);
        },
        onTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => {
            if (currentView !== 'world') return;
            const touch = e.touches[0];
            if (touch) updateCursorPos(touch.clientX, touch.clientY);
        },
        onClick: (e: React.MouseEvent | React.TouchEvent) => {
            if (currentView !== 'world') return;
            if (hoveredObject.current) onInteract(hoveredObject.current);
        }
    };

    const handleMobileInput = (dir: string, active: boolean) => {
        activeKeys.current[dir] = active;
        // Force re-render of debug info if needed? No.
    };

    return {
        canvasRef,
        interactionTarget,
        isHoveringObject,
        playerRef: player,
        cameraRef: camera,
        canvasHandlers,
        handleMobileInput,
        hoveredObject
    };
};
