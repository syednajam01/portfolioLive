import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Network,
  Layers,
  GitBranch,
  Cpu,
  Activity,
  Database,
  ArrowRight,
  Terminal,
  Scale,
  Zap,
  Box,
  ChevronRight,
  Code,
  Eye,
  Server,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';

/**
 * COMPONENT: Global Styles (All CSS in one place)
 */
const GlobalStyles = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Custom Animations */
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes fade-in-up {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      .animate-shimmer { animation: shimmer 2s infinite; }
      .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      
      /* Smooth scrolling */
      html { scroll-behavior: smooth; }
      
      /* Custom selection */
      ::selection { background-color: #404040; color: #ffffff; }
      
      /* Mobile optimizations */
      @media (max-width: 768px) {
        body { overflow-x: hidden; }
        .overflow-x-auto::-webkit-scrollbar { display: none; }
        .overflow-x-auto { -ms-overflow-style: none; scrollbar-width: none; }
        button, a { -webkit-tap-highlight-color: transparent; }
      }
      
      /* Reduce motion for accessibility */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return null;
};

/**
 * HOOK: Scroll Reveal Animation
 */
const useScrollReveal = (options = {}) => {
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
      { threshold: options.threshold || 0.1, rootMargin: options.rootMargin || '0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

/**
 * COMPONENT: Scroll Reveal Wrapper
 */
const RevealOnScroll = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const directions = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${isVisible
        ? 'opacity-100 translate-y-0 translate-x-0'
        : `opacity-0 ${directions[direction]}`
        }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/**
 * COMPONENT: Tech Tooltip (Floating Insight Card)
 */
const TechTooltip = ({ term, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const definitions = {
    'Transformers': 'Attention-based architecture that processes sequences in parallel, enabling contextual understanding across long-range dependencies.',
    'GNNs': 'Graph Neural Networks - specialized for relational data, propagating information across connected nodes.',
    'BM25': 'Best Match 25 - probabilistic ranking function for document retrieval based on term frequency.',
    'SBERT': 'Sentence-BERT - transformer model fine-tuned for semantic similarity in embedding space.',
    'vLLM': 'High-throughput LLM inference engine with PagedAttention for efficient memory management.',
    'TensorRT': 'NVIDIA\'s deep learning inference optimizer and runtime for production deployment.',
    'Quantization': 'Reducing model precision (FP32→INT8) to decrease latency and memory with minimal accuracy loss.',
    'Feature Stores': 'Centralized repository for storing, managing, and serving ML features consistently.',
    'W&B': 'Weights & Biases - experiment tracking platform for ML training visualization and collaboration.',
    'ONNX': 'Open Neural Network Exchange - interoperability format for model portability across frameworks.',
    'Embeddings': 'Dense vector representations that capture semantic meaning in continuous space.',
    'Cross-encoder': 'Model that jointly encodes query-document pairs for precise relevance scoring.'
  };

  const definition = definitions[term];
  if (!definition) return <span className="text-[#928DAB]">{children || term}</span>;

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-[#928DAB] border-b border-dashed border-[#928DAB]/50 cursor-help">
        {children || term}
      </span>
      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-neutral-900 border border-[#928DAB]/50 rounded-sm shadow-xl shadow-[#928DAB]/10 z-50 transition-all duration-200 ${isHovered ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'}`}>
        <div className="text-xs text-neutral-300 leading-relaxed">{definition}</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#928DAB]/50" />
      </div>
    </span>
  );
};

/**
 * COMPONENT: Animated Metric Ring
 */
const MetricRing = ({ value, label, color = 'teal' }) => {
  const [ref, isVisible] = useScrollReveal();
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div ref={ref} className="flex items-center gap-2">
      <svg width="44" height="44" className="transform -rotate-90">
        <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="3" fill="none" className="text-neutral-800" />
        <circle
          cx="22" cy="22" r="18"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className={`text-${color}-500 transition-all duration-1000 ease-out`}
          strokeDasharray={circumference}
          strokeDashoffset={isVisible ? offset : circumference}
        />
      </svg>
      <div>
        <div className="text-sm font-medium text-neutral-200">{value}%</div>
        <div className="text-xs text-neutral-500">{label}</div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: Skill Progress Bar
 */
const SkillBar = ({ skill, level, years, projects, delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between text-xs md:text-sm mb-1">
        <span className="text-neutral-300">{skill}</span>
        <span className="text-neutral-500">{level}%</span>
      </div>
      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#928DAB] to-[#4CA1AF] rounded-full transition-all duration-1000 ease-out"
          style={{
            width: isVisible ? `${level}%` : '0%',
            transitionDelay: `${delay}ms`
          }}
        />
      </div>
      {/* Hover tooltip */}
      <div className={`absolute left-0 bottom-full mb-2 bg-neutral-900 border border-purple-900/50 rounded-sm p-2 shadow-lg shadow-purple-900/10 z-20 transition-all duration-200 ${isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="text-xs text-neutral-400 whitespace-nowrap">
          <span className="text-neutral-200">{years}</span> years • <span className="text-neutral-200">{projects}</span> projects
        </div>
      </div>
    </div>
  );
};

/**
 * UTILITY: 3D Math for Canvas Neural Network (Now Interactive)
 */
const useNeuralNetwork = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const particles = [];
    const particleCount = 70; // Increased count
    const connectionDistance = 160;
    const rotationSpeed = 0.001;

    // Mouse interaction state
    let mouse = { x: -1000, y: -1000 };

    // Initialize 3D particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 0.8,
        y: (Math.random() - 0.5) * height * 0.8,
        z: (Math.random() - 0.5) * width * 0.8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        pulse: Math.random() * Math.PI,
      });
    }

    let angleY = 0;
    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate entire system
      angleY += rotationSpeed;
      const sinY = Math.sin(angleY);
      const cosY = Math.cos(angleY);

      const projectedParticles = particles.map(p => {
        // 1. Mouse Interaction (Repulsion/Attraction Field)
        // Calculate projected 2D position roughly for mouse interaction
        // Note: This is an approximation for performance
        const tempScale = 800 / (800 + p.z + 400);
        const tempX = p.x * tempScale + width / 2;
        const tempY = p.y * tempScale + height / 2;

        const dx = tempX - mouse.x;
        const dy = tempY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // If mouse is close, push particle slightly in 3D space
        if (dist < 200) {
          const force = (200 - dist) / 2000;
          const angle = Math.atan2(dy, dx);
          p.vx += Math.cos(angle) * force * 0.5; // Push away X
          p.vy += Math.sin(angle) * force * 0.5; // Push away Y
          p.pulse += 0.1; // Excite the neuron
        }

        // 2. Physics Update
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        p.pulse += 0.05;

        // Friction to return to calm state
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.vz *= 0.99;

        // Keep slight ambient motion
        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.05;
        if (Math.abs(p.vz) < 0.1) p.vz += (Math.random() - 0.5) * 0.05;

        // Boundary checks (soft bounce)
        const limit = width * 0.5;
        if (Math.abs(p.x) > limit) p.vx *= -1;
        if (Math.abs(p.y) > limit) p.vy *= -1;
        if (Math.abs(p.z) > limit) p.vz *= -1;

        // 3. Rotation Matrix (Y-axis)
        const rx = p.x * cosY - p.z * sinY;
        const rz = p.z * cosY + p.x * sinY;

        // 4. Projection
        const scale = 800 / (800 + rz + 400); // Perspective
        const px = rx * scale + width / 2;
        const py = p.y * scale + height / 2;

        return { x: px, y: py, z: rz, scale, pulse: p.pulse, original: p };
      });

      // Draw Connections
      ctx.lineWidth = 1;
      projectedParticles.forEach((p1, i) => {
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p2 = projectedParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = 1 - (dist / connectionDistance);
            // Simulate signal pulse
            const signal = (Math.sin(p1.pulse) + 1) / 2;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);

            // Dynamic coloring based on "activity"
            const isActive = signal > 0.8;

            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `rgba(150, 140, 180, ${alpha * 0.1})`);
            gradient.addColorStop(0.5, isActive
              ? `rgba(146, 141, 171, ${alpha * 0.6})` // Lavender flash for active connection
              : `rgba(180, 170, 200, ${alpha * 0.1})`);
            gradient.addColorStop(1, `rgba(150, 140, 180, ${alpha * 0.1})`);

            ctx.strokeStyle = gradient;
            ctx.stroke();
          }
        }
      });

      // Draw Nodes
      projectedParticles.forEach(p => {
        const size = Math.max(1, 3 * p.scale + (Math.sin(p.pulse) * 1));
        const alpha = Math.min(1, (p.scale - 0.2) * 2);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 230, 240, ${alpha})`;
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
};

/**
 * COMPONENT: Typewriter Effect
 */
const TypewriterText = ({ text, delay = 0 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        if (index === text.length) clearInterval(interval);
      }, 30); // Typing speed
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return <span>{displayedText}<span className="animate-pulse">_</span></span>;
};

/**
 * COMPONENT: System Telemetry Widget (New Creative Element)
 */
const SystemTelemetry = () => {
  const [stats, setStats] = useState({ latency: 12, memory: 45, drift: 0.02 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        latency: Math.max(10, Math.min(25, prev.latency + (Math.random() - 0.5) * 5)),
        memory: Math.max(40, Math.min(60, prev.memory + (Math.random() - 0.5) * 2)),
        drift: Math.max(0, Math.min(0.1, prev.drift + (Math.random() - 0.5) * 0.01))
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden md:block">
      <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-sm p-3 font-mono text-[10px] text-neutral-500 shadow-2xl w-48">
        <div className="flex justify-between items-center mb-2 border-b border-neutral-800 pb-1">
          <span className="uppercase tracking-widest text-neutral-400">System Status</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>INF_LATENCY</span>
            <span className="text-neutral-300">{stats.latency.toFixed(1)}ms</span>
          </div>
          <div className="flex justify-between">
            <span>VRAM_USAGE</span>
            <span className="text-neutral-300">{stats.memory.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>DATA_DRIFT</span>
            <span className={`${stats.drift > 0.05 ? 'text-amber-500' : 'text-neutral-300'}`}>{stats.drift.toFixed(3)}</span>
          </div>
          <div className="flex justify-between mt-2 pt-1 border-t border-neutral-800 text-neutral-600">
            <span>VERSION</span>
            <span>v2.4.0-rc</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: Section Wrapper
 */
const Section = ({ children, className = "", id = "" }) => (
  <section id={id} className={`w-full py-16 md:py-24 px-4 md:px-12 lg:px-24 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

/**
 * COMPONENT: Project Card (Enhanced with Metrics)
 */
const ProjectCard = ({ title, problem, design, constraint, outcome, metrics }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`group relative bg-neutral-900 border border-neutral-800 p-8 rounded-sm overflow-hidden transition-all duration-500 hover:border-neutral-600 hover:-translate-y-1 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* Hover Effect: "Data Flow" Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-900/20 to-transparent rounded-bl-full transform translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-medium text-neutral-100">{title}</h3>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Activity size={16} className="text-neutral-500" />
          </div>
        </div>

        {/* Metrics visualization */}
        {metrics && (
          <div className="flex flex-wrap gap-4 md:gap-6 mb-6 pb-6 border-b border-neutral-800/50">
            {metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <svg width="36" height="36" className="transform -rotate-90 md:w-10 md:h-10">
                  <circle cx="18" cy="18" r="14" stroke="currentColor" strokeWidth="2" fill="none" className="text-neutral-800" />
                  <circle
                    cx="18" cy="18" r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    className="text-[#928DAB] transition-all duration-1000 ease-out"
                    strokeDasharray={2 * Math.PI * 14}
                    strokeDashoffset={isVisible ? (2 * Math.PI * 14) - (metric.value / 100) * (2 * Math.PI * 14) : 2 * Math.PI * 14}
                  />
                </svg>
                <div>
                  <div className="text-xs md:text-sm font-medium text-neutral-200">{metric.display}</div>
                  <div className="text-[9px] md:text-[10px] text-neutral-500 uppercase tracking-wide">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 md:gap-4">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold pt-1">Problem</span>
            <p className="text-neutral-400 text-sm leading-relaxed">{problem}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 md:gap-4">
            <span className="text-xs uppercase tracking-wider text-[#928DAB] font-semibold pt-1">Design</span>
            <p className="text-neutral-300 text-sm leading-relaxed">{design}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-2 md:gap-4">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold pt-1">Constraint</span>
            <p className="text-neutral-400 text-sm leading-relaxed">{constraint}</p>
          </div>
          <div className="mt-6 pt-4 border-t border-neutral-800">
            <span className="text-xs uppercase tracking-wider text-neutral-500 font-semibold block mb-2">Outcome</span>
            <p className="text-neutral-200 font-medium">{outcome}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: Balance Bar
 */
const BalanceBar = ({ left, right, value, explanation }) => (
  <div className="mb-8">
    <div className="flex justify-between text-sm text-neutral-400 mb-2 uppercase tracking-wide font-medium">
      <span>{left}</span>
      <span>{right}</span>
    </div>
    <div className="h-1 w-full bg-neutral-800 relative rounded-full overflow-hidden group cursor-help">
      <div
        className="absolute top-0 bottom-0 w-12 bg-gradient-to-r from-[#928DAB] to-[#4CA1AF] rounded-full opacity-80 transition-all duration-300 group-hover:opacity-100 group-hover:w-16"
        style={{ left: `${value}%`, transform: 'translateX(-50%)' }}
      />
    </div>
    <p className="mt-2 text-xs text-neutral-500 italic">{explanation}</p>
  </div>
);

/**
 * MAIN PAGE
 */
export default function AIPlanningPage() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  useNeuralNetwork(canvasRef);

  const [activeStep, setActiveStep] = useState(0);
  const [activeViz, setActiveViz] = useState('network');

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactClick = () => {
    navigate('/', { state: { scrollToContact: true } });
  };

  const steps = [
    { title: "Problem Definition", desc: "Good solutions start with understanding the problem. I focus on what needs to be solved before choosing tools." },
    { title: "Data Quality", desc: "The quality of your data determines the quality of your results. I always audit for gaps and inconsistencies first." },
    { title: "Feature Engineering", desc: "How you represent information matters. I invest time in thoughtful feature design rather than relying on raw inputs." },
    { title: "Model Selection", desc: "Different problems need different approaches. I choose architectures that fit the task, not the trends." },
    { title: "Production Deployment", desc: "A model is only useful if it runs reliably. I build with latency, cost, and stability in mind." }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 font-sans selection:bg-neutral-700 selection:text-white overflow-x-hidden">



      {/* 1. HERO SECTION */}
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-40 cursor-crosshair"
        />
        <div className="relative z-10 text-center max-w-4xl px-6 pointer-events-none">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">
            <span className="text-[#928DAB]">AI</span> Engineer
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#928DAB] to-transparent mx-auto mb-6" />
          <h2 className="text-xl md:text-2xl text-neutral-400 font-light mb-12 h-8">
            <TypewriterText text="Building Practical Machine Learning Systems" delay={500} />
          </h2>

          <div className="flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm text-neutral-500 uppercase tracking-widest font-medium opacity-80">
            <span>Architecture over hype</span>
            <span>Data quality over quantity</span>
            <span>Production ready solutions</span>
          </div>

          <button onClick={() => document.getElementById('blueprint').scrollIntoView({ behavior: 'smooth' })} className="pointer-events-auto mt-10 md:mt-16 px-6 md:px-8 py-2.5 md:py-3 border border-[#928DAB]/50 hover:border-[#928DAB]/80 hover:text-[#928DAB] hover:shadow-lg hover:shadow-[#928DAB]/20 transition-all text-xs md:text-sm uppercase tracking-wide rounded-sm group bg-neutral-950/50 backdrop-blur-sm">
            See How I Design
            <ArrowRight className="inline ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. COGNITIVE BLUEPRINT */}
      <Section id="blueprint" className="border-t border-neutral-900 bg-neutral-950">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="relative">
            <h3 className="text-2xl text-white font-medium mb-12 flex items-center gap-3">
              <Brain className="text-neutral-600" size={24} />
              The Cognitive Blueprint
            </h3>
            <div className="space-y-0 relative border-l border-neutral-800 ml-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`pl-8 py-6 relative cursor-pointer transition-all duration-500 group ${activeStep === idx ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  onMouseEnter={() => setActiveStep(idx)}
                >
                  <div className={`absolute left-[-5px] top-8 w-2.5 h-2.5 rounded-full border border-neutral-950 transition-all duration-300 ${activeStep === idx ? 'bg-neutral-200 scale-125 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-neutral-800 group-hover:bg-neutral-600'}`} />
                  <h4 className="text-lg font-medium text-neutral-200 mb-1">{step.title}</h4>
                  <div className={`overflow-hidden transition-all duration-500 ${activeStep === idx ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <p className="text-neutral-400 leading-relaxed text-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center lg:justify-start">
            <div className="bg-neutral-900/30 p-6 md:p-12 w-full aspect-square md:aspect-auto md:h-full border border-neutral-800/50 flex flex-col justify-center items-center text-center backdrop-blur-sm transition-all duration-500 relative overflow-hidden">
              {/* Background effect for active step */}
              <div className="absolute inset-0 bg-gradient-to-tr from-neutral-800/20 to-transparent opacity-50" />

              <div key={activeStep} className="mb-4 md:mb-6 p-4 md:p-6 bg-neutral-900 rounded-full border border-neutral-800 animate-in zoom-in duration-300 relative z-10">
                {activeStep === 0 && <Brain size={36} className="text-neutral-300 md:w-12 md:h-12" />}
                {activeStep === 1 && <Database size={36} className="text-neutral-300 md:w-12 md:h-12" />}
                {activeStep === 2 && <Layers size={36} className="text-neutral-300 md:w-12 md:h-12" />}
                {activeStep === 3 && <Network size={36} className="text-neutral-300 md:w-12 md:h-12" />}
                {activeStep === 4 && <RocketIcon />}
              </div>
              <p className="text-lg md:text-2xl font-light text-neutral-300 max-w-sm leading-snug relative z-10">
                "{steps[activeStep].desc.split('.')[0]}."
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. AI ENGINEERING STACK */}
      <Section className="bg-neutral-900/30">
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-16">
            <div>
              <h3 className="text-2xl text-white font-medium mb-2">Engineering Stack</h3>
              <p className="text-neutral-500">Systems, not just tools.</p>
            </div>
          </div>
        </RevealOnScroll>

        {/* Skill Proficiency Section */}
        <RevealOnScroll delay={100}>
          <div className="mb-16 p-6 bg-neutral-950/50 border border-neutral-800 rounded-sm">
            <h4 className="text-sm uppercase tracking-wider text-neutral-500 font-semibold mb-6">Core Proficiencies</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <SkillBar skill="PyTorch / Deep Learning" level={92} years={3} projects={8} delay={0} />
              <SkillBar skill="Transformer Architectures" level={88} years={2} projects={5} delay={100} />
              <SkillBar skill="MLOps & Model Serving" level={85} years={2} projects={6} delay={200} />
              <SkillBar skill="Data Engineering" level={80} years={3} projects={7} delay={300} />
              <SkillBar skill="Computer Vision" level={78} years={2} projects={4} delay={400} />
              <SkillBar skill="NLP / LLMs" level={85} years={2} projects={5} delay={500} />
            </div>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <Database className="w-6 h-6" />,
              title: "Data Systems",
              role: "Infrastructure",
              desc: "Managing data versions, tracking origins, and monitoring changes over time.",
              tech: ["dbt", "Airflow", "Feature Stores"]
            },
            {
              icon: <Network className="w-6 h-6" />,
              title: "Architectures",
              role: "Model Design",
              desc: "Picking the right structure for each problem. Sequence tasks, graph data, images.",
              tech: ["PyTorch", "Transformers", "GNNs"]
            },
            {
              icon: <Activity className="w-6 h-6" />,
              title: "Training",
              role: "Optimization",
              desc: "Running experiments, tuning hyperparameters, and ensuring stable training runs.",
              tech: ["W&B", "Distributed Training"]
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Inference",
              role: "Delivery",
              desc: "Making models fast and efficient. Reducing size while keeping accuracy.",
              tech: ["ONNX", "TensorRT", "vLLM"]
            },
            {
              icon: <Code className="w-6 h-6" />,
              title: "Integration",
              role: "Application",
              desc: "Connecting models to real software. Building reliable APIs that handle edge cases.",
              tech: ["FastAPI", "gRPC", "Docker"]
            },
            {
              icon: <Scale className="w-6 h-6" />,
              title: "Evaluation",
              role: "Validation",
              desc: "Measuring what actually matters for the business, not just academic benchmarks.",
              tech: ["Evidently", "Custom Metrics"]
            }
          ].map((card, i) => (
            <RevealOnScroll key={i} delay={i * 100}>
              <div className="bg-neutral-950 border border-neutral-800 p-6 hover:border-neutral-600 transition-all duration-300 flex flex-col group hover:-translate-y-1 h-full">
                <div className="text-neutral-400 mb-4 group-hover:text-white transition-colors">{card.icon}</div>
                <h4 className="text-lg text-neutral-200 font-medium mb-1">{card.title}</h4>
                <span className="text-xs uppercase text-neutral-600 font-bold tracking-wider mb-4">{card.role}</span>
                <p className="text-neutral-400 text-sm mb-6 flex-grow leading-relaxed">{card.desc}</p>
                <div className="pt-4 border-t border-neutral-900 text-xs text-neutral-500 font-mono flex items-center gap-2 flex-wrap">
                  <Terminal size={12} />
                  {card.tech.map((t, idx) => (
                    <span key={idx}>
                      <TechTooltip term={t}>{t}</TechTooltip>
                      {idx < card.tech.length - 1 && <span className="text-neutral-700">, </span>}
                    </span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </Section>

      {/* 4. AI IN ACTION (Visual Tabs) */}
      <Section>
        <h3 className="text-2xl text-white font-medium mb-12 flex items-center gap-3">
          <Eye className="text-neutral-600" size={24} />
          How It Works
        </h3>

        <div className="flex flex-col lg:flex-row border border-neutral-800 min-h-[500px] lg:h-[600px] bg-neutral-900 rounded-sm overflow-hidden">
          {/* Controls */}
          <div className="w-full lg:w-1/3 border-b lg:border-b-0 lg:border-r border-neutral-800 bg-neutral-950 p-4 md:p-8 flex flex-row lg:flex-col justify-start lg:justify-center gap-4 lg:gap-0 lg:space-y-6 overflow-x-auto">
            {[
              { id: 'network', label: 'Neural Networks', sub: 'How Models Learn' },
              { id: 'rep', label: 'Data Representation', sub: 'Reducing Complexity' },
              { id: 'decision', label: 'Decision Making', sub: 'Turning Output Into Action' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveViz(tab.id)}
                className={`text-left group transition-all duration-300 whitespace-nowrap lg:whitespace-normal ${activeViz === tab.id ? 'lg:pl-4 lg:border-l-2 border-neutral-200' : 'lg:pl-0 lg:border-l-2 border-transparent opacity-50 hover:opacity-80'}`}
              >
                <div className="text-sm lg:text-lg text-neutral-200 font-medium">{tab.label}</div>
                <div className="text-[10px] lg:text-xs text-neutral-500 uppercase tracking-wide mt-0.5 lg:mt-1 hidden lg:block">{tab.sub}</div>
              </button>
            ))}
          </div>

          {/* Visualization Area */}
          <div className="w-full lg:w-2/3 relative overflow-hidden flex items-center justify-center p-6 md:p-12 bg-neutral-900 min-h-[350px]">

            {activeViz === 'network' && (
              <div className="text-center animate-in fade-in duration-700">
                <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
                  {/* Input Layer */}
                  <div className="flex flex-col gap-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="relative">
                        <div className="w-5 h-5 rounded-full bg-neutral-700 border border-neutral-600" />
                        <div
                          className="absolute inset-0 w-5 h-5 rounded-full bg-teal-500/50 animate-ping"
                          style={{ animationDelay: `${i * 300}ms`, animationDuration: '2s' }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Animated Connections 1 */}
                  <div className="relative w-12 md:w-20">
                    <svg className="w-full h-24 overflow-visible">
                      {[0, 1, 2].map(i => (
                        <g key={i}>
                          <line x1="0" y1={i * 24 + 12} x2="100%" y2="24" stroke="#525252" strokeWidth="1" strokeDasharray="4 2" />
                          <circle r="2" fill="#928DAB" className="animate-pulse">
                            <animateMotion dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite">
                              <mpath xlinkHref={`#path${i}`} />
                            </animateMotion>
                          </circle>
                        </g>
                      ))}
                    </svg>
                  </div>

                  {/* Hidden Layer */}
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="relative">
                        <div className="w-4 h-4 rounded-full bg-neutral-600 border border-neutral-500" />
                        <div
                          className="absolute inset-0 w-4 h-4 rounded-full bg-white/20 animate-pulse"
                          style={{ animationDelay: `${i * 200 + 500}ms` }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Animated Connections 2 */}
                  <div className="w-12 md:w-20 flex items-center justify-center">
                    <ChevronRight className="text-neutral-500 animate-pulse" />
                  </div>

                  {/* Output */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#928DAB]" />
                    <div className="absolute inset-0 w-8 h-8 rounded-full bg-[#928DAB]/30 animate-ping" style={{ animationDuration: '1.5s' }} />
                  </div>
                </div>
                <p className="text-neutral-400 max-w-md mx-auto text-sm">
                  Neural networks map inputs to outputs through learned transformations. Each connection carries learned weights.
                </p>
              </div>
            )}

            {activeViz === 'rep' && (
              <div className="text-center animate-in fade-in duration-700 w-full max-w-lg">
                <div className="flex items-center justify-center gap-4 md:gap-8 mb-8">
                  {/* High Dimensional Data */}
                  <div className="border border-neutral-800 p-4 rounded bg-neutral-950">
                    <div className="text-xs text-neutral-500 mb-3">High Dimension</div>
                    <div className="grid grid-cols-4 gap-1">
                      {Array(16).fill(0).map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-neutral-500 rounded-sm animate-pulse"
                          style={{ animationDelay: `${i * 50}ms`, opacity: 0.3 + Math.random() * 0.5 }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Compression Animation */}
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="text-[#928DAB] animate-pulse" />
                    <span className="text-[10px] text-neutral-600">compress</span>
                  </div>

                  {/* Low Dimensional Embedding */}
                  <div className="border border-[#928DAB]/50 p-4 rounded bg-neutral-950 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#928DAB]/20 to-transparent" />
                    <div className="text-xs text-[#928DAB] mb-3 relative">Embedding</div>
                    <div className="grid grid-cols-2 gap-2 relative">
                      {[0.82, 0.41, 0.67, 0.23].map((val, i) => (
                        <div key={i} className="text-[10px] font-mono text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded">
                          {val}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm">
                  Good representations compress noise and preserve signal, making downstream tasks tractable.
                </p>
              </div>
            )}

            {activeViz === 'decision' && (
              <div className="text-center animate-in fade-in duration-700 w-full max-w-md">
                <div className="flex flex-col items-center gap-3 mb-8">
                  {/* Model Output */}
                  <div className="bg-neutral-800 px-5 py-2.5 rounded border border-neutral-700">
                    <span className="text-xs text-neutral-500 mr-2">P(action)</span>
                    <span className="text-lg font-mono text-cyan-400">0.87</span>
                  </div>

                  {/* Animated Flow Line */}
                  <div className="h-6 w-px bg-gradient-to-b from-neutral-700 to-[#928DAB] relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#928DAB] animate-bounce" style={{ animationDuration: '1s' }} />
                  </div>

                  {/* Threshold */}
                  <div className="border border-dashed border-neutral-600 px-6 py-3 rounded flex items-center gap-3">
                    <span className="text-neutral-400 text-sm">Threshold</span>
                    <span className="font-mono text-neutral-300">{'>'} 0.8</span>
                    <span className="text-cyan-400">✓</span>
                  </div>

                  {/* Flow Line */}
                  <div className="h-6 w-px bg-gradient-to-b from-[#928DAB] to-[#4CA1AF] relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#4CA1AF] animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.5s' }} />
                  </div>

                  {/* Action */}
                  <div className="bg-white text-neutral-900 px-6 py-2 rounded font-medium shadow-lg shadow-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                    <span className="relative">Execute Action</span>
                  </div>
                </div>
                <p className="text-neutral-400 text-sm">
                  Predictions become actions through decision logic. The system must know when to act—and when to abstain.
                </p>
              </div>
            )}

          </div>
        </div>
      </Section>

      {/* 5. PROJECTS */}
      <Section className="bg-neutral-950">
        <h3 className="text-2xl text-white font-medium mb-12 flex items-center gap-3">
          <Server className="text-neutral-600" size={24} />
          Systems Built
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProjectCard
            title="Real-time Anomaly Detection"
            problem="High-frequency financial data with non-stationary distribution (concept drift)."
            design="Autoencoder architecture with online learning window."
            constraint="Sub-20ms inference latency required for transaction blocking."
            outcome="Detected 94% of fraud patterns with <0.1% false positive rate."
            metrics={[
              { value: 94, display: '94%', label: 'Detection' },
              { value: 95, display: '<20ms', label: 'Latency' },
              { value: 99, display: '0.1%', label: 'FP Rate' }
            ]}
          />
          <ProjectCard
            title="Semantic Search Engine"
            problem="Keyword search failed on technical documentation with distinct jargon."
            design="Hybrid retrieval: Sparse (BM25) + Dense (SBERT) with cross-encoder re-ranking."
            constraint="Low memory footprint for on-premise deployment."
            outcome="Improved retrieval relevance (nDCG) by 40% over elasticsearch default."
            metrics={[
              { value: 40, display: '+40%', label: 'nDCG Gain' },
              { value: 75, display: '2GB', label: 'Memory' }
            ]}
          />
          <ProjectCard
            title="Autonomous Agent Framework"
            problem="LLM hallucinations in multi-step reasoning tasks."
            design="Chain-of-Thought prompting constrained by formal logic verifiers."
            constraint="Must utilize smaller, open-source models (Llama-3-8B) for cost."
            outcome="Achieved GPT-4 parity on domain-specific reasoning tasks at 1/10th cost."
            metrics={[
              { value: 90, display: '90%', label: 'GPT-4 Parity' },
              { value: 90, display: '1/10x', label: 'Cost' }
            ]}
          />
          <ProjectCard
            title="Edge Vision Pipeline"
            problem="Detecting defects in manufacturing on hardware with no GPU."
            design="MobileNetV3 backbone optimized with quantization-aware training."
            constraint="Raspberry Pi 4 deployment target."
            outcome="30 FPS real-time processing with 99.2% accuracy."
            metrics={[
              { value: 99, display: '99.2%', label: 'Accuracy' },
              { value: 100, display: '30 FPS', label: 'Speed' }
            ]}
          />
        </div>
      </Section>

      {/* 6. TRADE-OFFS */}
      <Section className="bg-neutral-900/20 py-16">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl text-white font-medium mb-10 text-center">Engineering Trade-offs</h3>

          <BalanceBar
            left="Accuracy"
            right="Latency"
            value={70}
            explanation="Sometimes a slightly less accurate model that responds 50% faster is the right choice."
          />
          <BalanceBar
            left="Complexity"
            right="Maintainability"
            value={80}
            explanation="A simpler solution that my team can maintain beats a complex one nobody understands."
          />
          <BalanceBar
            left="Generalization"
            right="Specialization"
            value={60}
            explanation="Focused models built for a specific task often outperform general purpose ones."
          />
        </div>
      </Section>

      {/* 7. PHILOSOPHY & FOOTER */}
      <Section className="text-center py-32">
        <div className="max-w-3xl mx-auto mb-24">
          <p className="text-3xl md:text-4xl font-light text-neutral-300 leading-tight mb-8">
            "Good engineering is about <br />
            <span className="text-white font-normal">making the right trade-offs.</span>"
          </p>
          <p className="text-neutral-500 text-lg">
            I build machine learning systems that actually work in the real world,<br /> not just in notebooks.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 items-center border-t border-neutral-900 pt-16">
          <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <GitBranch size={18} />
            <span>GitHub</span>
          </button>
          <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <Terminal size={18} />
            <span>Resume</span>
          </button>
          <button
            onClick={handleContactClick}
            className="px-6 py-2 bg-neutral-200 text-neutral-950 font-medium rounded-sm hover:bg-white transition-colors"
          >
            Discuss Systems
          </button>
        </div>

        <div className="mt-16 text-neutral-700 text-sm">
          &copy; {new Date().getFullYear()} AI Engineering Portfolio
        </div>
      </Section>

    </div>
  );
}

// Simple icon component helper
const RocketIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-neutral-300"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);