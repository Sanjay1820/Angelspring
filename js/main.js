document.addEventListener('DOMContentLoaded', () => {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
                // Ensure social sidebar is visible
                const socialSidebar = document.querySelector('.fixed-socials');
                if (socialSidebar) {
                    socialSidebar.classList.add('active');
                }
            }, 1000);
        });
    }

    // Custom Cursor & Interaction Setup
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    const bgGlow = document.createElement('div');

    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    bgGlow.className = 'bg-glow';

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    document.body.appendChild(bgGlow);

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

    // Magnetic Pulse for Background
    let cursorInited = false;
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        if (!cursorInited) {
            cursorDot.style.opacity = "1";
            cursorOutline.style.opacity = "1";
            cursorInited = true;
        }

        // Use pure coordinate positioning - CSS handles the -50% centering
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smoothly animate the outline to follow the exact center
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 150, fill: "forwards" });

        // Interactive Background Glow
        document.documentElement.style.setProperty('--x', posX + 'px');
        document.documentElement.style.setProperty('--y', posY + 'px');
    });

    // Cursor Hover Effect - Using delegation for better reliability
    document.body.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .product-card, .social-link, .hq-badge, .filter-btn, .modal-close, .fab-btn, .nav-toggle');
        if (target) {
            document.body.classList.add('cursor-hover');
            if (target.classList.contains('modal-close')) {
                document.body.classList.add('cursor-exit');
            }
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .product-card, .social-link, .hq-badge, .filter-btn, .modal-close, .fab-btn, .nav-toggle');
        if (target) {
            document.body.classList.remove('cursor-hover');
            document.body.classList.remove('cursor-exit');
        }
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

        // Close menu when clicking links
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
        // Header logic
        if (window.scrollY > 36) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top logic
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
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
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out expo for a premium feel
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

    document.querySelectorAll('.animate-up, section, footer, .product-card, .feature-item, .reveal-text, .counter-section').forEach(el => {
        observer.observe(el);
    });

    // Product Data
    const products = [
        {
            id: 1,
            name: "Industrial Compression Springs",
            description: "Engineered for maximum resilience under high-pressure industrial loads. Our compression springs utilize Grade 316 Stainless Steel for superior corrosion resistance in harsh chemical environments.",
            material: "SS 304, 316, 17-7 PH",
            specs: {
                "Wire Dia Range": "0.1mm to 65mm",
                "Load Capacity": "Up to 500kN",
                "Stress Relief": "24h Heat Treated",
                "Surface Finish": "Passivated / Electro-polished"
            },
            advantages: [
                "Superior high-temperature performance",
                "Precise spring constants (k-factor)",
                "Zero-failure metallurgical bonding"
            ],
            applications: "Oil & Gas, Heavy Machinery, Aerospace Valves",
            image: "assets/product-spring-1.webp"
        },
        {
            id: 2,
            name: "High-Torque Torsion Springs",
            description: "Specifically designed for consistent rotational force application. These springs are precision-wound to ensure minimal friction and maximum life cycles in repetitive motion systems.",
            material: "Stainless Steel Spring Wire (Grade II/III)",
            specs: {
                "Torque Precision": "+/- 2%",
                "Max Deflection": "320 Degrees",
                "End Types": "Straight, Hooked, Custom-Bent"
            },
            advantages: [
                "Ultra-smooth rotational movement",
                "Optimized leg configurations",
                "High cycle fatigue resistance"
            ],
            applications: "Automotive Controls, Medical Hinges, Industrial Doors",
            image: "assets/product-spring-2.webp"
        },
        {
            id: 3,
            name: "Heavy-Duty Extension Springs",
            description: "Built to withstand extreme tension. Our extension springs feature reinforced loop ends to prevent failure at the connection points under maximum stretch conditions.",
            material: "Cold-Drawn Stainless Steel Alloy",
            specs: {
                "Initial Tension": "Configurable",
                "Loop Strength": "5x Rated Load",
                "Fatigue Life": "1 Million+ Cycles"
            },
            advantages: [
                "Advanced initial tension control",
                "Reinforced loop geometry",
                "Superior tensile strength retention"
            ],
            applications: "Garage Systems, Agricultural Implements, Weighing Scales",
            image: "assets/product-spring-3.webp"
        },
        {
            id: 4,
            name: "Precision Flat & Leaf Springs",
            description: "Stamped and formed with CNC accuracy. These components offer high energy storage in compact spaces, ideal for electronic contacts and small mechanism returns.",
            material: "Full-Hard Spring Temper Steel",
            specs: {
                "Thickness": "0.05mm to 10mm",
                "Dimensional Tol": "+/- 0.005mm",
                "Burr Removal": "Vibratory Tumbled"
            },
            advantages: [
                "Micro-dimensional stability",
                "Optimal grain orientation",
                "High electrical conductivity options"
            ],
            applications: "Medical Devices, Electrical Switches, Aerospace Clips",
            image: "assets/product-spring-4.webp"
        }
    ];

    // Product Modal System
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close"><i class="fas fa-times"></i></span>
            
            <!-- Left: Premium HUD Display -->
            <div class="modal-left" style="display: flex; flex-direction: column; justify-content: flex-start; padding: 60px; position: relative; background: #050505;">
                <div class="hud-corner hud-tl"></div>
                <div class="hud-corner hud-tr"></div>
                <div class="hud-corner hud-bl"></div>
                <div class="hud-corner hud-br"></div>

                <div style="font-size: 0.65rem; color: var(--steel-grey); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 40px; opacity: 0.5;">
                    <i class="fas fa-microchip" style="margin-right: 10px;"></i> Advanced Component Scan
                </div>

                <div style="flex: 1; display: flex; align-items: center; justify-content: center; width: 100%; position: relative;">
                    <img id="modal-img" src="" alt="Product Image" style="max-height: 100%; max-width: 100%; object-fit: contain; filter: drop-shadow(0 40px 80px rgba(0,0,0,0.9)); transform: scale(1.1); transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);">
                </div>
            </div>

            <!-- Right: Technical Specification Panel -->
            <div class="modal-right" style="display: flex; flex-direction: column; padding: 60px; overflow-y: auto; height: 100%;">
                <div style="font-size: 0.75rem; letter-spacing: 4px; color: var(--white); text-transform: uppercase; margin-bottom: 20px; font-weight: 900; opacity: 0.6; display: flex; align-items: center;">
                    <div style="width: 20px; height: 1px; background: var(--white); margin-right: 15px;"></div>
                    Technical Data Sheet
                </div>
                
                <h2 id="modal-title" style="margin-bottom: 15px;"></h2>
                
                <div style="display: flex; gap: 15px; margin-bottom: 35px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 8px 18px; border-radius: 50px; font-size: 0.75rem; border: 1px solid rgba(255,255,255,0.1); color: var(--white); font-weight: 700;">
                        <i class="fas fa-dna" style="margin-right: 10px; opacity: 0.5;"></i> <span id="modal-material"></span>
                    </div>
                </div>

                <p id="modal-desc" style="margin-bottom: 40px; color: var(--steel-grey); font-size: 1.1rem; line-height: 1.8;"></p>
                
                <div style="background: rgba(255,255,255,0.015); border-radius: 20px; padding: 30px; border: 1px solid rgba(255,255,255,0.05);">
                    <h4 style="margin-bottom: 20px; color: var(--white); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8;">Performance Specs</h4>
                    <table class="spec-table" style="margin-bottom: 0;">
                        <tbody id="modal-specs"></tbody>
                    </table>
                </div>
                
                <div style="margin-top: 40px; margin-bottom: 50px;">
                    <h4 style="margin-bottom: 20px; color: var(--white); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8;">Key Advantages</h4>
                    <div id="modal-advantages" style="display: flex; flex-wrap: wrap;"></div>
                </div>

                <div style="margin-top: 40px; margin-bottom: 50px;">
                    <a href="contact.html" class="btn btn-primary" style="display: block; text-align: center; padding: 1.8rem; font-size: 1.2rem; width: 100%; border-radius: 12px; font-weight: 800; letter-spacing: 3px;">Quote Now</a>
                </div>

                <!-- Related Products Section (At bottom of scroll) -->
                <div class="related-products-section" style="margin-top: 40px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.05);">
                    <div style="margin-bottom: 25px;">
                        <h4 style="color: var(--white); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 4px; font-weight: 900; margin-bottom: 5px;">Related Engineering Systems</h4>
                        <p style="color: var(--steel-grey); font-size: 0.85rem;">Discover compatible high-performance components.</p>
                    </div>
                    <div id="related-carousel" class="owl-carousel owl-theme"></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const openModal = (product) => {
        document.getElementById('modal-title').innerText = product.name;
        document.getElementById('modal-desc').innerText = product.description;
        document.getElementById('modal-img').src = product.image;
        document.getElementById('modal-material').innerText = product.material;

        const advantagesList = document.getElementById('modal-advantages');
        advantagesList.innerHTML = '';
        product.advantages.forEach(adv => {
            advantagesList.innerHTML += `<span class="advantage-tag">${adv}</span>`;
        });

        const carouselContainer = document.getElementById('related-carousel');
        // Destroy existing owl instance if any
        if ($(carouselContainer).hasClass('owl-loaded')) {
            $(carouselContainer).owlCarousel('destroy').removeClass('owl-loaded');
        }
        carouselContainer.innerHTML = '';

        // Filter out current product and add to carousel
        products.filter(p => p.id !== product.id).forEach(p => {
            carouselContainer.innerHTML += `
                <div class="item" style="cursor: pointer; background: rgba(255,255,255,0.03); padding: 30px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.05); text-align: center; transition: all 0.5s ease; height: 100%;">
                    <div style="height: 180px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px;">
                         <img src="${p.image}" alt="${p.name}" style="max-height: 100%; width: auto; max-width: 90%; object-fit: contain; filter: drop-shadow(0 15px 30px rgba(0,0,0,0.4));">
                    </div>
                    <h5 style="font-size: 1rem; color: var(--white); font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; letter-spacing: 1px;">${p.name}</h5>
                    <div style="margin-top: 15px; font-size: 0.75rem; color: var(--steel-grey); text-transform: uppercase; letter-spacing: 2px; font-weight: 700;">Analyze Specs <i class="fas fa-arrow-right" style="margin-left: 10px;"></i></div>
                </div>
            `;
        });

        const specsBody = document.getElementById('modal-specs');
        specsBody.innerHTML = '';
        for (const [key, value] of Object.entries(product.specs)) {
            specsBody.innerHTML += `
                <tr>
                    <td class="spec-label">${key}</td>
                    <td>${value}</td>
                </tr>
            `;
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize Owl Carousel
        setTimeout(() => {
            $('#related-carousel').owlCarousel({
                loop: false,
                margin: 25,
                nav: false,
                dots: true,
                responsive: {
                    0: { items: 1 },
                    1000: { items: 2 }
                }
            });

            // Re-open modal with new product when clicking carousel item
            document.querySelectorAll('#related-carousel .item').forEach((itemEl, idx) => {
                itemEl.addEventListener('click', () => {
                    const relatedProducts = products.filter(p => p.id !== product.id);
                    openModal(relatedProducts[idx]);
                });
            });
        }, 100);
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            // In a real app, match by ID. Here we use index as we have 3 cards.
            openModal(products[index % products.length]);
        });
    });

    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
