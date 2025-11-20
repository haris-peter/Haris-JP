"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

interface MazeGridProps {
    className?: string;
}

export function MazeGrid({ className }: MazeGridProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const gridSize = 40;
        const runners: Runner[] = [];
        const maxRunners = 10;

        class Runner {
            x: number;
            y: number;
            vx: number;
            vy: number;
            history: { x: number; y: number }[];
            color: string;
            speed: number;
            life: number;

            constructor(w: number, h: number) {
                // Snap to grid
                this.x = Math.floor(Math.random() * (w / gridSize)) * gridSize;
                this.y = Math.floor(Math.random() * (h / gridSize)) * gridSize;

                // Random direction (cardinal)
                const dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
                const dir = dirs[Math.floor(Math.random() * dirs.length)];
                this.vx = dir.x;
                this.vy = dir.y;

                this.history = [];
                // Theme-aware colors
                const isDark = theme === 'dark' || !theme; // Default to dark if undefined
                this.color = Math.random() > 0.8
                    ? (isDark ? "#ffffff" : "#000000") // White in dark, Black in light
                    : (isDark ? "#00ffff" : "#008b8b"); // Cyan in dark, Dark Cyan in light
                this.speed = 2; // Pixels per frame
                this.life = 100 + Math.random() * 200;
            }

            update(w: number, h: number) {
                this.x += this.vx * this.speed;
                this.y += this.vy * this.speed;
                this.life--;

                // Add to history for trail
                this.history.push({ x: this.x, y: this.y });
                if (this.history.length > 20) this.history.shift();

                // Turn at grid intersections
                if (this.x % gridSize === 0 && this.y % gridSize === 0) {
                    if (Math.random() < 0.3) { // 30% chance to turn
                        if (this.vx !== 0) {
                            this.vx = 0;
                            this.vy = Math.random() > 0.5 ? 1 : -1;
                        } else {
                            this.vy = 0;
                            this.vx = Math.random() > 0.5 ? 1 : -1;
                        }
                    }
                }

                // Respawn if out of bounds or dead
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h || this.life <= 0) {
                    return false;
                }
                return true;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;

                if (this.history.length > 0) {
                    ctx.moveTo(this.history[0].x, this.history[0].y);
                    for (let i = 1; i < this.history.length; i++) {
                        ctx.lineTo(this.history[i].x, this.history[i].y);
                    }
                    ctx.stroke();
                }

                // Draw head
                ctx.fillStyle = "#fff";
                ctx.fillRect(this.x - 1, this.y - 1, 3, 3);
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn new runners
            if (runners.length < maxRunners && Math.random() < 0.05) {
                runners.push(new Runner(canvas.width, canvas.height));
            }

            // Update and draw runners
            for (let i = runners.length - 1; i >= 0; i--) {
                const alive = runners[i].update(canvas.width, canvas.height);
                if (alive) {
                    runners[i].draw(ctx);
                } else {
                    runners.splice(i, 1);
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener("resize", resize);
        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ opacity: 0.6 }}
        />
    );
}
