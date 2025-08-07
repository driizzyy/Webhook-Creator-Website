// Support Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const supportSearch = document.getElementById('support-search');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    const supportForm = document.getElementById('support-form');
    
    let currentCategory = 'all';

    // Search functionality
    if (supportSearch) {
        supportSearch.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            searchFAQ(query);
        });
    }

    // FAQ Category filtering
    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            filterFAQ(currentCategory);
        });
    });

    // FAQ accordion functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', function() {
            const isOpen = answer.style.display === 'block';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    otherAnswer.style.display = 'none';
                    otherIcon.style.transform = 'rotate(0deg)';
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isOpen) {
                answer.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
                item.classList.remove('active');
            } else {
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
                item.classList.add('active');
                
                // Smooth scroll to item
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Support form handling
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateSupportForm(data)) {
                submitSupportForm(data);
            }
        });
    }

    // Help card interactions
    const helpCards = document.querySelectorAll('.help-card');
    helpCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    function searchFAQ(query) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h4').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            const category = item.dataset.category;
            
            const matchesQuery = query === '' || question.includes(query) || answer.includes(query);
            const matchesCategory = currentCategory === 'all' || category === currentCategory;
            
            if (matchesQuery && matchesCategory) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease-out';
                
                // Highlight search terms
                if (query) {
                    highlightSearchTerms(item, query);
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message if needed
        const visibleItems = Array.from(faqItems).filter(item => 
            item.style.display !== 'none'
        );
        showNoResultsMessage(visibleItems.length === 0 && query);
    }

    function filterFAQ(category) {
        faqItems.forEach(item => {
            const itemCategory = item.dataset.category;
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.style.animation = 'fadeIn 0.3s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function highlightSearchTerms(item, query) {
        // Remove previous highlights
        item.querySelectorAll('.highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        // Add new highlights
        const questionEl = item.querySelector('.faq-question h4');
        const answerEl = item.querySelector('.faq-answer');
        
        [questionEl, answerEl].forEach(el => {
            if (el) {
                el.innerHTML = el.innerHTML.replace(
                    new RegExp(`(${query})`, 'gi'),
                    '<span class="highlight">$1</span>'
                );
            }
        });
    }

    function validateSupportForm(data) {
        const errors = [];
        
        if (!data.name || data.name.length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.subject) {
            errors.push('Please select a subject');
        }
        
        if (!data.message || data.message.length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        if (errors.length > 0) {
            showFormErrors(errors);
            return false;
        }
        
        return true;
    }

    function submitSupportForm(data) {
        // Show loading state
        const submitBtn = supportForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Thank you! Your message has been sent. We\'ll get back to you soon.', 'success');
            
            // Reset form
            supportForm.reset();
        }, 2000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormErrors(errors) {
        // Remove existing error messages
        document.querySelectorAll('.form-error').forEach(el => el.remove());
        
        // Add new error messages
        errors.forEach(error => {
            const errorEl = document.createElement('div');
            errorEl.className = 'form-error';
            errorEl.textContent = error;
            errorEl.style.cssText = `
                color: var(--discord-red);
                font-size: var(--font-size-sm);
                margin-top: var(--space-2);
                padding: var(--space-2) var(--space-3);
                background: rgba(237, 66, 69, 0.1);
                border-radius: var(--border-radius);
                border-left: 3px solid var(--discord-red);
            `;
            
            supportForm.insertBefore(errorEl, supportForm.querySelector('button'));
        });
    }

    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3 style="margin-bottom: 1rem;">No results found</h3>
                    <p>Try adjusting your search terms or browse by category</p>
                    <button class="btn btn-secondary" onclick="clearSearch()" style="margin-top: 1rem;">
                        Clear Search
                    </button>
                </div>
            `;
            
            const faqGrid = document.querySelector('.faq-grid');
            faqGrid.appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--secondary-color)' : 'var(--primary-color)'};
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
        }, 5000);
    }

    // Global function for clearing search
    window.clearSearch = function() {
        if (supportSearch) {
            supportSearch.value = '';
            searchFAQ('');
        }
    };

    // Service status animation
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator && statusIndicator.classList.contains('online')) {
        setInterval(() => {
            const dot = statusIndicator.querySelector('.status-dot');
            if (dot) {
                dot.style.animation = 'pulse 1s ease-in-out';
                setTimeout(() => {
                    dot.style.animation = '';
                }, 1000);
            }
        }, 3000);
    }

    // Add required CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .highlight {
            background: rgba(88, 101, 242, 0.2);
            color: var(--primary-color);
            font-weight: 600;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        .faq-item.active .faq-question {
            background: var(--bg-secondary);
        }
        
        .faq-item.active .faq-answer {
            border-top: 1px solid var(--border-color);
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--secondary-color);
            display: inline-block;
            margin-right: var(--space-2);
        }
        
        .help-card {
            transition: transform var(--transition-normal);
        }
        
        .form-error {
            animation: slideInLeft 0.3s ease-out;
        }
        
        @keyframes slideInLeft {
            from { transform: translateX(-20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
