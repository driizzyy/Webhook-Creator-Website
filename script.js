// Discord Webhook Creator Pro - Website JavaScript
// Author: driizzyy
// Version: 1.0.0

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        GITHUB_API_BASE: 'https://api.github.com/repos/driizzyy/Webhook-Creator',
        GITHUB_REPO_URL: 'https://github.com/driizzyy/Webhook-Creator',
        ANIMATION_DURATION: 300,
        SCROLL_OFFSET: 80,
        COUNTER_ANIMATION_DURATION: 2000
    };

    // DOM Elements
    const DOM = {
        navbar: null,
        hamburger: null,
        navMenu: null,
        navLinks: null,
        stats: null,
        init() {
            this.navbar = document.querySelector('.navbar');
            this.hamburger = document.getElementById('hamburger');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.stats = document.querySelectorAll('[data-target]');
        }
    };

    // Navigation Handler
    class NavigationHandler {
        constructor() {
            this.isMenuOpen = false;
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.handleScroll();
        }

        setupEventListeners() {
            // Hamburger menu toggle
            DOM.hamburger?.addEventListener('click', () => this.toggleMobileMenu());

            // Close mobile menu when clicking on a link
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    if (link.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                        this.handleSmoothScroll(link);
                    }
                    if (this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                });
            });

            // Scroll event for navbar styling
            window.addEventListener('scroll', () => this.handleScroll());

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMenuOpen && !DOM.navMenu.contains(e.target) && !DOM.hamburger.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            // Escape key to close menu
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }

        toggleMobileMenu() {
            this.isMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
        }

        openMobileMenu() {
            DOM.navMenu.classList.add('active');
            DOM.hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isMenuOpen = true;
        }

        closeMobileMenu() {
            DOM.navMenu.classList.remove('active');
            DOM.hamburger.classList.remove('active');
            document.body.style.overflow = '';
            this.isMenuOpen = false;
        }

        handleSmoothScroll(link) {
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - CONFIG.SCROLL_OFFSET;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }

        handleScroll() {
            if (!DOM.navbar) return;
            
            const scrollY = window.scrollY;
            
            if (scrollY > 50) {
                DOM.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                DOM.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                DOM.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                DOM.navbar.style.boxShadow = 'none';
            }
        }
    }

    // Counter Animation Handler
    class CounterAnimationHandler {
        constructor() {
            this.counters = DOM.stats;
            this.hasAnimated = false;
            this.init();
        }

        init() {
            this.setupIntersectionObserver();
        }

        setupIntersectionObserver() {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.hasAnimated) {
                        this.animateCounters();
                        this.hasAnimated = true;
                    }
                });
            }, options);

            const statsSection = document.querySelector('.hero-stats');
            if (statsSection) {
                observer.observe(statsSection);
            }
        }

        animateCounters() {
            this.counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / (CONFIG.COUNTER_ANIMATION_DURATION / 16);
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 16);
            });
        }
    }

    // GitHub API Handler
    class GitHubAPIHandler {
        constructor() {
            this.init();
        }

        async init() {
            try {
                await this.fetchRepoData();
                await this.fetchLatestRelease();
            } catch (error) {
                console.warn('GitHub API request failed:', error);
                // Fallback to static data if API fails
                this.handleAPIFailure();
            }
        }

        async fetchRepoData() {
            try {
                const response = await fetch(`${CONFIG.GITHUB_API_BASE}`);
                if (!response.ok) throw new Error('GitHub API request failed');
                
                const data = await response.json();
                this.updateRepoStats(data);
            } catch (error) {
                throw error;
            }
        }

        async fetchLatestRelease() {
            try {
                const response = await fetch(`${CONFIG.GITHUB_API_BASE}/releases/latest`);
                if (!response.ok) throw new Error('GitHub releases API request failed');
                
                const data = await response.json();
                this.updateReleaseInfo(data);
            } catch (error) {
                console.warn('Latest release fetch failed:', error);
            }
        }

        updateRepoStats(data) {
            // Update stars count
            const starsCounter = document.querySelector('[data-target="15"]');
            if (starsCounter && data.stargazers_count) {
                starsCounter.setAttribute('data-target', data.stargazers_count);
            }

            // Update download count if available
            if (data.downloads) {
                const downloadsCounter = document.querySelector('[data-target="500"]');
                if (downloadsCounter) {
                    downloadsCounter.setAttribute('data-target', data.downloads);
                }
            }
        }

        updateReleaseInfo(data) {
            // Update version number
            const versionElements = document.querySelectorAll('.stat-number');
            versionElements.forEach(el => {
                if (el.textContent === 'v2.0' && data.tag_name) {
                    el.textContent = data.tag_name;
                }
            });

            // Update download links
            const downloadLinks = document.querySelectorAll('a[href*="releases/latest"]');
            downloadLinks.forEach(link => {
                if (data.html_url) {
                    link.href = data.html_url;
                }
            });

            // Update latest version info in timeline
            const currentVersionElement = document.querySelector('.timeline-item.current h3');
            if (currentVersionElement && data.tag_name) {
                currentVersionElement.textContent = `${data.tag_name} - Professional Edition`;
            }
        }

        handleAPIFailure() {
            // Set fallback values
            console.log('Using fallback GitHub data');
            
            // Update any broken links to point to the repository
            const brokenLinks = document.querySelectorAll('a[href=""]');
            brokenLinks.forEach(link => {
                link.href = CONFIG.GITHUB_REPO_URL;
            });
        }
    }

    // Animation Handler
    class AnimationHandler {
        constructor() {
            this.init();
        }

        init() {
            this.setupScrollAnimations();
            this.setupHoverEffects();
        }

        setupScrollAnimations() {
            const animatedElements = document.querySelectorAll('.feature-card, .timeline-item, .developer-card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }

        setupHoverEffects() {
            // Enhanced button hover effects
            const buttons = document.querySelectorAll('.btn, .download-card, .dev-link');
            
            buttons.forEach(button => {
                button.addEventListener('mouseenter', (e) => {
                    this.createRippleEffect(e);
                });
            });
        }

        createRippleEffect(e) {
            const button = e.currentTarget;
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;

            // Add ripple animation CSS if not exists
            if (!document.getElementById('ripple-styles')) {
                const style = document.createElement('style');
                style.id = 'ripple-styles';
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    }

    // Theme Handler (for future dark mode implementation)
    class ThemeHandler {
        constructor() {
            this.currentTheme = 'light';
            this.init();
        }

        init() {
            this.loadTheme();
        }

        loadTheme() {
            const savedTheme = localStorage.getItem('discord-tool-theme');
            if (savedTheme) {
                this.currentTheme = savedTheme;
                document.body.setAttribute('data-theme', this.currentTheme);
            }
        }

        toggleTheme() {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            document.body.setAttribute('data-theme', this.currentTheme);
            localStorage.setItem('discord-tool-theme', this.currentTheme);
        }
    }

    // Performance Monitor
    class PerformanceMonitor {
        constructor() {
            this.init();
        }

        init() {
            this.measurePageLoad();
            this.setupPerformanceObserver();
        }

        measurePageLoad() {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            });
        }

        setupPerformanceObserver() {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'largest-contentful-paint') {
                            console.log('LCP:', entry.startTime);
                        }
                    }
                });
                
                try {
                    observer.observe({ entryTypes: ['largest-contentful-paint'] });
                } catch (e) {
                    console.log('Performance observer not supported');
                }
            }
        }
    }

    // Accessibility Handler
    class AccessibilityHandler {
        constructor() {
            this.init();
        }

        init() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupARIALabels();
        }

        setupKeyboardNavigation() {
            // Enhanced keyboard navigation for mobile menu
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.handleTabNavigation(e);
                }
            });
        }

        handleTabNavigation(e) {
            const focusableElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }

        setupFocusManagement() {
            // Manage focus for mobile menu
            const mobileMenuLinks = DOM.navMenu?.querySelectorAll('a');
            
            mobileMenuLinks?.forEach((link, index) => {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowDown' && index < mobileMenuLinks.length - 1) {
                        mobileMenuLinks[index + 1].focus();
                        e.preventDefault();
                    } else if (e.key === 'ArrowUp' && index > 0) {
                        mobileMenuLinks[index - 1].focus();
                        e.preventDefault();
                    }
                });
            });
        }

        setupARIALabels() {
            // Add ARIA labels for screen readers
            DOM.hamburger?.setAttribute('aria-label', 'Toggle navigation menu');
            DOM.hamburger?.setAttribute('aria-expanded', 'false');
            
            DOM.navMenu?.setAttribute('aria-hidden', 'true');
        }

        updateARIAStates(isMenuOpen) {
            DOM.hamburger?.setAttribute('aria-expanded', isMenuOpen.toString());
            DOM.navMenu?.setAttribute('aria-hidden', (!isMenuOpen).toString());
        }
    }

    // Error Handler
    class ErrorHandler {
        constructor() {
            this.init();
        }

        init() {
            window.addEventListener('error', (e) => this.handleError(e));
            window.addEventListener('unhandledrejection', (e) => this.handlePromiseRejection(e));
        }

        handleError(error) {
            console.error('JavaScript Error:', error.error);
            // Could implement error reporting here
        }

        handlePromiseRejection(event) {
            console.error('Unhandled Promise Rejection:', event.reason);
            event.preventDefault(); // Prevent console spam
        }
    }

    // Main Application
    class DiscordToolWebsite {
        constructor() {
            this.handlers = {};
            this.init();
        }

        async init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        }

        start() {
            try {
                // Initialize DOM references
                DOM.init();

                // Initialize all handlers
                this.handlers.navigation = new NavigationHandler();
                this.handlers.counter = new CounterAnimationHandler();
                this.handlers.github = new GitHubAPIHandler();
                this.handlers.animation = new AnimationHandler();
                this.handlers.theme = new ThemeHandler();
                this.handlers.performance = new PerformanceMonitor();
                this.handlers.accessibility = new AccessibilityHandler();
                this.handlers.error = new ErrorHandler();

                console.log('Discord Webhook Creator Pro website loaded successfully');
                
            } catch (error) {
                console.error('Failed to initialize website:', error);
            }
        }
    }

    // Utility Functions
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        formatNumber(num) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        }
    };

    // Initialize the application
    new DiscordToolWebsite();

    // Export for debugging in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.DiscordToolWebsite = DiscordToolWebsite;
        window.utils = utils;
    }

})();
