/* ===================================================================
   MARTERM.COM.TR — Main JavaScript
   Scroll-driven hero animation, reveal effects, counter animation
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============================
    // 1. HEADER — Scroll behavior
    // ============================
    const header = document.getElementById('main-header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const scrollY = window.scrollY;

        // Scroll darkening logic removed

        lastScroll = scrollY;
    }

    // ============================
    // 2. MOBILE MENU
    // ============================
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on link click
        mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================
    // 3. HERO — Canvas Scroll Frame Animation (Apple-style)
    // ============================
    class ContinuousHeroScroll {
        constructor(config) {
            this.section = document.getElementById(config.sectionId);
            this.canvas = document.getElementById(config.canvasId);
            this.indicator = document.getElementById(config.indicatorId);
            this.sequenceContents = config.sequenceContents.map(id => document.getElementById(id));
            
            this.sequences = config.sequences;
            this.hasIntro = config.hasIntro || false;
            this.introEndFrame = config.introEndFrame || 51;

            this.frames = [];
            this.framesLoaded = 0;
            this.totalFrames = this.sequences.reduce((sum, seq) => sum + seq.frames, 0);
            
            this.currentFrameIndex = -1;
            this.isIntroPlaying = this.hasIntro;
            this.introInterval = null;

            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;

            if (this.section && this.canvas && this.ctx) {
                this.init();
            }
        }

        init() {
            this.resizeCanvas();
            window.addEventListener('resize', () => this.resizeCanvas());
            this.preloadFrames();
            
            window.addEventListener('scroll', () => {
                requestAnimationFrame(() => this.handleScroll());
            });
        }

        resizeCanvas() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            if (this.frames[this.currentFrameIndex]) {
                this.drawFrame(this.currentFrameIndex);
            }
        }

        drawFrame(index) {
            if (!this.ctx || !this.frames[index] || !this.frames[index].complete) return;
            this.currentFrameIndex = index;

            const img = this.frames[index];
            const canvasRatio = this.canvas.width / this.canvas.height;
            const imgRatio = img.naturalWidth / img.naturalHeight;

            let drawWidth, drawHeight, drawX, drawY;

            if (imgRatio > canvasRatio) {
                drawHeight = this.canvas.height;
                drawWidth = drawHeight * imgRatio;
                drawX = (this.canvas.width - drawWidth) / 2;
                drawY = 0;
            } else {
                drawWidth = this.canvas.width;
                drawHeight = drawWidth / imgRatio;
                drawX = 0;
                drawY = (this.canvas.height - drawHeight) / 2;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        }

        preloadFrames() {
            let index = 0;
            this.sequences.forEach(seq => {
                for (let i = 1; i <= seq.frames; i++) {
                    const img = new Image();
                    const frameNum = String(i).padStart(4, '0');
                    img.src = `${seq.path}frame_${frameNum}.webp`;
                    
                    const currentIndex = index;
                    img.onload = () => {
                        this.framesLoaded++;
                        if (currentIndex === 0 && this.ctx) {
                            if (this.hasIntro) {
                                this.startIntroAnimation();
                            } else {
                                this.drawFrame(0);
                            }
                        }
                    };
                    this.frames.push(img);
                    index++;
                }
            });
        }

        startIntroAnimation() {
            let introFrame = 0;
            this.introInterval = setInterval(() => {
                if (introFrame <= this.introEndFrame) {
                    this.drawFrame(introFrame);
                    introFrame++;
                } else {
                    clearInterval(this.introInterval);
                    this.isIntroPlaying = false;
                    this.handleScroll();
                }
            }, 40);
        }

        handleScroll() {
            if (!this.section) return;

            const heroRect = this.section.getBoundingClientRect();
            const heroHeight = this.section.offsetHeight;
            const viewportHeight = window.innerHeight;

            const scrolled = -heroRect.top;
            const maxScroll = heroHeight - viewportHeight;
            const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

            let frameIndex;
            
            if (this.hasIntro) {
                if (this.isIntroPlaying) return;
                const scrollableFrames = this.totalFrames - 1 - this.introEndFrame;
                frameIndex = this.introEndFrame + Math.floor(progress * scrollableFrames);
                frameIndex = Math.min(this.totalFrames - 1, frameIndex);
            } else {
                frameIndex = Math.min(this.totalFrames - 1, Math.floor(progress * this.totalFrames));
            }

            if (frameIndex !== this.currentFrameIndex) {
                this.drawFrame(frameIndex);
            }

            const totalContent = this.sequenceContents.length;
            const step = 1 / totalContent;

            this.sequenceContents.forEach((content, i) => {
                if (!content) return;
                
                const start = i * step;
                const end = start + step;
                
                // Get the overlay element
                const overlay = this.section.querySelector('.hero-scroll__overlay');

                if (progress >= start && progress < end) {
                    content.classList.remove('hero-content-hidden');
                    
                    // Toggle overlay direction based on content alignment
                    if (overlay) {
                        if (content.classList.contains('hero-scroll__content--right')) {
                            overlay.classList.add('hero-scroll__overlay--right');
                        } else {
                            overlay.classList.remove('hero-scroll__overlay--right');
                        }
                    }
                    
                    const localProgress = (progress - start) / step;
                    
                    // First sequence should be visible at start, no fade-in.
                    if (i === 0 && localProgress < 0.15) {
                        content.classList.remove('fade-out');
                    } else if (i === totalContent - 1 && localProgress > 0.85) {
                        // Last sequence should stay visible at the end.
                        content.classList.remove('fade-out');
                    } else if (localProgress < 0.15 || localProgress > 0.85) {
                        content.classList.add('fade-out');
                    } else {
                        content.classList.remove('fade-out');
                    }
                } else {
                    content.classList.add('hero-content-hidden');
                }
            });

            if (this.indicator) {
                this.indicator.classList.toggle('hidden', progress > 0.05);
            }
        }
    }

    // Initialize Sequential Scroll
    const continuousHero = new ContinuousHeroScroll({
        sectionId: 'hero-scroll-section',
        canvasId: 'hero-canvas',
        sequenceContents: [
            'hero-scroll-content-1', 
            'hero-scroll-content-2',
            'hero-scroll-content-3',
            'hero-scroll-content-4',
            'hero-scroll-content-5',
            'hero-scroll-content-6',
            'hero-scroll-content-7'
        ],
        indicatorId: 'scroll-indicator',
        sequences: [
            { path: '/assets/heros/videolar/herolar/video_1/', frames: 120 },
            { path: '/assets/heros/videolar/herolar/video_2/', frames: 120 },
            { path: '/assets/heros/videolar/herolar/video_3/', frames: 120 },
            { path: '/assets/heros/videolar/herolar/video_4/', frames: 120 },
            { path: '/assets/heros/videolar/herolar/video_5/', frames: 120 },
            { path: '/assets/heros/videolar/herolar/video_6/', frames: 120 },
            { path: '/assets/heros/videolar/herolar/video_7/', frames: 120 }
        ],
        hasIntro: true,
        introEndFrame: 51
    });

    // ============================
    // 4. SCROLL REVEAL — Intersection Observer
    // ============================
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================
    // 5. COUNTER ANIMATION
    // ============================
    const counters = document.querySelectorAll('[data-count]');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    // ============================
    // 6. SMOOTH PARALLAX on mouse (subtle) — for hero content
    // ============================
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function updateParallax() {
        if (typeof heroContent !== 'undefined' && heroContent && !heroContent.classList.contains('fade-out')) {
            const translateX = mouseX * 8;
            const translateY = mouseY * 5;
            heroContent.style.transform = `translate(${translateX}px, ${translateY}px)`;
        }
        requestAnimationFrame(updateParallax);
    }

    updateParallax();

    // ============================
    // 7. MAIN SCROLL HANDLER
    // ============================
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleHeaderScroll();
                if (typeof continuousHero !== 'undefined' && continuousHero) continuousHero.handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial call
    handleHeaderScroll();
    if (typeof continuousHero !== 'undefined' && continuousHero) continuousHero.handleScroll();

    // ============================
    // 8. PRELOADER FADE
    // ============================
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.6s ease';

    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // Fallback if load already fired
    if (document.readyState === 'complete') {
        document.body.style.opacity = '1';
    }
});

/* ========================================================================= */
/* LANGUAGE SWITCHER LOGIC
/* ========================================================================= */
const defaultLang = 'tr';
const supportedLangs = ['tr', 'en', 'es', 'ru', 'ar'];

// Current path manipulation to find current lang
function getCurrentLang() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    
    // e.g. /en/pages/urunler.html -> first part is 'en'
    if (parts.length > 0 && supportedLangs.includes(parts[0])) {
        return parts[0];
    }
    return defaultLang; // root is Turkish
}

function updateSwitcherUI() {
    const btn = document.querySelector('.lang-btn');
    if(!btn) return;
    
    const currLang = getCurrentLang();
    const flags = {
        'tr': 'tr.png',
        'en': 'gb.png',
        'es': 'es.png',
        'ru': 'ru.png',
        'ar': 'sa.png'
    };
    
    const img = btn.querySelector('img');
    const span = btn.querySelector('span');
    
    if(img && span) {
        img.src = `https://flagcdn.com/24x18/${flags[currLang]}`;
        span.textContent = currLang.toUpperCase();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateSwitcherUI();
    
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    
    if(langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
        
        // Close on click outside
        document.addEventListener('click', (e) => {
            if(!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        });
        
        // Switch Logic
        const options = document.querySelectorAll('.lang-option');
        options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.preventDefault();
                const targetLang = opt.getAttribute('data-lang');
                const currLang = getCurrentLang();
                
                if(targetLang === currLang) {
                    langDropdown.classList.remove('active');
                    return; // Same lang, no action
                }
                
                let currentPath = window.location.pathname;
                
                // Remove existing lang prefix if it's there
                if(currLang !== defaultLang) {
                    // e.g. /en/pages/urunler.html -> /pages/urunler.html
                    currentPath = currentPath.replace(`/${currLang}`, '');
                }
                // Handle edge case where it might just be /en or /en/
                if(currentPath === '') currentPath = '/';
                
                // Add new prefix if target is not default (tr)
                let newPath = currentPath;
                if(targetLang !== defaultLang) {
                    newPath = `/${targetLang}${currentPath}`;
                }
                
                // Preserve query string and hash
                window.location.href = newPath + window.location.search + window.location.hash;
            });
        });
    }
});


/* ========================================================================= */
/* NAVIGATION INTERCEPTOR FOR LOCALES
/* ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const currLang = getCurrentLang();
    if (currLang === defaultLang) return;

    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach(link => {
        let href = link.getAttribute('href');
        if (href.startsWith('/' + currLang + '/') || href === '/' + currLang) return;
        
        let newHref = href === '/' ? '/' + currLang + '/' : '/' + currLang + href;
        link.setAttribute('href', newHref);
    });
});
