document.addEventListener('DOMContentLoaded', () => {
    // Unified Preloader & Display Logic
    const preloader = document.getElementById('preloader');
    const hidePreloader = () => {
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                // Trigger visibility for social sidebar
                const socialSidebar = document.querySelector('.fixed-socials');
                if (socialSidebar) socialSidebar.classList.add('active');
            }, 1000);
        }
    };

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
        // Safety timeout for slow connections
        setTimeout(hidePreloader, 4000);
    }



    // Magnetic Interaction Setup
    const magneticElements = document.querySelectorAll('.btn, .social-link, .logo');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0, 0)`;
        });
    });

    // Advanced 3D Tilt for Product Cards
    const tiltCards = document.querySelectorAll('.product-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // Background Interactivity
    window.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--x', e.clientX + 'px');
        document.documentElement.style.setProperty('--y', e.clientY + 'px');
    });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('#nav-menu ul li a');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // Header Scroll Effect & Float Buttons
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 36) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    };

    function animateCounters() {
        const counters = document.querySelectorAll('.counter-val');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(easeOutExpo * target);

                counter.innerText = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target;
                }
            };
            requestAnimationFrame(updateCount);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if (entry.target.classList.contains('counter-section')) {
                    animateCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // --- PRODUCT REDIRECTION SYSTEM ---
    window.handleProductClick = (card) => {
        const title = card.getAttribute('data-title');
        const description = card.getAttribute('data-description');
        const image = card.getAttribute('data-image');
        const category = card.getAttribute('data-category');
        const specs = JSON.parse(card.getAttribute('data-specs'));
        const features = JSON.parse(card.getAttribute('data-features'));

        const productData = {
            title,
            description,
            image,
            category,
            specs,
            features
        };

        // Persist data for the detail page
        sessionStorage.setItem('activeProductDetail', JSON.stringify(productData));

        // Redirect with a clean URL parameter for SEO and context
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        window.location.href = `product-detail.html?name=${slug}`;
    };

    // Observe all animatable elements
    const animateElements = document.querySelectorAll('.animate-up, section, footer, .product-card, .feature-item, .reveal-text, .counter-section, .footer-grid, .footer-bottom');
    animateElements.forEach(el => {
        observer.observe(el);

        // Safety: If element is already in viewport, activate it
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('active');
            if (el.classList.contains('counter-section')) animateCounters();
        }
    });

    // Final safety: Force all elements visible after 2 seconds if still hidden
    setTimeout(() => {
        document.querySelectorAll('.animate-up:not(.active), .reveal-text:not(.active)').forEach(el => {
            el.classList.add('active');
        });
    }, 2000);

});

