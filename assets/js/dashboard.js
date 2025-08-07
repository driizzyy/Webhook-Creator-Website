// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    const userData = JSON.parse(localStorage.getItem('webhookUser'));
    if (!userData) {
        window.location.href = 'auth.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard(userData);
    loadToolStatus();
    loadRoadmapData();
    loadCommunityStats();
    loadAnalyticsData();

    // Sidebar functionality
    initializeSidebar();

    function initializeDashboard(user) {
        // Update user info
        document.getElementById('user-name').textContent = user.firstName || user.name || 'User';
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-since').textContent = new Date(user.loginTime).toLocaleDateString();
        
        // Update account type
        const accountType = user.accountType || 'free';
        document.getElementById('account-type').textContent = accountType.charAt(0).toUpperCase() + accountType.slice(1);
        
        if (accountType === 'premium') {
            document.getElementById('account-type').classList.add('premium');
        }

        // Update stats
        updateDashboardStats();
    }

    function updateDashboardStats() {
        // Simulate real data
        const stats = {
            webhooksCreated: Math.floor(Math.random() * 50) + 10,
            messagessent: Math.floor(Math.random() * 500) + 100,
            uptime: '99.9%',
            lastUsed: 'Today'
        };

        document.getElementById('webhooks-created').textContent = stats.webhooksCreated;
        document.getElementById('messages-sent').textContent = stats.messagesSent;
        document.getElementById('uptime-stat').textContent = stats.uptime;
        document.getElementById('last-used').textContent = stats.lastUsed;
    }

    function loadToolStatus() {
        const statusEl = document.getElementById('tool-status');
        const statusDot = document.getElementById('status-indicator');
        const lastUpdate = document.getElementById('last-status-update');

        // Simulate status check
        setTimeout(() => {
            const isOnline = Math.random() > 0.1; // 90% uptime simulation
            
            if (isOnline) {
                statusEl.textContent = 'All Systems Operational';
                statusEl.className = 'status-text operational';
                statusDot.className = 'status-dot operational';
            } else {
                statusEl.textContent = 'Maintenance Mode';
                statusEl.className = 'status-text maintenance';
                statusDot.className = 'status-dot maintenance';
            }

            lastUpdate.textContent = new Date().toLocaleString();
        }, 1000);
    }

    function loadRoadmapData() {
        const roadmapContainer = document.getElementById('roadmap-items');
        
        const roadmapItems = [
            {
                title: 'Advanced Message Formatting',
                description: 'Rich text editor with markdown support and live preview',
                status: 'in-progress',
                votes: 127,
                eta: 'Q1 2024'
            },
            {
                title: 'Webhook Analytics Dashboard',
                description: 'Detailed statistics and performance metrics for your webhooks',
                status: 'planned',
                votes: 89,
                eta: 'Q2 2024'
            },
            {
                title: 'Team Collaboration Features',
                description: 'Share and manage webhooks with team members',
                status: 'planned',
                votes: 156,
                eta: 'Q2 2024'
            },
            {
                title: 'API Integration',
                description: 'REST API for programmatic webhook management',
                status: 'research',
                votes: 203,
                eta: 'Q3 2024'
            }
        ];

        roadmapContainer.innerHTML = roadmapItems.map(item => `
            <div class="roadmap-item ${item.status}">
                <div class="roadmap-header">
                    <h4>${item.title}</h4>
                    <div class="roadmap-meta">
                        <span class="status-badge ${item.status}">${item.status.replace('-', ' ')}</span>
                        <span class="eta">ETA: ${item.eta}</span>
                    </div>
                </div>
                <p>${item.description}</p>
                <div class="roadmap-footer">
                    <div class="votes">
                        <button class="vote-btn" onclick="voteForFeature('${item.title}')">
                            <i class="fas fa-thumbs-up"></i>
                            <span>${item.votes}</span>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function loadCommunityStats() {
        const stats = {
            totalUsers: '12,847',
            activeToday: '2,341',
            webhooksCreated: '45,123',
            messagesSent: '1.2M'
        };

        document.getElementById('community-users').textContent = stats.totalUsers;
        document.getElementById('active-today').textContent = stats.activeToday;
        document.getElementById('community-webhooks').textContent = stats.webhooksCreated;
        document.getElementById('community-messages').textContent = stats.messagesSent;
    }

    function loadAnalyticsData() {
        // Simulate analytics data
        const chartData = generateMockChartData();
        createUsageChart(chartData);
    }

    function generateMockChartData() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => ({
            day,
            messages: Math.floor(Math.random() * 100) + 20,
            webhooks: Math.floor(Math.random() * 10) + 2
        }));
    }

    function createUsageChart(data) {
        const canvas = document.getElementById('usage-chart');
        const ctx = canvas.getContext('2d');
        
        // Simple bar chart implementation
        const maxMessages = Math.max(...data.map(d => d.messages));
        const barWidth = canvas.width / data.length;
        const barSpacing = 10;
        const actualBarWidth = barWidth - barSpacing;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        data.forEach((item, index) => {
            const barHeight = (item.messages / maxMessages) * (canvas.height - 60);
            const x = index * barWidth + barSpacing / 2;
            const y = canvas.height - barHeight - 30;
            
            // Draw bar
            ctx.fillStyle = '#5865F2';
            ctx.fillRect(x, y, actualBarWidth, barHeight);
            
            // Draw label
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(item.day, x + actualBarWidth / 2, canvas.height - 10);
            
            // Draw value
            ctx.fillText(item.messages, x + actualBarWidth / 2, y - 5);
        });
    }

    function initializeSidebar() {
        const sidebarItems = document.querySelectorAll('.sidebar-item');
        const contentSections = document.querySelectorAll('.content-section');

        sidebarItems.forEach(item => {
            item.addEventListener('click', function() {
                const target = this.dataset.section;
                
                // Update active states
                sidebarItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Show/hide content sections
                contentSections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === target) {
                        section.classList.add('active');
                    }
                });
            });
        });
    }

    // Global functions
    window.voteForFeature = function(featureTitle) {
        const voteBtn = event.target.closest('.vote-btn');
        const voteCount = voteBtn.querySelector('span');
        const currentVotes = parseInt(voteCount.textContent);
        
        // Animate vote
        voteBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            voteBtn.style.transform = 'scale(1)';
        }, 150);
        
        // Update count
        voteCount.textContent = currentVotes + 1;
        voteBtn.classList.add('voted');
        
        showNotification(`Thanks for voting for "${featureTitle}"!`, 'success');
    };

    window.joinBetaAccess = function() {
        const modal = document.getElementById('beta-modal');
        modal.classList.add('active');
    };

    window.submitBetaApplication = function() {
        const form = document.getElementById('beta-form');
        const formData = new FormData(form);
        
        // Show loading
        const submitBtn = form.querySelector('.modal-submit');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            closeModal('beta-modal');
            showNotification('Beta application submitted! We\'ll be in touch soon.', 'success');
            
            // Reset form
            form.reset();
            submitBtn.innerHTML = 'Submit Application';
            submitBtn.disabled = false;
        }, 2000);
    };

    window.downloadResource = function(resourceName) {
        showNotification(`Downloading ${resourceName}...`, 'info');
        
        // Simulate download
        setTimeout(() => {
            showNotification(`${resourceName} downloaded successfully!`, 'success');
        }, 1500);
    };

    window.signOut = function() {
        localStorage.removeItem('webhookUser');
        showNotification('You have been signed out.', 'info');
        
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1000);
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
    };

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
        }, 5000);
    }

    // Auto-refresh functionality
    setInterval(() => {
        loadToolStatus();
        updateDashboardStats();
    }, 60000); // Refresh every minute

    // Animation styles
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
        
        .vote-btn.voted {
            background: var(--secondary-color) !important;
            color: white !important;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: var(--bg-primary);
            border-radius: var(--border-radius-lg);
            padding: 2rem;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .modal.active .modal-content {
            transform: scale(1);
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
            font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--bg-secondary);
            color: var(--text-primary);
            font-family: inherit;
        }
        
        .form-group textarea {
            min-height: 100px;
            resize: vertical;
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 1.5rem;
        }
        
        .modal-submit {
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: inherit;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .modal-submit:hover {
            background: #4752C4;
        }
        
        .modal-cancel {
            background: transparent;
            color: var(--text-muted);
            border: 1px solid var(--border-color);
            padding: 0.75rem 1.5rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-family: inherit;
            transition: all 0.2s ease;
        }
        
        .modal-cancel:hover {
            background: var(--bg-secondary);
        }
    `;
    document.head.appendChild(style);
});
