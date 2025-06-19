document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initViewportHeight();
    initTheme();
    initNavigation();
    // initParticles(); // Disabled - now handled per page
    initTyped();
    initTilt();
    initScrollReveal();
    initScrollTop();
    initContactForm();
    loadSkills();
});

// Also initialize particles when window loads (backup)
window.addEventListener('load', function() {
    if (!window.particlesInitialized) {
        setTimeout(() => {
            initParticles();
        }, 200);
    }
});

// Fix viewport height for mobile browsers
function initViewportHeight() {
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                // Close menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                body.style.overflow = 'auto';
            } else {
                // Open menu
                navMenu.classList.add('active');
                navToggle.classList.add('active');
                body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                body.style.overflow = 'auto';
            }
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });

    // Close menu on window resize (if switching from mobile to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });

    // Change navbar background on scroll (theme-aware)
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const isDarkTheme = document.body.getAttribute('data-theme') === 'dark';
        
        if (window.scrollY > 100) {
            if (isDarkTheme) {
                navbar.style.background = 'rgba(26, 26, 26, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        } else {
            if (isDarkTheme) {
                navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            }
            navbar.style.boxShadow = 'none';
        }
    });
}

// Theme toggle functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Get saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        updateNavbarTheme('dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        updateNavbarTheme('light');
    }
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            
            if (currentTheme === 'dark') {
                body.setAttribute('data-theme', 'light');
                themeIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
                updateNavbarTheme('light');
                updateParticlesForTheme('light');
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
                updateNavbarTheme('dark');
                updateParticlesForTheme('dark');
            }
        });
    }
}

// Update navbar theme immediately
function updateNavbarTheme(theme) {
    const navbar = document.querySelector('.navbar');
    const isDark = theme === 'dark';
    
    if (window.scrollY > 100) {
        if (isDark) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    } else {
        if (isDark) {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
        navbar.style.boxShadow = 'none';
    }
}

// Update particles color based on theme
function updateParticlesForTheme(theme) {
    // Re-initialize particles with theme-appropriate colors
    if (typeof particlesJS !== 'undefined') {
        const isDark = theme === 'dark';
        const particleColors = isDark ? ['#0fa0ce', '#00d4ff', '#ffffff'] : ['#0fa0ce', '#00d4ff', '#1890ff'];
        const lineColor = isDark ? '#ffffff' : '#0fa0ce';
        
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 120,
                    density: {
                        enable: true,
                        value_area: 1000
                    }
                },
                color: {
                    value: particleColors
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: isDark ? 0.4 : 0.6,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: isDark ? 0.1 : 0.2,
                        sync: false
                    }
                },
                size: {
                    value: 4,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.5,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 180,
                    color: lineColor,
                    opacity: isDark ? 0.3 : 0.5,
                    width: 1.5
                },
                move: {
                    enable: true,
                    speed: 4,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 600
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: ['grab', 'bubble']
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 200,
                        line_linked: {
                            opacity: isDark ? 0.5 : 0.8
                        }
                    },
                    bubble: {
                        distance: 250,
                        size: 8,
                        duration: 1,
                        opacity: isDark ? 0.6 : 0.8,
                        speed: 3
                    },
                    repulse: {
                        distance: 150,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 3
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Initialize Typed.js
function initTyped() {
    if (typeof Typed !== 'undefined') {
        const typedElement = document.querySelector('.typed');
        if (typedElement) {
            const typedStrings = typedElement.getAttribute('data-typed');
            if (typedStrings) {
                new Typed('.typed', {
                    strings: JSON.parse(typedStrings),
                    typeSpeed: 50,
                    backSpeed: 30,
                    backDelay: 2000,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|'
                });
            }
        }
    }
}

// Initialize Tilt.js
function initTilt() {
    if (typeof VanillaTilt !== 'undefined') {
        const tiltElements = document.querySelectorAll('[data-tilt]');
        VanillaTilt.init(tiltElements, {
            max: 25,
            speed: 400,
            glare: true,
            'max-glare': 0.5,
            scale: 1.02
        });
    }
}

// Initialize AOS (Animate On Scroll)
function initScrollReveal() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            offset: 100
        });
    }
}

// Scroll to top functionality
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Contact functionality
function initContactForm() {
    // Add smooth scroll animation for contact buttons
    const contactButtons = document.querySelectorAll('.contact-btn');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add notification for WhatsApp and other external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.href.includes('wa.me') ? 'WhatsApp' : 
                           this.href.includes('linkedin') ? 'LinkedIn' : 
                           this.href.includes('facebook') ? 'Facebook' : 'External';
            
            showNotification(`Opening ${platform}...`, 'info');
        });
    });
}

// Load skills for the skills page
function loadSkills() {
    const technicalSkills = [
        { name: 'C Programming', icon: 'fas fa-code', description: 'Programming Language' },
        { name: 'HTML', icon: 'fab fa-html5', description: 'Web Development' },
        { name: 'Python', icon: 'fab fa-python', description: 'Programming & Automation' },
        { name: 'SolidWorks', icon: 'fas fa-cube', description: '3D CAD Modeling' },
        { name: 'AutoCAD', icon: 'fas fa-drafting-compass', description: 'Technical Drawing' },
        { name: 'ANSYS', icon: 'fas fa-cogs', description: 'Engineering Simulation' },
        { name: 'MS Office', icon: 'fas fa-file-alt', description: 'Documentation & Presentation' }
    ];
    
    const softSkills = [
        { name: 'Leadership', icon: 'fas fa-users', description: 'Team Management & Organization' },
        { name: 'Communication', icon: 'fas fa-comments', description: 'Effective Presentation' },
        { name: 'Problem Solving', icon: 'fas fa-brain', description: 'Analytical Thinking' },
        { name: 'Adaptability', icon: 'fas fa-sync-alt', description: 'Quick Learning' },
        { name: 'Time Management', icon: 'fas fa-clock', description: 'Meeting Deadlines' },
        { name: 'Teamwork', icon: 'fas fa-handshake', description: 'Collaborative Work' }
    ];
    
    renderSkills('technical-skills', technicalSkills);
    renderSkills('soft-skills', softSkills);
}

// Render skills in the DOM
function renderSkills(containerId, skills) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item';
        skillElement.innerHTML = `
            <i class="${skill.icon}"></i>
            <h4>${skill.name}</h4>
            <p>${skill.description}</p>
        `;
        container.appendChild(skillElement);
    });
}

// Show notification
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        justify-content: space-between;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
            padding: 0;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
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
}

// Performance optimization: Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    initLazyLoading();
}

// Add loading animation
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    // Reinitialize particles on resize
    if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
        pJSDom[0].pJS.fn.particlesRefresh();
    }
});

// Console message
console.log('🚀 Portfolio website loaded successfully!');
console.log('💼 Srijib Mukherjee - Mechanical Engineering Student');
console.log('🔧 Built with HTML5, CSS3, JavaScript, and modern libraries');

// Initialize particles.js
function initParticles() {
    // Check if particles element exists
    const particlesElement = document.getElementById('particles-js');
    if (!particlesElement) {
        console.log('Particles element not found');
        return;
    }
    
    // Check if particles.js library is loaded
    if (typeof particlesJS === 'undefined') {
        console.log('Particles.js library not loaded, retrying...');
        setTimeout(initParticles, 500);
        return;
    }
    
    try {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 120,
                    density: {
                        enable: true,
                        value_area: 1000
                    }
                },
                color: {
                    value: ['#0fa0ce', '#00d4ff', '#1890ff']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.6,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.2,
                        sync: false
                    }
                },
                size: {
                    value: 4,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.5,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 180,
                    color: '#0fa0ce',
                    opacity: 0.5,
                    width: 1.5
                },
                move: {
                    enable: true,
                    speed: 4,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: true,
                        rotateX: 600,
                        rotateY: 600
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: ['grab', 'bubble']
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 200,
                        line_linked: {
                            opacity: 0.8
                        }
                    },
                    bubble: {
                        distance: 250,
                        size: 8,
                        duration: 1,
                        opacity: 0.8,
                        speed: 3
                    },
                    repulse: {
                        distance: 150,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 3
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
        
        // Mark particles as initialized
        window.particlesInitialized = true;
        console.log('Particles.js initialized successfully');
        
    } catch (error) {
        console.error('Error initializing particles:', error);
        // Retry after a delay
        setTimeout(initParticles, 1000);
    }
} 