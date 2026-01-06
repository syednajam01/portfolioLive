import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Code2,
    Cpu,
    Network,
    Layers,
    GitBranch,
    Database,
    Terminal,
    ArrowRight,
    Zap,
    CheckCircle2,
    Box,
    Search,
    Share2,
    BrainCircuit,
    Server,
    Layout,
    ChevronDown,
    Minimize2,
    Activity,
    X
} from 'lucide-react';

// --- Utility Components ---

const FadeIn = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => setIsVisible(entry.isIntersecting));
        }, { threshold: 0.1 });
        if (domRef.current) observer.observe(domRef.current);
        return () => {
            if (domRef.current) observer.unobserve(domRef.current);
        };
    }, []);

    return (
        <div
            ref={domRef}
            className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// Animated Counter Component - counts up when scrolled into view
const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const counterRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true);
                        // Parse the numeric value
                        const numericValue = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
                        const startTime = Date.now();

                        const animate = () => {
                            const elapsed = Date.now() - startTime;
                            const progress = Math.min(elapsed / duration, 1);
                            // Easing function for smooth deceleration
                            const easeOut = 1 - Math.pow(1 - progress, 3);
                            setCount(Math.floor(numericValue * easeOut));

                            if (progress < 1) {
                                requestAnimationFrame(animate);
                            } else {
                                setCount(numericValue);
                            }
                        };
                        requestAnimationFrame(animate);
                    }
                });
            },
            { threshold: 0.5 }
        );
        if (counterRef.current) observer.observe(counterRef.current);
        return () => {
            if (counterRef.current) observer.unobserve(counterRef.current);
        };
    }, [value, duration, hasAnimated]);

    return (
        <span ref={counterRef} className="tabular-nums">
            {prefix}{count}{suffix}
        </span>
    );
};

// --- Creative Enhancements ---

const NetworkBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];
            const particleCount = Math.min(Math.floor(width * 0.08), 100); // Limit density

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 2 + 0.5,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;

                // Soft bounce off edges
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(74, 222, 128, 0.3)'; // Emerald-400 with opacity
                ctx.fill();

                // Connect particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(74, 222, 128, ${0.15 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => init();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50 pointer-events-none" />;
};

const SystemTerminal = () => {
    const [logs, setLogs] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const scrollRef = useRef(null);

    useEffect(() => {
        const sequence = [
            { text: "Initializing core systems...", delay: 800 },
            { text: "Loading cognitive modules...", delay: 1500 },
            { text: "Optimizing assets...", delay: 2400 },
            { text: "Fetching portfolio data...", delay: 3200 },
            { text: "System Ready. Welcome.", delay: 4000 },
        ];

        let timeouts = [];
        sequence.forEach(({ text, delay }) => {
            const timeout = setTimeout(() => {
                setLogs(prev => [...prev, `> ${text}`]);
            }, delay);
            timeouts.push(timeout);
        });

        // Auto-minimize after sequence finishes
        const closeTimeout = setTimeout(() => setIsOpen(false), 8000);
        timeouts.push(closeTimeout);

        return () => timeouts.forEach(clearTimeout);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 bg-zinc-900 border border-zinc-800 text-emerald-500 p-2 rounded-full hover:bg-zinc-800 transition-all shadow-lg flex items-center gap-2 px-4 hover:border-emerald-500/50"
            >
                <Terminal size={14} />
                <span className="text-xs font-mono">System Idle</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ml-1"></div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] md:w-80 bg-zinc-950/95 backdrop-blur-md border border-zinc-800 rounded-lg shadow-2xl font-mono text-xs overflow-hidden transition-all duration-300 transform translate-y-0">
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/80 border-b border-zinc-800 text-zinc-400">
                <div className="flex items-center gap-2">
                    <Activity size={12} className="text-emerald-500 animate-pulse" />
                    <span>Boot Sequence</span>
                </div>
                <div className="flex gap-2">
                    <Minimize2 size={12} className="cursor-pointer hover:text-white" onClick={() => setIsOpen(false)} />
                </div>
            </div>
            <div ref={scrollRef} className="h-32 overflow-y-auto p-3 space-y-1 text-zinc-300 font-mono">
                {logs.map((log, i) => (
                    <div key={i} className="opacity-90">{log}</div>
                ))}
                <div className="animate-pulse text-emerald-500">_</div>
            </div>
        </div>
    );
};

// --- Section Components ---

const Hero = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center px-6 relative overflow-hidden bg-zinc-950 text-zinc-100">
            {/* Background Animation */}
            <NetworkBackground />

            {/* Static Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none"></div>

            <div className="max-w-5xl mx-auto w-full z-10 pt-20">
                <FadeIn delay={100}>
                    <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-tight">
                        Software Engineer
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4CA1AF] to-[#928DAB] text-3xl md:text-5xl lg:text-6xl mt-2 font-medium">
                            I build systems that work.
                        </span>
                    </h1>
                </FadeIn>

                <FadeIn delay={300}>
                    <div className="flex flex-col md:flex-row gap-6 md:items-center text-zinc-400 text-lg md:text-xl font-light mb-12 border-l-2 border-[#4CA1AF]/30 pl-6 backdrop-blur-sm">
                        <span className="flex items-center gap-2 group">
                            <BrainCircuit size={20} className="text-[#4CA1AF] group-hover:scale-110 transition-transform" /> DSA in practice
                        </span>
                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                        <span className="flex items-center gap-2 group">
                            <Server size={20} className="text-zinc-400 group-hover:scale-110 transition-transform" /> Backend systems
                        </span>
                        <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
                        <span className="flex items-center gap-2 group">
                            <Cpu size={20} className="text-[#928DAB] group-hover:scale-110 transition-transform" /> ML integration
                        </span>
                    </div>
                </FadeIn>

                <FadeIn delay={500}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="px-8 py-4 bg-white text-zinc-950 font-semibold rounded hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group">
                            See My Approach <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 border border-[#4CA1AF]/30 text-zinc-300 font-medium rounded hover:bg-zinc-900 hover:border-[#4CA1AF]/60 transition-all text-center">
                            View Projects
                        </button>
                    </div>
                </FadeIn>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-600">
                <ChevronDown size={24} />
            </div>
        </section>
    );
};

const CognitiveBlueprint = () => {
    const steps = [
        { label: "Understand the problem", icon: Search },
        { label: "Check constraints", icon: Layers },
        { label: "Pick the data structure", icon: Database },
        { label: "Choose the algorithm", icon: GitBranch },
        { label: "Handle edge cases", icon: check => <div className="font-mono text-xs border border-current px-1 rounded">!null</div> },
        { label: "Optimize if needed", icon: Zap },
        { label: "Ship it", icon: CheckCircle2 },
    ];

    return (
        <section className="py-24 bg-[#0a0a0a] text-zinc-100 border-t border-zinc-800/50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left: Diagram */}
                    <FadeIn>
                        <div className="relative">
                            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#4CA1AF]/20 via-zinc-600/20 to-[#928DAB]/20"></div>
                            <div className="space-y-6">
                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex items-center gap-6 group cursor-default">
                                        <div className="relative z-10 w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-[#4CA1AF] group-hover:border-[#4CA1AF]/50 transition-all duration-300 shadow-xl group-hover:scale-110">
                                            {step.icon && (typeof step.icon === 'function' ? step.icon() : <step.icon size={20} />)}
                                        </div>
                                        <div className="text-zinc-400 group-hover:text-white transition-colors font-mono text-sm tracking-wide">
                                            {step.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>

                    {/* Right: Text */}
                    <div className="space-y-10">
                        <FadeIn delay={200}>
                            <h2 className="text-4xl font-bold mb-6">How I Solve Problems</h2>
                            <div className="space-y-8">
                                <div className="border-l-2 border-[#4CA1AF]/30 pl-6 hover:border-[#4CA1AF] transition-colors duration-500">
                                    <h3 className="text-xl font-semibold text-[#4CA1AF] mb-2">Data structure first</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Before writing code, I decide how to store the data. A hash map vs a tree changes everything about the solution.
                                    </p>
                                </div>

                                <div className="border-l-2 border-zinc-600/30 pl-6 hover:border-zinc-400 transition-colors duration-500">
                                    <h3 className="text-xl font-semibold text-zinc-300 mb-2">Know the limits</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Memory budget? Latency target? Expected load? I ask these before starting, not after things break.
                                    </p>
                                </div>

                                <div className="border-l-2 border-[#928DAB]/30 pl-6 hover:border-[#928DAB] transition-colors duration-500">
                                    <h3 className="text-xl font-semibold text-[#928DAB] mb-2">Keep it efficient</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        I watch for nested loops that shouldn't be there. An O(n²) hiding in your code will hurt you at scale.
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SkillCard = ({ title, items, description, icon: Icon, colorClass }) => (
    <div className="bg-zinc-950 p-8 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl">
        <div className={`w-12 h-12 rounded bg-zinc-900 flex items-center justify-center mb-6 ${colorClass} group-hover:bg-opacity-20 transition-all`}>
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-zinc-100 mb-3">{title}</h3>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed min-h-[60px]">{description}</p>
        <div className="flex flex-wrap gap-2">
            {items.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-500 font-mono group-hover:text-zinc-300 group-hover:border-zinc-700 transition-colors">
                    {item}
                </span>
            ))}
        </div>
    </div>
);

const UnifiedSkills = () => {
    return (
        <section className="py-24 bg-zinc-950 text-zinc-100 relative">
            <div className="max-w-6xl mx-auto px-6">
                <FadeIn>
                    <h2 className="text-4xl font-bold mb-16 text-center">Engineering Toolkit</h2>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FadeIn delay={100}>
                        <SkillCard
                            title="Data Structures"
                            icon={Database}
                            colorClass="text-[#4CA1AF]"
                            description="Trees for hierarchies, hash maps for fast lookups, queues for job processing. I pick what fits the problem."
                            items={["Trees", "Graphs", "Hash Maps", "Queues"]}
                        />
                    </FadeIn>
                    <FadeIn delay={200}>
                        <SkillCard
                            title="Algorithms"
                            icon={GitBranch}
                            colorClass="text-zinc-300"
                            description="BFS for shortest paths, binary search for logs, DP when brute force won't cut it."
                            items={["Search", "Sorting", "DP", "Traversal"]}
                        />
                    </FadeIn>
                    <FadeIn delay={300}>
                        <SkillCard
                            title="Software Engineering"
                            icon={Layout}
                            colorClass="text-[#928DAB]"
                            description="Clean code, proper testing, CI/CD pipelines. Code that other people can actually work with."
                            items={["SOLID", "CI/CD", "Testing", "API Design"]}
                        />
                    </FadeIn>
                    <FadeIn delay={400}>
                        <SkillCard
                            title="ML Integration"
                            icon={Cpu}
                            colorClass="text-[#4CA1AF]"
                            description="Building the pipelines and APIs that connect ML models to production systems."
                            items={["RAG", "Embeddings", "Pipelines", "Python"]}
                        />
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

// Visualizations for DSA Section
const GraphVisual = () => (
    <svg viewBox="0 0 400 200" className="w-full h-full text-zinc-600">
        <line x1="100" y1="100" x2="200" y2="50" stroke="currentColor" strokeWidth="2" />
        <line x1="100" y1="100" x2="200" y2="150" stroke="currentColor" strokeWidth="2" />
        <line x1="200" y1="50" x2="300" y2="100" stroke="currentColor" strokeWidth="2" />
        <line x1="200" y1="150" x2="300" y2="100" stroke="currentColor" strokeWidth="2" />

        <circle cx="100" cy="100" r="15" fill="#4CA1AF" className="animate-pulse" />
        <circle cx="200" cy="50" r="12" fill="#3f3f46" />
        <circle cx="200" cy="150" r="12" fill="#3f3f46" />
        <circle cx="300" cy="100" r="12" fill="#3f3f46" />
    </svg>
);

const TreeVisual = () => (
    <svg viewBox="0 0 400 200" className="w-full h-full text-zinc-600">
        <line x1="200" y1="40" x2="140" y2="100" stroke="currentColor" strokeWidth="2" />
        <line x1="200" y1="40" x2="260" y2="100" stroke="currentColor" strokeWidth="2" />
        <line x1="140" y1="100" x2="110" y2="160" stroke="currentColor" strokeWidth="2" />
        <line x1="140" y1="100" x2="170" y2="160" stroke="currentColor" strokeWidth="2" />
        <line x1="260" y1="100" x2="290" y2="160" stroke="currentColor" strokeWidth="2" />

        <circle cx="200" cy="40" r="12" fill="#3b82f6" className="animate-pulse" />
        <circle cx="140" cy="100" r="10" fill="#3f3f46" />
        <circle cx="260" cy="100" r="10" fill="#3f3f46" />
        <rect x="100" y="150" width="20" height="20" rx="4" fill="#27272a" />
        <rect x="160" y="150" width="20" height="20" rx="4" fill="#27272a" />
        <rect x="280" y="150" width="20" height="20" rx="4" fill="#27272a" />
    </svg>
);

const HashVisual = () => (
    <div className="flex items-center justify-center h-full gap-8">
        <div className="space-y-2">
            <div className="w-24 h-8 bg-zinc-800 rounded flex items-center px-2 text-xs text-zinc-400">"User_123"</div>
            <div className="w-24 h-8 bg-zinc-800 rounded flex items-center px-2 text-xs text-zinc-400">"Session_ID"</div>
            <div className="w-24 h-8 bg-zinc-800 rounded flex items-center px-2 text-xs text-zinc-400">"API_Key"</div>
        </div>
        <div className="flex flex-col gap-2 text-purple-500">
            <ArrowRight size={16} />
            <ArrowRight size={16} />
            <ArrowRight size={16} />
        </div>
        <div className="space-y-2">
            <div className="w-24 h-8 bg-zinc-800 border border-purple-500/30 rounded flex items-center px-2 text-xs text-purple-400 font-mono">0x4F...</div>
            <div className="w-24 h-8 bg-zinc-800 border border-purple-500/30 rounded flex items-center px-2 text-xs text-purple-400 font-mono">0xA1...</div>
            <div className="w-24 h-8 bg-zinc-800 border border-purple-500/30 rounded flex items-center px-2 text-xs text-purple-400 font-mono">0x9B...</div>
        </div>
    </div>
);

const DSAInAction = () => {
    const [activeTab, setActiveTab] = useState('graphs');

    const tabs = {
        graphs: {
            title: "Graphs",
            desc: "Dependency resolution, shortest paths, social networks. I use BFS/DFS regularly.",
            visual: <GraphVisual />,
            color: "text-[#4CA1AF]"
        },
        trees: {
            title: "Trees",
            desc: "DOM manipulation, file systems, database indexes. Binary search trees, tries, heaps.",
            visual: <TreeVisual />,
            color: "text-zinc-300"
        },
        hashing: {
            title: "Hash Maps",
            desc: "O(1) lookups for caching, deduplication, counting. My go-to for most problems.",
            visual: <HashVisual />,
            color: "text-[#928DAB]"
        }
    };

    return (
        <section className="py-24 bg-zinc-900 border-y border-zinc-800 text-zinc-100">
            <div className="max-w-5xl mx-auto px-6">
                <FadeIn>
                    <div className="flex items-center gap-4 mb-12">
                        <h2 className="text-3xl font-bold">DSA in Action</h2>
                        <div className="h-px flex-1 bg-zinc-800"></div>
                        <span className="text-zinc-500 text-sm font-mono">Real-world Application</span>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Tabs */}
                    <div className="md:col-span-4 space-y-2">
                        {Object.entries(tabs).map(([key, data]) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`w-full text-left px-6 py-4 rounded transition-all duration-300 border-l-2 ${activeTab === key
                                    ? `bg-zinc-800/50 ${data.color.replace('text', 'border')} text-white`
                                    : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30"
                                    }`}
                            >
                                <span className="font-semibold block text-lg">{data.title}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Window */}
                    <div className="md:col-span-8 bg-zinc-950 rounded-xl border border-zinc-800 p-8 relative overflow-hidden h-auto min-h-[450px] md:h-[400px] flex flex-col shadow-2xl">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800"></div>

                        <div className="flex-1 flex items-center justify-center p-6 border border-zinc-800/50 rounded bg-zinc-900/20 mb-6 relative min-h-[200px]">
                            {/* Scanline effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-4 animate-[scan_3s_infinite_linear] pointer-events-none"></div>
                            {tabs[activeTab].visual}
                        </div>

                        <div className={`transition-all duration-300 ${tabs[activeTab].color}`}>
                            <h3 className="text-xl font-bold mb-2">{tabs[activeTab].title}</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                {tabs[activeTab].desc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ProjectCard = ({ title, problem, used, design, result, metrics, techDetails }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all duration-500 rounded-lg overflow-hidden hover:shadow-[0_0_30px_rgba(0,0,0,0.6)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-zinc-100 group-hover:text-white transition-colors duration-300">{title}</h3>
                    <ArrowRight className="text-zinc-600 group-hover:text-zinc-300 transition-all duration-300 transform group-hover:translate-x-1" />
                </div>

                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-mono uppercase text-zinc-500 mb-1 block tracking-wider">The Problem</span>
                        <p className="text-zinc-400 text-sm leading-relaxed">{problem}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs font-mono uppercase text-zinc-500 mb-1 block tracking-wider">Logic / DSA</span>
                            <p className="text-zinc-300 text-sm">{used}</p>
                        </div>
                        <div>
                            <span className="text-xs font-mono uppercase text-zinc-500 mb-1 block tracking-wider">System Design</span>
                            <p className="text-zinc-300 text-sm">{design}</p>
                        </div>
                    </div>

                    {/* Metrics with Animated Counters */}
                    {metrics && (
                        <div className="grid grid-cols-3 gap-3 py-4 border-y border-zinc-900">
                            {metrics.map((metric, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-xl font-bold text-zinc-100">
                                        <AnimatedCounter value={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
                                    </div>
                                    <div className="text-xs text-zinc-500 font-mono uppercase tracking-wide">{metric.label}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Hover-Reveal Technical Details */}
                    <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        {techDetails && (
                            <div className="pt-4 border-t border-zinc-900/50">
                                <span className="text-xs font-mono uppercase text-zinc-600 mb-2 block tracking-wider">Technical Details</span>
                                <ul className="space-y-1">
                                    {techDetails.map((detail, idx) => (
                                        <li key={idx} className="text-zinc-400 text-xs flex items-center gap-2">
                                            <span className="w-1 h-1 bg-zinc-600 rounded-full"></span>
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-zinc-900">
                        <span className="text-xs font-mono uppercase text-emerald-500/70 mb-1 block tracking-wider">The Result</span>
                        <p className="text-zinc-200 text-sm font-medium">{result}</p>
                    </div>
                </div>
            </div>

            {/* Subtle hover indicator */}
            <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-zinc-700 to-zinc-600 transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'}`}></div>
        </div>
    );
};

const Projects = () => {
    return (
        <section className="py-24 bg-zinc-950 text-zinc-100">
            <div className="max-w-6xl mx-auto px-6">
                <FadeIn>
                    <h2 className="text-4xl font-bold mb-16">Engineering Work</h2>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FadeIn delay={100}>
                        <ProjectCard
                            title="Cache Layer"
                            problem="DB was getting hammered on reads. Latency spiked during peak hours."
                            used="LRU Cache (Linked List + Hash Map)"
                            design="Write-through with TTL expiry"
                            result="Cut DB load by 40%, p99 latency dropped 200ms."
                            metrics={[
                                { value: 40, suffix: "%", label: "Less DB Load" },
                                { value: 200, suffix: "ms", label: "Latency Down" },
                                { value: 99, suffix: "th", prefix: "p", label: "Percentile" }
                            ]}
                            techDetails={[
                                "Redis cluster, 3-node replication",
                                "Pub/sub for cache invalidation",
                                "Fallback to DB on cache miss"
                            ]}
                        />
                    </FadeIn>
                    <FadeIn delay={200}>
                        <ProjectCard
                            title="Route Optimizer"
                            problem="Delivery trucks were taking inefficient routes, burning fuel and time."
                            used="Dijkstra + Priority Queue"
                            design="gRPC microservice"
                            result="15% shorter total distance."
                            metrics={[
                                { value: 15, suffix: "%", label: "Shorter" },
                                { value: 50, suffix: "ms", label: "Compute" },
                                { value: 1000, suffix: "+", label: "Routes/day" }
                            ]}
                            techDetails={[
                                "Pre-computed graphs for hot routes",
                                "A* for time-critical deliveries",
                                "BFS fallback for sparse areas"
                            ]}
                        />
                    </FadeIn>
                    <FadeIn delay={300}>
                        <ProjectCard
                            title="Event Pipeline"
                            problem="User events were piling up, analytics lagging behind reality."
                            used="Sliding Window + Stream Processing"
                            design="Kafka + Go worker pool"
                            result="10k events/sec, under 50ms lag."
                            metrics={[
                                { value: 10, suffix: "k", label: "Events/sec" },
                                { value: 50, suffix: "ms", label: "Max Lag" },
                                { value: 99.9, suffix: "%", label: "Uptime" }
                            ]}
                            techDetails={[
                                "Partitioned by user_id",
                                "Backpressure with bounded queues",
                                "Dead letter queue for failures"
                            ]}
                        />
                    </FadeIn>
                    <FadeIn delay={400}>
                        <ProjectCard
                            title="Search Autocomplete"
                            problem="Type-ahead was slow, users noticed the delay."
                            used="Trie (Prefix Tree)"
                            design="In-memory with disk snapshots"
                            result="Under 10ms for 1M+ products."
                            metrics={[
                                { value: 10, suffix: "ms", label: "Response" },
                                { value: 1, suffix: "M+", label: "Products" },
                                { value: 5, suffix: "x", label: "Faster" }
                            ]}
                            techDetails={[
                                "Radix tree for memory efficiency",
                                "Bloom filter for non-existent keys",
                                "LRU eviction for cold prefixes"
                            ]}
                        />
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

const Optimization = () => {
    return (
        <section className="py-24 bg-[#0a0a0a] border-t border-zinc-800/50 text-zinc-100">
            <div className="max-w-4xl mx-auto px-6">
                <FadeIn>
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">What I Focus On</h2>
                        <p className="text-zinc-400">The stuff that actually matters in production.</p>
                    </div>
                </FadeIn>

                <div className="space-y-12">
                    {/* Meter 1 */}
                    <FadeIn delay={100}>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-zinc-300">Big O awareness</span>
                                <span className="text-[#4CA1AF]">Always</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#4CA1AF] w-[90%] rounded-full shadow-[0_0_10px_rgba(76,161,175,0.5)]"></div>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">I check for nested loops. An O(n²) will kill you at scale.</p>
                        </div>
                    </FadeIn>

                    {/* Meter 2 */}
                    <FadeIn delay={200}>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-zinc-300">Memory vs Speed</span>
                                <span className="text-zinc-400">Depends</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-zinc-500 w-[75%] rounded-full shadow-[0_0_10px_rgba(100,100,100,0.3)]"></div>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Sometimes a hash map is worth the RAM. Sometimes it's not.</p>
                        </div>
                    </FadeIn>

                    {/* Meter 3 */}
                    <FadeIn delay={300}>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-zinc-300">Readable code</span>
                                <span className="text-[#928DAB]">Non-negotiable</span>
                            </div>
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#928DAB] w-[95%] rounded-full shadow-[0_0_10px_rgba(146,141,171,0.5)]"></div>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">Clever one-liners are fun until someone else has to debug them.</p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
};

const Philosophy = () => {
    return (
        <section className="py-24 bg-zinc-950 text-zinc-100">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <FadeIn>
                    <div className="inline-block p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-8">
                        <Cpu size={32} className="text-zinc-100" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                        Frameworks come and go.<br />
                        <span className="text-zinc-500">Fundamentals don't.</span>
                    </h2>
                </FadeIn>

                <FadeIn delay={200}>
                    <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                        <div className="p-6 border-l border-zinc-800 hover:border-zinc-500 transition-colors">
                            <h4 className="font-bold mb-2 text-zinc-200">Understand the system</h4>
                            <p className="text-sm text-zinc-400">Syntax changes every few years. System design and algorithms don't.</p>
                        </div>
                        <div className="p-6 border-l border-zinc-800 hover:border-zinc-500 transition-colors">
                            <h4 className="font-bold mb-2 text-zinc-200">DSA is practical</h4>
                            <p className="text-sm text-zinc-400">I use graphs and trees on real projects, not just for interview prep.</p>
                        </div>
                        <div className="p-6 border-l border-zinc-800 hover:border-zinc-500 transition-colors">
                            <h4 className="font-bold mb-2 text-zinc-200">ML needs good pipes</h4>
                            <p className="text-sm text-zinc-400">A model is only as good as the data pipeline feeding it.</p>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
};

const Footer = () => {
    const navigate = useNavigate();

    const handleContactClick = () => {
        navigate('/', { state: { scrollToContact: true } });
    };

    return (
        <footer className="py-20 bg-zinc-950 border-t border-zinc-900 text-center relative z-10">
            <FadeIn>
                <p className="text-2xl md:text-3xl font-light text-zinc-300 mb-2">
                    Ship it right.
                </p>
                <p className="text-2xl md:text-3xl font-bold text-white mb-10">
                    Ship it stable.
                </p>

                <div className="flex justify-center gap-6">
                    <button
                        onClick={handleContactClick}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-950 font-bold rounded hover:bg-zinc-200 transition-colors"
                    >
                        <Code2 size={18} /> GitHub
                    </button>
                    <button
                        onClick={handleContactClick}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-medium rounded hover:bg-zinc-800 transition-colors border border-zinc-800"
                    >
                        Get in Touch
                    </button>
                </div>

                <div className="mt-16 text-zinc-600 text-sm">
                    &copy; {new Date().getFullYear()} Syed Najam Ul Huda
                </div>
            </FadeIn>
        </footer>
    );
};

// --- Main App ---

export default function App() {
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="font-sans antialiased bg-[#050505] text-zinc-100 selection:bg-[#4CA1AF]/30">
            <Hero />
            <CognitiveBlueprint />
            <UnifiedSkills />
            <DSAInAction />
            <Projects />
            <Optimization />
            <Philosophy />
            <Footer />
        </div>
    );
}