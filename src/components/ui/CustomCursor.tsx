"use client";
import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the 32px cursor
      cursorY.set(e.clientY - 16);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Logic to detect hover on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, .interactive")) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    >
      {/* Outer Ring */}
      <motion.div 
        className="absolute inset-0 border border-primary rounded-full opacity-50"
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 1 : 0.5,
        }}
      />
      
      {/* Inner Dot */}
      <motion.div
        className="w-2 h-2 bg-primary rounded-full"
        animate={{
          scale: isClicked ? 0.5 : isHovered ? 0.2 : 1,
        }}
      />
    </motion.div>
  );
}