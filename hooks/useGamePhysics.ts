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
    keys: React.MutableRefObject<Record<string, boolean>>;
}

export const useGamePhysics = ({ active, onInteract, onDraw, onExit, currentView, keys }: UseGamePhysicsProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0);

    // State exposed to UI
    const [interactionTarget, setInteractionTarget] = useState<GameObject | null>(null);
    const [isHoveringObject, setIsHoveringObject] = useState(false);

    // Refs (Physics State)
    const player = useRef<Player>({ pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, facing: 'down' });
    // Keys are now passed in via props
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
            ess: '#84CC16',           // Lime
            tt_migrate: '#EF4444',    // Red (Hardware/AI)
            macro_monitor: '#0EA5E9', // Light Blue (Data/Dashboard)
            impact100: '#F59E0B'      // Amber (Ranking/Index)
        };

        // 1. Deco (Labels)
        // Center alignment
        worldObjects.push({ id: 'lbl_core', x: 0, y: -400, w: 0, h: 0, type: 'label', label: 'PROFILE', color: '#eab308', fontSize: 32 }); // Above Identity
        worldObjects.push({ id: 'lbl_work', x: 0, y: 100, w: 0, h: 0, type: 'label', label: 'SELECTED_WORK', color: '#4ade80', fontSize: 32 }); // Above Grid

        // 2. Portals (Symmetrical Flanks)
        // Center: Identity
        worldObjects.push({ id: 'about', x: -80, y: -350, w: 160, h: 100, type: 'portal', label: 'IDENTITY_CORE', color: '#eab308', isSolid: true });

        // Left Flank: Contact
        worldObjects.push({ id: 'contact', x: -400, y: -50, w: 120, h: 100, type: 'portal', label: 'CONTACT', color: '#3b82f6', isSolid: true });
        worldObjects.push({ id: 'lbl_comms', x: -340, y: -100, w: 0, h: 0, type: 'label', label: 'UPLINK', color: '#3b82f6', fontSize: 24 });

        // Right Flank: Blog
        worldObjects.push({ id: 'blog', x: 280, y: -50, w: 120, h: 100, type: 'portal', label: 'WRITING', color: '#a855f7', isSolid: true });
        worldObjects.push({ id: 'lbl_archive', x: 340, y: -100, w: 0, h: 0, type: 'label', label: 'ARCHIVE', color: '#a855f7', fontSize: 24 });

        // 3. Projects (Bottom Center Grid)
        let row = 0; let col = 0;
        // Center grid: 3 columns. Width of item ~120. Gap ~80?
        // Let's use 220 spacing.
        // Mid col center = 0. mid col x = -60.
        // Left col x = -280. Right col x = 160.
        const startX = -280;
        const startY = 150;
        const gapX = 220;
        const gapY = 280;

        projectList.forEach((p, i) => {
            if (i > 0 && i % 3 === 0) { row++; col = 0; } // 3 columns
            worldObjects.push({
                id: p.id, x: startX + (col * gapX), y: startY + (row * gapY),
                w: 120, h: 160, type: 'project', label: p.title, data: p,
                color: projectColors[p.id] || '#4ade80', isSolid: true
            });
            col++;
        });

        objects.current = worldObjects;

        // Bounds (Recalculate for new layout)
        if (worldObjects.length > 0) {
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            worldObjects.forEach(obj => {
                if (obj.type === 'label') return;
                minX = Math.min(minX, obj.x); maxX = Math.max(maxX, obj.x + obj.w);
                minY = Math.min(minY, obj.y); maxY = Math.max(maxY, obj.y + obj.h);
            });
            // Ensure bounds are large enough to feel open but bounded
            bounds.current = {
                minX: Math.min(minX - WORLD_PADDING, -600),
                maxX: Math.max(maxX + WORLD_PADDING, 600),
                minY: Math.min(minY - WORLD_PADDING, -600),
                maxY: Math.max(maxY + WORLD_PADDING, row * gapY + 400)
            };
        }

        player.current.pos = { x: 0, y: 0 };
        player.current.vel = { x: 0, y: 0 };

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
        const touchBuffer = 30; // Increased to ensure interaction triggers even if collision stops player early
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

    // --- Interaction Listener Removed (Handled by useGameInput) ---

    // --- Mouse/Touch Handlers ---
    const updateCursorPos = (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
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
        hoveredObject,
        objects // Exposed for A11y Overlay
    };
};
