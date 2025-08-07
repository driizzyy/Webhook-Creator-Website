// Documentation Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Copy to clipboard functionality
    window.copyToClipboard = function(button) {
        const codeBlock = button.closest('.code-block-container, .code-snippet, .code-example')
                                 .querySelector('code');
        const text = codeBlock.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // Show success feedback
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.color = 'var(--secondary-color)';
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.color = '';
            }, 2000);
            
            showNotification('Code copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy code', 'error');
        });
    };

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });

    // Docs navigation card hover effects
    const navCards = document.querySelectorAll('.docs-nav-card');
    navCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // Troubleshooting toggle functionality
    const troubleItems = document.querySelectorAll('.trouble-item');
    troubleItems.forEach(item => {
        const problem = item.querySelector('.problem');
        const solution = item.querySelector('.solution');
        
        if (problem && solution) {
            // Initially hide solutions
            solution.style.display = 'none';
            problem.style.cursor = 'pointer';
            
            problem.addEventListener('click', function() {
                const isVisible = solution.style.display === 'block';
                
                // Close all other solutions
                troubleItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherSolution = otherItem.querySelector('.solution');
                        if (otherSolution) {
                            otherSolution.style.display = 'none';
                            otherItem.classList.remove('expanded');
                        }
                    }
                });
                
                // Toggle current solution
                if (isVisible) {
                    solution.style.display = 'none';
                    item.classList.remove('expanded');
                } else {
                    solution.style.display = 'block';
                    solution.style.animation = 'expandContent 0.3s ease-out';
                    item.classList.add('expanded');
                }
            });
        }
    });

    // Step guide animations
    const stepItems = document.querySelectorAll('.step-item');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            }
        });
    }, observerOptions);

    stepItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        stepObserver.observe(item);
    });

    // Feature card animations
    const featureCards = document.querySelectorAll('.message-type-card, .technique-card, .practice-item');
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // API endpoint interactions
    const apiEndpoints = document.querySelectorAll('.api-endpoint');
    apiEndpoints.forEach(endpoint => {
        const header = endpoint.querySelector('.endpoint-header');
        if (header) {
            header.addEventListener('click', function() {
                endpoint.classList.toggle('expanded');
            });
        }
    });

    // Search highlight functionality (if search exists)
    const searchInput = document.querySelector('#docs-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            highlightSearchResults(query);
        });
    }

    function highlightSearchResults(query) {
        const sections = document.querySelectorAll('.docs-section');
        sections.forEach(section => {
            const textElements = section.querySelectorAll('h1, h2, h3, h4, p, li');
            
            textElements.forEach(el => {
                // Remove previous highlights
                el.innerHTML = el.innerHTML.replace(/<mark class="search-highlight">/g, '');
                el.innerHTML = el.innerHTML.replace(/<\/mark>/g, '');
                
                // Add new highlights
                if (query && el.textContent.toLowerCase().includes(query)) {
                    const regex = new RegExp(`(${query})`, 'gi');
                    el.innerHTML = el.innerHTML.replace(regex, '<mark class="search-highlight">$1</mark>');
                }
            });
        });
    }

    function showNotification(message, type = 'info') {
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
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Progress indicator for long sections
    function updateReadingProgress() {
        const docsSections = document.querySelectorAll('.docs-section');
        const scrolled = window.pageYOffset;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        
        let progressBar = document.querySelector('.reading-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'reading-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: ${progress}%;
                height: 3px;
                background: var(--primary-color);
                z-index: 1000;
                transition: width 0.3s ease;
            `;
            document.body.appendChild(progressBar);
        } else {
            progressBar.style.width = `${progress}%`;
        }
    }

    window.addEventListener('scroll', updateReadingProgress);
    updateReadingProgress(); // Initial call

    // Add required CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes expandContent {
            from { opacity: 0; max-height: 0; }
            to { opacity: 1; max-height: 500px; }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .search-highlight {
            background: rgba(88, 101, 242, 0.2);
            color: var(--primary-color);
            font-weight: 600;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        .trouble-item.expanded .problem {
            background: var(--bg-secondary);
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
        
        .trouble-item .solution {
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-top: none;
            border-radius: 0 0 var(--border-radius) var(--border-radius);
            padding: 1rem;
        }
        
        .api-endpoint.expanded .endpoint-header {
            background: var(--bg-secondary);
        }
        
        .tab-content {
            display: none;
            animation: fadeIn 0.3s ease-out;
        }
        
        .tab-content.active {
            display: block;
        }
        
        .copy-btn {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: var(--border-radius);
            transition: all var(--transition-fast);
        }
        
        .copy-btn:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .reading-progress {
            transition: width 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
});
