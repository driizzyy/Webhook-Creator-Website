// Features Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const featureTabs = document.querySelectorAll('.feature-tab');
    const featureCards = document.querySelectorAll('.feature-card-detailed');
    const demoTabs = document.querySelectorAll('.demo-tab');
    const demoPanels = document.querySelectorAll('.demo-panel');
    const demoButtons = document.querySelectorAll('.demo-btn');
    const themeSelect = document.getElementById('demo-theme');
    
    // Interactive demo elements
    const embedTitle = document.getElementById('embed-title');
    const embedDescription = document.getElementById('embed-description');
    const embedColor = document.getElementById('embed-color');
    const liveEmbed = document.getElementById('live-embed');

    // Feature filtering
    featureTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            featureTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterFeatures(category);
        });
    });

    // Demo tab switching
    demoTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            demoTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const demoType = this.dataset.demo;
            switchDemo(demoType);
        });
    });

    // Interactive embed demo
    if (embedTitle) {
        embedTitle.addEventListener('input', updateLiveEmbed);
    }
    
    if (embedDescription) {
        embedDescription.addEventListener('input', updateLiveEmbed);
    }
    
    if (embedColor) {
        embedColor.addEventListener('change', updateLiveEmbed);
    }

    // Theme switching
    if (themeSelect) {
        themeSelect.addEventListener('change', function() {
            const theme = this.value;
            applyDemoTheme(theme);
        });
    }

    // Demo buttons
    demoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const feature = this.textContent.trim();
            showFeatureDemo(feature);
        });
    });

    // Comparison table interactivity
    const comparisonRows = document.querySelectorAll('.comparison-row');
    comparisonRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Roadmap item animations
    const roadmapItems = document.querySelectorAll('.roadmap-item');
    const observeRoadmap = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInLeft 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.3 });

    roadmapItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        observeRoadmap.observe(item);
    });

    function filterFeatures(category) {
        featureCards.forEach(card => {
            const cardCategories = card.dataset.category;
            
            if (category === 'all' || cardCategories.includes(category)) {
                card.style.display = 'flex';
                card.style.animation = 'fadeInUp 0.5s ease-out forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    function switchDemo(demoType) {
        // Hide all demo panels
        demoPanels.forEach(panel => {
            panel.style.display = 'none';
        });
        
        // Show selected demo panel
        const activePanel = document.getElementById(`${demoType}-demo`);
        if (activePanel) {
            activePanel.style.display = 'block';
            activePanel.style.animation = 'fadeIn 0.3s ease-out';
        }
        
        // Update demo content based on type
        updateDemoContent(demoType);
    }

    function updateDemoContent(demoType) {
        const demoPreview = document.querySelector('.demo-preview');
        
        switch (demoType) {
            case 'webhook':
                demoPreview.innerHTML = `
                    <h4>Webhook Manager Demo</h4>
                    <div class="webhook-demo">
                        <div class="webhook-form">
                            <input type="url" placeholder="Webhook URL" class="demo-input">
                            <input type="text" placeholder="Bot Username" class="demo-input">
                            <textarea placeholder="Message content..." class="demo-textarea"></textarea>
                            <button class="btn btn-primary">Send Webhook</button>
                        </div>
                    </div>
                `;
                break;
            case 'automation':
                demoPreview.innerHTML = `
                    <h4>Automation Demo</h4>
                    <div class="automation-demo">
                        <div class="automation-flow">
                            <div class="flow-step">
                                <i class="fas fa-clock"></i>
                                <span>Schedule</span>
                            </div>
                            <div class="flow-arrow">→</div>
                            <div class="flow-step">
                                <i class="fas fa-code"></i>
                                <span>Trigger</span>
                            </div>
                            <div class="flow-arrow">→</div>
                            <div class="flow-step">
                                <i class="fas fa-paper-plane"></i>
                                <span>Send</span>
                            </div>
                        </div>
                    </div>
                `;
                break;
            default:
                // Keep embed demo as default
                break;
        }
    }

    function updateLiveEmbed() {
        if (!liveEmbed) return;
        
        const title = embedTitle?.value || 'Sample Embed Title';
        const description = embedDescription?.value || 'This is a sample embed description that updates in real-time as you type.';
        const color = embedColor?.value || '#5865f2';
        
        const titleEl = liveEmbed.querySelector('.embed-title');
        const descEl = liveEmbed.querySelector('.embed-description');
        const colorPill = liveEmbed.querySelector('.embed-color-pill');
        
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;
        if (colorPill) colorPill.style.backgroundColor = color;
        
        // Update embed border color
        liveEmbed.style.borderLeftColor = color;
    }

    function applyDemoTheme(theme) {
        const embedPreview = document.querySelector('.embed-preview-live');
        if (!embedPreview) return;
        
        switch (theme) {
            case 'light':
                embedPreview.style.background = '#ffffff';
                embedPreview.querySelector('.discord-embed').style.background = '#f8f9fa';
                embedPreview.querySelector('.discord-embed').style.color = '#2c3e50';
                break;
            case 'discord':
                embedPreview.style.background = '#36393f';
                embedPreview.querySelector('.discord-embed').style.background = '#2f3136';
                embedPreview.querySelector('.discord-embed').style.color = '#dcddde';
                break;
            default: // dark
                embedPreview.style.background = '#1a1a1a';
                embedPreview.querySelector('.discord-embed').style.background = '#2d2d2d';
                embedPreview.querySelector('.discord-embed').style.color = '#ffffff';
                break;
        }
    }

    function showFeatureDemo(feature) {
        // Create modal for feature demo
        const modal = createModal(`${feature} Demo`, `
            <div class="demo-modal-content">
                <p>This would show an interactive demo of the ${feature} feature.</p>
                <p>Click and drag to interact with the demo below:</p>
                <div class="interactive-demo" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    height: 200px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                " onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                    🎯 Interactive ${feature} Demo
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    }

    function createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'demo-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="this.closest('.demo-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        // Add modal styles
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

    // Add CSS for animations and demos
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInLeft {
            from { transform: translateX(-50px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
            max-width: 600px;
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
        
        .modal-header h3 {
            margin: 0;
            color: var(--text-primary);
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
        
        .demo-input, .demo-textarea {
            width: 100%;
            padding: var(--space-3);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            margin-bottom: var(--space-4);
            font-size: var(--font-size-base);
        }
        
        .demo-textarea {
            min-height: 80px;
            resize: vertical;
        }
        
        .automation-flow {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-4);
            padding: var(--space-8);
            background: var(--bg-secondary);
            border-radius: var(--border-radius);
        }
        
        .flow-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-2);
            padding: var(--space-4);
            background: var(--bg-card);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-sm);
            border: 2px solid var(--border-color);
            transition: all var(--transition-normal);
        }
        
        .flow-step:hover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
        }
        
        .flow-step i {
            font-size: var(--font-size-xl);
            color: var(--primary-color);
        }
        
        .flow-arrow {
            font-size: var(--font-size-xl);
            color: var(--primary-color);
            font-weight: bold;
        }
        
        @media (max-width: 768px) {
            .automation-flow {
                flex-direction: column;
            }
            
            .flow-arrow {
                transform: rotate(90deg);
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize with embed demo
    updateLiveEmbed();
});
