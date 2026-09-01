/* ========================================
   REX PORTFOLIO — Interactions & Animations
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ========== CURSOR GLOW ==========
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        cursorGlow.style.left = glowX + 'px';
        cursorGlow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
    }
    animateGlow();

    // ========== NAVIGATION ==========
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const allNavLinks = document.querySelectorAll('.nav-link');

    // Scroll state
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile menu on link click
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');

    function updateActiveLink() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                allNavLinks.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ========== SCROLL ANIMATIONS ==========
    const animateElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // ========== COUNTER ANIMATION ==========
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();

                function updateCount(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased);

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    }
                }

                requestAnimationFrame(updateCount);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ========== CONTACT FORM (EMAILJS) ==========
    // TODO: Replace with YOUR EmailJS credentials (see setup instructions)
    const EMAILJS_CONFIG = {
        serviceId: 'service_klli7i6',
        templateId: 'template_9nmiyqs',
        publicKey: 'cmc9PuAhwg8ZdwL_4'
    };

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (EMAILJS_CONFIG.serviceId.startsWith('YOUR_')) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Email service not configured yet. Contact Rex directly at regismugisha40@gmail.com';
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').style.display = 'none';
            submitBtn.querySelector('.btn-success').style.display = 'none';
            submitBtn.querySelector('.btn-loading').style.display = 'flex';

            const templateParams = {
                from_name: contactForm.from_name.value,
                from_email: contactForm.from_email.value,
                subject: contactForm.subject.value || 'New message from portfolio',
                message: contactForm.message.value
            };

            emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
                .then(() => {
                    // Success
                    submitBtn.querySelector('.btn-loading').style.display = 'none';
                    submitBtn.querySelector('.btn-success').style.display = 'inline';
                    formStatus.className = 'form-status success';
                    formStatus.textContent = 'Message sent successfully! I will get back to you within 24 hours.';
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        submitBtn.querySelector('.btn-text').style.display = 'inline';
                        submitBtn.querySelector('.btn-success').style.display = 'none';
                        formStatus.textContent = '';
                    }, 4000);
                })
                .catch((error) => {
                    console.error('EmailJS full error:', error);
                    const msg = (error && (error.text || error.message)) || JSON.stringify(error) || 'Unknown error';
                    // Reset button state
                    submitBtn.disabled = false;
                    submitBtn.querySelector('.btn-text').style.display = 'inline';
                    submitBtn.querySelector('.btn-loading').style.display = 'none';
                    formStatus.className = 'form-status error';
                    formStatus.textContent = 'Send failed: ' + msg;
                });
        });
    }

});
