// ============================================
// BRANDLOOM X - Portfolio Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ---------- PRELOADER (mobile-safe) ----------
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    let loadProgress = 0;
    const isMobile = window.innerWidth < 768;

    // Don't lock body scroll on mobile (causes rendering issues)
    if (!isMobile) document.body.style.overflow = 'hidden';

    const loadInterval = setInterval(() => {
        loadProgress += Math.random() * 30;
        if (loadProgress > 100) loadProgress = 100;
        if (preloaderBar) preloaderBar.style.width = loadProgress + '%';
        if (loadProgress === 100) {
            clearInterval(loadInterval);
            setTimeout(() => {
                if (preloader) preloader.classList.add('hidden');
                document.body.style.overflow = '';
                initAll();
            }, 400);
        }
    }, 200);

    // Fallback: hide preloader after 3s even if not 100%
    setTimeout(() => {
        clearInterval(loadInterval);
        if (preloader && !preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            document.body.style.overflow = '';
            initAll();
        }
    }, 3000);

    function initAll() {

        // ---------- ACTIVE NAV LINK (page-based) ----------
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === currentPage);
        });

        // ---------- FULL 3D SCENE (THREE.JS) ----------
        // Gracefully handle mobile: skip on very low-end devices or when WebGL fails
        const canRender3D = typeof THREE !== 'undefined' && !(isMobile && (
            !window.WebGLRenderingContext ||
            (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
            /Android [1-8]/.test(navigator.userAgent)
        ));

        if (canRender3D) { try {

            // === SCENE, CAMERA, RENDERER INITIALIZATION ===
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
            camera.position.z = 8;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.domElement.style.position = 'fixed';
            renderer.domElement.style.top = '0';
            renderer.domElement.style.left = '0';
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            renderer.domElement.style.zIndex = '-2';
            renderer.domElement.style.pointerEvents = 'none';
            document.body.appendChild(renderer.domElement);

            // === LIGHTS ===
            scene.add(new THREE.AmbientLight(0x404060));
            const dl1 = new THREE.DirectionalLight(0xffffff, 1.2);
            dl1.position.set(5, 8, 6);
            scene.add(dl1);
            const dl2 = new THREE.DirectionalLight(0x7c3aed, 0.6);
            dl2.position.set(-4, -3, 5);
            scene.add(dl2);
            const dl3 = new THREE.DirectionalLight(0x06b6d4, 0.4);
            dl3.position.set(0, -5, -5);
            scene.add(dl3);

            // === SECTION 3D OBJECTS ===
            // Each section gets a unique 3D object floating at its position

            // Hero object: Large Torus Knot (at y=0)
            const heroGroup = new THREE.Group();
            const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.45, 200, 24);
            const knotMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#7c3aed'),
                metalness: 0.9,
                roughness: 0.1,
                clearcoat: 1,
                clearcoatRoughness: 0.08,
                emissive: new THREE.Color('#4f46e5'),
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.6,
            });
            const knot = new THREE.Mesh(knotGeo, knotMat);
            knot.position.y = 0; heroGroup.add(knot);

            const wireKnot = new THREE.Mesh(
                new THREE.TorusKnotGeometry(1.5, 0.5, 80, 12),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color('#06b6d4'),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.15,
                })
            );
            wireKnot.position.y = 0; heroGroup.add(wireKnot);
            scene.add(heroGroup);

            // About object: Icosahedron with glowing edges
            const aboutGroup = new THREE.Group();
            const icoGeo = new THREE.IcosahedronGeometry(1, 0);
            const icoMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#06b6d4'),
                metalness: 0.6,
                roughness: 0.2,
                transparent: true,
                opacity: 0.4,
                emissive: new THREE.Color('#06b6d4'),
                emissiveIntensity: 0.15,
                wireframe: false,
            });
            const ico = new THREE.Mesh(icoGeo, icoMat);
            aboutGroup.add(ico);

            const icoWire = new THREE.Mesh(
                new THREE.IcosahedronGeometry(1.1, 0),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color('#7c3aed'),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.2,
                })
            );
            aboutGroup.add(icoWire);
            scene.add(aboutGroup);

            // Skills object: Dodecahedron
            const skillsGroup = new THREE.Group();
            const dodGeo = new THREE.DodecahedronGeometry(0.9);
            const dodMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#10b981'),
                metalness: 0.7,
                roughness: 0.15,
                transparent: true,
                opacity: 0.35,
                emissive: new THREE.Color('#10b981'),
                emissiveIntensity: 0.1,
            });
            const dod = new THREE.Mesh(dodGeo, dodMat);
            skillsGroup.add(dod);

            const dodWire = new THREE.Mesh(
                new THREE.DodecahedronGeometry(1.0),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color('#06b6d4'),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.12,
                })
            );
            skillsGroup.add(dodWire);
            scene.add(skillsGroup);

            // Services object: Octahedron
            const servicesGroup = new THREE.Group();
            const octGeo = new THREE.OctahedronGeometry(0.8);
            const octMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#f59e0b'),
                metalness: 0.5,
                roughness: 0.3,
                transparent: true,
                opacity: 0.3,
                emissive: new THREE.Color('#f59e0b'),
                emissiveIntensity: 0.1,
            });
            const oct = new THREE.Mesh(octGeo, octMat);
            servicesGroup.add(oct);
            scene.add(servicesGroup);

            // Contact object: Small Torus (ring)
            const contactGroup = new THREE.Group();
            const ringGeo = new THREE.TorusGeometry(0.7, 0.15, 30, 60);
            const ringMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#7c3aed'),
                metalness: 0.8,
                roughness: 0.1,
                transparent: true,
                opacity: 0.4,
                emissive: new THREE.Color('#7c3aed'),
                emissiveIntensity: 0.2,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            contactGroup.add(ring);

            const ringWire = new THREE.Mesh(
                new THREE.TorusGeometry(0.75, 0.18, 20, 40),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color('#06b6d4'),
                    wireframe: true,
                    transparent: true,
                    opacity: 0.12,
                })
            );
            contactGroup.add(ringWire);
            scene.add(contactGroup);

            // === FLOATING PARTICLES (throughout the page) ===
            const particleCount = 600;
            const pGeo = new THREE.BufferGeometry();
            const pPos = new Float32Array(particleCount * 3);
            const pColors = new Float32Array(particleCount * 3);
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                pPos[i3] = (Math.random() - 0.5) * 40;
                pPos[i3+1] = (Math.random() - 0.5) * 60;
                pPos[i3+2] = (Math.random() - 0.5) * 20;
                const c = new THREE.Color().setHSL(0.75 + Math.random() * 0.2, 0.6, 0.5);
                pColors[i3] = c.r;
                pColors[i3+1] = c.g;
                pColors[i3+2] = c.b;
            }
            pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
            pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
            const pMat = new THREE.PointsMaterial({
                size: 0.06,
                vertexColors: true,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
            });
            const particles = new THREE.Points(pGeo, pMat);
            scene.add(particles);

            // === ORBITING SPHERES for hero ===
            const orbGroup = new THREE.Group();
            for (let i = 0; i < 12; i++) {
                const s = new THREE.Mesh(
                    new THREE.SphereGeometry(0.08, 8, 8),
                    new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color(i % 2 === 0 ? '#06b6d4' : '#7c3aed'),
                        emissive: new THREE.Color(i % 2 === 0 ? '#06b6d4' : '#7c3aed'),
                        emissiveIntensity: 0.4,
                        metalness: 0.6,
                        roughness: 0.2,
                    })
                );
                const angle = (i / 12) * Math.PI * 2;
                s.position.set(Math.cos(angle) * 2.6, Math.sin(angle) * 2.6, 0);
                orbGroup.add(s);
            }
            for (let i = 0; i < 8; i++) {
                const s = new THREE.Mesh(
                    new THREE.SphereGeometry(0.05, 6, 6),
                    new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color('#06b6d4'),
                        emissive: new THREE.Color('#06b6d4'),
                        emissiveIntensity: 0.3,
                        metalness: 0.5,
                        roughness: 0.3,
                    })
                );
                const angle = (i / 8) * Math.PI * 2 + 0.3;
                s.position.set(Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0.4);
                orbGroup.add(s);
            }
            scene.add(orbGroup);

            // === POSITION OBJECTS AT EACH SECTION ===
            function position3DObjects() {
                // Hide all groups by default; show only those with a matching section
                heroGroup.visible = false;
                orbGroup.visible = false;
                aboutGroup.visible = false;
                servicesGroup.visible = false;
                skillsGroup.visible = false;
                contactGroup.visible = false;

                const sections = document.querySelectorAll('section');
                sections.forEach(sec => {
                    const id = sec.getAttribute('id');
                    const rect = sec.getBoundingClientRect();
                    const centerY = rect.top + rect.height / 2 + window.scrollY;
                    const centerX = rect.left + rect.width / 2 + window.scrollX;

                    switch (id) {
                        case 'home':
                            heroGroup.visible = true;
                            orbGroup.visible = true;
                            heroGroup.position.set(3.5, centerY / 100 - 2, -4);
                            orbGroup.position.set(3.5, centerY / 100 - 2, -4);
                            break;
                        case 'about':
                            aboutGroup.visible = true;
                            aboutGroup.position.set(-3.8, centerY / 100 - 8, -5);
                            break;
                        case 'services':
                            servicesGroup.visible = true;
                            servicesGroup.position.set(4, centerY / 100 - 14, -6);
                            break;
                        case 'skills':
                            skillsGroup.visible = true;
                            skillsGroup.position.set(-4, centerY / 100 - 20, -5);
                            break;
                        case 'contact':
                            contactGroup.visible = true;
                            contactGroup.position.set(3.5, centerY / 100 - 30, -6);
                            break;
                    }
                });
            }

            // Initial positioning after layout
            requestAnimationFrame(() => {
                position3DObjects();
            });

            // === MOUSE TRACKING ===
            let mouseX = 0, mouseY = 0;
            document.addEventListener('mousemove', (e) => {
                mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            });

            // === SCROLL POSITION ===
            let scrollY = 0;

            // === MAIN ANIMATION LOOP ===
            function animateScene() {
                requestAnimationFrame(animateScene);

                scrollY = window.scrollY;
                const scrollNorm = scrollY / (document.documentElement.scrollHeight - window.innerHeight);

                // Rotate all objects
                heroGroup.rotation.x += 0.003;
                heroGroup.rotation.y += 0.006;
                wireKnot.rotation.x = heroGroup.rotation.x;
                wireKnot.rotation.y = heroGroup.rotation.y;

                aboutGroup.rotation.x += 0.004;
                aboutGroup.rotation.y += 0.008;

                skillsGroup.rotation.x += 0.005;
                skillsGroup.rotation.y += 0.01;

                servicesGroup.rotation.x += 0.006;
                servicesGroup.rotation.y += 0.012;

                contactGroup.rotation.x += 0.004;
                contactGroup.rotation.y += 0.007;

                // Orbit group rotates faster
                orbGroup.rotation.x += 0.008;
                orbGroup.rotation.y += 0.015;
                orbGroup.rotation.z += 0.005;

                // Particles gentle drift
                particles.rotation.x += 0.0002;
                particles.rotation.y += 0.0005;

                // Camera subtle movement based on mouse + scroll
                camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.008;
                camera.position.y += (-scrollNorm * 2 + mouseY * 0.5 - camera.position.y) * 0.008;
                camera.lookAt(0, -scrollNorm * 2, 0);

                // Floating motion for each object
                const t = Date.now() * 0.0005;
                heroGroup.position.y += (Math.sin(t) * 0.05 - (heroGroup.position.y - (heroGroup.userData.baseY || -2))) * 0.02;
                if (!heroGroup.userData.baseY) heroGroup.userData.baseY = heroGroup.position.y;

                renderer.render(scene, camera);
            }
            animateScene();

            // === RESIZE ===
            window.addEventListener('resize', () => {
                const w = window.innerWidth;
                const h = window.innerHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
                setTimeout(position3DObjects, 100);
            });

            // Re-position on scroll (with debounce)
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(position3DObjects, 200);
            });
        } catch (e) { /* 3D failed silently */ } }

        // ---------- 3D TILT EFFECT ON CARDS (works on mobile too) ----------
        document.querySelectorAll('[data-tilt]').forEach(card => {
            const handleMove = (e) => {
                const rect = card.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                const x = (clientX - rect.left) / rect.width;
                const y = (clientY - rect.top) / rect.height;
                const tiltX = (y - 0.5) * (isMobile ? 6 : 12);
                const tiltY = (0.5 - x) * (isMobile ? 6 : 12);
                card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'transform 0.1s ease-out';
            };

            const handleLeave = () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                card.style.transition = 'transform 0.5s ease-out';
            };

            card.addEventListener('mousemove', handleMove);
            card.addEventListener('mouseleave', handleLeave);
            card.addEventListener('touchmove', handleMove, { passive: true });
            card.addEventListener('touchend', handleLeave);
        });

        // ---------- LENIS SMOOTH SCROLL ----------
        // Disable on mobile (native scroll feels better + avoids conflicts)
        let lenis;
        if (typeof Lenis !== 'undefined' && !isMobile) {
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                smoothWheel: true,
                touchMultiplier: 1.5,
            });

            lenis.on('scroll', ScrollTrigger.update);

            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }

        // ---------- GSAP SCROLL ANIMATIONS ----------
        gsap.registerPlugin(ScrollTrigger);

        // Animate elements with data-anim
        document.querySelectorAll('[data-anim]').forEach(el => {
            const anim = el.getAttribute('data-anim');
            const delay = parseFloat(el.getAttribute('data-delay')) || 0;

            let vars = {
                opacity: 1,
                duration: 0.8,
                delay: delay,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                }
            };

            if (anim === 'fade-up') vars.y = 0;
            else if (anim === 'fade-right') vars.x = 0;
            else if (anim === 'fade-left') vars.x = 0;
            else if (anim === 'scale-in') vars.scale = 1;

            gsap.to(el, vars);
        });

        // ---------- CUSTOM CURSOR ----------
        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');

        if (cursorDot && cursorOutline) {
            document.addEventListener('mousemove', (e) => {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
                cursorOutline.style.left = e.clientX + 'px';
                cursorOutline.style.top = e.clientY + 'px';
            });

            document.querySelectorAll('a, button, .project-card, .filter-btn, .about-tab-btn, .faq-question, .form-input').forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorDot.classList.add('hover');
                    cursorOutline.classList.add('hover');
                });
                el.addEventListener('mouseleave', () => {
                    cursorDot.classList.remove('hover');
                    cursorOutline.classList.remove('hover');
                });
            });
        }

        // ---------- TYPING ANIMATION ----------
        const heroRole = document.getElementById('hero-role');
        if (heroRole) {
            const roles = ['Web Developer', 'Software Engineer', 'Mobile App Developer'];
            let idx = 0, charIdx = 0, deleting = false;

            function type() {
                const current = roles[idx];
                if (deleting) {
                    heroRole.textContent = current.substring(0, charIdx - 1);
                    charIdx--;
                } else {
                    heroRole.textContent = current.substring(0, charIdx + 1);
                    charIdx++;
                }

                if (!deleting && charIdx === current.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
                if (deleting && charIdx === 0) {
                    deleting = false;
                    idx = (idx + 1) % roles.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, deleting ? 40 : 80);
            }
            setTimeout(type, 1200);
        }

        // ---------- HEADER SCROLL ----------
        const header = document.getElementById('header');
        const scrollTopBtn = document.getElementById('scroll-top');
        const progressBar = document.getElementById('scroll-progress-bar');

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const y = window.scrollY;
                    const total = document.documentElement.scrollHeight - window.innerHeight;

                    header.classList.toggle('scrolled', y > 50);
                    scrollTopBtn.classList.toggle('active', y > 500);

                    if (total > 0) {
                        progressBar.style.width = (y / total) * 100 + '%';
                    }

                    ticking = false;
                });
                ticking = true;
            }
        });

        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                if (lenis) lenis.scrollTo(0);
                else window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // ---------- MOBILE MENU ----------
        const menuToggle = document.getElementById('menu-toggle');
        const navbar = document.getElementById('navbar');

        if (menuToggle && navbar) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                navbar.classList.toggle('active');
            });

            navbar.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    navbar.classList.remove('active');
                });
            });
        }

        // ---------- THEME TOGGLE ----------
        const themeBtn = document.getElementById('theme-btn');
        const html = document.documentElement;

        const saved = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', saved);

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
            });
        }

        // ---------- ABOUT TABS ----------
        const tabBtns = document.querySelectorAll('.about-tab-btn');
        const tabPanels = document.querySelectorAll('.about-tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                const panel = document.getElementById(target);
                if (panel) panel.classList.add('active');
            });
        });

        // ---------- STATS COUNTER ----------
        const statsGrid = document.getElementById('stats-grid');
        const statNums = document.querySelectorAll('.stat-num');
        let counted = false;

        if (statsGrid) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !counted) {
                        counted = true;
                        statNums.forEach(stat => {
                            const target = parseInt(stat.getAttribute('data-target'), 10);
                            gsap.to(stat, {
                                innerHTML: target,
                                duration: 2,
                                ease: 'power2.out',
                                snap: { innerHTML: 1 },
                                onUpdate: () => {
                                    // For formatting K+ for larger numbers
                                }
                            });
                        });
                    }
                });
            }, { threshold: 0.5 });
            observer.observe(statsGrid);
        }

        // ---------- SKILL BAR ANIMATION ----------
        document.querySelectorAll('.skill-panel').forEach(panel => {
            ScrollTrigger.create({
                trigger: panel,
                start: 'top 80%',
                onEnter: () => {
                    panel.querySelectorAll('.skill-bar').forEach(bar => {
                        const w = bar.getAttribute('data-width');
                        bar.querySelector('.skill-bar-fill').style.width = w + '%';
                    });
                },
                once: true,
            });
        });

        // ---------- PROJECT FILTER ----------
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const cat = card.getAttribute('data-category');
                    if (filter === 'all' || cat === filter) {
                        gsap.to(card, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', display: 'flex' });
                    } else {
                        gsap.to(card, {
                            opacity: 0,
                            scale: 0.9,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => { card.style.display = 'none'; }
                        });
                    }
                });
            });
        });

        // ---------- PROJECT MODALS ----------
        document.querySelectorAll('.open-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.project-card');
                const modalId = card.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a') || e.target.closest('.open-modal')) return;
                const modalId = card.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            const overlay = modal.querySelector('.modal-overlay');

            function closeModal() {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }

            if (closeBtn) closeBtn.addEventListener('click', closeModal);
            if (overlay) overlay.addEventListener('click', closeModal);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.active').forEach(m => {
                    m.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }
        });

        // ---------- TESTIMONIALS SLIDER ----------
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        let currentSlide = 0;
        let slideTimer = null;

        function showSlide(idx) {
            testimonialCards.forEach((c, i) => {
                c.classList.toggle('active', i === idx);
                if (dots[i]) dots[i].classList.toggle('active', i === idx);
            });
            currentSlide = idx;
        }

        function startSlideTimer() {
            slideTimer = setInterval(() => {
                showSlide((currentSlide + 1) % testimonialCards.length);
            }, 5000);
        }

        function resetSlideTimer() {
            clearInterval(slideTimer);
            startSlideTimer();
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetSlideTimer();
            });
        });

        if (testimonialCards.length > 0) startSlideTimer();

        // ---------- SKILLS TABS ----------
        document.querySelectorAll('.skill-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-skill-tab');
                document.querySelectorAll('.skill-tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.skill-panel').forEach(p => p.classList.remove('active'));
                const panel = document.getElementById(target);
                if (panel) panel.classList.add('active');
            });
        });

        // ---------- FAQ ACCORDION ----------
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.parentElement;
                const answer = item.querySelector('.faq-answer');
                const isActive = item.classList.contains('active');

                document.querySelectorAll('.faq-item').forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.faq-answer').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });

        // ---------- CONTACT FORM (EMAILJS) ----------
        // EmailJS Setup Instructions:
        // 1. Sign up free at https://www.emailjs.com
        // 2. Go to Email Services -> Add New Service -> Connect your Gmail
        // 3. Go to Email Templates -> Create New Template
        //    Template fields: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
        // 4. Go to Account -> API Keys -> Copy your Public Key
        // 5. Replace the 3 IDs below with YOUR values:
        //    - PUBLIC_KEY  (from Account > API Keys)
        //    - SERVICE_ID  (from Email Services)
        //    - TEMPLATE_ID (from Email Templates)

        const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // <-- CHANGE THIS
        const EMAILJS_SERVICE_ID = 'service_xxxxxxx';     // <-- CHANGE THIS
        const EMAILJS_TEMPLATE_ID = 'template_xxxxxxx';   // <-- CHANGE THIS

        const contactForm = document.getElementById('contact-form');
        const submitBtn = document.getElementById('form-submit');
        const successEl = document.getElementById('form-success');
        const errorEl = document.getElementById('form-error');

        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        }

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                successEl.classList.remove('active');
                errorEl.classList.remove('active');

                let valid = true;
                const inputs = contactForm.querySelectorAll('.form-input');

                inputs.forEach(input => {
                    const group = input.parentElement;
                    if (input.required && !input.value.trim()) {
                        group.classList.add('invalid');
                        valid = false;
                    } else if (input.type === 'email') {
                        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!re.test(input.value.trim())) {
                            group.classList.add('invalid');
                            valid = false;
                        } else {
                            group.classList.remove('invalid');
                        }
                    } else {
                        group.classList.remove('invalid');
                    }
                    input.addEventListener('input', () => {
                        if (input.value.trim()) group.classList.remove('invalid');
                    });
                });

                if (!valid) return;

                submitBtn.classList.add('loading');
                submitBtn.disabled = true;

                const sendEmail = () => {
                    return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                        from_name: document.getElementById('name').value,
                        from_email: document.getElementById('email').value,
                        subject: document.getElementById('subject').value,
                        message: document.getElementById('message').value,
                    });
                };

                if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
                    sendEmail()
                        .then(() => showFormSuccess())
                        .catch(() => showFormError())
                        .finally(() => {
                            submitBtn.classList.remove('loading');
                            submitBtn.disabled = false;
                        });
                } else {
                    // Demo mode: simulate send
                    setTimeout(() => {
                        showFormSuccess();
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }, 1500);
                }
            });

            function showFormSuccess() {
                successEl.classList.add('active');
                contactForm.reset();
                setTimeout(() => successEl.classList.remove('active'), 5000);
            }

            function showFormError() {
                errorEl.classList.add('active');
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                setTimeout(() => errorEl.classList.remove('active'), 5000);
            }
        }

        // ---------- NEWSLETTER ----------
        const newsletterBtn = document.getElementById('newsletter-btn');
        const newsletterInput = document.getElementById('newsletter-input');

        if (newsletterBtn && newsletterInput) {
            newsletterBtn.addEventListener('click', () => {
                const val = newsletterInput.value.trim();
                if (val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    newsletterInput.value = '';
                    newsletterInput.placeholder = 'Subscribed!';
                    setTimeout(() => { newsletterInput.placeholder = 'Your email'; }, 3000);
                } else {
                    newsletterInput.style.borderColor = '#ef4444';
                    setTimeout(() => { newsletterInput.style.borderColor = ''; }, 2000);
                }
            });
        }

        // ---------- HOVER 3D PARALLAX ON HERO AVATAR ----------
        const avatarInner = document.querySelector('.hero-avatar-inner');
        if (avatarInner) {
            avatarInner.parentElement.addEventListener('mousemove', (e) => {
                const rect = avatarInner.parentElement.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                avatarInner.style.transform = `translateZ(20px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
                const shadow = avatarInner.parentElement.querySelector('.hero-avatar-img');
                if (shadow) {
                    shadow.style.transform = `translateX(${-x * 8}px) translateY(${-y * 8}px)`;
                }
            });

            avatarInner.parentElement.addEventListener('mouseleave', () => {
                avatarInner.style.transform = 'translateZ(0) rotateY(0) rotateX(0)';
            });
        }

    } // end initAll
});
