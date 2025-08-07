// Discord Webhook Creator Pro - Main Website JavaScript
// Professional Discord webhook management system

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initAnimations();
    initScrollEffects();
    initStatCounters();
    initThemeToggle();
    initDiscordWidget();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Smooth Animations
function initAnimations() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add entrance animations to cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and feature elements
    document.querySelectorAll('.feature-card, .card, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Scroll Effects
function initScrollEffects() {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove navbar background on scroll
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll direction
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}

// Animated Stat Counters
function initStatCounters() {
    const stats = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const start = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
            
            counter.textContent = currentValue.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // Intersection Observer for stat counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => counterObserver.observe(stat));
}

// Theme Toggle (if implemented)
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

// Discord Widget Integration
function initDiscordWidget() {
    // This function is called by the Discord widget system
    if (typeof window.refreshDiscordWidget !== 'function') {
        window.refreshDiscordWidget = function() {
            const widgetStatus = document.querySelector('.widget-status span');
            if (widgetStatus) {
                widgetStatus.textContent = 'Refreshing...';
                
                // Simulate refresh (in real implementation, this would reload the widget data)
                setTimeout(() => {
                    widgetStatus.textContent = 'Online';
                }, 1000);
            }
        };
    }
}

// Form Handling
function handleFormSubmissions() {
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate subscription
            alert(`Thank you for subscribing with ${email}! We'll keep you updated on new features.`);
            this.reset();
        });
    }
    
    // Contact forms
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Simulate form submission
                alert('Thank you for your message! We\'ll get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    });
}

// Copy to Clipboard Functionality
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-copy-target');
            const textToCopy = document.querySelector(target)?.textContent || this.getAttribute('data-copy-text');
            
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Show feedback
                    const originalText = this.textContent;
                    this.textContent = 'Copied!';
                    this.classList.add('copied');
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.classList.remove('copied');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            }
        });
    });
}

// Search Functionality (if implemented)
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        function performSearch(query) {
            // Simulate search (in real implementation, this would search content)
            const mockResults = [
                { title: 'Getting Started', url: 'docs.html#getting-started' },
                { title: 'Creating Webhooks', url: 'docs.html#webhooks' },
                { title: 'Rich Embeds', url: 'docs.html#embeds' }
            ];
            
            const filteredResults = mockResults.filter(result => 
                result.title.toLowerCase().includes(query.toLowerCase())
            );
            
            displaySearchResults(filteredResults);
        }
        
        function displaySearchResults(results) {
            if (results.length === 0) {
                searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
            } else {
                const resultsHTML = results.map(result => 
                    `<a href="${result.url}" class="search-result">${result.title}</a>`
                ).join('');
                searchResults.innerHTML = resultsHTML;
            }
            
            searchResults.style.display = 'block';
        }
        
        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Error Handling
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // In production, you might want to send this to an error tracking service
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // In production, you might want to send this to an error tracking service
    });
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Track largest contentful paint
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.entryType === 'largest-contentful-paint') {
                            console.log(`LCP: ${entry.startTime}ms`);
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['largest-contentful-paint'] });
            }
        }
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    handleFormSubmissions();
    initCopyButtons();
    initSearch();
    initErrorHandling();
    initPerformanceMonitoring();
});

// Utility Functions
function debounce(func, wait) {
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

function throttle(func, limit) {
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
}

// Export functions for global use
window.DiscordWebhookCreatorPro = {
    refreshDiscordWidget: window.refreshDiscordWidget,
    debounce,
    throttle
};

// Add CSS classes for enhanced interactions
document.head.insertAdjacentHTML('beforeend', `
<style>
.navbar {
    transition: transform 0.3s ease, background-color 0.3s ease;
}

.navbar.scrolled {
    background: rgba(15, 20, 25, 0.98);
    backdrop-filter: blur(20px);
}

.hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

.copy-btn.copied {
    background-color: var(--success-color) !important;
    color: var(--dark-color) !important;
}

.form-input.error {
    border-color: var(--danger-color);
    box-shadow: 0 0 0 3px rgba(237, 66, 69, 0.1);
}

.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--bg-secondary);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
}

.search-result {
    display: block;
    padding: 0.75rem 1rem;
    color: var(--text-primary);
    text-decoration: none;
    border-bottom: 1px solid var(--border-muted);
    transition: var(--transition-base);
}

.search-result:hover {
    background: var(--bg-tertiary);
}

.search-no-results {
    padding: 1rem;
    text-align: center;
    color: var(--text-muted);
}

@media (prefers-reduced-motion: reduce) {
    .navbar {
        transition: none;
    }
    
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
</style>
`);
