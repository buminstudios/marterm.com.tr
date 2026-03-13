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

        if (scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

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
    // 3. HERO — Scroll-driven slide transitions
    // ============================
    const heroSection = document.getElementById('hero-section');
    const heroSlides = document.querySelectorAll('.hero__slide');
    const progressDots = document.querySelectorAll('.hero__progress-dot');
    const heroProgress = document.getElementById('hero-progress');
    const scrollIndicator = document.getElementById('scroll-indicator');
    const totalSlides = heroSlides.length;

    let currentSlide = 0;

    function updateHeroSlide(newIndex) {
        if (newIndex === currentSlide) return;

        heroSlides.forEach((slide, i) => {
            if (i === newIndex) {
                slide.classList.add('hero__slide--active');
            } else {
                slide.classList.remove('hero__slide--active');
            }
        });

        progressDots.forEach((dot, i) => {
            if (i === newIndex) {
                dot.classList.add('hero__progress-dot--active');
            } else {
                dot.classList.remove('hero__progress-dot--active');
            }
        });

        currentSlide = newIndex;
    }

    function handleHeroScroll() {
        if (!heroSection) return;

        const heroRect = heroSection.getBoundingClientRect();
        const heroHeight = heroSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress through the hero section (0 to 1)
        const scrolled = -heroRect.top;
        const maxScroll = heroHeight - viewportHeight;
        const progress = Math.max(0, Math.min(1, scrolled / maxScroll));

        // Determine which slide to show
        const slideIndex = Math.min(
            totalSlides - 1,
            Math.floor(progress * totalSlides)
        );

        updateHeroSlide(slideIndex);

        // Show/hide progress dots and scroll indicator based on hero visibility
        const heroVisible = heroRect.top <= 0 && heroRect.bottom >= viewportHeight;
        const pastHero = heroRect.bottom < viewportHeight;

        if (heroProgress) {
            heroProgress.classList.toggle('hidden', pastHero);
        }
        if (scrollIndicator) {
            scrollIndicator.classList.toggle('hidden', progress > 0.1);
        }

        // Handle fixed positioning — slides should become static when past hero
        heroSlides.forEach(slide => {
            if (pastHero) {
                slide.style.position = 'absolute';
                slide.style.top = 'auto';
                slide.style.bottom = '0';
            } else {
                slide.style.position = 'fixed';
                slide.style.top = '0';
                slide.style.bottom = 'auto';
            }
        });
    }

    // Click on progress dots
    progressDots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            const heroHeight = heroSection.offsetHeight;
            const viewportHeight = window.innerHeight;
            const targetScroll = heroSection.offsetTop + (i / totalSlides) * (heroHeight - viewportHeight);

            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth'
            });
        });
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
    // 6. SMOOTH PARALLAX on mouse (subtle)
    // ============================
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function updateParallax() {
        const activeSlide = document.querySelector('.hero__slide--active .hero__content');
        if (activeSlide) {
            const translateX = mouseX * 8;
            const translateY = mouseY * 5;
            activeSlide.style.transform = `translate(${translateX}px, ${translateY}px)`;
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
                handleHeroScroll();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial call
    handleHeaderScroll();
    handleHeroScroll();

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
