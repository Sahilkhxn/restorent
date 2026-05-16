// Formspree endpoint
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mrejnvqa';

// Cache DOM elements to avoid repeated queries
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const contactForm = document.querySelector('.contact-form');

// Throttle function for better scroll performance
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mobile Menu Toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Close mobile menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links using event delegation
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        const href = e.target.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        }
    }
});

// Optimized scroll handler with throttle
const updateActiveLink = throttle(() => {
    let current = '';
    const scrollY = window.scrollY || window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}, 100);

window.addEventListener('scroll', updateActiveLink, { passive: true });

// Contact Form Submission with Formspree
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const nameInput = this.querySelector('input[name="name"]');
        const emailInput = this.querySelector('input[name="email"]');
        const subjectInput = this.querySelector('input[name="subject"]');
        const messageInput = this.querySelector('textarea[name="message"]');

        if (nameInput && emailInput && messageInput) {
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const subject = subjectInput ? subjectInput.value.trim() : 'Contact Form Inquiry';
            const message = messageInput.value.trim();

            // Validate inputs
            if (!name || !email || !message) {
                alert('Please fill all fields');
                return;
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email');
                return;
            }

            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Send data to Formspree
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        subject: subject,
                        message: message
                    })
                });

                if (response.ok) {
                    // Success
                    alert(`Thank you ${name}! We'll get back to you soon.`);
                    contactForm.reset();
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                } else {
                    alert('Error sending message. Please try again.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Error sending message. Please check your connection and try again.');
            } finally {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

// Optimized scroll animations with Intersection Observer
const animatedElements = document.querySelectorAll('.dish-card, .stat, .info-item');

if (animatedElements.length > 0) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Unobserve after animation to free up resources
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Set initial state and observe
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });
}

// Handle orientation changes
window.addEventListener('orientationchange', () => {
    navMenu.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
});