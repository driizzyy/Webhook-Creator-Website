// Changelog Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const versionFilter = document.getElementById('version-filter');
    const changelogItems = document.querySelectorAll('.changelog-item');
    const downloadStats = document.querySelectorAll('.download-stat');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Version filter functionality
    if (versionFilter) {
        versionFilter.addEventListener('change', function() {
            const filterValue = this.value;
            filterChangelogItems(filterValue);
        });
    }

    // Timeline item interactions
    timelineItems.forEach(item => {
        const header = item.querySelector('.timeline-header');
        const content = item.querySelector('.timeline-content');
        const expandBtn = item.querySelector('.expand-btn');
        
        if (header && content && expandBtn) {
            header.addEventListener('click', function() {
                toggleTimelineItem(item, content, expandBtn);
            });
        }
    });

    // Collapsible changelog details
    changelogItems.forEach(item => {
        const header = item.querySelector('.changelog-header');
        const details = item.querySelector('.changelog-details');
        
        if (header && details) {
            header.addEventListener('click', function() {
                toggleChangelogItem(item, details);
            });
        }
    });

    // Download button interactions
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const version = this.dataset.version;
            handleDownload(version, this);
        });
    });

    // Animate download stats on load
    animateStats();
    
    // Version comparison functionality
    initVersionComparison();
    
    // Search functionality
    initSearch();

    function filterChangelogItems(filterValue) {
        changelogItems.forEach(item => {
            const versionType = item.dataset.type;
            
            if (filterValue === 'all' || versionType === filterValue) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.4s ease-out';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update visible count
        const visibleItems = Array.from(changelogItems).filter(item => 
            item.style.display !== 'none'
        );
        updateVisibleCount(visibleItems.length);
    }

    function toggleTimelineItem(item, content, expandBtn) {
        const isExpanded = content.classList.contains('expanded');
        
        // Close all other items
        timelineItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherContent = otherItem.querySelector('.timeline-content');
                const otherBtn = otherItem.querySelector('.expand-btn');
                
                if (otherContent && otherBtn) {
                    otherContent.classList.remove('expanded');
                    otherBtn.querySelector('i').style.transform = 'rotate(0deg)';
                    otherItem.classList.remove('active');
                }
            }
        });
        
        // Toggle current item
        if (isExpanded) {
            content.classList.remove('expanded');
            expandBtn.querySelector('i').style.transform = 'rotate(0deg)';
            item.classList.remove('active');
        } else {
            content.classList.add('expanded');
            expandBtn.querySelector('i').style.transform = 'rotate(180deg)';
            item.classList.add('active');
            
            // Smooth scroll to item
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    function toggleChangelogItem(item, details) {
        const isExpanded = details.style.display === 'block';
        
        if (isExpanded) {
            details.style.display = 'none';
            item.classList.remove('expanded');
        } else {
            details.style.display = 'block';
            item.classList.add('expanded');
            
            // Animate content
            details.style.animation = 'expandDetails 0.3s ease-out';
        }
    }

    function handleDownload(version, button) {
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        button.disabled = true;
        
        // Simulate download process
        setTimeout(() => {
            // Reset button
            button.innerHTML = originalText;
            button.disabled = false;
            
            // Update download count
            updateDownloadCount(version);
            
            // Show success notification
            showNotification(`Windows 11 Tool ${version} download started!`, 'success');
            
            // Actual download would happen here
            // window.open(`/downloads/windows-11-tool-${version}.zip`, '_blank');
        }, 2000);
    }

    function updateDownloadCount(version) {
        const stat = document.querySelector(`[data-version="${version}"] .download-count`);
        if (stat) {
            const currentCount = parseInt(stat.textContent.replace(/,/g, ''));
            const newCount = currentCount + 1;
            
            // Animate count update
            animateNumber(stat, currentCount, newCount);
        }
    }

    function animateNumber(element, start, end) {
        const duration = 1000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function animateStats() {
        downloadStats.forEach(stat => {
            const target = parseInt(stat.dataset.count);
            const numberEl = stat.querySelector('.stat-number');
            
            if (numberEl) {
                animateNumber(numberEl, 0, target);
            }
        });
    }

    function updateVisibleCount(count) {
        let countDisplay = document.querySelector('.changelog-count');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.className = 'changelog-count';
            countDisplay.style.cssText = `
                text-align: center;
                margin: 2rem 0;
                color: var(--text-muted);
                font-size: var(--font-size-sm);
            `;
            
            const filterContainer = document.querySelector('.changelog-filters');
            if (filterContainer) {
                filterContainer.appendChild(countDisplay);
            }
        }
        
        countDisplay.textContent = `Showing ${count} version${count !== 1 ? 's' : ''}`;
    }

    function initVersionComparison() {
        const compareBtn = document.getElementById('compare-versions-btn');
        if (compareBtn) {
            compareBtn.addEventListener('click', function() {
                openVersionComparison();
            });
        }
    }

    function openVersionComparison() {
        const modal = createComparisonModal();
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    function createComparisonModal() {
        const modal = document.createElement('div');
        modal.className = 'version-comparison-modal';
        modal.innerHTML = `
            <div class="modal-backdrop" onclick="closeModal(this.parentElement)"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-code-branch"></i> Version Comparison</h3>
                    <button class="close-btn" onclick="closeModal(this.closest('.version-comparison-modal'))">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="version-selectors">
                        <div class="version-selector">
                            <label>Compare Version:</label>
                            <select id="compare-from">
                                <option value="v1.2.0">v1.2.0 (Latest)</option>
                                <option value="v1.1.3">v1.1.3</option>
                                <option value="v1.1.2">v1.1.2</option>
                                <option value="v1.1.1">v1.1.1</option>
                            </select>
                        </div>
                        <div class="version-selector">
                            <label>With Version:</label>
                            <select id="compare-to">
                                <option value="v1.1.3">v1.1.3</option>
                                <option value="v1.1.2">v1.1.2</option>
                                <option value="v1.1.1">v1.1.1</option>
                                <option value="v1.1.0">v1.1.0</option>
                            </select>
                        </div>
                    </div>
                    <div class="comparison-results">
                        <div class="comparison-section">
                            <h4><i class="fas fa-plus-circle text-green"></i> New Features</h4>
                            <ul class="feature-list">
                                <li>Enhanced system optimization algorithms</li>
                                <li>New privacy protection features</li>
                                <li>Improved user interface</li>
                            </ul>
                        </div>
                        <div class="comparison-section">
                            <h4><i class="fas fa-tools text-blue"></i> Improvements</h4>
                            <ul class="feature-list">
                                <li>Faster startup time (30% improvement)</li>
                                <li>Reduced memory usage</li>
                                <li>Better error handling</li>
                            </ul>
                        </div>
                        <div class="comparison-section">
                            <h4><i class="fas fa-bug text-red"></i> Bug Fixes</h4>
                            <ul class="feature-list">
                                <li>Fixed compatibility issues with Windows 11 22H2</li>
                                <li>Resolved memory leak in background processes</li>
                                <li>Fixed UI scaling on high DPI displays</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    function initSearch() {
        const searchInput = document.getElementById('changelog-search');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                searchChangelog(query);
            });
        }
    }

    function searchChangelog(query) {
        changelogItems.forEach(item => {
            const version = item.querySelector('.version-number')?.textContent.toLowerCase() || '';
            const title = item.querySelector('.changelog-title')?.textContent.toLowerCase() || '';
            const content = item.querySelector('.changelog-details')?.textContent.toLowerCase() || '';
            
            const matches = query === '' || 
                version.includes(query) || 
                title.includes(query) || 
                content.includes(query);
            
            if (matches) {
                item.style.display = 'block';
                
                // Highlight search terms
                if (query) {
                    highlightSearchTerms(item, query);
                }
            } else {
                item.style.display = 'none';
            }
        });
    }

    function highlightSearchTerms(item, query) {
        // Remove previous highlights
        item.querySelectorAll('.search-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        
        // Add new highlights
        const textElements = item.querySelectorAll('.changelog-title, .changelog-details p, .changelog-details li');
        textElements.forEach(el => {
            if (el) {
                el.innerHTML = el.innerHTML.replace(
                    new RegExp(`(${query})`, 'gi'),
                    '<span class="search-highlight">$1</span>'
                );
            }
        });
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

    // Global functions
    window.closeModal = function(modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    };

    // Add required CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes expandDetails {
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
        
        .timeline-item.active .timeline-header {
            background: var(--bg-secondary);
        }
        
        .timeline-content.expanded {
            max-height: 1000px;
            opacity: 1;
            transition: all 0.3s ease-out;
        }
        
        .changelog-item.expanded .changelog-header {
            background: var(--bg-secondary);
        }
        
        .search-highlight {
            background: rgba(88, 101, 242, 0.2);
            color: var(--primary-color);
            font-weight: 600;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        .version-comparison-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease-out;
        }
        
        .version-comparison-modal.active {
            opacity: 1;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-primary);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-xl);
            width: 90%;
            max-width: 800px;
            max-height: 80vh;
            overflow: hidden;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-header h3 {
            margin: 0;
            display: flex;
            align-items: center;
            gap: var(--space-2);
        }
        
        .close-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 1.2rem;
            cursor: pointer;
            padding: var(--space-2);
            border-radius: var(--border-radius);
            transition: all var(--transition-fast);
        }
        
        .close-btn:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .modal-body {
            padding: 1.5rem;
            max-height: 60vh;
            overflow-y: auto;
        }
        
        .version-selectors {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .version-selector label {
            display: block;
            margin-bottom: var(--space-2);
            font-weight: 600;
            color: var(--text-secondary);
        }
        
        .version-selector select {
            width: 100%;
            padding: var(--space-3);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--bg-primary);
            color: var(--text-primary);
            font-size: var(--font-size-base);
        }
        
        .comparison-section {
            margin-bottom: 2rem;
        }
        
        .comparison-section h4 {
            display: flex;
            align-items: center;
            gap: var(--space-2);
            margin-bottom: 1rem;
            padding-bottom: var(--space-2);
            border-bottom: 1px solid var(--border-color);
        }
        
        .feature-list {
            list-style: none;
            padding: 0;
        }
        
        .feature-list li {
            padding: var(--space-2) 0;
            padding-left: 2rem;
            position: relative;
        }
        
        .feature-list li:before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--primary-color);
            font-weight: bold;
        }
        
        .text-green { color: var(--secondary-color); }
        .text-blue { color: var(--primary-color); }
        .text-red { color: var(--discord-red); }
        
        @media (max-width: 768px) {
            .version-selectors {
                grid-template-columns: 1fr;
            }
            
            .modal-content {
                width: 95%;
                margin: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
});
