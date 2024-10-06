"use client";

import React, { useEffect, useRef } from "react";

interface FluidGradientProps {
  darkMode: boolean;
}

const FluidGradient: React.FC<FluidGradientProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGradient = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        300
      );

      if (darkMode) {
        gradient.addColorStop(0, "rgba(79, 70, 229, 0.1)"); // indigo
        gradient.addColorStop(1, "rgba(67, 56, 202, 0)"); // darker indigo
      } else {
        gradient.addColorStop(0, "rgba(199, 210, 254, 0.1)"); // light indigo
        gradient.addColorStop(1, "rgba(224, 231, 255, 0)"); // lighter indigo
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(drawGradient);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    resize();
    drawGradient();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

export default FluidGradient;
