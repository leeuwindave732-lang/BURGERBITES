// main.js - Main JavaScript file for BurgerBite website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init();
    }

    // Smooth scrolling for navigation links with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Skip smooth scroll for carousel controls
            if (this.hasAttribute('data-slide')) {
                return;
            }
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = document.querySelector('.nav-bar').offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Advanced form validation for contact form with real-time feedback
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea');
        const submitBtn = contactForm.querySelector('button[type="submit"]');

        // Add loading, sent, and error message elements if not present
        if (!contactForm.querySelector('.loading')) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading';
            loadingDiv.innerHTML = 'Sending...';
            loadingDiv.style.display = 'none';
            loadingDiv.style.color = 'var(--first-color)';
            loadingDiv.style.marginTop = '10px';
            contactForm.appendChild(loadingDiv);
        }

        if (!contactForm.querySelector('.sent-message')) {
            const sentDiv = document.createElement('div');
            sentDiv.className = 'sent-message';
            sentDiv.innerHTML = 'Your message has been sent successfully!';
            sentDiv.style.display = 'none';
            sentDiv.style.color = 'green';
            sentDiv.style.marginTop = '10px';
            contactForm.appendChild(sentDiv);
        }

        if (!contactForm.querySelector('.error-message')) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.innerHTML = 'An error occurred. Please try again.';
            errorDiv.style.display = 'none';
            errorDiv.style.color = 'red';
            errorDiv.style.marginTop = '10px';
            contactForm.appendChild(errorDiv);
        }

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                return;
            }

            // Simulate form submission
            const loading = this.querySelector('.loading');
            const sentMessage = this.querySelector('.sent-message');
            const errorMessage = this.querySelector('.error-message');

            loading.style.display = 'block';
            sentMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            submitBtn.disabled = true;

            setTimeout(() => {
                loading.style.display = 'none';
                sentMessage.style.display = 'block';
                this.reset();
                submitBtn.disabled = false;
                // Reset validation states
                inputs.forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
            }, 2000);
        });
    }

    // Scroll top button
    const scrollTop = document.querySelector('.scroll-top');
    if (scrollTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                scrollTop.classList.add('active');
            } else {
                scrollTop.classList.remove('active');
            }
        });

        scrollTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile menu slide-out animation
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('#navmenu');
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('mobile-nav-active');
            this.classList.toggle('bi-list');
            this.classList.toggle('bi-x');
        });

        // Close mobile menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-nav-active');
                mobileNavToggle.classList.remove('bi-x');
                mobileNavToggle.classList.add('bi-list');
            });
        });
    }

    // Modal system for menu previews
    const modal = document.getElementById('menuModal');
    const modalClose = modal ? modal.querySelector('.close') : null;
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    if (modal && modalClose && modalTriggers.length > 0) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                const menuItem = this.closest('.card') || this.closest('.feature-card');
                if (menuItem) {
                    const title = menuItem.querySelector('h3, .card__name')?.textContent || 'Menu Item';
                    const description = menuItem.querySelector('p, .card__precis')?.textContent || '';
                    const price = menuItem.querySelector('.card__price')?.textContent || '';

                    modal.querySelector('.modal-title').textContent = title;
                    modal.querySelector('.modal-description').textContent = description;
                    modal.querySelector('.modal-price').textContent = price;

                    modal.style.display = 'block';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Keyboard navigation for modal
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    }

    function closeModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.card, .feature-card, .service-item').forEach(el => {
        observer.observe(el);
    });

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Handle Enter/Space on interactive elements
        if (e.key === 'Enter' || e.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement && (focusedElement.classList.contains('modal-trigger') || focusedElement.classList.contains('card'))) {
                e.preventDefault();
                focusedElement.click();
            }
        }
    });

    // Focus management for accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusableContent = modal ? modal.querySelectorAll(focusableElements) : [];
            const firstFocusableElement = focusableContent[0];
            const lastFocusableElement = focusableContent[focusableContent.length - 1];

            if (modal && modal.style.display === 'block') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        }
    });
});

// Utility function for form validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    field.classList.remove('is-valid', 'is-invalid');

    switch(field.name) {
        case 'name':
            if (!value) {
                isValid = false;
                message = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                message = 'Name must be at least 2 characters';
            }
            break;
        case 'email':
            if (!value) {
                isValid = false;
                message = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            break;
        case 'subject':
            if (!value) {
                isValid = false;
                message = 'Subject is required';
            }
            break;
        case 'message':
            if (!value) {
                isValid = false;
                message = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                message = 'Message must be at least 10 characters';
            }
            break;
    }

    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    return isValid;
}
