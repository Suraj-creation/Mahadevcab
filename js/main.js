/* =============================================
   BS TRAVEL DELHI CABS — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ────────────── HEADER: Scroll Effect ──────────────
    const header = document.getElementById('header');
    const SCROLL_THRESHOLD = 60;

    function handleHeaderScroll() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll(); // Initial check


    // ────────────── HEADER: Active Nav Link ──────────────
    const navLinks = document.querySelectorAll('.header__nav-link');
    const sections = document.querySelectorAll('section[id]');

    function setActiveNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNav, { passive: true });


    // ────────────── HAMBURGER MENU ──────────────
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mainNav = document.getElementById('mainNav');

    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            mainNav.classList.toggle('open');
            document.body.style.overflow = mainNav.classList.contains('open') ? 'hidden' : '';
        });

        // Close on nav link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                mainNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('open') &&
                !mainNav.contains(e.target) &&
                !hamburgerBtn.contains(e.target)) {
                hamburgerBtn.classList.remove('active');
                mainNav.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }


    // ────────────── SMOOTH SCROLL ──────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ────────────── COUNTER ANIMATION ──────────────
    const counters = document.querySelectorAll('.hero__stat-number[data-count]');
    let counterStarted = false;

    function animateCounters() {
        if (counterStarted) return;
        counterStarted = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString();
                }
            }, stepTime);
        });
    }

    // Trigger counters when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.4 });

    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);


    // ────────────── SCROLL REVEAL ──────────────
    function addRevealClasses() {
        // Section headers
        document.querySelectorAll('.section-header').forEach(el => {
            if (!el.classList.contains('reveal')) el.classList.add('reveal');
        });

        // Service cards
        document.querySelectorAll('.services__card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.15}s`;
        });

        // Fleet cards
        document.querySelectorAll('.fleet__card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.15}s`;
        });

        // Package cards
        document.querySelectorAll('.packages__card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.12}s`;
        });

        // Why-us cards
        document.querySelectorAll('.why-us__card').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.1}s`;
        });

        // How-it-works steps
        document.querySelectorAll('.how-it-works__step').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.2}s`;
        });

        // Reviews aggregate + cards
        const reviewsAgg = document.querySelector('.reviews__aggregate');
        if (reviewsAgg) reviewsAgg.classList.add('reveal');

        // FAQ items
        document.querySelectorAll('.faq__item').forEach((el, i) => {
            el.classList.add('reveal');
            el.style.transitionDelay = `${i * 0.08}s`;
        });

        // Final CTA
        const ctaContent = document.querySelector('.final-cta__content');
        if (ctaContent) ctaContent.classList.add('reveal-scale');

        // Booking form
        const bookingForm = document.querySelector('.booking__form');
        if (bookingForm) bookingForm.classList.add('reveal-scale');

        // Fleet comparison
        const fleetComparison = document.querySelector('.fleet__comparison');
        if (fleetComparison) fleetComparison.classList.add('reveal');
    }

    addRevealClasses();

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });


    // ────────────── FAQ ACCORDION ──────────────
    const faqItems = document.querySelectorAll('[data-faq]');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all others
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const btn = otherItem.querySelector('.faq__question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });


    // ────────────── REVIEWS CAROUSEL ──────────────
    const track = document.querySelector('.reviews__track');
    const prevBtn = document.getElementById('prevReview');
    const nextBtn = document.getElementById('nextReview');
    const dotsContainer = document.getElementById('carouselDots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.reviews__card');
        let currentSlide = 0;
        let cardsPerView = 3;

        function updateCardsPerView() {
            if (window.innerWidth <= 768) {
                cardsPerView = 1;
            } else if (window.innerWidth <= 1024) {
                cardsPerView = 2;
            } else {
                cardsPerView = 3;
            }
        }

        function getTotalSlides() {
            return Math.max(1, cards.length - cardsPerView + 1);
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            const total = getTotalSlides();
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function goToSlide(index) {
            const total = getTotalSlides();
            currentSlide = Math.max(0, Math.min(index, total - 1));

            const card = cards[0];
            if (!card) return;
            const cardWidth = card.offsetWidth;
            const gap = 28;
            const offset = currentSlide * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;

            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Auto-play
        let autoplayTimer = setInterval(() => {
            const total = getTotalSlides();
            goToSlide((currentSlide + 1) % total);
        }, 5000);

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
        track.addEventListener('mouseleave', () => {
            autoplayTimer = setInterval(() => {
                const total = getTotalSlides();
                goToSlide((currentSlide + 1) % total);
            }, 5000);
        });

        // Initialize
        updateCardsPerView();
        createDots();

        window.addEventListener('resize', () => {
            updateCardsPerView();
            createDots();
            goToSlide(Math.min(currentSlide, getTotalSlides() - 1));
        });
    }


    // ────────────── BACK TO TOP ──────────────
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ────────────── BOOKING FORM ──────────────
    const bookingForm = document.getElementById('bookingForm');
    const fareEstimate = document.getElementById('fareEstimate');

    if (bookingForm && fareEstimate) {
        // Simple fare estimation
        const carSelect = bookingForm.querySelector('select');
        if (carSelect) {
            carSelect.addEventListener('change', () => {
                const prices = {
                    'dzire': '₹1,500 - ₹2,500',
                    'ertiga': '₹2,500 - ₹4,000',
                    'crysta': '₹4,500 - ₹7,000'
                };
                fareEstimate.textContent = prices[carSelect.value] || 'Select details above';
            });
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(bookingForm);
            const inputs = bookingForm.querySelectorAll('.booking__input');
            let allFilled = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    allFilled = false;
                    input.style.borderColor = 'var(--clr-red)';
                    input.style.boxShadow = '0 0 0 4px rgba(239, 68, 68, 0.1)';
                    setTimeout(() => {
                        input.style.borderColor = '';
                        input.style.boxShadow = '';
                    }, 3000);
                }
            });

            if (allFilled) {
                // Build WhatsApp message
                const pickup = inputs[0]?.value || '';
                const drop = inputs[1]?.value || '';
                const date = inputs[2]?.value || '';
                const time = inputs[3]?.value || '';
                const car = inputs[4]?.value || '';
                const passengers = inputs[5]?.value || '';

                const message = `Hi! I'd like to book a cab:\n\n` +
                    `📍 Pickup: ${pickup}\n` +
                    `📍 Drop: ${drop}\n` +
                    `📅 Date: ${date}\n` +
                    `🕐 Time: ${time}\n` +
                    `🚗 Car: ${car}\n` +
                    `👥 Passengers: ${passengers}\n\n` +
                    `Please confirm availability and fare.`;

                const whatsappURL = `https://wa.me/918585973335?text=${encodeURIComponent(message)}`;
                window.open(whatsappURL, '_blank');
            }
        });
    }


    // ────────────── SUBTLE TILT EFFECT (Desktop only) ──────────────
    if (window.innerWidth > 1024) {
        const tiltCards = document.querySelectorAll('[data-tilt]');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -3;
                const rotateY = ((x - centerX) / centerX) * 3;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }


    // ────────────── PARALLAX ON HERO (Desktop only) ──────────────
    if (window.innerWidth > 1024) {
        const heroBgLayer = document.querySelector('.hero__bg-layer--1');
        const heroFloating = document.querySelector('.hero__floating-elements');

        if (heroBgLayer) {
            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                if (scrolled < window.innerHeight) {
                    heroBgLayer.style.transform = `translateY(${scrolled * 0.3}px)`;
                    if (heroFloating) {
                        heroFloating.style.transform = `translateY(${scrolled * 0.15}px)`;
                    }
                }
            }, { passive: true });
        }
    }


    // ────────────── CURSOR GLOW ON HERO (Desktop only) ──────────────
    if (window.innerWidth > 1024) {
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.addEventListener('mousemove', (e) => {
                const rect = hero.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                hero.style.setProperty('--mouse-x', `${x}px`);
                hero.style.setProperty('--mouse-y', `${y}px`);
            });
        }
    }


    // ────────────── PRELOAD CRITICAL IMAGES ──────────────
    const criticalImages = [
        'assets/images/hero-bg-delhi-skyline.jpg',
        'assets/images/hero-car.jpg'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

});
