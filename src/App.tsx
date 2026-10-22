import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ChapterId,
  Relic,
  BonusCard,
  Obstacle,
  Footprint,
  FloatingText,
  Particle
} from './types/game';
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  INITIAL_RELICS,
  CHAPTER_BONUS_CARDS,
  CHAPTER_OBSTACLES,
  COMIC_CHAPTERS
} from './data/gameData';
import { soundEngine } from './audio/soundEngine';
import { ComicModal } from './components/ComicModal';
import { MiniGameModal } from './components/MiniGameModal';
import { FactCardModal } from './components/FactCardModal';
import { CertificateModal } from './components/CertificateModal';
import { BonusCardModal } from './components/BonusCardModal';
import { GameHUD } from './components/GameHUD';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // --- Game Flow States ---
  const [currentChapter, setCurrentChapter] = useState<ChapterId>(1);
  const [gameState, setGameState] = useState<'comic' | 'playing' | 'minigame' | 'factcard' | 'certificate'>('comic');
  const [relics, setRelics] = useState<Relic[]>(INITIAL_RELICS);
  const [bonusCards, setBonusCards] = useState<BonusCard[]>(CHAPTER_BONUS_CARDS);
  const [activeRelic, setActiveRelic] = useState<Relic | null>(null);
  const [nearRelic, setNearRelic] = useState<Relic | null>(null);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Time tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef(Date.now());

  // Player state
  const playerRef = useRef({
    x: 400,
    y: 400,
    radius: 18,
    vx: 0,
    vy: 0,
    speed: 3.8,
    angle: 0,
    idleTimer: 0,
    stepDistance: 0
  });

  // Drone state
  const droneRef = useRef({
    x: 370,
    y: 370,
    angle: 0,
    targetAngle: 0,
    hoverOffset: 0
  });

  // Joystick state
  const joystickRef = useRef({
    active: false,
    identifier: -1,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0,
    maxRadius: 55,
    dx: 0,
    dy: 0
  });

  // Keyboard keys
  const keysRef = useRef<Record<string, boolean>>({});

  // Dynamic entities
  const footprintsRef = useRef<Footprint[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const isRightFootRef = useRef(false);

  // Floating text ID counter
  const textIdCounter = useRef(1);

  // --- Start Ambient Sound on First User Gesture ---
  const handleUserInteraction = useCallback(() => {
    soundEngine.startAmbient();
  }, []);

  // --- Timer Loop ---
  useEffect(() => {
    const timer = setInterval(() => {
      if (gameState === 'playing' || gameState === 'minigame' || gameState === 'factcard') {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // --- Keyboard Event Listeners ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      handleUserInteraction();
      keysRef.current[e.key.toLowerCase()] = true;
      keysRef.current[e.key] = true;

      // Interaction key [E] or Space
      if ((e.key === 'e' || e.key === 'E' || e.key === ' ') && nearRelic && gameState === 'playing') {
        soundEngine.playLockOn();
        setActiveRelic(nearRelic);
        setGameState('minigame');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearRelic, gameState, handleUserInteraction]);

  // --- Touch Event Listeners (Virtual Thumb Joystick) ---
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      handleUserInteraction();
      if (gameState !== 'playing') return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        // Only left side of the screen initiates joystick
        if (touch.clientX < window.innerWidth * 0.5 && !joystickRef.current.active) {
          joystickRef.current.active = true;
          joystickRef.current.identifier = touch.identifier;
          joystickRef.current.startX = touch.clientX;
          joystickRef.current.startY = touch.clientY;
          joystickRef.current.currX = touch.clientX;
          joystickRef.current.currY = touch.clientY;
          joystickRef.current.dx = 0;
          joystickRef.current.dy = 0;
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!joystickRef.current.active) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystickRef.current.identifier) {
          joystickRef.current.currX = touch.clientX;
          joystickRef.current.currY = touch.clientY;

          const dx = touch.clientX - joystickRef.current.startX;
          const dy = touch.clientY - joystickRef.current.startY;
          const dist = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);

          const moveDist = Math.min(dist, joystickRef.current.maxRadius);
          joystickRef.current.dx = Math.cos(angle) * (moveDist / joystickRef.current.maxRadius);
          joystickRef.current.dy = Math.sin(angle) * (moveDist / joystickRef.current.maxRadius);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystickRef.current.identifier) {
          joystickRef.current.active = false;
          joystickRef.current.identifier = -1;
          joystickRef.current.dx = 0;
          joystickRef.current.dy = 0;
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [gameState, handleUserInteraction]);

  // --- Main Game Physics and Rendering Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    // Spawn dust particles for atmospheric effect
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = currentChapter === 1 ? 40 : 90; // Mars has more dust
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * WORLD_WIDTH,
          y: Math.random() * WORLD_HEIGHT,
          vx: currentChapter === 1 ? (Math.random() - 0.5) * 0.2 : 0.8 + Math.random() * 0.9,
          vy: currentChapter === 1 ? (Math.random() - 0.5) * 0.2 : 0.3 + Math.random() * 0.4,
          size: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.1,
          color: currentChapter === 1 ? '#e2e8f0' : '#f87171',
          life: Math.random() * 300,
          maxLife: 300
        });
      }
    };
    initParticles();

    // Loop
    const gameLoop = () => {
      const p = playerRef.current;
      const d = droneRef.current;
      const obstacles = CHAPTER_OBSTACLES[currentChapter];
      const activeChapterRelics = relics.filter(r => r.chapter === currentChapter && !r.recovered);

      // 1. UPDATE LOGIC (Only when playing)
      if (gameState === 'playing') {
        let moveX = joystickRef.current.dx;
        let moveY = joystickRef.current.dy;

        const keys = keysRef.current;
        if (keys['arrowleft'] || keys['a']) moveX = -1;
        if (keys['arrowright'] || keys['d']) moveX = 1;
        if (keys['arrowup'] || keys['w']) moveY = -1;
        if (keys['arrowdown'] || keys['s']) moveY = 1;

        if (moveX !== 0 || moveY !== 0) {
          const mag = Math.hypot(moveX, moveY);
          p.vx = (moveX / mag) * p.speed;
          p.vy = (moveY / mag) * p.speed;
          p.angle = Math.atan2(p.vy, p.vx);
          p.idleTimer = 0;

          // Track step distance for footstep decal & audio
          p.stepDistance += Math.hypot(p.vx, p.vy);
          if (p.stepDistance > 24) {
            p.stepDistance = 0;
            isRightFootRef.current = !isRightFootRef.current;
            soundEngine.playFootstep();

            // Decal position slightly offset perpendicular to angle
            const offset = (isRightFootRef.current ? 5 : -5);
            const fx = p.x + Math.sin(p.angle) * offset;
            const fy = p.y - Math.cos(p.angle) * offset;

            footprintsRef.current.push({
              x: fx,
              y: fy,
              angle: p.angle,
              alpha: 0.65,
              isRight: isRightFootRef.current
            });

            // Limit persistent footprints count to prevent memory overhead
            if (footprintsRef.current.length > 250) {
              footprintsRef.current.shift();
            }
          }
        } else {
          p.vx = 0;
          p.vy = 0;
          p.idleTimer += 0.04;
        }

        // Apply Sliding Collisions against Obstacles
        let nextX = p.x + p.vx;
        let nextY = p.y + p.vy;

        for (const obs of obstacles) {
          const dist = Math.hypot(nextX - obs.x, nextY - obs.y);
          const minDist = p.radius + obs.radius;
          if (dist < minDist) {
            const angle = Math.atan2(nextY - obs.y, nextX - obs.x);
            nextX = obs.x + Math.cos(angle) * minDist;
            nextY = obs.y + Math.sin(angle) * minDist;
          }
        }

        // Clamp inside World bounds
        p.x = Math.max(50, Math.min(WORLD_WIDTH - 50, nextX));
        p.y = Math.max(50, Math.min(WORLD_HEIGHT - 50, nextY));

        // Smooth Companion Drone AL-09 Movement
        d.hoverOffset += 0.05;
        const targetDroneX = p.x - Math.cos(p.angle) * 40 + Math.sin(d.hoverOffset) * 6;
        const targetDroneY = p.y - Math.sin(p.angle) * 40 + Math.cos(d.hoverOffset) * 6;
        d.x += (targetDroneX - d.x) * 0.08;
        d.y += (targetDroneY - d.y) * 0.08;

        // Drone points to next unrecovered relic in this chapter
        let closestNearRelic: Relic | null = null;

        if (activeChapterRelics.length > 0) {
          const target = activeChapterRelics[0];
          d.targetAngle = Math.atan2(target.y - d.y, target.x - d.x);

          // Proximity detection for USE button (distance <= 65px)
          const dist = Math.hypot(p.x - target.x, p.y - target.y);
          if (dist < 65) {
            closestNearRelic = target;
          }
        }

        // Smooth drone rotation
        d.angle += (d.targetAngle - d.angle) * 0.1;

        // Check proximity for all unrecovered relics
        for (const r of activeChapterRelics) {
          const dist = Math.hypot(p.x - r.x, p.y - r.y);
          if (dist < 65) {
            closestNearRelic = r;
            break;
          }
        }
        setNearRelic(closestNearRelic);

        // Check Hidden Bonus Cards discovery
        bonusCards
          .filter(b => b.chapter === currentChapter && !b.collected)
          .forEach(bonus => {
            const dist = Math.hypot(p.x - bonus.x, p.y - bonus.y);
            if (dist < 36) {
              // Collected!
              soundEngine.playBonus();
              setBonusCards(prev =>
                prev.map(b => (b.id === bonus.id ? { ...b, collected: true } : b))
              );
              floatingTextsRef.current.push({
                id: textIdCounter.current++,
                x: bonus.x,
                y: bonus.y,
                text: '+1 Secret Archive Card!',
                alpha: 1.0,
                color: '#fbbf24'
              });
            }
          });

        // Update floating texts
        floatingTextsRef.current.forEach(ft => {
          ft.y -= 0.6;
          ft.alpha -= 0.012;
        });
        floatingTextsRef.current = floatingTextsRef.current.filter(ft => ft.alpha > 0);

        // Update atmospheric dust particles
        particlesRef.current.forEach(pt => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          if (pt.x > WORLD_WIDTH) pt.x = 0;
          if (pt.x < 0) pt.x = WORLD_WIDTH;
          if (pt.y > WORLD_HEIGHT) pt.y = 0;
          if (pt.y < 0) pt.y = WORLD_HEIGHT;
        });
      }

      // 2. RENDER PIPELINE
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      ctx.clearRect(0, 0, screenW, screenH);

      // Camera Offset Centered on Player
      const camX = screenW / 2 - p.x;
      const camY = screenH / 2 - p.y;

      ctx.save();
      ctx.translate(camX, camY);

      // Ground Surface Background
      if (currentChapter === 1) {
        // The Moon: Deep Regolith Slate
        ctx.fillStyle = '#0f121a';
        ctx.fillRect(-200, -200, WORLD_WIDTH + 400, WORLD_HEIGHT + 400);

        // Subtle lunar dust texture pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 400; i++) {
          const gx = (i * 73) % WORLD_WIDTH;
          const gy = (i * 137) % WORLD_HEIGHT;
          ctx.beginPath();
          ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Mars: Rich Rust Red & Iron Ochre
        ctx.fillStyle = '#26120b';
        ctx.fillRect(-200, -200, WORLD_WIDTH + 400, WORLD_HEIGHT + 400);

        // Martian wind ripples
        ctx.fillStyle = 'rgba(239, 68, 68, 0.03)';
        for (let i = 0; i < 500; i++) {
          const gx = (i * 61) % WORLD_WIDTH;
          const gy = (i * 151) % WORLD_HEIGHT;
          ctx.beginPath();
          ctx.ellipse(gx, gy, 6, 2, 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // World Boundary Border
      ctx.strokeStyle = currentChapter === 1 ? 'rgba(148, 163, 184, 0.25)' : 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 4;
      ctx.strokeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

      // Render Persistent Footstep Decals
      footprintsRef.current.forEach(fp => {
        ctx.save();
        ctx.translate(fp.x, fp.y);
        ctx.rotate(fp.angle);
        ctx.fillStyle = currentChapter === 1 ? `rgba(0, 0, 0, ${fp.alpha * 0.45})` : `rgba(45, 12, 5, ${fp.alpha * 0.5})`;

        // Boot sole shape
        ctx.beginPath();
        ctx.ellipse(0, 0, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Boot ridges
        ctx.strokeStyle = currentChapter === 1 ? `rgba(255, 255, 255, ${fp.alpha * 0.15})` : `rgba(255, 200, 150, ${fp.alpha * 0.15})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-3, -2);
        ctx.lineTo(-3, 2);
        ctx.moveTo(0, -2);
        ctx.lineTo(0, 2);
        ctx.moveTo(3, -2);
        ctx.lineTo(3, 2);
        ctx.stroke();

        ctx.restore();
      });

      // Render Craters & Boulders
      obstacles.forEach(obs => {
        ctx.save();
        if (obs.type === 'crater') {
          // Crater bowl
          const craterGrad = ctx.createRadialGradient(obs.x - obs.radius * 0.2, obs.y - obs.radius * 0.2, obs.radius * 0.1, obs.x, obs.y, obs.radius);
          if (currentChapter === 1) {
            craterGrad.addColorStop(0, '#07090e');
            craterGrad.addColorStop(0.85, '#131824');
            craterGrad.addColorStop(1, '#2d3748');
          } else {
            craterGrad.addColorStop(0, '#150804');
            craterGrad.addColorStop(0.85, '#2e130b');
            craterGrad.addColorStop(1, '#4c2317');
          }
          ctx.fillStyle = craterGrad;
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
          ctx.fill();

          // Outer crater rim highlight
          ctx.strokeStyle = currentChapter === 1 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(254, 202, 202, 0.15)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        } else if (obs.type === 'dune') {
          // Sand dune ridge
          ctx.fillStyle = 'rgba(185, 28, 28, 0.2)';
          ctx.beginPath();
          ctx.ellipse(obs.x, obs.y, obs.radius, obs.radius * 0.5, 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(248, 113, 113, 0.25)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else {
          // Boulders with cast shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.ellipse(obs.x + 8, obs.y + 10, obs.radius * 0.9, obs.radius * 0.6, 0.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = currentChapter === 1 ? '#334155' : '#78350f';
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = currentChapter === 1 ? '#64748b' : '#9a3412';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      });

      // Render Secret Bonus Cards (Shimmering anomaly on the ground)
      bonusCards
        .filter(b => b.chapter === currentChapter && !b.collected)
        .forEach(b => {
          ctx.save();
          const pulse = Math.sin(Date.now() * 0.005) * 4;
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(b.x, b.y, 22 + pulse, 0, Math.PI * 2);
          ctx.stroke();

          // Golden glow center
          ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
          ctx.beginPath();
          ctx.arc(b.x, b.y, 14, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fbbf24';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✨', b.x, b.y);
          ctx.restore();
        });

      // Render Relics
      const chapterRelics = relics.filter(r => r.chapter === currentChapter);
      chapterRelics.forEach(r => {
        ctx.save();

        if (r.recovered) {
          // Recovered Relic: Restored, glowing, green checkmark
          ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius + 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Structure icon
          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(r.icon, r.x, r.y);

          // Green check badge
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(r.x + 20, r.y - 20, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('✓', r.x + 20, r.y - 20);

          // Label
          ctx.fillStyle = '#6ee7b7';
          ctx.font = 'bold 11px "Space Mono", monospace';
          ctx.fillText(r.name, r.x, r.y + r.radius + 14);
        } else {
          // Unrecovered Relic: Dim silhouette with lock icon and pulsing proximity ring
          const isTargeted = activeChapterRelics[0]?.id === r.id;
          const pulse = isTargeted ? Math.sin(Date.now() * 0.006) * 6 : 0;

          // Proximity indicator
          ctx.strokeStyle = isTargeted ? 'rgba(59, 130, 246, 0.6)' : 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius + 10 + pulse, 0, Math.PI * 2);
          ctx.stroke();

          // Dark silhouette
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.fill();

          // Dim Icon
          ctx.font = '28px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.globalAlpha = 0.45;
          ctx.fillText(r.icon, r.x, r.y);
          ctx.globalAlpha = 1.0;

          // Lock badge
          ctx.fillStyle = '#e2e8f0';
          ctx.font = '12px sans-serif';
          ctx.fillText('🔒', r.x + 16, r.y - 16);

          // Label
          ctx.fillStyle = '#94a3b8';
          ctx.font = '11px "Space Mono", monospace';
          ctx.fillText(r.name, r.x, r.y + r.radius + 14);
        }

        ctx.restore();
      });

      // Render Floating Texts
      floatingTextsRef.current.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color || '#38bdf8';
        ctx.font = 'bold 14px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // Render Drone AL-09 Guidance Laser Beam (Points to next target relic)
      if (activeChapterRelics.length > 0) {
        const target = activeChapterRelics[0];
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 8]);
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
        ctx.restore();
      }

      // Render Companion Drone AL-09 Sprite
      ctx.save();
      ctx.translate(d.x, d.y);
      ctx.rotate(d.angle);

      // Thruster trail particles
      ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.beginPath();
      ctx.arc(-12, 0, 3 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();

      // Drone chassis
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Front optical sensor
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(6, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Antenna
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(0, -12);
      ctx.stroke();
      ctx.restore();

      // Render Player Astronaut Sprite
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      // Astronaut shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(0, 4, p.radius, p.radius * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // PLSS Backpack
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.fillRect(-14, -10, 8, 20);
      ctx.strokeRect(-14, -10, 8, 20);

      // Astronaut Suit Torso
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(0, 0, p.radius - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Mission Patch on Shoulder
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.arc(0, -10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Helmet & Visor
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(5, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      // Visor Gold/Cyan Reflection
      const visorGrad = ctx.createLinearGradient(4, -6, 12, 6);
      visorGrad.addColorStop(0, '#f59e0b');
      visorGrad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = visorGrad;
      ctx.beginPath();
      ctx.arc(6, 0, 6, -Math.PI / 2, Math.PI / 2);
      ctx.fill();

      // Idle Breathing pulse (Visor glow)
      const breathing = Math.sin(p.idleTimer) * 0.15 + 0.85;
      ctx.fillStyle = `rgba(245, 158, 11, ${breathing * 0.25})`;
      ctx.beginPath();
      ctx.arc(6, 0, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Render Atmospheric Dust Particles
      particlesRef.current.forEach(pt => {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      ctx.restore(); // Restore camera translation

      // Render Touch Joystick Overlay directly onto screen coordinates
      if (joystickRef.current.active) {
        const j = joystickRef.current;
        // Base ring
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.beginPath();
        ctx.arc(j.startX, j.startY, j.maxRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Active thumb knob
        const knobX = j.startX + j.dx * j.maxRadius;
        const knobY = j.startY + j.dy * j.maxRadius;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(knobX, knobY, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, currentChapter, relics, bonusCards]);

  // --- Handlers for Chapter / Mini-Game / Quiz Flow ---
  const handleStartChapter = () => {
    soundEngine.playLockOn();
    setGameState('playing');
  };

  const handleMiniGameComplete = () => {
    if (!activeRelic) return;
    // Mark relic as recovered
    setRelics(prev =>
      prev.map(r => (r.id === activeRelic.id ? { ...r, recovered: true } : r))
    );
    setGameState('factcard');
  };

  const handleContinueAfterFact = () => {
    soundEngine.playDustWhisk();
    // Check if all relics in this chapter are recovered
    const updatedRelics = relics.map(r =>
      r.id === activeRelic?.id ? { ...r, recovered: true } : r
    );

    const chapterRelics = updatedRelics.filter(r => r.chapter === currentChapter);
    const allInChapterRecovered = chapterRelics.every(r => r.recovered);

    setActiveRelic(null);

    if (allInChapterRecovered) {
      if (currentChapter === 1) {
        // Transition to Chapter 2 (Mars) with opening comic!
        setCurrentChapter(2);
        playerRef.current.x = 400;
        playerRef.current.y = 400;
        setGameState('comic');
      } else {
        // Both Chapters Complete -> Certificate Screen!
        setGameState('certificate');
      }
    } else {
      setGameState('playing');
    }
  };

  const handleRestartGame = () => {
    soundEngine.playDustWhisk();
    setRelics(INITIAL_RELICS.map(r => ({ ...r, recovered: false })));
    setBonusCards(CHAPTER_BONUS_CARDS.map(b => ({ ...b, collected: false })));
    setCurrentChapter(1);
    playerRef.current.x = 400;
    playerRef.current.y = 400;
    footprintsRef.current = [];
    startTimeRef.current = Date.now();
    setElapsedSeconds(0);
    setGameState('comic');
  };

  return (
    <div
      onClick={handleUserInteraction}
      className="relative w-screen h-screen overflow-hidden bg-[#07090e] select-none"
    >
      {/* 2D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full cursor-crosshair touch-none"
      />

      {/* Heads-Up Display (HUD) */}
      {gameState === 'playing' && (
        <GameHUD
          currentChapter={currentChapter}
          relics={relics}
          bonusCards={bonusCards}
          playerX={playerRef.current.x}
          playerY={playerRef.current.y}
          playerAngle={playerRef.current.angle}
          nearRelic={nearRelic}
          onUseRelic={() => {
            if (nearRelic) {
              soundEngine.playLockOn();
              setActiveRelic(nearRelic);
              setGameState('minigame');
            }
          }}
          onOpenBonusCards={() => setShowBonusModal(true)}
          isMuted={isMuted}
          onToggleMute={() => {
            const nextMuted = soundEngine.toggleMute();
            setIsMuted(nextMuted);
          }}
          showHelp={showHelp}
          onToggleHelp={() => setShowHelp(prev => !prev)}
        />
      )}

      {/* Comic Modal (Prior to Chapter 1 & Chapter 2) */}
      {gameState === 'comic' && (
        <ComicModal
          comicData={COMIC_CHAPTERS[currentChapter]}
          onStartChapter={handleStartChapter}
        />
      )}

      {/* Mini-Game Modal */}
      {gameState === 'minigame' && activeRelic && (
        <MiniGameModal
          relic={activeRelic}
          onComplete={handleMiniGameComplete}
          onClose={() => setGameState('playing')}
        />
      )}

      {/* Polaroid NASA Fact & Quiz Modal */}
      {gameState === 'factcard' && activeRelic && (
        <FactCardModal
          relic={activeRelic}
          onContinue={handleContinueAfterFact}
        />
      )}

      {/* Certificate Modal (Final Ending) */}
      {gameState === 'certificate' && (
        <CertificateModal
          relics={relics}
          bonusCards={bonusCards}
          elapsedSeconds={elapsedSeconds}
          onRestart={handleRestartGame}
        />
      )}

      {/* Secret Bonus Cards Archive Viewer */}
      {showBonusModal && (
        <BonusCardModal
          bonusCards={bonusCards}
          onClose={() => setShowBonusModal(false)}
        />
      )}
    </div>
  );
}
