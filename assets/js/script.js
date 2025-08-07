// Discord Webhook Creator Pro - Enhanced Website JavaScript
// Author: driizzyy
// Version: 2.0.0 - Enhanced with animations and persistent auth

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

    // Enhanced Navigation Handler
    class NavigationHandler {
        constructor() {
            this.isMenuOpen = false;
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.handleScroll();
            this.initializePersistentAuth();
        }

        setupEventListeners() {
            // Hamburger menu toggle
            DOM.hamburger?.addEventListener('click', () => this.toggleMobileMenu());

            // Close mobile menu when clicking on a link
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMobileMenu());
            });

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => this.smoothScroll(e));
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!DOM.navMenu.contains(e.target) && !DOM.hamburger.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }

        toggleMobileMenu() {
            this.isMenuOpen = !this.isMenuOpen;
            DOM.navMenu.classList.toggle('active');
            DOM.hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        }

        closeMobileMenu() {
            this.isMenuOpen = false;
            DOM.navMenu.classList.remove('active');
            DOM.hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }

        handleScroll() {
            let ticking = false;
            
            const updateNavbar = () => {
                const scrolled = window.pageYOffset > 50;
                DOM.navbar.classList.toggle('scrolled', scrolled);
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateNavbar);
                    ticking = true;
                }
            });
        }

        smoothScroll(e) {
            const target = e.target.getAttribute('href');
            if (target && target.startsWith('#')) {
                e.preventDefault();
                const element = document.querySelector(target);
                if (element) {
                    const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - CONFIG.SCROLL_OFFSET;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        }

        // Enhanced Persistent Authentication System
        initializePersistentAuth() {
            const userData = JSON.parse(localStorage.getItem('webhookUser'));
            
            if (userData) {
                // Check if session is still valid
                if (this.isSessionValid(userData)) {
                    this.updateNavigationForLoggedInUser(userData);
                    this.extendSession(userData);
                } else {
                    // Session expired
                    localStorage.removeItem('webhookUser');
                }
            }
        }

        isSessionValid(userData) {
            if (!userData.loginTime) return false;
            
            const loginTime = new Date(userData.loginTime);
            const now = new Date();
            const sessionDuration = userData.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
            
            return (now - loginTime) < sessionDuration;
        }

        extendSession(userData) {
            userData.lastActivity = new Date().toISOString();
            localStorage.setItem('webhookUser', JSON.stringify(userData));
        }

        updateNavigationForLoggedInUser(userData) {
            const authButtons = document.querySelectorAll('.auth-btn');
            
            authButtons.forEach(authBtn => {
                if (authBtn) {
                    // Create user menu
                    const userMenu = document.createElement('div');
                    userMenu.className = 'user-menu';
                    
                    const userAvatar = document.createElement('div');
                    userAvatar.className = 'user-avatar';
                    userAvatar.textContent = (userData.firstName || userData.name || userData.email).charAt(0).toUpperCase();
                    userAvatar.title = `${userData.firstName || userData.name} (${userData.email})`;
                    
                    const dropdown = document.createElement('div');
                    dropdown.className = 'user-dropdown';
                    
                    // Determine correct path to dashboard based on current location
                    const isInPages = window.location.pathname.includes('/pages/');
                    const dashboardPath = isInPages ? 'dashboard.html' : 'pages/dashboard.html';
                    
                    dropdown.innerHTML = `
                        <a href="${dashboardPath}" class="user-dropdown-item">
                            <i class="fas fa-tachometer-alt"></i> Dashboard
                        </a>
                        <a href="#" class="user-dropdown-item" onclick="showProfile()">
                            <i class="fas fa-user"></i> Profile
                        </a>
                        <a href="#" class="user-dropdown-item" onclick="showSettings()">
                            <i class="fas fa-cog"></i> Settings
                        </a>
                        <a href="#" class="user-dropdown-item logout" onclick="signOut()">
                            <i class="fas fa-sign-out-alt"></i> Sign Out
                        </a>
                    `;
                    
                    userMenu.appendChild(userAvatar);
                    userMenu.appendChild(dropdown);
                    
                    // Replace auth button with user menu
                    authBtn.parentNode.replaceChild(userMenu, authBtn);
                    
                    // Add click handler for dropdown
                    userAvatar.addEventListener('click', (e) => {
                        e.stopPropagation();
                        dropdown.classList.toggle('active');
                    });
                    
                    // Close dropdown when clicking outside
                    document.addEventListener('click', () => {
                        dropdown.classList.remove('active');
                    });
                }
            });
        }
    }

    // Enhanced Animation System
    class AnimationSystem {
        constructor() {
            this.init();
        }

        init() {
            this.initializeScrollAnimations();
            this.initializeHoverEffects();
            this.initializeCounterAnimations();
            this.initializeParticleBackground();
        }

        initializeScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        
                        // Stagger animation for children
                        const children = entry.target.querySelectorAll('.animate-child');
                        children.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('animated');
                            }, index * 100);
                        });
                    }
                });
            }, observerOptions);
            
            // Observe elements for animation
            const animatedElements = document.querySelectorAll('.card, .feature-card, .step-card, .example-card, .support-card');
            animatedElements.forEach(el => {
                el.classList.add('animate-on-scroll');
                observer.observe(el);
            });
        }

        initializeHoverEffects() {
            // Add enhanced hover effects to buttons
            const buttons = document.querySelectorAll('.btn, .nav-link');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', this.addHoverEffect);
                btn.addEventListener('mouseleave', this.removeHoverEffect);
            });
        }

        addHoverEffect(e) {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 10px 30px rgba(88, 101, 242, 0.3)';
        }

        removeHoverEffect(e) {
            e.target.style.transform = '';
            e.target.style.boxShadow = '';
        }

        initializeCounterAnimations() {
            const counters = document.querySelectorAll('[data-target]');
            const observerOptions = {
                threshold: 0.5
            };

            const counterObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                        this.animateCounter(entry.target);
                        entry.target.classList.add('counted');
                    }
                });
            }, observerOptions);

            counters.forEach(counter => counterObserver.observe(counter));
        }

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = CONFIG.COUNTER_ANIMATION_DURATION;
            const start = 0;
            const startTime = Date.now();

            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(start + (target - start) * this.easeOutQuart(progress));

                element.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            requestAnimationFrame(updateCounter);
        }

        easeOutQuart(t) {
            return 1 - (--t) * t * t * t;
        }

        initializeParticleBackground() {
            // Create subtle particle background
            const particleContainer = document.createElement('div');
            particleContainer.className = 'particles-bg';
            document.body.appendChild(particleContainer);

            for (let i = 0; i < 50; i++) {
                this.createParticle(particleContainer);
            }
        }

        createParticle(container) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const animationDuration = Math.random() * 20 + 10;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                animation-duration: ${animationDuration}s;
            `;

            container.appendChild(particle);
        }
    }

    // Interactive Demo System
    class InteractiveDemoSystem {
        constructor() {
            this.messageCount = 1;
            this.init();
        }

        init() {
            this.createDemoSection();
        }

        createDemoSection() {
            // Find a good place to insert the demo (after hero section)
            const heroSection = document.querySelector('.hero');
            if (!heroSection) return;

            const demoSection = document.createElement('section');
            demoSection.className = 'demo-section';
            demoSection.innerHTML = `
                <div class="container">
                    <div class="section-header">
                        <h2 class="gradient-text">🚀 Try It Live</h2>
                        <p>Experience the power of Discord Webhook Creator Pro with our interactive demo</p>
                    </div>
                    
                    <div class="interactive-demo">
                        <div class="demo-preview">
                            <div class="discord-mockup">
                                <div class="discord-header">
                                    <div class="discord-channel">webhook-testing</div>
                                    <div style="margin-left: auto; color: #72767d; font-size: 12px;">
                                        Live Demo
                                    </div>
                                </div>
                                <div class="discord-messages" id="demo-messages">
                                    <div class="discord-message">
                                        <div class="discord-avatar">🤖</div>
                                        <div class="discord-message-content">
                                            <div>
                                                <span class="discord-username">Webhook Creator Pro</span>
                                                <span class="discord-timestamp">Today at ${new Date().toLocaleTimeString()}</span>
                                            </div>
                                            <div style="color: #dcddde;">Welcome to the live demo! Create your first embed below. ✨</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="discord-typing" id="demo-typing" style="display: none;">
                                    <div class="typing-indicator">
                                        <div class="typing-dot"></div>
                                        <div class="typing-dot"></div>
                                        <div class="typing-dot"></div>
                                    </div>
                                    <span>Webhook Creator Pro is typing...</span>
                                </div>
                            </div>
                            
                            <div class="demo-controls">
                                <div class="demo-control-group">
                                    <label>🏷️ Embed Title</label>
                                    <input type="text" id="demo-title" placeholder="Enter your title..." value="🎉 Discord Webhook Demo">
                                </div>
                                <div class="demo-control-group">
                                    <label>📝 Description</label>
                                    <textarea id="demo-description" placeholder="Your message description...">This is a live demonstration of Discord Webhook Creator Pro! Create professional embeds with ease. 🚀</textarea>
                                </div>
                                <div class="demo-control-group">
                                    <label>🎨 Color Theme</label>
                                    <select id="demo-color">
                                        <option value="#5865f2">Discord Blurple</option>
                                        <option value="#57f287">Success Green</option>
                                        <option value="#fee75c">Warning Yellow</option>
                                        <option value="#ed4245">Error Red</option>
                                        <option value="#eb459e">Pink</option>
                                        <option value="#9c84ef">Purple</option>
                                    </select>
                                </div>
                                <div class="demo-control-group">
                                    <label>👤 Author Name</label>
                                    <input type="text" id="demo-author" placeholder="Bot name..." value="Discord Bot Pro">
                                </div>
                                <div class="demo-control-group">
                                    <button class="demo-send-btn" id="demo-send">
                                        <i class="fas fa-paper-plane"></i>
                                        Send Webhook
                                    </button>
                                    <button class="btn btn-secondary" id="demo-clear" style="margin-top: 8px;">
                                        <i class="fas fa-trash"></i>
                                        Clear Messages
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            heroSection.insertAdjacentElement('afterend', demoSection);
            this.setupDemoEventListeners();
        }

        setupDemoEventListeners() {
            const sendBtn = document.getElementById('demo-send');
            const clearBtn = document.getElementById('demo-clear');

            if (sendBtn) {
                sendBtn.addEventListener('click', () => this.sendDemoWebhook());
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearDemoMessages());
            }

            // Real-time preview updates
            const inputs = ['demo-title', 'demo-description', 'demo-color', 'demo-author'];
            inputs.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', () => this.updateDemoPreview());
                }
            });
        }

        sendDemoWebhook() {
            const sendBtn = document.getElementById('demo-send');
            const typingIndicator = document.getElementById('demo-typing');
            const messagesContainer = document.getElementById('demo-messages');
            
            const title = document.getElementById('demo-title').value || 'Webhook Demo';
            const description = document.getElementById('demo-description').value || 'Test message';
            const color = document.getElementById('demo-color').value || '#5865f2';
            const author = document.getElementById('demo-author').value || 'Webhook Bot';
            
            // Validate inputs
            if (!title.trim() || !description.trim()) {
                this.showNotification('Please fill in both title and description!', 'error');
                return;
            }

            // Disable button and show loading
            sendBtn.disabled = true;
            sendBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
            
            // Show typing indicator
            typingIndicator.style.display = 'flex';
            
            // Simulate realistic sending delay
            setTimeout(() => {
                // Hide typing indicator
                typingIndicator.style.display = 'none';
                
                // Create new message
                const messageDiv = document.createElement('div');
                messageDiv.className = 'discord-message';
                messageDiv.innerHTML = `
                    <div class="discord-avatar">🤖</div>
                    <div class="discord-message-content">
                        <div>
                            <span class="discord-username">${author}</span>
                            <span class="discord-timestamp">Today at ${new Date().toLocaleTimeString()}</span>
                        </div>
                        <div class="discord-embed" style="border-left-color: ${color};">
                            <div class="discord-embed-author">
                                <span>🚀 ${author}</span>
                            </div>
                            <div class="discord-embed-title">${title}</div>
                            <div class="discord-embed-description">${description}</div>
                            <div class="discord-embed-fields">
                                <div class="discord-embed-field">
                                    <div class="discord-embed-field-name">Status</div>
                                    <div class="discord-embed-field-value">✅ Delivered</div>
                                </div>
                                <div class="discord-embed-field">
                                    <div class="discord-embed-field-name">Message #</div>
                                    <div class="discord-embed-field-value">${this.messageCount++}</div>
                                </div>
                            </div>
                            <div class="discord-embed-footer">
                                <span>Discord Webhook Creator Pro • ${new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add message with animation
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
                // Re-enable button
                sendBtn.disabled = false;
                sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Webhook';
                
                // Show success notification
                this.showNotification('🎉 Webhook sent successfully! Check the demo channel above.', 'success');
                
            }, Math.random() * 1500 + 1000); // Random delay between 1-2.5 seconds
        }

        clearDemoMessages() {
            const messagesContainer = document.getElementById('demo-messages');
            const confirmClear = confirm('Are you sure you want to clear all demo messages?');
            
            if (confirmClear) {
                // Keep only the welcome message
                const welcomeMessage = messagesContainer.querySelector('.discord-message');
                messagesContainer.innerHTML = '';
                messagesContainer.appendChild(welcomeMessage);
                
                this.messageCount = 1;
                this.showNotification('Demo messages cleared!', 'info');
            }
        }

        updateDemoPreview() {
            // Could add real-time preview updates here
            console.log('Demo preview updated');
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? 'var(--secondary-color)' : type === 'error' ? 'var(--discord-red)' : 'var(--primary-color)'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: slideInRight 0.3s ease-out;
                max-width: 400px;
                font-weight: 500;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }
    }

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        DOM.init();
        new NavigationHandler();
        new AnimationSystem();
        new InteractiveDemoSystem();
        
        console.log('🚀 Discord Webhook Creator Pro - Website Enhanced!');
    });

    // Global functions for user menu
    window.showProfile = function() {
        const userData = JSON.parse(localStorage.getItem('webhookUser'));
        if (userData) {
            alert(`👤 Profile Information\n\nName: ${userData.firstName} ${userData.lastName}\nEmail: ${userData.email}\nAccount Type: ${userData.accountType}\nJoined: ${new Date(userData.createdAt || userData.loginTime).toLocaleDateString()}`);
        }
    };

    window.showSettings = function() {
        alert('⚙️ Settings panel would open here in a full implementation.\n\nFeatures would include:\n• Theme preferences\n• Notification settings\n• Privacy controls\n• Account management');
    };

    window.signOut = function() {
        const userData = JSON.parse(localStorage.getItem('webhookUser'));
        if (userData && confirm('Are you sure you want to sign out?')) {
            localStorage.removeItem('webhookUser');
            
            // Show notification
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--primary-color);
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-lg);
                    z-index: 1000;
                    animation: slideInRight 0.3s ease-out;
                ">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Successfully signed out. See you soon!</span>
                </div>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                location.reload();
            }, 1500);
        }
    };

})();