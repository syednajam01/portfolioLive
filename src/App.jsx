import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Terminal,
  Box,
  Activity,
  Server,
  GitBranch,
  RefreshCw,
  Zap,
  XCircle,
  Database,
  Eye,
  Shield,
  Layers,
  Cloud,
  BarChart3,
  Cpu
} from 'lucide-react';

// ============================================
// GLOBAL STYLES
// ============================================
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        /* New Gradient Color Palette */
        --gradient-1-start: #2C3E50;
        --gradient-1-end: #4CA1AF;
        --gradient-2-start: #1F1C2C;
        --gradient-2-end: #928DAB;
        --gradient-3-start: #0F2027;
        --gradient-3-end: #2C5364;
        --gradient-4-start: #1E130C;
        --gradient-4-end: #9A8478;
        --gradient-5-start: #485563;
        --gradient-5-end: #29323C;
        /* Legacy mapping */
        --navy-dark: #2C3E50;
        --navy-light: #4CA1AF;
        --purple-soft: #928DAB;
        --purple-dark: #1F1C2C;
        --dark-bg: #20201F;
        --coral-accent: #9A8478;
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      
      @keyframes data-flow {
        0% { transform: translateY(-100%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(100%); opacity: 0; }
      }
      
      @keyframes gradient-rotate {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes scanline {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      
      @keyframes float-particle {
        0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
      }
      
      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      
      @keyframes data-stream {
        0% { transform: translateY(-100%) translateX(0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(100vh) translateX(10px); opacity: 0; }
      }
      
      html { scroll-behavior: smooth; }
      ::selection { background-color: #35577D; color: #ffffff; }
      
      /* Custom Scrollbar with gradient */
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: #20201F; }
      ::-webkit-scrollbar-thumb { 
        background: linear-gradient(180deg, #2C3E50, #4CA1AF); 
        border-radius: 3px; 
      }
      
      @media (max-width: 768px) {
        body { overflow-x: hidden; }
      }
      
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  return null;
};

// ============================================
// HOOKS
// ============================================
const useScrollReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// ============================================
// UTILITY COMPONENTS
// ============================================
const RevealOnScroll = ({ children, delay = 0, className = '' }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const TypewriterText = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index === text.length) clearInterval(interval);
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return <span>{displayedText}<span className="animate-pulse" style={{ color: '#EE6E4D' }}>_</span></span>;
};

const Section = ({ children, className = '', id = '' }) => (
  <section id={id} className={`py-20 md:py-28 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

// ============================================
// FLOATING GEOMETRIC PARTICLES
// ============================================
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 15,
    delay: Math.random() * 5,
    shape: ['square', 'diamond', 'circle'][Math.floor(Math.random() * 3)],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            background: p.id % 2 === 0
              ? 'linear-gradient(135deg, #2C3E50, transparent)'
              : 'linear-gradient(135deg, #928DAB, transparent)',
            borderRadius: p.shape === 'circle' ? '50%' : '0',
            transform: p.shape === 'diamond' ? 'rotate(45deg)' : 'none',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// SCAN LINE EFFECT
// ============================================
const ScanLineEffect = () => (
  <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.02]">
    <div
      className="absolute w-full h-[2px]"
      style={{
        background: 'linear-gradient(90deg, transparent, #2C3E50, transparent)',
        animation: 'scanline 8s linear infinite'
      }}
    />
  </div>
);

// ============================================
// DATA STREAM VISUALIZATION
// ============================================
const DataStream = () => {
  const streams = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: 10 + (i * 12),
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 3,
    height: 40 + Math.random() * 60,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
      {streams.map((s) => (
        <div
          key={s.id}
          className="absolute w-[1px]"
          style={{
            left: `${s.x}%`,
            top: 0,
            height: `${s.height}px`,
            background: s.id % 2 === 0
              ? 'linear-gradient(180deg, transparent, #2C3E50, transparent)'
              : 'linear-gradient(180deg, transparent, #928DAB, transparent)',
            animation: `data-stream ${s.duration}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// ANIMATED COUNTER
// ============================================
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollReveal(0.5);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        setCount(Math.floor(eased * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isVisible, end, duration]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

// ============================================
// 3D TILT CARD
// ============================================
const TiltCard = ({ children, className = '' }) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.1 });
  };

  const handleMouseLeave = () => {
    setTransform('');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        className="absolute inset-0 pointer-events-none rounded-lg transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(44, 62, 80, ${glare.opacity}), transparent 50%)`,
        }}
      />
    </div>
  );
};

// ============================================
// ANIMATED GRADIENT BORDER
// ============================================
const GradientBorder = ({ children, className = '' }) => (
  <div className={`relative p-[1px] rounded-lg overflow-hidden ${className}`}>
    <div
      className="absolute inset-0 rounded-lg"
      style={{
        background: 'linear-gradient(90deg, #2C3E50, #928DAB, #2C3E50)',
        backgroundSize: '200% 100%',
        animation: 'gradient-rotate 3s linear infinite',
      }}
    />
    <div className="relative rounded-lg h-full" style={{ background: '#20201F' }}>
      {children}
    </div>
  </div>
);

// ============================================
// PULSE RING ANIMATION
// ============================================
const PulseRing = ({ color = '#35577D' }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <div
      className="absolute w-full h-full rounded-full border-2"
      style={{
        borderColor: color,
        animation: 'pulse-ring 2s ease-out infinite',
        opacity: 0.3
      }}
    />
    <div
      className="absolute w-full h-full rounded-full border-2"
      style={{
        borderColor: color,
        animation: 'pulse-ring 2s ease-out 0.5s infinite',
        opacity: 0.3
      }}
    />
  </div>
);

// ============================================
// 3D INFRASTRUCTURE CANVAS
// ============================================
const InfrastructureCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const nodes = [];
    const nodeCount = 40;
    const connectionDistance = 180;
    let mouse = { x: -1000, y: -1000 };
    let animationFrameId;

    // Initialize nodes (representing infrastructure components)
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 - 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 4 + 2,
        pulse: Math.random() * Math.PI * 2,
        type: Math.floor(Math.random() * 3), // 0: container, 1: server, 2: cloud
      });
    }

    // Data packets flowing between nodes
    const packets = [];
    for (let i = 0; i < 15; i++) {
      packets.push({
        startNode: Math.floor(Math.random() * nodeCount),
        endNode: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
        color: ['#2496ED', '#326CE5', '#FF9900', '#E6522C'][Math.floor(Math.random() * 4)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Mouse interaction
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 3000;
          node.vx += dx * force;
          node.vy += dy * force;
        }

        // Physics
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.98;
        node.vy *= 0.98;
        node.pulse += 0.02;

        // Boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const cdx = node.x - other.x;
          const cdy = node.y - other.y;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (cdist < connectionDistance) {
            const alpha = (1 - cdist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }

        // Draw node
        const pulseSize = Math.sin(node.pulse) * 1.5;
        const size = node.size + pulseSize;

        ctx.beginPath();
        if (node.type === 0) {
          // Container (square)
          ctx.rect(node.x - size, node.y - size, size * 2, size * 2);
          ctx.fillStyle = `rgba(36, 150, 237, ${0.3 + Math.sin(node.pulse) * 0.2})`;
        } else if (node.type === 1) {
          // Server (diamond)
          ctx.moveTo(node.x, node.y - size);
          ctx.lineTo(node.x + size, node.y);
          ctx.lineTo(node.x, node.y + size);
          ctx.lineTo(node.x - size, node.y);
          ctx.closePath();
          ctx.fillStyle = `rgba(50, 108, 229, ${0.3 + Math.sin(node.pulse) * 0.2})`;
        } else {
          // Cloud (circle)
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 153, 0, ${0.3 + Math.sin(node.pulse) * 0.2})`;
        }
        ctx.fill();
      });

      // Draw data packets
      packets.forEach(packet => {
        const start = nodes[packet.startNode];
        const end = nodes[packet.endNode];
        if (!start || !end) return;

        packet.progress += packet.speed;
        if (packet.progress > 1) {
          packet.progress = 0;
          packet.startNode = packet.endNode;
          packet.endNode = Math.floor(Math.random() * nodeCount);
        }

        const x = start.x + (end.x - start.x) * packet.progress;
        const y = start.y + (end.y - start.y) * packet.progress;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = packet.color;
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = packet.color.replace(')', ', 0.2)').replace('rgb', 'rgba');
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-50"
    />
  );
};

// ============================================
// TOOL LOGOS (SVG)
// ============================================
const DockerLogo = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#2496ED">
    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186zm-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186zm5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.084.185.185.185zm-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185zm10.787 2.715h2.118a.185.185 0 00.185-.185v-1.888a.185.185 0 00-.185-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 00.184-.185v-1.888a.185.185 0 00-.184-.185h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 00.185-.185v-1.888a.185.185 0 00-.185-.185h-2.119a.185.185 0 00-.185.185v1.888c0 .102.084.185.185.185zm-2.92 0h2.12a.185.185 0 00.184-.185v-1.888a.185.185 0 00-.184-.185h-2.12a.185.185 0 00-.186.185v1.888c0 .102.084.185.186.185zM23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" />
  </svg>
);

const KubernetesLogo = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#326CE5">
    <path d="M10.204 14.35l.007.01-.999 2.413a5.171 5.171 0 01-2.075-2.597l2.578-.437.004.005a.44.44 0 01.485.606zm-.833-2.129a.44.44 0 00.173-.756l.002-.011L7.585 9.7a5.143 5.143 0 00-.73 3.255l2.514-.725.002-.009zm1.145-1.98a.44.44 0 00.699-.337l.01-.005.15-2.62a5.144 5.144 0 00-3.01 1.442l2.147 1.523.004-.003zm.76 2.75l.723.349.722-.347.18-.78-.5-.623h-.804l-.5.623.179.778zm1.5-2.063a.44.44 0 00.7.336l.008.003 2.134-1.513a5.188 5.188 0 00-2.992-1.442l.148 2.615.002.001zm10.876 5.97l-5.773 7.181a1.6 1.6 0 01-1.248.594H9.261a1.6 1.6 0 01-1.247-.594l-5.773-7.181a1.583 1.583 0 01-.307-1.34L3.823 5.79a1.6 1.6 0 01.947-1.152l7.286-3.223a1.537 1.537 0 011.26 0l7.285 3.223a1.6 1.6 0 01.947 1.152l1.889 7.967c.086.307.086.63 0 .937-.086.307-.235.585-.44.817zm-3.192-1.556a.44.44 0 00-.185-.755l-.003-.01-2.59-.44a5.183 5.183 0 01-2.1 2.6l1.004 2.424.003.01a.44.44 0 00.769.074l.002-.001 3.1-3.902zm-4.87-6.727a.44.44 0 00-.214-.749l-.002-.011-2.482-.936-2.482.936-.002.01a.44.44 0 00-.214.75l.004.002 1.953 1.567h1.481l1.954-1.567.004-.002z" />
  </svg>
);

const GitHubActionsLogo = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#2088FF">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const AWSLogo = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#FF9900">
    <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 01-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 01-.287-.375 6.18 6.18 0 01-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 01-.28.104.488.488 0 01-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 01.224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 011.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 00-.735-.136 6.02 6.02 0 00-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 01-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 01.32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 01.311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 01-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 01-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 01-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 00.415-.758.777.777 0 00-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 01-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 01.24.2.43.43 0 01.071.263v.375c0 .168-.064.256-.184.256a.83.83 0 01-.303-.096 3.652 3.652 0 00-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.27-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.385.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z" />
  </svg>
);

const MLflowLogo = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#0194E2">
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l6.9 3.45L12 11.08 5.1 7.63 12 4.18zM4 8.82l7 3.5v7.36l-7-3.5V8.82zm9 10.86v-7.36l7-3.5v7.36l-7 3.5z" />
  </svg>
);

const PrometheusLogo = () => (
  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="#E6522C">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.628-5.373-12-12-12zm0 22.46c-1.885 0-3.414-1.455-3.414-3.248h6.828c0 1.793-1.53 3.248-3.414 3.248zm5.64-4.315H6.36v-1.62h11.28v1.62zm-.04-2.572H6.397c-.047-.053-.092-.109-.14-.163-1.06-1.201-1.312-1.837-1.64-2.676-.347-.89-.547-2.347-.547-2.347s.467.987 1.147 1.773c.68.787 1.373 1.2 1.373 1.2s-.293-.96-.293-2.147c0-1.187.387-2.853 1.013-3.987 0 0 .267 1.32.907 2.617.64 1.297 1.28 1.933 1.28 1.933s-.107-1.307.107-2.547c.213-1.24.747-2.56.747-2.56s.547 1.32.907 2.56c.36 1.24.107 2.547.107 2.547s.64-.636 1.28-1.933c.64-1.297.907-2.617.907-2.617.626 1.134 1.013 2.8 1.013 3.987 0 1.187-.293 2.147-.293 2.147s.693-.413 1.373-1.2c.68-.786 1.147-1.773 1.147-1.773s-.2 1.457-.547 2.347c-.328.839-.58 1.475-1.64 2.676-.048.054-.093.11-.14.163z" />
  </svg>
);

// ============================================
// HERO SECTION
// ============================================
const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      <InfrastructureCanvas />
      <DataStream />

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(32, 32, 31, 0.9), transparent, rgba(32, 32, 31, 1))' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(32, 32, 31, 0.6), transparent, rgba(32, 32, 31, 0.6))' }} />

      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32" style={{ borderLeft: '1px solid rgba(53, 87, 125, 0.3)', borderTop: '1px solid rgba(53, 87, 125, 0.3)' }} />
      <div className="absolute top-0 right-0 w-32 h-32" style={{ borderRight: '1px solid rgba(224, 177, 203, 0.2)', borderTop: '1px solid rgba(224, 177, 203, 0.2)' }} />
      <div className="absolute bottom-0 left-0 w-32 h-32" style={{ borderLeft: '1px solid rgba(224, 177, 203, 0.2)', borderBottom: '1px solid rgba(224, 177, 203, 0.2)' }} />
      <div className="absolute bottom-0 right-0 w-32 h-32" style={{ borderRight: '1px solid rgba(53, 87, 125, 0.3)', borderBottom: '1px solid rgba(53, 87, 125, 0.3)' }} />

      <div className="relative z-10 text-center max-w-4xl px-6">
        <RevealOnScroll>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono text-neutral-400 mb-8 backdrop-blur-sm" style={{ background: 'rgba(32, 32, 31, 0.8)', border: '1px solid rgba(53, 87, 125, 0.3)' }}>
            <div className="relative">
              <Terminal size={14} style={{ color: '#35577D' }} />
              <div className="absolute inset-0 w-3 h-3 rounded-full blur-md" style={{ background: 'rgba(53, 87, 125, 0.5)' }} />
            </div>
            <span style={{ color: '#35577D' }}>DEVOPS & MLOPS ENGINEER</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #35577D, #E0B1CB)' }}
            >
              Deployment
            </span>
            <br />
            <span className="text-neutral-300">Engineering</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="h-8 mb-8">
            <p className="text-xl md:text-2xl text-neutral-400 font-light">
              <TypewriterText text="From Code to Production. Reliably." delay={800} />
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={400}>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['Package', 'Deploy', 'Automate', 'Host', 'Manage', 'Monitor'].map((item, i) => (
              <span
                key={item}
                className="px-3 py-1.5 border rounded text-xs font-mono text-neutral-400 backdrop-blur-sm hover:text-white transition-all cursor-default"
                style={{
                  background: 'rgba(32, 32, 31, 0.6)',
                  borderColor: i % 2 === 0 ? 'rgba(53, 87, 125, 0.3)' : 'rgba(224, 177, 203, 0.2)',
                  boxShadow: `0 0 20px ${i % 2 === 0 ? 'rgba(53, 87, 125, 0.08)' : 'rgba(224, 177, 203, 0.05)'}`,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={500}>
          <button
            onClick={() => document.getElementById('pillars').scrollIntoView({ behavior: 'smooth' })}
            className="relative px-8 py-3 font-semibold rounded overflow-hidden inline-flex items-center gap-2 group transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #35577D, #141E30)',
              color: '#ffffff',
            }}
          >
            <span className="relative z-10">Explore My Stack</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </RevealOnScroll>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" style={{ color: '#EE6E4D' }}>
        <ChevronDown size={24} />
      </div>
    </section>
  );
};

// ============================================
// DEPLOYMENT PILLARS SECTION
// ============================================
const PillarCard = ({ icon, title, description, toolName, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <RevealOnScroll delay={delay}>
      <TiltCard>
        <div
          className="relative bg-neutral-900/70 border p-8 rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-1 group backdrop-blur-sm"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            borderColor: isHovered ? color : 'rgba(38, 38, 38, 1)',
            boxShadow: isHovered ? `0 0 40px ${color}30, inset 0 0 20px ${color}10` : 'none'
          }}
        >
          {/* Animated corner accent */}
          <div
            className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 transition-all duration-500"
            style={{ borderColor: isHovered ? color : 'transparent' }}
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 transition-all duration-500"
            style={{ borderColor: isHovered ? color : 'transparent' }}
          />

          {/* Glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${color}15, transparent 70%)`
            }}
          />

          <div className="relative z-10">
            <div className="mb-6 transition-transform duration-300 group-hover:scale-110 relative">
              {icon}
              {isHovered && <PulseRing color={color} />}
            </div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-2">{title}</h3>
            <p className="text-xs font-mono uppercase tracking-wider text-neutral-500 mb-4 transition-colors duration-300" style={{ color: isHovered ? color : undefined }}>
              {toolName}
            </p>
            <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </TiltCard>
    </RevealOnScroll>
  );
};

const DeploymentPillars = () => {
  const pillars = [
    {
      icon: <DockerLogo />,
      title: "Package",
      toolName: "Docker",
      description: "Containerization creates reproducible, isolated environments. One build runs the same everywhere.",
      color: "#2496ED"
    },
    {
      icon: <KubernetesLogo />,
      title: "Deploy & Scale",
      toolName: "Kubernetes",
      description: "Orchestration handles scheduling, scaling, and self-healing. Declare the desired state, let the system converge.",
      color: "#326CE5"
    },
    {
      icon: <GitHubActionsLogo />,
      title: "Automate",
      toolName: "CI/CD Pipelines",
      description: "Automated testing and deployment reduces human error. Every push triggers validation and safe rollouts.",
      color: "#2088FF"
    },
    {
      icon: <AWSLogo />,
      title: "Host",
      toolName: "Cloud Infrastructure",
      description: "Cloud primitives provide scalable compute, storage, and networking. Infrastructure as code eliminates drift.",
      color: "#FF9900"
    },
    {
      icon: <MLflowLogo />,
      title: "Manage Models",
      toolName: "MLflow / DVC",
      description: "Model versioning, experiment tracking, and data lineage. Reproducibility for machine learning workflows.",
      color: "#0194E2"
    },
    {
      icon: <PrometheusLogo />,
      title: "Monitor",
      toolName: "Prometheus / Grafana",
      description: "Observability keeps systems alive in production. Metrics, logs, and alerts catch issues before users do.",
      color: "#E6522C"
    }
  ];

  return (
    <Section id="pillars" className="relative" style={{ background: '#20201F', borderTop: '1px solid rgba(53, 87, 125, 0.2)' }}>
      {/* Section accent lines */}
      <div className="absolute top-0 left-1/4 w-px h-20" style={{ background: 'linear-gradient(to bottom, rgba(53, 87, 125, 0.5), transparent)' }} />
      <div className="absolute top-0 right-1/4 w-px h-20" style={{ background: 'linear-gradient(to bottom, rgba(224, 177, 203, 0.3), transparent)' }} />

      <RevealOnScroll>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Core Deployment <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #35577D, #E0B1CB)' }}>Stack</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            The six pillars of modern deployment infrastructure. Each tool solves a specific problem in the path from code to production.
          </p>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, index) => (
          <PillarCard key={pillar.title} {...pillar} delay={index * 100} />
        ))}
      </div>
    </Section>
  );
};

// ============================================
// PIPELINE SECTION
// ============================================
const PipelineStep = ({ title, description, active, isLast, icon }) => (
  <div className={`relative flex gap-6 pb-12 ${isLast ? 'pb-0' : ''} group`}>
    {!isLast && (
      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-neutral-800 group-hover:bg-neutral-700 transition-colors" />
    )}

    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0 ${active
      ? 'bg-blue-500/10 border-blue-500 text-blue-400 scale-110 shadow-[0_0_20px_rgba(59,130,246,0.3)]'
      : 'bg-neutral-900 border-neutral-700 text-neutral-600'
      }`}>
      {active ? <CheckCircle size={18} /> : icon}
    </div>

    <div className={`transition-all duration-500 ${active ? 'opacity-100' : 'opacity-50'}`}>
      <h3 className="text-lg font-semibold text-neutral-200 mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const PipelineSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight / 2 - rect.top) / rect.height));
      setActiveStep(Math.floor(progress * 7));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { title: "Local Development", desc: "Environment parity with containers. Pre-commit hooks catch issues early.", icon: <Terminal size={16} /> },
    { title: "Build Artifacts", desc: "Immutable Docker images. Deterministic builds with locked dependencies.", icon: <Box size={16} /> },
    { title: "Automated Testing", desc: "Unit, integration, and E2E tests run on every push.", icon: <Zap size={16} /> },
    { title: "Security Scanning", desc: "Container vulnerability scanning. Secret detection in code.", icon: <Shield size={16} /> },
    { title: "Staging Deploy", desc: "Deploy to staging environment. Run smoke tests and validations.", icon: <Layers size={16} /> },
    { title: "Production Rollout", desc: "Blue/Green or Canary deployment. Zero-downtime releases.", icon: <Server size={16} /> },
    { title: "Observability", desc: "Metrics, logs, and traces. Alert on anomalies, not just failures.", icon: <BarChart3 size={16} /> },
  ];

  return (
    <Section className="relative overflow-hidden" style={{ background: 'rgba(32, 32, 31, 0.5)', borderTop: '1px solid rgba(53, 87, 125, 0.2)', borderBottom: '1px solid rgba(53, 87, 125, 0.2)' }}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(224, 177, 203, 0.05), transparent)' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(53, 87, 125, 0.05), transparent)' }} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative" ref={sectionRef}>
        <div className="lg:sticky lg:top-32 lg:self-start">
          <RevealOnScroll>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Deployment Pipeline</h2>
            <div className="border-l-4 pl-6 py-2 mb-8" style={{ borderColor: 'rgba(53, 87, 125, 0.5)' }}>
              <p className="text-xl text-neutral-300 italic">"If it can't be deployed reliably, it's not finished."</p>
            </div>
            <p className="text-neutral-400 leading-relaxed mb-8">
              Every stage is a gate. Each gate catches a category of failure before it reaches production.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <GradientBorder>
                <div className="p-4">
                  <span className="block font-mono text-2xl mb-1" style={{ color: '#35577D' }}>
                    <AnimatedCounter end={99} suffix=".9%" />
                  </span>
                  <span className="text-sm text-neutral-500">Target Availability</span>
                </div>
              </GradientBorder>
              <GradientBorder>
                <div className="p-4">
                  <span className="block font-mono text-2xl mb-1" style={{ color: '#E0B1CB' }}>
                    &lt; <AnimatedCounter end={5} suffix="m" />
                  </span>
                  <span className="text-sm text-neutral-500">Rollback Time</span>
                </div>
              </GradientBorder>
            </div>
          </RevealOnScroll>
        </div>

        <div>
          {steps.map((step, idx) => (
            <PipelineStep
              key={idx}
              title={step.title}
              description={step.desc}
              icon={step.icon}
              active={idx <= activeStep}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

// ============================================
// CHAOS ENGINEERING DEMO
// ============================================
const ChaosDemo = () => {
  const [pods, setPods] = useState([
    { id: 1, status: 'running' },
    { id: 2, status: 'running' },
    { id: 3, status: 'running' },
  ]);
  const [reconciling, setReconciling] = useState(false);

  const killPod = (id) => {
    if (reconciling) return;

    setPods(prev => prev.map(p => p.id === id ? { ...p, status: 'terminating' } : p));
    setReconciling(true);

    setTimeout(() => {
      setPods(prev => prev.filter(p => p.id !== id));

      setTimeout(() => {
        const newId = Math.max(...pods.map(p => p.id), 0) + 1;
        setPods(prev => [...prev, { id: newId, status: 'pending' }]);

        setTimeout(() => {
          setPods(prev => prev.map(p => p.status === 'pending' ? { ...p, status: 'running' } : p));
          setReconciling(false);
        }, 1500);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-mono text-neutral-500">
        <div className={`w-2 h-2 rounded-full ${reconciling ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
        {reconciling ? "RECONCILING..." : "CLUSTER HEALTHY"}
      </div>

      <div className="flex gap-6 mb-8">
        {pods.map(pod => (
          <div
            key={pod.id}
            onClick={() => pod.status === 'running' && killPod(pod.id)}
            className={`
              w-20 h-24 rounded-lg flex flex-col items-center justify-center gap-2 border-2 transition-all duration-300 cursor-pointer relative group
              ${pod.status === 'running' ? 'bg-neutral-800 border-emerald-500/50 hover:border-red-500 hover:bg-red-500/10' : ''}
              ${pod.status === 'terminating' ? 'bg-red-900/20 border-red-500 scale-90 opacity-50' : ''}
              ${pod.status === 'pending' ? 'bg-blue-900/20 border-blue-500 border-dashed animate-pulse' : ''}
            `}
          >
            {pod.status === 'running' && (
              <>
                <Box className="text-emerald-500 group-hover:text-red-500 transition-colors" />
                <span className="text-xs font-mono text-neutral-400 group-hover:text-red-400">pod-{pod.id}</span>
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">KILL</div>
              </>
            )}
            {pod.status === 'terminating' && <XCircle className="text-red-500" />}
            {pod.status === 'pending' && <RefreshCw className="text-blue-500 animate-spin" />}
          </div>
        ))}
      </div>

      <div className="text-center">
        <div className="text-xs font-mono text-neutral-500 mb-2 uppercase tracking-widest">
          Desired State: 3 Replicas
        </div>
        <p className="text-neutral-400 text-sm max-w-md mx-auto">
          {reconciling
            ? "Control plane detected drift. Scheduling new pod..."
            : "Click a pod to simulate failure and watch Kubernetes self-heal."}
        </p>
      </div>
    </div>
  );
};

const InteractiveSection = () => {
  const [activeTab, setActiveTab] = useState('chaos');

  return (
    <Section className="bg-neutral-950">
      <RevealOnScroll>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Systems In Action</h2>
          <p className="text-neutral-400">Interactive demonstrations of deployment concepts.</p>
        </div>
      </RevealOnScroll>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex lg:flex-col gap-2 lg:w-64 overflow-x-auto pb-2 lg:pb-0">
          {[
            { id: 'chaos', label: 'Kubernetes Self-Healing', sub: 'Chaos Engineering' },
            { id: 'cicd', label: 'Pipeline Execution', sub: 'CI/CD Flow' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-6 py-4 rounded font-mono text-sm transition-all whitespace-nowrap lg:whitespace-normal ${activeTab === tab.id
                ? 'bg-neutral-800 text-neutral-100 border-l-4 border-blue-500 shadow-lg'
                : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50 border-l-4 border-transparent'
                }`}
            >
              <div className="font-medium">{tab.label}</div>
              <div className="text-xs text-neutral-600 mt-1">{tab.sub}</div>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-neutral-900 rounded-xl border border-neutral-800 min-h-[400px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#404040 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          {activeTab === 'chaos' && <ChaosDemo />}

          {activeTab === 'cicd' && (
            <div className="w-full max-w-lg space-y-4 p-8">
              {[
                { stage: 'Commit', status: 'done', color: 'emerald' },
                { stage: 'Test', status: 'done', color: 'emerald' },
                { stage: 'Build', status: 'running', color: 'blue' },
                { stage: 'Deploy', status: 'pending', color: 'neutral' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 text-sm font-mono text-neutral-400">
                  <span className="w-16 text-right">{step.stage}</span>
                  <div className="h-1.5 flex-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${step.status === 'done' ? 'bg-emerald-500 w-full' :
                        step.status === 'running' ? 'bg-blue-500 w-3/4 animate-pulse' : 'w-0'
                        }`}
                    />
                  </div>
                  {step.status === 'done' && <CheckCircle size={16} className="text-emerald-500" />}
                  {step.status === 'running' && <span className="text-blue-500 text-xs animate-pulse">Running...</span>}
                  {step.status === 'pending' && <div className="w-4 h-4 rounded-full border border-neutral-700" />}
                </div>
              ))}
              <p className="text-center text-neutral-500 font-mono text-xs mt-8 pt-4 border-t border-neutral-800">
                "Automation reduces human error, not responsibility."
              </p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

// ============================================
// PHILOSOPHY SECTION
// ============================================
const BalanceSlider = ({ left, right, value, explanation }) => (
  <div className="mb-6">
    <div className="flex justify-between text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
      <span>{left}</span>
      <span>{right}</span>
    </div>
    <div className="h-2 rounded-full overflow-hidden relative" style={{ background: '#20201F' }}>
      <div
        className="absolute top-0 bottom-0 w-4 transform -translate-x-1/2 rounded-full"
        style={{
          left: `${value}%`,
          background: 'linear-gradient(to right, #35577D, #E0B1CB)',
          boxShadow: '0 0 10px rgba(53, 87, 125, 0.5)'
        }}
      />
    </div>
    <p className="text-xs text-neutral-600 mt-1 italic">{explanation}</p>
  </div>
);

const PhilosophySection = () => (
  <Section className="bg-neutral-900/30 border-t border-neutral-800">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <RevealOnScroll>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Engineering Philosophy</h2>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            Deployment engineering is about trade-offs. I prioritize reliability and operability over feature velocity.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <AlertCircle className="text-orange-400 shrink-0 mt-1" size={18} />
              <span className="text-neutral-300 text-sm">Design for failure. Systems will break—plan the recovery.</span>
            </li>
            <li className="flex items-start gap-3">
              <Activity className="text-blue-400 shrink-0 mt-1" size={18} />
              <span className="text-neutral-300 text-sm">Rollback speed matters more than deployment speed.</span>
            </li>
            <li className="flex items-start gap-3">
              <Cpu className="text-emerald-400 shrink-0 mt-1" size={18} />
              <span className="text-neutral-300 text-sm">Complexity is a liability. Keep the stack boring.</span>
            </li>
          </ul>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <div className="bg-neutral-950 p-8 rounded-xl border border-neutral-800">
          <BalanceSlider left="Dev Speed" right="Stability" value={75} explanation="Stability wins. Fast iteration means nothing if prod is down." />
          <BalanceSlider left="Automation" right="Control" value={80} explanation="Automate the boring parts. Keep humans for decisions." />
          <BalanceSlider left="Cost" right="Redundancy" value={60} explanation="Pay for redundancy. Downtime costs more than servers." />
          <BalanceSlider left="Flexibility" right="Simplicity" value={85} explanation="Simple systems are debuggable systems." />

          <div className="mt-6 pt-4 border-t border-neutral-800 text-center">
            <span className="text-xs font-mono text-neutral-600">CURRENT PHILOSOPHY SETTINGS</span>
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </Section>
);

// ============================================
// FOOTER BUTTONS COMPONENT
// ============================================
const FooterButtons = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/', { state: { scrollToContact: true } });
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center gap-4">
      <button
        onClick={handleContactClick}
        className="px-8 py-3 font-bold rounded transition-all duration-300 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #35577D, #141E30)',
          color: '#ffffff',
        }}
      >
        Download Resume
      </button>
      <button
        onClick={handleContactClick}
        className="px-8 py-3 text-neutral-300 font-medium rounded transition-all duration-300 hover:text-white"
        style={{
          border: '1px solid rgba(53, 87, 125, 0.4)',
          boxShadow: '0 0 20px rgba(53, 87, 125, 0.08)',
        }}
      >
        View GitHub
      </button>
    </div>
  );
};

// ============================================
// FOOTER
// ============================================
const Footer = () => (
  <footer className="py-24 text-center relative overflow-hidden" style={{ background: '#20201F', borderTop: '1px solid rgba(53, 87, 125, 0.2)' }}>
    {/* Background gradient elements */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24" style={{ background: 'linear-gradient(to bottom, rgba(53, 87, 125, 0.5), transparent)' }} />
    <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(224, 177, 203, 0.3), transparent)' }} />

    <div className="max-w-2xl mx-auto px-6 relative">
      <RevealOnScroll>
        <div className="mb-12">
          <div className="relative inline-block mb-6">
            <Server size={48} className="mx-auto" style={{ color: '#35577D' }} />
            <div className="absolute inset-0 blur-xl opacity-30" style={{ background: 'radial-gradient(circle, #35577D, transparent)' }} />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Code Ships.</h2>
          <h2
            className="text-4xl font-bold text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #35577D, #E0B1CB)' }}
          >
            Systems Endure.
          </h2>
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={200}>
        <FooterButtons />
      </RevealOnScroll>

      <div className="mt-16 text-neutral-600 text-sm font-mono">
        © {new Date().getFullYear()} DevOps Engineering Portfolio
      </div>
    </div>
  </footer>
);

// ============================================
// MAIN APP
// ============================================
export default function DeploymentPage() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-neutral-200 overflow-x-hidden" style={{ background: '#20201F' }}>
      <GlobalStyles />
      <FloatingParticles />
      <ScanLineEffect />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md px-6 py-4" style={{ background: 'rgba(32, 32, 31, 0.9)', borderBottom: '1px solid rgba(53, 87, 125, 0.2)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span
            className="font-bold tracking-tight text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #35577D, #E0B1CB)' }}
          >
            DEVOPS
          </span>
        </div>
      </nav>

      <Hero />
      <DeploymentPillars />
      <PipelineSection />
      <InteractiveSection />
      <PhilosophySection />
      <Footer />
    </div>
  );
}