import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// ============================================
// HOME PAGE - React Version
// Preserves all Three.js animations from home.html
// ============================================

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const animationRef = useRef(null);
    const cleanupRef = useRef([]);
    const navigateRef = useRef(navigate);
    navigateRef.current = navigate;

    // Scroll to contact section if navigated with scrollToContact state
    useEffect(() => {
        if (location.state?.scrollToContact) {
            // Small delay to ensure page is fully rendered
            setTimeout(() => {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
            // Clear the state to prevent re-scrolling on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        // Wait for Three.js and GSAP to load
        const initScene = () => {
            if (!window.THREE || !window.gsap || !window.ScrollTrigger) {
                setTimeout(initScene, 100);
                return;
            }

            const THREE = window.THREE;
            const gsap = window.gsap;
            const ScrollTrigger = window.ScrollTrigger;

            gsap.registerPlugin(ScrollTrigger);

            const canvas = canvasRef.current;
            if (!canvas) return;

            // --- 1. SETUP ---
            const scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(0x050505, 0.02);
            sceneRef.current = scene;

            const sizes = {
                width: window.innerWidth,
                height: window.innerHeight
            };

            const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
            camera.position.z = 5;
            scene.add(camera);

            const renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                antialias: true,
                alpha: true
            });
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // --- 2. OBJECTS ---

            // === HERO GROUP ===
            const heroGroup = new THREE.Group();
            scene.add(heroGroup);

            const coreGeo = new THREE.IcosahedronGeometry(1, 1);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0x4CA1AF, wireframe: true, transparent: true, opacity: 0.3 });
            const core = new THREE.Mesh(coreGeo, coreMat);
            heroGroup.add(core);

            const innerCoreGeo = new THREE.IcosahedronGeometry(0.5, 0);
            const innerCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 });
            const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
            const coreLight = new THREE.PointLight(0x4CA1AF, 2, 10);
            innerCore.add(coreLight);
            heroGroup.add(innerCore);

            const cageGeo = new THREE.BoxGeometry(2.5, 2.5, 2.5);
            const cageEdges = new THREE.EdgesGeometry(cageGeo);
            const cageMat = new THREE.LineBasicMaterial({ color: 0x928DAB, transparent: true, opacity: 0.1 });
            const cage = new THREE.LineSegments(cageEdges, cageMat);
            heroGroup.add(cage);

            const particlesGeo = new THREE.BufferGeometry();
            const particlesCount = 1000;
            const posArray = new Float32Array(particlesCount * 3);
            for (let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 8;
            }
            particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMat = new THREE.PointsMaterial({
                size: 0.02,
                color: 0x4CA1AF,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            const heroParticles = new THREE.Points(particlesGeo, particlesMat);
            heroGroup.add(heroParticles);

            // === EVOLUTION OBJECT (3x3x3 Data Cube) ===
            const evoGroup = new THREE.Group();
            evoGroup.visible = false;
            evoGroup.position.set(2.5, 0, 0);
            evoGroup.scale.set(0, 0, 0);
            scene.add(evoGroup);

            const cubeSegmentGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
            const cubeSegmentMat = new THREE.MeshPhysicalMaterial({
                color: 0xffd700,
                emissive: 0x442200,
                metalness: 0.9,
                roughness: 0.1,
                clearcoat: 1.0,
                transparent: true,
                opacity: 1
            });

            const segments = [];
            const offset = 0.4;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    for (let z = -1; z <= 1; z++) {
                        const seg = new THREE.Mesh(cubeSegmentGeo, cubeSegmentMat);
                        const px = x * offset;
                        const py = y * offset;
                        const pz = z * offset;
                        seg.position.set(px, py, pz);
                        seg.userData.originalPos = new THREE.Vector3(px, py, pz);
                        seg.userData.expandedPos = new THREE.Vector3(px * 3, py * 3, pz * 3);

                        const edges = new THREE.EdgesGeometry(cubeSegmentGeo);
                        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.3 }));
                        seg.add(line);

                        evoGroup.add(seg);
                        segments.push(seg);
                    }
                }
            }

            const evoLight = new THREE.PointLight(0xffaa00, 2, 10);
            evoLight.position.set(2, 2, 5);
            evoGroup.add(evoLight);
            const evoRimLight = new THREE.PointLight(0x4CA1AF, 1, 10);
            evoRimLight.position.set(-2, -2, -2);
            evoGroup.add(evoRimLight);

            // === PILLARS GROUP ===
            const pillarsGroup = new THREE.Group();
            pillarsGroup.visible = false;
            pillarsGroup.position.y = -5;
            scene.add(pillarsGroup);

            const pillarGeo = new THREE.CylinderGeometry(0.4, 0.4, 3.5, 32);
            const pillarCapGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);

            function createPillar(color, xPos, id) {
                const group = new THREE.Group();
                const mat = new THREE.MeshPhongMaterial({
                    color: 0x111111,
                    emissive: color,
                    emissiveIntensity: 0.2,
                    shininess: 100
                });
                const shaft = new THREE.Mesh(pillarGeo, mat);
                group.add(shaft);

                const ringGeo = new THREE.TorusGeometry(0.45, 0.02, 16, 32);
                const ringMat = new THREE.MeshBasicMaterial({ color: color });

                const topRing = new THREE.Mesh(ringGeo, ringMat);
                topRing.rotation.x = Math.PI / 2;
                topRing.position.y = 1.5;
                group.add(topRing);

                const botRing = new THREE.Mesh(ringGeo, ringMat);
                botRing.rotation.x = Math.PI / 2;
                botRing.position.y = -1.5;
                group.add(botRing);

                const cap = new THREE.Mesh(pillarCapGeo, mat);
                cap.position.y = 1.85;
                group.add(cap);

                group.position.x = xPos;
                group.userData = { id: id, baseColor: color };
                return group;
            }

            const p1 = createPillar(0x4CA1AF, -2.8, 'ai');
            const p2 = createPillar(0x928DAB, 0, 'sw');
            const p3 = createPillar(0x2C5364, 2.8, 'dsa');
            pillarsGroup.add(p1, p2, p3);

            const pillarsLight = new THREE.DirectionalLight(0xffffff, 1);
            pillarsLight.position.set(0, 5, 5);
            pillarsGroup.add(pillarsLight);

            // --- 3. LOGIC & INTERACTION ---
            let mouseX = 0;
            let mouseY = 0;
            const raycaster = new THREE.Raycaster();
            const pointer = new THREE.Vector2();

            const handleMouseMove = (event) => {
                mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
                mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
                pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
                pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
            };
            document.addEventListener('mousemove', handleMouseMove);
            cleanupRef.current.push(() => document.removeEventListener('mousemove', handleMouseMove));

            let isExploded = false;

            const handleClick = () => {
                raycaster.setFromCamera(pointer, camera);

                if (evoGroup.visible) {
                    const intersects = raycaster.intersectObjects(evoGroup.children, true);
                    if (intersects.length > 0) {
                        isExploded = !isExploded;
                        segments.forEach(seg => {
                            const target = isExploded ? seg.userData.expandedPos : seg.userData.originalPos;
                            if (isExploded) {
                                gsap.to(seg.position, { x: target.x, y: target.y, z: target.z, duration: 1, ease: "elastic.out(1, 0.5)" });
                                gsap.to(seg.rotation, { x: Math.random() * Math.PI, y: Math.random() * Math.PI, duration: 1 });
                            } else {
                                gsap.to(seg.position, { x: target.x, y: target.y, z: target.z, duration: 1.2, ease: "power3.inOut" });
                                gsap.to(seg.rotation, { x: 0, y: 0, z: 0, duration: 1.2, ease: "power2.out" });
                            }
                        });
                        return;
                    }
                }

                if (pillarsGroup.visible) {
                    const intersectsPillars = raycaster.intersectObjects(pillarsGroup.children, true);
                    if (intersectsPillars.length > 0) {
                        let obj = intersectsPillars[0].object;
                        while (obj.parent !== pillarsGroup && obj.parent !== null) {
                            obj = obj.parent;
                        }
                        const pid = obj.userData.id;
                        if (pid === 'ai') navigateRef.current('/ai');
                        if (pid === 'sw') navigateRef.current('/software');
                        if (pid === 'dsa') navigateRef.current('/devops');
                    }
                }
            };
            document.addEventListener('click', handleClick);
            cleanupRef.current.push(() => document.removeEventListener('click', handleClick));

            function resetEvoState() {
                isExploded = false;
                segments.forEach(seg => {
                    gsap.killTweensOf(seg.position);
                    gsap.killTweensOf(seg.rotation);
                    seg.position.copy(seg.userData.originalPos);
                    seg.rotation.set(0, 0, 0);
                });
                evoGroup.scale.set(0, 0, 0);
            }
            const clock = new THREE.Clock();
            let evoBaseRotation = 0;
            let ticking = false;
            let cubeAnimating = false;
            let lastCubeState = false; // Track the last intended state

            const updateVisibility = () => {
                const scrollY = window.scrollY;
                const h = window.innerHeight;
                // Cube appears AFTER hero ends (0.85*h) and disappears BEFORE pillars (1.6*h)
                const shouldShowCube = (scrollY > h * 0.85) && (scrollY < h * 1.6);

                // Only animate if the desired state changed
                if (shouldShowCube !== lastCubeState) {
                    lastCubeState = shouldShowCube;

                    // Kill any running animation on the cube scale
                    gsap.killTweensOf(evoGroup.scale);
                    cubeAnimating = true;

                    if (shouldShowCube) {
                        evoGroup.visible = true;
                        gsap.to(evoGroup.scale, {
                            x: 1, y: 1, z: 1, duration: 0.6, ease: "power2.out",
                            onComplete: () => { cubeAnimating = false; }
                        });
                    } else {
                        gsap.to(evoGroup.scale, {
                            x: 0, y: 0, z: 0, duration: 0.4, ease: "power2.in",
                            onComplete: () => {
                                evoGroup.visible = false;
                                cubeAnimating = false;
                                if (isExploded) resetEvoState();
                            }
                        });
                    }
                }

                // Pillars appear after cube has started disappearing
                const pillarsVisible = (scrollY > h * 1.8);
                if (pillarsVisible !== pillarsGroup.visible) {
                    pillarsGroup.visible = pillarsVisible;
                }
                ticking = false;
            };

            const handleScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateVisibility);
                    ticking = true;
                }
            };
            window.addEventListener('scroll', handleScroll, { passive: true });
            cleanupRef.current.push(() => window.removeEventListener('scroll', handleScroll));

            const tick = () => {
                const elapsedTime = clock.getElapsedTime();
                updateVisibility();

                // Hero Animation
                heroGroup.rotation.y += 0.002;
                heroGroup.rotation.x += (mouseY - heroGroup.rotation.x) * 0.05;
                heroGroup.rotation.y += (mouseX - heroGroup.rotation.y) * 0.05;
                core.rotation.x += 0.01;
                core.rotation.y += 0.01;
                cage.rotation.z -= 0.005;

                // Evolution Object Animation
                if (evoGroup.visible) {
                    evoBaseRotation += 0.005;
                    const targetRotX = mouseY * 1.5;
                    const targetRotY = evoBaseRotation + (mouseX * 1.5);
                    evoGroup.rotation.x += (targetRotX - evoGroup.rotation.x) * 0.05;
                    evoGroup.rotation.y += (targetRotY - evoGroup.rotation.y) * 0.05;
                    evoGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.1;
                }

                // Pillars Animation
                if (pillarsGroup.visible) {
                    raycaster.setFromCamera(pointer, camera);
                    const intersects = raycaster.intersectObjects(pillarsGroup.children, true);
                    const isMobileView = window.innerWidth < 768;

                    if (isMobileView) {
                        const scrollY = window.scrollY;
                        const h = window.innerHeight;
                        const coreStart = h * 1.75;
                        const pillarHeight = h * 0.8;
                        const scrollInCore = Math.max(0, scrollY - coreStart);
                        const activePillarIndex = Math.min(2, Math.max(0, Math.floor(scrollInCore / pillarHeight)));

                        [p1, p2, p3].forEach((p, i) => {
                            const targetScale = (i === activePillarIndex) ? 1 : 0.3;
                            const currentScale = p.scale.x;
                            const newScale = currentScale + (targetScale - currentScale) * 0.1;
                            p.scale.setScalar(newScale);
                            p.children.forEach(child => {
                                if (child.material && child.material.emissiveIntensity !== undefined) {
                                    child.material.emissiveIntensity = (i === activePillarIndex) ? 0.5 : 0.1;
                                }
                            });
                        });
                    } else {
                        [p1, p2, p3].forEach(p => {
                            p.scale.setScalar(1);
                            p.children[0].material.emissiveIntensity = 0.2;
                        });
                    }

                    if (intersects.length > 0) {
                        let obj = intersects[0].object;
                        while (obj.parent !== pillarsGroup && obj.parent !== null) {
                            obj = obj.parent;
                        }
                        if (obj) {
                            obj.scale.setScalar(1.1);
                            obj.children[0].material.emissiveIntensity = 1.5;
                            document.body.style.cursor = 'pointer';
                        }
                    } else {
                        document.body.style.cursor = 'default';
                    }
                }

                renderer.render(scene, camera);
                animationRef.current = requestAnimationFrame(tick);
            };

            tick();

            // --- 4. SCROLL TRIGGERS ---
            const tl1 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#section-hero",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });
            tl1.to(heroGroup.scale, { x: 0.1, y: 0.1, z: 0.1 }, 0)
                .to(heroGroup.position, { y: 2 }, 0)
                .to([core.material, innerCore.material, cage.material, particlesMat], { opacity: 0 }, 0);

            const tl2 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#section-evolution",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });
            tl2.to(evoGroup.scale, { x: 0, y: 0, z: 0, ease: "power2.in" }, 0);
            tl2.to(pillarsGroup.position, { y: -1.5, ease: "power2.out" }, 0.5);

            // Pillar Cards Animation
            const pillarCards = gsap.utils.toArray('.pillar-card');
            const isMobile = window.innerWidth < 768;

            if (isMobile) {
                pillarCards.forEach((card) => {
                    const cardContainer = card.parentElement;
                    gsap.set(card, { opacity: 0, y: 30 });
                    ScrollTrigger.create({
                        trigger: cardContainer,
                        start: "top 70%",
                        end: "bottom 30%",
                        onEnter: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }),
                        onLeave: () => gsap.to(card, { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" }),
                        onEnterBack: () => gsap.to(card, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }),
                        onLeaveBack: () => gsap.to(card, { opacity: 0, y: 30, duration: 0.3, ease: "power2.in" })
                    });
                });
            } else {
                pillarCards.forEach((card, i) => {
                    gsap.to(card, {
                        opacity: 1, y: 0, duration: 0.8, delay: i * 0.1,
                        scrollTrigger: { trigger: "#section-core", start: "top 60%", toggleActions: "play none none reverse" }
                    });
                });
            }

            // Resize Logic
            const handleResize = () => {
                sizes.width = window.innerWidth;
                sizes.height = window.innerHeight;
                camera.aspect = sizes.width / sizes.height;
                camera.updateProjectionMatrix();
                renderer.setSize(sizes.width, sizes.height);

                if (sizes.width < 768) {
                    p1.position.set(0, 0, 0);
                    p2.position.set(0, 0, 0);
                    p3.position.set(0, 0, 0);
                    pillarsGroup.scale.set(0.7, 0.7, 0.7);
                    evoGroup.position.set(0, 1, 0);
                } else {
                    p1.position.set(-2.8, 0, 0);
                    p2.position.set(0, 0, 0);
                    p3.position.set(2.8, 0, 0);
                    pillarsGroup.scale.set(1, 1, 1);
                    evoGroup.position.set(2.5, 0, 0);
                }
            };
            window.addEventListener('resize', handleResize);
            cleanupRef.current.push(() => window.removeEventListener('resize', handleResize));
            window.dispatchEvent(new Event('resize'));

            // Store cleanup for renderer
            cleanupRef.current.push(() => {
                if (animationRef.current) cancelAnimationFrame(animationRef.current);
                renderer.dispose();
                ScrollTrigger.getAll().forEach(st => st.kill());
            });
        };

        initScene();

        return () => {
            cleanupRef.current.forEach(cleanup => cleanup());
            cleanupRef.current = [];
        };
    }, []);

    return (
        <>

            <style>{`
        :root {
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
          --neon-blue: #4CA1AF;
          --neon-purple: #928DAB;
          --dark-bg: #050505;
        }

        body {
          margin: 0;
          padding: 0;
          background-color: var(--dark-bg);
          color: white;
          font-family: 'Rajdhani', sans-serif;
          overflow-x: hidden;
          width: 100vw;
        }

        .home-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          outline: none;
        }

        h1, h2, h3 {
          font-family: 'Orbitron', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .hero-text-glow {
          text-shadow: 0 0 10px rgba(76, 161, 175, 0.5), 0 0 20px rgba(76, 161, 175, 0.3);
        }

        .purple-glow {
          text-shadow: 0 0 10px rgba(146, 141, 171, 0.5);
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--gradient-1-start), var(--gradient-1-end));
          border-radius: 4px;
        }

        .btn-primary {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.1), transparent);
          border: 1px solid var(--neon-blue);
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 243, 255, 0.4), transparent);
          transition: 0.5s;
        }
        .btn-primary:hover::before { left: 100%; }
        .btn-primary:hover {
          box-shadow: 0 0 15px var(--neon-blue);
          text-shadow: 0 0 5px var(--neon-blue);
        }

        .btn-secondary {
          border: 1px solid var(--neon-purple);
          color: white;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: rgba(188, 19, 254, 0.2);
          box-shadow: 0 0 15px var(--neon-purple);
        }

        .content-section {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          pointer-events: none;
          overflow: hidden;
        }

        #section-evolution { padding-top: 15vh; }
        #section-core { overflow: visible; }

        .pointer-events-auto { pointer-events: auto; }

        .pillar-card {
          pointer-events: auto;
          background: rgba(5, 10, 20, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.4s ease;
          clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
          min-width: 280px;
          width: 280px;
        }
        .pillar-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gradient-1-end), transparent);
        }
        .pillar-card:hover {
          border-color: var(--gradient-1-end);
          box-shadow: 0 -5px 20px rgba(76, 161, 175, 0.2);
          transform: translateY(-5px);
        }

        .profile-glow {
          box-shadow: 0 0 15px rgba(76, 161, 175, 0.3);
          border: 2px solid rgba(76, 161, 175, 0.5);
        }

        .social-icons-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 16px;
          position: relative;
          padding: 0 16px;
        }

        .social-icon {
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 8px;
          flex-shrink: 0;
        }
        .social-icon:hover {
          transform: scale(1.15);
          z-index: 10;
        }

        @media (max-width: 480px) {
          .social-icons-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            padding: 0 20px;
            max-width: 320px;
            margin: 0 auto;
            margin-top: 80px !important;
          }
          .social-icon {
            padding: 8px;
            justify-self: center;
          }
          .social-icon svg {
            width: 24px !important;
            height: 24px !important;
          }
        }

        .social-icon .tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(5, 5, 5, 0.9);
          color: #00f3ff;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 1px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 243, 255, 0.3);
          box-shadow: 0 0 10px rgba(0, 243, 255, 0.2);
          pointer-events: none;
          margin-bottom: 10px;
        }
        .social-icon:hover .tooltip {
          opacity: 1;
          visibility: visible;
        }

        .social-icon[data-name="github"] { color: #ffffff; }
        .social-icon[data-name="github"]:hover { filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.5)); }
        .social-icon[data-name="leetcode"] { color: #ffa116; }
        .social-icon[data-name="leetcode"]:hover { filter: drop-shadow(0 0 6px rgba(255, 161, 22, 0.6)); }
        .social-icon[data-name="linkedin"] { color: #0077b5; }
        .social-icon[data-name="linkedin"]:hover { filter: drop-shadow(0 0 6px rgba(0, 119, 181, 0.6)); }
        .social-icon[data-name="facebook"] { color: #1877f2; }
        .social-icon[data-name="facebook"]:hover { filter: drop-shadow(0 0 6px rgba(24, 119, 242, 0.6)); }
        .social-icon[data-name="instagram"] { color: #e4405f; }
        .social-icon[data-name="instagram"]:hover { filter: drop-shadow(0 0 6px rgba(228, 64, 95, 0.6)); }
        .social-icon[data-name="resume"] { color: var(--neon-purple); }
        .social-icon[data-name="resume"]:hover { filter: drop-shadow(0 0 6px rgba(188, 19, 254, 0.5)); }
        .social-icon[data-name="gmail"] { color: #EA4335; }
        .social-icon[data-name="gmail"]:hover { filter: drop-shadow(0 0 6px rgba(234, 67, 53, 0.6)); }
        .social-icon[data-name="whoami"] { color: var(--neon-blue); }
        .social-icon[data-name="whoami"]:hover { filter: drop-shadow(0 0 6px rgba(0, 243, 255, 0.5)); }

        @media (max-width: 768px) {
          h1 { font-size: 1.25rem; letter-spacing: 1px; }
          h2 { font-size: 1.75rem !important; letter-spacing: 1px; }
          h3 { font-size: 1rem; letter-spacing: 1px; }
          .pillar-card { min-width: 100%; width: 100%; max-width: 320px; padding: 1rem; margin-bottom: 2rem; }
          .content-section { min-height: auto; height: auto; padding-top: 4rem; padding-bottom: 4rem; }
          #section-core { min-height: auto; height: auto; padding-top: 6rem; padding-bottom: 6rem; }
          .pillar-container { min-height: 80vh !important; display: flex; align-items: center; justify-content: center; }
        }

        @media (max-width: 480px) {
          h1 { font-size: 1rem; }
          h2 { font-size: 1.5rem !important; }
          .pillar-card { min-width: 100%; width: 100%; padding: 0.875rem; }
        }
      `}</style>

            <canvas ref={canvasRef} className="home-canvas" id="webgl"></canvas>

            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-20 mix-blend-screen">
                <div className="profile-header absolute top-4 left-4 md:top-10 md:left-6 flex items-center gap-3 md:gap-4 pointer-events-auto opacity-90 hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 md:w-20 md:h-20 rounded-full overflow-hidden profile-glow bg-gray-900 flex-shrink-0">
                        <img src="/profilepicture.png" alt="Syed Najam Ul Huda" className="w-full h-full object-cover" />
                    </div>
                    <div className="profile-text flex flex-col">
                        <h1 className="text-base md:text-2xl font-bold hero-text-glow text-white leading-tight">
                            Syed Najam Ul Huda
                        </h1>
                        <h2 className="text-xs md:text-base text-gray-300 font-light mb-1">
                            Software Engineer <span className="text-[#928DAB] font-medium">+ Applied AI</span>
                        </h2>
                        <p className="tagline text-xs md:text-sm text-[#4CA1AF]/80 italic font-mono border-t border-[#4CA1AF]/30 pt-1 mt-1 inline-block max-w-[200px] md:max-w-xs leading-tight hidden md:block">
                            Building production-grade systems where software architecture meets intelligent automation.
                        </p>
                    </div>
                </div>
            </div>

            <main className="relative z-10">
                <section className="content-section items-center text-center px-4" id="section-hero">
                    <div className="max-w-4xl w-full pointer-events-auto transform transition hover:scale-[1.01] duration-500 mt-[45vh]">
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <button onClick={() => alert('Coming Soon!')} className="btn-primary px-8 py-3 rounded text-[#4CA1AF] font-bold tracking-wider uppercase">
                                Explore My Journey
                            </button>
                            <button onClick={() => window.open('https://github.com/syednajam01', '_blank')} className="btn-secondary px-8 py-3 rounded text-[#928DAB] font-bold tracking-wider uppercase">
                                View My Work
                            </button>
                        </div>
                    </div>
                </section>

                <section className="content-section pl-0 pr-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center" id="section-evolution">
                    <div className="pointer-events-auto ml-0 pl-0">
                        <h2 className="text-4xl font-bold mb-6 text-white">The Evolution</h2>
                        <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
                            Started with CS fundamentals. Moved to systems thinking. Now integrating <strong className="text-[#928DAB]">intelligent components</strong> into real architectures.
                        </p>
                        <div className="bg-black/40 p-6 border-l-2 border-[#4CA1AF] text-left inline-block mb-8 max-w-lg">
                            <p className="text-gray-400 font-mono text-sm leading-relaxed">
                                Foundation → Data Structures & Algorithms<br />
                                Architecture → Scalable System Design<br />
                                Application → ML Pipeline Integration<br />
                                Current Focus → Production Deployment
                            </p>
                        </div>
                    </div>
                </section>

                <section className="content-section items-center relative" id="section-core">
                    <div className="absolute top-20 md:top-36 w-full text-center pointer-events-auto">
                        <h2 className="text-4xl font-bold mb-2">Core Modules</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 w-full max-w-6xl gap-4 md:gap-4 z-10 pointer-events-none px-4 mt-32 md:mt-0">
                        <div className="pillar-container flex items-center justify-center min-h-[50vh] md:min-h-0 md:pt-56">
                            <div onClick={() => navigate('/software')} className="pillar-card text-center opacity-0 transform translate-y-10 cursor-pointer">
                                <h3 className="text-[#4CA1AF] text-xl mb-2 font-bold tracking-wider">SOFTWARE ENGINEERING</h3>
                                <p className="text-xs text-gray-300 uppercase tracking-widest">Architecture • Systems • Clean Code</p>
                            </div>
                        </div>
                        <div className="pillar-container flex items-center justify-center min-h-[50vh] md:min-h-0 md:pt-56">
                            <div onClick={() => navigate('/ai')} className="pillar-card text-center opacity-0 transform translate-y-10 cursor-pointer">
                                <h3 className="text-[#928DAB] text-xl mb-2 font-bold tracking-wider">AI ENGINEERING</h3>
                                <p className="text-xs text-gray-300 uppercase tracking-widest">Pipelines • Integration • Deployment</p>
                            </div>
                        </div>
                        <div className="pillar-container flex items-center justify-center min-h-[50vh] md:min-h-0 md:pt-56">
                            <div onClick={() => navigate('/devops')} className="pillar-card text-center opacity-0 transform translate-y-10 cursor-pointer">
                                <h3 className="text-white text-xl mb-2 font-bold tracking-wider">DEVOPS / MLOPS</h3>
                                <p className="text-xs text-gray-300 uppercase tracking-widest">CI/CD • Containers • Production</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content-section items-center justify-center bg-gradient-to-t from-black via-black to-transparent h-screen">
                    <div className="text-center pointer-events-auto z-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 max-w-2xl mx-auto leading-tight">
                            "Build it right. <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4CA1AF] to-[#928DAB]">Ship it stable. Scale it always.</span>"
                        </h2>
                        <button onClick={() => window.open('https://github.com/syednajam01', '_blank')} className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full border border-gray-600 hover:border-white transition-colors duration-300">
                            <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                            <span className="relative text-white group-hover:text-[#4CA1AF] font-bold tracking-widest flex items-center gap-2">
                                SEE MY PROJECTS <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </button>

                        <div className="mt-16 social-icons-container">
                            <a href="https://github.com/syednajam01" target="_blank" rel="noopener noreferrer" className="social-icon group" data-name="github">
                                <span className="tooltip">GitHub</span>
                                <svg className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                                </svg>
                            </a>
                            <a href="https://leetcode.com/u/syed_najam/" target="_blank" rel="noopener noreferrer" className="social-icon group" data-name="leetcode">
                                <span className="tooltip">LeetCode</span>
                                <svg className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/in/syed-najamulhuda/" target="_blank" rel="noopener noreferrer" className="social-icon group" data-name="linkedin">
                                <span className="tooltip">LinkedIn</span>
                                <svg className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/syedhafiznajam.huda/" target="_blank" rel="noopener noreferrer" className="social-icon group" data-name="facebook">
                                <span className="tooltip">Facebook</span>
                                <svg className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/syd.najam" target="_blank" rel="noopener noreferrer" className="social-icon group" data-name="instagram">
                                <span className="tooltip">Instagram</span>
                                <svg className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            <a href="MyResume.pdf" target="_blank" rel="noopener noreferrer" className="social-icon group" data-name="resume">
                                <span className="tooltip">Resume</span>
                                <svg className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6zm2-6h8v2H8v-2zm0-3h8v2H8v-2zm0 6h5v2H8v-2z" />
                                </svg>
                            </a>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=syedhafiznajamhuda@gmail.com" target="_blank" rel="noopener noreferrer" className="social-icon group" data-name="gmail">
                                <span className="tooltip">syedhafiznajamhuda@gmail.com</span>
                                <svg className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                                </svg>
                            </a>
                            <a href="#section-hero" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="social-icon group cursor-pointer" data-name="whoami">
                                <span className="tooltip">Who Am I?</span>
                                <svg className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                </svg>
                            </a>
                        </div>

                        <div className="mt-12 text-gray-600 text-sm font-mono">
                            &copy; 2026 Syed Najam. System All Systems Go.
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;
