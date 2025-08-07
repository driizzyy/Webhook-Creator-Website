// Tutorials Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const tutorialSearch = document.getElementById('tutorial-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort-tutorials');
    const tutorialsContainer = document.getElementById('tutorials-container');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const categoryCards = document.querySelectorAll('.category-card');
    
    let allTutorials = [];
    let visibleTutorials = 6; // Initially show 6 tutorials
    let currentFilter = 'all';
    let currentSort = 'newest';

    // Initialize tutorials data
    function initializeTutorials() {
        const tutorialCards = document.querySelectorAll('.tutorial-card');
        allTutorials = Array.from(tutorialCards).map(card => ({
            element: card,
            level: card.dataset.level,
            date: new Date(card.dataset.date),
            title: card.querySelector('h3').textContent.toLowerCase(),
            content: card.querySelector('p').textContent.toLowerCase()
        }));
        
        // Initially hide tutorials beyond the visible limit
        showTutorials();
    }

    // Search functionality
    if (tutorialSearch) {
        tutorialSearch.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            filterAndSortTutorials(query);
        });
    }

    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            filterAndSortTutorials();
        });
    });

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            filterAndSortTutorials();
        });
    }

    // Category card clicks
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const level = this.dataset.level;
            
            // Update filter
            currentFilter = level;
            
            // Update active filter button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.filter === level) {
                    btn.classList.add('active');
                }
            });
            
            // Scroll to tutorials grid
            document.querySelector('.tutorials-grid').scrollIntoView({
                behavior: 'smooth'
            });
            
            filterAndSortTutorials();
        });
    });

    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleTutorials += 6;
            showTutorials();
            
            // Hide button if all tutorials are visible
            const filteredTutorials = getFilteredTutorials();
            if (visibleTutorials >= filteredTutorials.length) {
                this.style.display = 'none';
            }
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-signup');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate subscription
            showNotification('Thank you for subscribing! You\'ll receive updates about new tutorials.', 'success');
            this.reset();
        });
    }

    function getFilteredTutorials(query = '') {
        return allTutorials.filter(tutorial => {
            const matchesFilter = currentFilter === 'all' || tutorial.level === currentFilter;
            const matchesQuery = query === '' || 
                tutorial.title.includes(query) || 
                tutorial.content.includes(query);
            
            return matchesFilter && matchesQuery;
        });
    }

    function sortTutorials(tutorials) {
        return tutorials.sort((a, b) => {
            switch (currentSort) {
                case 'newest':
                    return b.date - a.date;
                case 'oldest':
                    return a.date - b.date;
                case 'difficulty':
                    const levelOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
                    return levelOrder[a.level] - levelOrder[b.level];
                case 'popular':
                    // Sort by view count (extract from tutorial stats)
                    const getViews = (tutorial) => {
                        const viewsText = tutorial.element.querySelector('.tutorial-stats span:nth-child(2)').textContent;
                        return parseFloat(viewsText.replace(/[^\d.]/g, '')) * (viewsText.includes('k') ? 1000 : 1);
                    };
                    return getViews(b) - getViews(a);
                default:
                    return 0;
            }
        });
    }

    function filterAndSortTutorials(query = '') {
        const filtered = getFilteredTutorials(query);
        const sorted = sortTutorials(filtered);
        
        // Hide all tutorials first
        allTutorials.forEach(tutorial => {
            tutorial.element.style.display = 'none';
        });
        
        // Show filtered and sorted tutorials
        sorted.forEach((tutorial, index) => {
            if (index < visibleTutorials) {
                tutorial.element.style.display = 'block';
                // Add animation
                tutorial.element.style.animation = 'fadeInUp 0.5s ease-out forwards';
                tutorial.element.style.animationDelay = `${index * 0.1}s`;
            }
        });
        
        // Update load more button visibility
        if (loadMoreBtn) {
            if (sorted.length > visibleTutorials) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
        
        // Show no results message if needed
        showNoResultsMessage(sorted.length === 0);
    }

    function showTutorials() {
        const filtered = getFilteredTutorials();
        const sorted = sortTutorials(filtered);
        
        // Hide all tutorials first
        allTutorials.forEach(tutorial => {
            tutorial.element.style.display = 'none';
        });
        
        // Show visible tutorials
        sorted.forEach((tutorial, index) => {
            if (index < visibleTutorials) {
                tutorial.element.style.display = 'block';
            }
        });
        
        // Update load more button
        if (loadMoreBtn) {
            if (sorted.length > visibleTutorials) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 4rem; color: var(--text-muted);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3 style="margin-bottom: 1rem;">No tutorials found</h3>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
            tutorialsContainer.appendChild(noResultsMsg);
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
        
        // Add notification styles
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
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add animation CSS
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
        
        @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Initialize
    if (tutorialsContainer) {
        initializeTutorials();
    }
});
