import { GamePhysicsState } from '../../hooks/useGamePhysics';
import { GAME_COLORS, GAME_DIMENSIONS } from './gameConstants';

export const renderGame = (
    ctx: CanvasRenderingContext2D,
    state: GamePhysicsState,
    visitedNodes: Set<string>
) => {
    const { camera, objects, bounds, interactionTarget, hoveredObject, player } = state;
    const canvas = ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2;
    const cy = height / 2;
    const propsOpacity = 1;

    // Ensure accurate sizing
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
    }

    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = GAME_COLORS.BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx - camera.x, cy - camera.y);

    // Floor Bounds
    ctx.fillStyle = GAME_COLORS.FLOOR;
    ctx.fillRect(bounds.minX, bounds.minY, bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

    // Grid
    const gridSize = GAME_DIMENSIONS.GRID_SIZE;
    const startGridX = Math.floor((camera.x - cx) / gridSize) * gridSize;
    const startGridY = Math.floor((camera.y - cy) / gridSize) * gridSize;

    ctx.strokeStyle = GAME_COLORS.GRID;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = startGridX - gridSize * 2; x < startGridX + width + gridSize * 2; x += gridSize) {
        ctx.moveTo(x, startGridY - gridSize * 10);
        ctx.lineTo(x, startGridY + height + gridSize * 10);
    }
    for (let y = startGridY - gridSize * 2; y < startGridY + height + gridSize * 2; y += gridSize) {
        ctx.moveTo(startGridX - gridSize * 10, y);
        ctx.lineTo(startGridX + width + gridSize * 10, y);
    }
    ctx.stroke();

    // Border
    ctx.strokeStyle = GAME_COLORS.SoC_BORDER;
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
            // Use standard terminal green for visited if generic, or obj color
            if (isVisited) lightColor = '#00ff00';

            ctx.fillStyle = isHighlighted ? '#fff' : lightColor;
            ctx.globalAlpha = isHighlighted ? 1 : 0.5 + pulse * 0.5;
            ctx.beginPath();
            ctx.arc(obj.x + obj.w - 15, obj.y + 20, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;

            // Text Info
            ctx.fillStyle = isHighlighted ? '#000' : GAME_COLORS.TEXT_DEFAULT;
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

        // --- NEON LABEL ---
        if (isHighlighted) {
            ctx.save();
            ctx.translate(0, -10);

            const labelWidth = ctx.measureText(obj.label).width + 20;
            ctx.fillStyle = '#000';
            ctx.globalAlpha = 0.8;
            ctx.fillRect(obj.x + obj.w / 2 - labelWidth / 2, obj.y - 30, labelWidth, 24);
            ctx.globalAlpha = 1.0;

            ctx.strokeStyle = obj.color;
            ctx.lineWidth = 1;
            ctx.strokeRect(obj.x + obj.w / 2 - labelWidth / 2, obj.y - 30, labelWidth, 24);

            ctx.shadowBlur = 10;
            ctx.shadowColor = obj.color;
            ctx.fillStyle = obj.color;
            ctx.font = "bold 13px 'JetBrains Mono'";
            ctx.textAlign = 'center';
            ctx.fillText(obj.label, obj.x + obj.w / 2, obj.y - 14);

            ctx.restore();
        } else {
            ctx.shadowBlur = 0;
            ctx.fillStyle = propsOpacity > 0 ? obj.color : GAME_COLORS.TEXT_DIM;
            ctx.font = "bold 13px 'JetBrains Mono'";
            ctx.textAlign = 'center';
            ctx.fillText(obj.label, obj.x + obj.w / 2, obj.y - 15);
        }

        ctx.shadowBlur = 0;
    });

    // Player
    const px = player.pos.x;
    const py = player.pos.y;
    ctx.shadowBlur = 10;
    ctx.shadowColor = GAME_COLORS.PLAYER_SHADOW;
    ctx.fillStyle = GAME_COLORS.PLAYER;
    ctx.beginPath();
    ctx.arc(px, py, GAME_DIMENSIONS.PLAYER_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Direction Indicator
    ctx.fillStyle = 'white';
    const eyeOffsetX = player.facing === 'left' ? -4 : player.facing === 'right' ? 4 : 0;
    const eyeOffsetY = player.facing === 'up' ? -4 : player.facing === 'down' ? 4 : 0;
    ctx.fillRect(px - 2 + eyeOffsetX, py - 2 + eyeOffsetY, 4, 4);

    ctx.restore();
};
