/* ============================================================
   MG DRILL AND GRILL — JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- NAVBAR SCROLL ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ---- HAMBURGER MENU ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    let menuOpen = false;

    hamburger.addEventListener('click', () => {
        menuOpen = !menuOpen;
        navLinks.classList.toggle('open', menuOpen);
        hamburger.classList.toggle('active', menuOpen);
        document.body.style.overflow = menuOpen ? 'hidden' : '';

        // Animate hamburger to X
        const spans = hamburger.querySelectorAll('span');
        if (menuOpen) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile nav when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuOpen = false;
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (menuOpen && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            menuOpen = false;
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // ---- ACTIVE NAV LINK ON SCROLL ----
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-link');

    const activateNavLink = () => {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navAnchors.forEach(a => {
                    a.style.fontWeight = '';
                    a.style.color = '';
                });
                const active = document.querySelector(`.nav-link[href="#${id}"]`);
                if (active) {
                    active.style.fontWeight = '700';
                    active.style.color = 'var(--charcoal)';
                }
            }
        });
    };

    window.addEventListener('scroll', activateNavLink, { passive: true });

    // ---- SCROLL REVEAL ANIMATION ----
    const revealElements = document.querySelectorAll(
        '.about-text, .about-cards, .cat-panel, .step-card, .why-card, .testi-card, .contact-form-wrap, .contact-info-wrap'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, (entry.target.dataset.delay || 0) * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    // Stagger sibling cards
    const staggerGroups = [
        '.steps-row .step-card',
        '.why-grid .why-card',
        '.testi-grid .testi-card',
        '.categories-split .cat-panel'
    ];

    staggerGroups.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.dataset.delay = i;
        });
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- CONTACT FORM SUBMISSION ----
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    const showToast = (message, isError = false) => {
        toastMsg.textContent = message;
        toast.style.borderLeftColor = isError ? 'var(--orange)' : 'var(--yellow)';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fname = document.getElementById('fname').value.trim();
        const lname = document.getElementById('lname').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!fname || !email) {
            showToast('Please fill in your name and email address.', true);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address.', true);
            return;
        }

        // Simulate form submission
        const submitBtn = document.getElementById('form-submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
      <span>Sending...</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    `;

        // Add spin animation inline
        const style = document.createElement('style');
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);

        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            form.reset();
            showToast(`Thank you, ${fname}! We'll be in touch within a few hours.`);
        }, 1800);
    });

    // ---- SMOOTH ANCHOR SCROLL WITH OFFSET ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72);
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // ---- COUNTER ANIMATION FOR HERO STATS ----
    let countersStarted = false;

    const animateCounter = (el, target, suffix = '') => {
        const duration = 1500;
        const start = performance.now();
        const update = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const heroSection = document.getElementById('home');
    const statNums = document.querySelectorAll('.stat-num');
    const statTargets = [500, 25, 1200];
    const statSuffixes = ['+', '+', '+'];

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                statNums.forEach((el, i) => {
                    animateCounter(el, statTargets[i], statSuffixes[i]);
                });
            }
        });
    }, { threshold: 0.3 });

    if (heroSection) statsObserver.observe(heroSection);

    // ---- PARALLAX HINT ON HERO IMAGE HOVER ----
    const heroSplit = document.querySelector('.hero-split-bg');
    if (heroSplit && window.innerWidth > 768) {
        document.querySelector('.hero').addEventListener('mousemove', (e) => {
            const rect = heroSplit.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const imgs = heroSplit.querySelectorAll('.hero-bg-img');
            imgs.forEach(img => {
                img.style.transform = `scale(1.05) translate(${x * 10}px, ${y * 6}px)`;
            });
        });

        document.querySelector('.hero').addEventListener('mouseleave', () => {
            const imgs = heroSplit.querySelectorAll('.hero-bg-img');
            imgs.forEach(img => {
                img.style.transform = 'scale(1.05)';
            });
        });
    }

    // ---- CATEGORY PANEL HOVER GLOW ----
    document.querySelectorAll('.cat-panel').forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            const isConstruction = panel.classList.contains('cat-construction');
            panel.style.boxShadow = isConstruction
                ? '0 20px 60px rgba(245,197,24,0.15)'
                : '0 20px 60px rgba(255,107,53,0.15)';
        });
        panel.addEventListener('mouseleave', () => {
            panel.style.boxShadow = '';
        });
    });

    // ---- RENTAL COLLECTION TAB SWITCHER ----
    const rcTabs = document.querySelectorAll('.rc-tab');
    const rcPanels = document.querySelectorAll('.rc-panel');

    rcTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update tab active states
            rcTabs.forEach(t => {
                t.classList.remove('rc-tab-active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('rc-tab-active');
            tab.setAttribute('aria-selected', 'true');

            // Show the matching panel
            rcPanels.forEach(panel => {
                panel.classList.remove('rc-panel-active');
            });
            const targetPanel = document.getElementById(`panel-${targetTab}`);
            if (targetPanel) {
                targetPanel.classList.add('rc-panel-active');
            }

            // Trigger reveal on product cards in the newly shown panel
            if (targetPanel) {
                const cards = targetPanel.querySelectorAll('.rc-card');
                cards.forEach((card, i) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 60);
                });
            }
        });
    });

    // ---- RC CARD HOVER GLOW ----
    document.querySelectorAll('.rc-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const isYellow = card.querySelector('.rc-badge-yellow');
            card.style.boxShadow = isYellow
                ? '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,197,24,0.2)'
                : '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,53,0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '';
        });
    });

    // ---- SCAFFOLDING SPECS TOGGLE ----
    document.querySelectorAll('.rc-specs-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const panelId = btn.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Toggle
            btn.setAttribute('aria-expanded', String(!isOpen));
            panel.setAttribute('aria-hidden', String(isOpen));
            panel.classList.toggle('rc-specs-open', !isOpen);

            // Update button label
            const label = btn.querySelector('span');
            if (label) label.textContent = isOpen ? 'View Full Specs' : 'Hide Specs';

            // Scroll the card into view smoothly after opening
            if (!isOpen) {
                setTimeout(() => {
                    btn.closest('.rc-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 120);
            }
        });
    });

});


