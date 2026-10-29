"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { useInView } from "framer-motion";
import { useOptionalTheme } from "@/components/modules/theme-provider";

export interface BackgroundProps {
  mode?: "grid" | "random";
  backgroundColor?: string;
  nodeColorIdle?: string;
  nodeColorActive?: string;
  nodeRadiusIdle?: number;
  nodeRadiusActive?: number;
  nodeOpacityIdle?: number;
  glowColor?: string;
  glowStrength?: number;
  connectToCursor?: boolean;
  cursorConnectDistance?: number;
  cursorLineColor?: string;
  cursorLineWidth?: number;
  cursorLineOpacity?: number;
  connectNodes?: boolean;
  nodeConnectDistance?: number;
  nodeLineColor?: string;
  nodeLineWidth?: number;
  nodeLineOpacity?: number;
  maxNodeConnectionsPerNode?: number;
  gridSpacing?: number;
  randomNodeCount?: number;
  jitter?: number;
  pauseWhenOffscreen?: boolean;
  className?: string;
  style?: CSSProperties;
}

type Point = { x: number; y: number };

type AutoCursor = {
  enabled: boolean;
  initialized: boolean;
  target: Point;
  width: number;
  height: number;
  waitUntil: number;
  lastTime: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function withAlpha(color: string, alpha: number) {
  if (/^rgba\(/i.test(color) || /^hsla\(/i.test(color)) return color;

  const hex = color.trim();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return color;

  let r: number;
  let g: number;
  let b: number;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
}

function makeRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 1831565813;
    let x = state;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const DARK_PALETTE = {
  background: "#0d0709",
  dot: "rgba(224,112,127,0.45)",
  hot: "#f4b6c2",
  glow: "#f4b6c2",
  cursorLine: "#e0707f",
  line: "rgba(163,38,63,0.14)",
} as const;

const LIGHT_PALETTE = {
  background: "#faf6f7",
  dot: "rgba(128,0,32,0.30)",
  hot: "#a3263f",
  glow: "#e0707f",
  cursorLine: "#a3263f",
  line: "rgba(128,0,32,0.12)",
} as const;

export default function Background(props: BackgroundProps) {
  const theme = useOptionalTheme();
  const palette = theme?.resolvedTheme === "light" ? LIGHT_PALETTE : DARK_PALETTE;

  const {
    mode = "grid",
    backgroundColor = "var(--background)",
    nodeColorIdle = palette.dot,
    nodeColorActive = palette.hot,
    nodeRadiusIdle = 2,
    nodeRadiusActive = 3,
    nodeOpacityIdle = 1,
    glowColor = palette.glow,
    glowStrength = 0.55,
    connectToCursor = true,
    cursorConnectDistance = 120,
    cursorLineColor = palette.cursorLine,
    cursorLineWidth = 1,
    cursorLineOpacity = 0.22,
    connectNodes = true,
    nodeConnectDistance = 90,
    nodeLineColor = palette.line,
    nodeLineWidth = 1,
    nodeLineOpacity = 1,
    maxNodeConnectionsPerNode = 3,
    gridSpacing = 56,
    randomNodeCount = 90,
    jitter = 6,
    pauseWhenOffscreen = true,
    className,
    style,
  } = props;

  const canvasBackground = backgroundColor.startsWith("var(") ? palette.background : backgroundColor;

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -99999, y: -99999, inside: false });
  const autoRef = useRef<AutoCursor>({
    enabled: false,
    initialized: false,
    target: { x: 0, y: 0 },
    width: 0,
    height: 0,
    waitUntil: 0,
    lastTime: 0,
  });
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  const [documentVisible, setDocumentVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  const inView = useInView(wrapRef, { margin: "200px" });
  const shouldAnimate = documentVisible && !reduceMotion && (!pauseWhenOffscreen || inView);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduceMotion(motionQuery.matches);
    const updateVisibility = () => setDocumentVisible(!document.hidden);

    updateMotion();
    updateVisibility();

    motionQuery.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      motionQuery.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const pointerQuery = window.matchMedia("(hover: none), (pointer: coarse)");

    const updatePointerMode = () => {
      const enabled = pointerQuery.matches;
      autoRef.current.enabled = enabled;
      autoRef.current.initialized = false;
      autoRef.current.lastTime = 0;

      if (!enabled) {
        mouseRef.current = { x: -99999, y: -99999, inside: false };
      }
    };

    updatePointerMode();
    pointerQuery.addEventListener("change", updatePointerMode);

    return () => pointerQuery.removeEventListener("change", updatePointerMode);
  }, []);

  const rebuildNodes = useCallback(() => {
    const width = sizeRef.current.w;
    const height = sizeRef.current.h;
    if (width <= 2 || height <= 2) return;

    const rng = makeRng(1337 ^ (width * 73856093) ^ (height * 19349663));
    const nodes: Point[] = [];
    const amount = clamp(jitter, 0, 200);
    const half = amount * 0.5;

    if (mode === "grid") {
      const spacing = Math.max(8, gridSpacing);
      for (let y = spacing * 0.5; y <= height; y += spacing) {
        for (let x = spacing * 0.5; x <= width; x += spacing) {
          const dx = (rng() * amount - half) * 0.6;
          const dy = (rng() * amount - half) * 0.6;
          nodes.push({
            x: clamp(x + dx, 0, width),
            y: clamp(y + dy, 0, height),
          });
        }
      }
    } else {
      const count = Math.max(1, Math.floor(randomNodeCount));
      for (let i = 0; i < count; i++) {
        const x = rng() * width;
        const y = rng() * height;
        const dx = rng() * amount - half;
        const dy = rng() * amount - half;
        nodes.push({
          x: clamp(x + dx, 0, width),
          y: clamp(y + dy, 0, height),
        });
      }
    }

    nodesRef.current = nodes;
  }, [gridSpacing, jitter, mode, randomNodeCount]);

  const resizeCanvas = useCallback(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const rect = wrap.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));
    const dpr = clamp(window.devicePixelRatio || 1, 1, 2);

    sizeRef.current = { w: width, h: height, dpr };

    const pixelWidth = Math.max(1, Math.floor(width * dpr));
    const pixelHeight = Math.max(1, Math.floor(height * dpr));

    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    rebuildNodes();
  }, [rebuildNodes]);

  const drawFrame = useCallback(
    (time?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w: width, h: height, dpr } = sizeRef.current;
      if (width <= 0 || height <= 0) return;

      const now = time ?? performance.now();
      const auto = autoRef.current;
      const mouse = mouseRef.current;

      if (auto.enabled) {
        const dt = auto.lastTime ? Math.min(48, now - auto.lastTime) : 16.67;
        auto.lastTime = now;
        mouse.inside = true;

        if (!auto.initialized || auto.width !== width || auto.height !== height) {
          auto.width = width;
          auto.height = height;
          auto.target = { x: width * 0.5, y: height * 0.5 };
          if (!auto.initialized) {
            mouse.x = auto.target.x;
            mouse.y = auto.target.y;
            auto.initialized = true;
          }
          auto.waitUntil = 0;
        }

        if (now >= auto.waitUntil) {
          const dx = auto.target.x - mouse.x;
          const dy = auto.target.y - mouse.y;

          if (Math.hypot(dx, dy) < 2) {
            auto.target = {
              x: width * (0.12 + Math.random() * 0.76),
              y: height * (0.12 + Math.random() * 0.76),
            };
            auto.waitUntil = now + 350 + Math.random() * 650;
          } else {
            const ease = 1 - Math.exp(-dt / 420);
            mouse.x += dx * ease;
            mouse.y += dy * ease;
          }
        }
      } else {
        auto.lastTime = 0;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = canvasBackground;
      ctx.fillRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const maxCursorDist = Math.max(1, cursorConnectDistance);
      const maxNodeDist = Math.max(1, nodeConnectDistance);
      const edgeFade = (x: number, y: number) => {
        const distance = Math.min(x, y, width - x, height - y);
        return clamp(distance / 80, 0, 1);
      };

      if (connectNodes && nodes.length > 1) {
        const maxPer = clamp(Math.floor(maxNodeConnectionsPerNode), 1, 24);
        const cellSize = maxNodeDist;
        const cols = Math.max(1, Math.ceil(width / cellSize));
        const rows = Math.max(1, Math.ceil(height / cellSize));
        const buckets: number[][] = Array.from({ length: cols * rows }, () => []);

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const cx = clamp(Math.floor(node.x / cellSize), 0, cols - 1);
          const cy = clamp(Math.floor(node.y / cellSize), 0, rows - 1);
          buckets[cy * cols + cx].push(i);
        }

        const connectionCount = new Array(nodes.length).fill(0);
        const neighborOffsets = [
          [-1, -1],
          [0, -1],
          [1, -1],
          [-1, 0],
          [0, 0],
          [1, 0],
          [-1, 1],
          [0, 1],
          [1, 1],
        ];

        ctx.lineWidth = nodeLineWidth;
        ctx.strokeStyle = nodeLineColor;

        for (let i = 0; i < nodes.length; i++) {
          if (connectionCount[i] >= maxPer) continue;

          const a = nodes[i];
          const acx = clamp(Math.floor(a.x / cellSize), 0, cols - 1);
          const acy = clamp(Math.floor(a.y / cellSize), 0, rows - 1);

          for (const [offsetX, offsetY] of neighborOffsets) {
            if (connectionCount[i] >= maxPer) break;

            const nx = acx + offsetX;
            const ny = acy + offsetY;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;

            const bucket = buckets[ny * cols + nx];
            for (let k = 0; k < bucket.length; k++) {
              const j = bucket[k];
              if (j <= i) continue;
              if (connectionCount[i] >= maxPer) break;
              if (connectionCount[j] >= maxPer) continue;

              const b = nodes[j];
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const distance = Math.hypot(dx, dy);
              if (distance > maxNodeDist) continue;

              ctx.globalAlpha = clamp(
                nodeLineOpacity * (1 - distance / maxNodeDist) * Math.min(edgeFade(a.x, a.y), edgeFade(b.x, b.y)),
                0,
                1,
              );
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();

              connectionCount[i]++;
              connectionCount[j]++;
            }
          }
        }

        ctx.globalAlpha = 1;
      }

      if (connectToCursor && mouse.inside) {
        ctx.lineWidth = cursorLineWidth;
        ctx.strokeStyle = cursorLineColor;

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const distance = Math.hypot(mouse.x - node.x, mouse.y - node.y);
          if (distance > maxCursorDist) continue;

          ctx.globalAlpha = clamp(cursorLineOpacity * (1 - distance / maxCursorDist) * edgeFade(node.x, node.y), 0, 1);
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const distance = mouse.inside ? Math.hypot(mouse.x - node.x, mouse.y - node.y) : Number.POSITIVE_INFINITY;
        const active = distance < maxCursorDist;
        const t = active ? clamp(1 - distance / maxCursorDist, 0, 1) : 0;
        const fade = edgeFade(node.x, node.y);
        if (fade <= 0) continue;

        const size = Math.max(
          2,
          Math.round(active ? nodeRadiusIdle + (nodeRadiusActive - nodeRadiusIdle) * t : nodeRadiusIdle),
        );

        if (t > 0) {
          ctx.save();
          ctx.globalAlpha = clamp(t * glowStrength * fade, 0, 1);
          ctx.shadowColor = withAlpha(glowColor, 1);
          ctx.shadowBlur = 14 * (0.3 + t);
          ctx.fillStyle = withAlpha(glowColor, 0.9);
          ctx.fillRect(Math.round(node.x - size), Math.round(node.y - size), size * 2, size * 2);
          ctx.restore();
        }

        ctx.globalAlpha = (active ? 1 : clamp(nodeOpacityIdle, 0, 1)) * fade;
        ctx.fillStyle = active ? nodeColorActive : nodeColorIdle;
        const half = Math.floor(size / 2);
        ctx.fillRect(Math.round(node.x) - half, Math.round(node.y) - half, size, size);
      }

      ctx.globalAlpha = 1;
    },
    [
      canvasBackground,
      connectNodes,
      connectToCursor,
      cursorConnectDistance,
      cursorLineColor,
      cursorLineOpacity,
      cursorLineWidth,
      glowColor,
      glowStrength,
      maxNodeConnectionsPerNode,
      nodeColorActive,
      nodeColorIdle,
      nodeConnectDistance,
      nodeLineColor,
      nodeLineOpacity,
      nodeLineWidth,
      nodeOpacityIdle,
      nodeRadiusActive,
      nodeRadiusIdle,
    ],
  );

  useEffect(() => {
    resizeCanvas();

    const wrap = wrapRef.current;
    if (!wrap) return;

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [resizeCanvas]);

  useEffect(() => {
    if (!shouldAnimate) {
      drawFrame();
      return;
    }

    let frame = requestAnimationFrame(function tick(time) {
      drawFrame(time);
      frame = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frame);
  }, [drawFrame, shouldAnimate]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (autoRef.current.enabled) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      inside: true,
    };
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (autoRef.current.enabled) return;
    mouseRef.current.inside = false;
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: backgroundColor,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at center, transparent 38%, ${backgroundColor} 100%)`,
        }}
      />
    </div>
  );
}
