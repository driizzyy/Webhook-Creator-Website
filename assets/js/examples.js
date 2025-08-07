// Examples Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const exampleCards = document.querySelectorAll('.example-card');
    const copyButtons = document.querySelectorAll('.copy-btn');
    const previewButtons = document.querySelectorAll('.preview-btn');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Template builder elements
    const templateName = document.getElementById('template-name');
    const templateCategory = document.getElementById('template-category');
    const templateDifficulty = document.getElementById('template-difficulty');
    const embedTitleBuilder = document.getElementById('embed-title-builder');
    const embedDescriptionBuilder = document.getElementById('embed-description-builder');
    const embedColorBuilder = document.getElementById('embed-color-builder');
    const builderPreview = document.getElementById('builder-preview');
    const saveTemplateBtn = document.getElementById('save-template');
    const shareTemplateBtn = document.getElementById('share-template');

    let visibleExamples = 6;
    let currentFilter = 'all';

    // Example templates data
    const exampleTemplates = {
        'gaming-welcome': {
            title: 'Gaming Server Welcome',
            description: 'Welcome new players to your gaming community',
            embed: {
                title: '🎮 Welcome to the Server!',
                description: '{{playerName}} has joined the game! Welcome them to our amazing community.',
                color: '#00ff00',
                fields: [
                    { name: 'Player Level', value: 'Newcomer', inline: true },
                    { name: 'Join Date', value: '{{currentDate}}', inline: true }
                ]
            }
        },
        'system-alert': {
            title: 'System Maintenance Alert',
            description: 'Professional system notifications',
            embed: {
                title: '⚠️ System Maintenance Alert',
                description: 'Scheduled maintenance will begin in {{timeRemaining}} minutes. Please save your work.',
                color: '#ff6b6b',
                fields: [
                    { name: 'Duration', value: '2 hours', inline: true },
                    { name: 'Affected Services', value: 'All services', inline: true }
                ]
            }
        },
        'sales-report': {
            title: 'Daily Sales Report',
            description: 'Automated business reports with metrics',
            embed: {
                title: '📊 Daily Sales Report',
                description: 'Here are today\'s sales metrics and performance indicators.',
                color: '#4ecdc4',
                fields: [
                    { name: 'Total Revenue', value: '${{revenue}}', inline: true },
                    { name: 'Orders', value: '{{orderCount}}', inline: true },
                    { name: 'Growth', value: '+{{growthPercent}}%', inline: true }
                ]
            }
        }
    };

    // Initialize page
    initializeExamples();
    initializeTemplateBuilder();

    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            filterExamples();
        });
    });

    // Copy functionality
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const exampleType = this.dataset.example;
            copyTemplate(exampleType);
        });
    });

    // Preview functionality
    previewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.example-card, .tutorial-card');
            const title = card.querySelector('h3, h4').textContent;
            showPreviewModal(title, card);
        });
    });

    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleExamples += 6;
            showExamples();
            
            // Hide button if all examples are visible
            if (visibleExamples >= exampleCards.length) {
                this.style.display = 'none';
            }
        });
    }

    // Template builder functionality
    if (embedTitleBuilder) {
        embedTitleBuilder.addEventListener('input', updateBuilderPreview);
    }
    
    if (embedDescriptionBuilder) {
        embedDescriptionBuilder.addEventListener('input', updateBuilderPreview);
    }
    
    if (embedColorBuilder) {
        embedColorBuilder.addEventListener('change', updateBuilderPreview);
    }

    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', saveCustomTemplate);
    }

    if (shareTemplateBtn) {
        shareTemplateBtn.addEventListener('click', shareTemplate);
    }

    function initializeExamples() {
        showExamples();
        
        // Add hover effects
        exampleCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-4px)';
            });
        });
    }

    function initializeTemplateBuilder() {
        updateBuilderPreview();
    }

    function filterExamples() {
        let visibleCount = 0;
        
        exampleCards.forEach(card => {
            const category = card.dataset.category;
            const shouldShow = currentFilter === 'all' || category.includes(currentFilter);
            
            if (shouldShow && visibleCount < visibleExamples) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease-out forwards';
                card.style.animationDelay = `${visibleCount * 0.1}s`;
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update load more button
        const totalFiltered = Array.from(exampleCards).filter(card => {
            const category = card.dataset.category;
            return currentFilter === 'all' || category.includes(currentFilter);
        }).length;
        
        if (loadMoreBtn) {
            if (totalFiltered > visibleExamples) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    function showExamples() {
        exampleCards.forEach((card, index) => {
            if (index < visibleExamples) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function copyTemplate(exampleType) {
        const template = exampleTemplates[exampleType];
        
        if (template) {
            const templateData = JSON.stringify(template, null, 2);
            
            // Copy to clipboard
            navigator.clipboard.writeText(templateData).then(() => {
                showNotification('Template copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = templateData;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Template copied to clipboard!', 'success');
            });
        } else {
            showNotification('Template not found', 'error');
        }
    }

    function showPreviewModal(title, card) {
        const modal = createModal(`Preview: ${title}`, `
            <div class="preview-modal-content">
                <div class="discord-preview">
                    <div class="discord-mockup-modal">
                        <div class="discord-header">
                            <div class="server-info">
                                <div class="server-icon">💬</div>
                                <div class="server-details">
                                    <div class="server-name">Preview Server</div>
                                    <div class="channel-name"># general</div>
                                </div>
                            </div>
                        </div>
                        <div class="discord-message">
                            <div class="bot-avatar">🤖</div>
                            <div class="message-content">
                                <div class="bot-name">Webhook Bot <span class="bot-tag">BOT</span></div>
                                <div class="embed-preview-modal">
                                    ${generateEmbedPreview(card)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="preview-actions">
                    <button class="btn btn-primary" onclick="copyFromPreview('${title}')">
                        <i class="fas fa-copy"></i>
                        Copy Template
                    </button>
                    <button class="btn btn-secondary" onclick="downloadTemplate('${title}')">
                        <i class="fas fa-download"></i>
                        Download JSON
                    </button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    }

    function generateEmbedPreview(card) {
        const title = card.querySelector('h3, h4').textContent;
        const description = card.querySelector('p').textContent;
        const miniEmbed = card.querySelector('.mini-embed');
        const color = miniEmbed ? getComputedStyle(miniEmbed.querySelector('.embed-color')).backgroundColor : '#5865f2';
        
        return `
            <div class="embed" style="border-left-color: ${color};">
                <div class="embed-content">
                    <div class="embed-title">${title}</div>
                    <div class="embed-description">${description}</div>
                    <div class="embed-footer">
                        <span>Example Template • Today at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function updateBuilderPreview() {
        if (!builderPreview) return;
        
        const title = embedTitleBuilder?.value || 'Your Template Title';
        const description = embedDescriptionBuilder?.value || 'Your template description will appear here.';
        const color = embedColorBuilder?.value || '#5865f2';
        
        const titleEl = builderPreview.querySelector('.embed-title');
        const descEl = builderPreview.querySelector('.embed-description');
        const colorPill = builderPreview.querySelector('.embed-color-pill');
        
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;
        if (colorPill) colorPill.style.backgroundColor = color;
        
        builderPreview.style.borderLeftColor = color;
    }

    function saveCustomTemplate() {
        const template = {
            name: templateName?.value || 'Custom Template',
            category: templateCategory?.value || 'notifications',
            difficulty: templateDifficulty?.value || 'easy',
            embed: {
                title: embedTitleBuilder?.value || 'Default Title',
                description: embedDescriptionBuilder?.value || 'Default Description',
                color: embedColorBuilder?.value || '#5865f2'
            }
        };
        
        // Save to localStorage
        const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
        savedTemplates.push({
            ...template,
            id: Date.now(),
            created: new Date().toISOString()
        });
        localStorage.setItem('customTemplates', JSON.stringify(savedTemplates));
        
        showNotification('Template saved successfully!', 'success');
        
        // Reset form
        if (templateName) templateName.value = '';
        if (embedTitleBuilder) embedTitleBuilder.value = '';
        if (embedDescriptionBuilder) embedDescriptionBuilder.value = '';
        updateBuilderPreview();
    }

    function shareTemplate() {
        const template = {
            name: templateName?.value || 'Custom Template',
            embed: {
                title: embedTitleBuilder?.value || 'Default Title',
                description: embedDescriptionBuilder?.value || 'Default Description',
                color: embedColorBuilder?.value || '#5865f2'
            }
        };
        
        const shareData = btoa(JSON.stringify(template));
        const shareUrl = `${window.location.origin}${window.location.pathname}?template=${shareData}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('Share link copied to clipboard!', 'success');
        }).catch(() => {
            showNotification('Unable to copy share link', 'error');
        });
    }

    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'example-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.example-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        return modal;
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
            z-index: 1100;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Global functions for modal actions
    window.copyFromPreview = function(title) {
        copyTemplate(title.toLowerCase().replace(/\s+/g, '-'));
    };
    
    window.downloadTemplate = function(title) {
        const template = exampleTemplates[title.toLowerCase().replace(/\s+/g, '-')] || {
            title: title,
            description: 'Custom template',
            embed: { title: title, description: 'Template description', color: '#5865f2' }
        };
        
        const dataStr = JSON.stringify(template, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-template.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('Template downloaded!', 'success');
    };

    // Load shared template from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedTemplate = urlParams.get('template');
    if (sharedTemplate) {
        try {
            const template = JSON.parse(atob(sharedTemplate));
            if (templateName) templateName.value = template.name;
            if (embedTitleBuilder) embedTitleBuilder.value = template.embed.title;
            if (embedDescriptionBuilder) embedDescriptionBuilder.value = template.embed.description;
            if (embedColorBuilder) embedColorBuilder.value = template.embed.color;
            updateBuilderPreview();
            showNotification('Shared template loaded!', 'success');
        } catch (e) {
            showNotification('Invalid shared template', 'error');
        }
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
        
        @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .discord-mockup-modal {
            background: #36393f;
            border-radius: var(--border-radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-xl);
            margin-bottom: var(--space-6);
        }
        
        .embed-preview-modal .embed {
            background: #2f3136;
            border-left: 4px solid var(--primary-color);
            border-radius: var(--border-radius);
            padding: var(--space-4);
            color: white;
        }
        
        .embed-preview-modal .embed-title {
            color: #00aff4;
            font-weight: 600;
            font-size: var(--font-size-lg);
            margin-bottom: var(--space-2);
        }
        
        .embed-preview-modal .embed-description {
            color: #dcddde;
            margin-bottom: var(--space-4);
            line-height: 1.4;
        }
        
        .embed-preview-modal .embed-footer {
            color: #72767d;
            font-size: var(--font-size-xs);
            border-top: 1px solid #40444b;
            padding-top: var(--space-2);
        }
        
        .preview-actions {
            display: flex;
            gap: var(--space-4);
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        
        .modal-content {
            background: var(--bg-card);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-xl);
            max-width: 700px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            z-index: 1;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: var(--space-6);
            border-bottom: 1px solid var(--border-color);
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: var(--font-size-lg);
            color: var(--text-muted);
            cursor: pointer;
            padding: var(--space-2);
            border-radius: 50%;
            transition: all var(--transition-fast);
        }
        
        .modal-close:hover {
            background: var(--bg-secondary);
            color: var(--text-primary);
        }
        
        .modal-body {
            padding: var(--space-6);
        }
    `;
    document.head.appendChild(style);
});
