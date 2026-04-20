"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const Web3Background = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;

    // State
    let currentX = 0;
    let currentY = 0;
    let time = 0;

    // Configuration
    const gridSize = 40; // Размер ячейки
    const baseColor = "0, 245, 212"; // #00f5d4 (Teal/Cyan)

    interface Pulse {
      id: number;
      type: 'h' | 'v'; // horizontal or vertical
      index: number;   // grid line index
      pos: number;     // position along the line
      speed: number;
      size: number;
    }

    let pulses: Pulse[] = [];
    let pulseIdCounter = 0;

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const drawGrid = (spacing: number, opacity: number, offsetX: number, offsetY: number) => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${baseColor}, ${opacity})`;
      ctx.lineWidth = 1;

      const startCol = Math.floor(-offsetX / spacing);
      const endCol = Math.floor((width - offsetX) / spacing) + 1;
      const startRow = Math.floor(-offsetY / spacing);
      const endRow = Math.floor((height - offsetY) / spacing) + 1;

      for (let c = startCol; c <= endCol; c++) {
        const x = Math.round(c * spacing + offsetX);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = startRow; r <= endRow; r++) {
        const y = Math.round(r * spacing + offsetY);
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      time++;

      // 1. Parallax Logic (Smooth easing, limited to ~12px)
      const targetX = (mouseX - width / 2) * 0.01;
      const targetY = (mouseY - height / 2) * 0.01;
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // 2. Central Energy Core (Layer 3 - Background Glow)
      const centerX = width / 2 + currentX * 0.5;
      const centerY = height / 2 + currentY * 0.5;
      const breathing = Math.sin(time * 0.015) * 0.1 + 1; // 0.9 to 1.1
      const radius = Math.min(width, height) * 0.4 * breathing;
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `rgba(${baseColor}, 0.08)`);
      gradient.addColorStop(0.6, `rgba(${baseColor}, 0.02)`);
      gradient.addColorStop(1, `rgba(${baseColor}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 3. Deep Grid (Layer 1)
      // Background layer (sparse, slower parallax)
      drawGrid(gridSize * 2, 0.015, currentX * 0.5, currentY * 0.5);
      
      // Foreground layer (dense, normal parallax)
      // Synchronous wave effect every ~8s
      const waveCycle = 480; // approx 8s at 60fps
      const wavePhase = time % waveCycle;
      const waveIntensity = (wavePhase < 60) ? Math.sin((wavePhase / 60) * Math.PI) * 0.03 : 0;
      
      drawGrid(gridSize, 0.03 + waveIntensity, currentX, currentY);

      // 4. Data Flow (Layer 2)
      if (pulses.length < 4 && Math.random() < 0.01) {
        const type = Math.random() > 0.5 ? 'h' : 'v';
        const speed = (Math.random() * 1.5 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
        
        // Determine visible grid lines
        const spacing = gridSize;
        const offset = type === 'h' ? currentY : currentX;
        const dimension = type === 'h' ? height : width;
        
        const startIdx = Math.floor(-offset / spacing);
        const endIdx = Math.floor((dimension - offset) / spacing);
        const index = Math.floor(Math.random() * (endIdx - startIdx + 1)) + startIdx;

        pulses.push({
          id: pulseIdCounter++,
          type,
          index,
          pos: speed > 0 ? -200 : (type === 'h' ? width : height) + 200,
          speed,
          size: 100 + Math.random() * 100
        });
      }

      // Update & Draw Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.pos += p.speed;

        const maxDist = p.type === 'h' ? width : height;
        if ((p.speed > 0 && p.pos > maxDist + 200) || (p.speed < 0 && p.pos < -200)) {
          pulses.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        const tail = p.pos - p.size * Math.sign(p.speed);
        
        const pulseGradient = ctx.createLinearGradient(
          p.type === 'h' ? tail : 0,
          p.type === 'v' ? tail : 0,
          p.type === 'h' ? p.pos : 0,
          p.type === 'v' ? p.pos : 0
        );
        pulseGradient.addColorStop(0, `rgba(${baseColor}, 0)`);
        pulseGradient.addColorStop(0.5, `rgba(${baseColor}, 0.4)`);
        pulseGradient.addColorStop(1, `rgba(${baseColor}, 0)`);

        ctx.strokeStyle = pulseGradient;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        if (p.type === 'h') {
          const y = Math.round(p.index * gridSize + currentY);
          ctx.moveTo(tail, y);
          ctx.lineTo(p.pos, y);
        } else {
          const x = Math.round(p.index * gridSize + currentX);
          ctx.moveTo(x, tail);
          ctx.lineTo(x, p.pos);
        }
        ctx.stroke();
      }

      // 5. Micro Noise (Layer 4)
      // Very subtle grain
      ctx.fillStyle = `rgba(${baseColor}, 0.05)`;
      for (let i = 0; i < 15; i++) {
        const nx = Math.random() * width;
        const ny = Math.random() * height;
        ctx.fillRect(nx, ny, 1, 1);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => init();
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    
    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[2]" />;
};

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Grid & Particles */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Web3 Animated Background (Layer 3) */}
      <Web3Background />

      <motion.div 
        style={{ y, opacity }} 
        className="max-w-4xl mx-auto px-6 text-center relative z-10"
      >
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-8 relative inline-block"
        >
          <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
            <div className="w-full h-full rounded-full bg-background overflow-hidden flex items-center justify-center relative z-10 p-1">
            <Image
              src="/avatar.jpg"
              alt="Avatar"
              width={256}
              height={256}
              className="object-contain w-full h-full rounded-full"
              priority
            />
            </div>
          </div>
          {/* Glow behind avatar */}
          <div className="absolute inset-0 rounded-full bg-primary/40 blur-2xl animate-pulse-slow -z-10"></div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50"
        >
          STAYFOR
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-xl md:text-2xl text-white-dim mb-8 font-light"
        >
          Digital Product Builder & <span className="text-primary font-mono">Web3 Architect</span>
        </motion.p>
      </motion.div>
    </section>
  );
}