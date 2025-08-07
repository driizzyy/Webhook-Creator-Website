// Discord Widget Manager
// Author: driizzyy
// Version: 1.0.0 - Discord Server Widget Integration

class DiscordWidget {
    constructor(serverId, options = {}) {
        this.serverId = serverId;
        this.apiUrl = `https://discord.com/api/guilds/${serverId}/widget.json`;
        this.widgetUrl = `https://discord.com/widget?id=${serverId}&theme=dark`;
        
        this.options = {
            updateInterval: 30000, // 30 seconds
            showMemberCount: true,
            showOnlineCount: true,
            showVoiceChannels: true,
            animateCounters: true,
            ...options
        };
        
        this.cache = {
            data: null,
            lastUpdate: 0,
            isOnline: false
        };
        
        this.init();
    }
    
    init() {
        console.log('🎮 Discord Widget Manager initialized');
        this.loadWidgetData();
        this.startAutoUpdate();
        this.setupEventListeners();
    }
    
    async loadWidgetData() {
        try {
            const response = await fetch(this.apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.cache.data = data;
            this.cache.lastUpdate = Date.now();
            this.cache.isOnline = true;
            
            this.updateUI(data);
            this.updateStatus('online');
            
            console.log('✅ Discord widget data loaded:', data);
            
        } catch (error) {
            console.warn('⚠️ Failed to load Discord widget data:', error);
            this.cache.isOnline = false;
            this.updateStatus('offline');
            this.showFallbackData();
        }
    }
    
    updateUI(data) {
        // Update member counts
        if (this.options.showMemberCount) {
            this.updateMemberCount(data.presence_count || 0);
        }
        
        // Update server info
        this.updateServerInfo(data);
        
        // Update member list preview
        this.updateMemberPreview(data.members || []);
        
        // Update voice channels
        if (this.options.showVoiceChannels) {
            this.updateVoiceChannels(data.channels || []);
        }
    }
    
    updateMemberCount(count) {
        const memberCountElements = document.querySelectorAll('[data-discord-members]');
        const onlineCountElements = document.querySelectorAll('[data-discord-online]');
        
        if (this.options.animateCounters) {
            this.animateCounter(memberCountElements, count);
            this.animateCounter(onlineCountElements, count);
        } else {
            memberCountElements.forEach(el => el.textContent = count.toLocaleString());
            onlineCountElements.forEach(el => el.textContent = count.toLocaleString());
        }
    }
    
    updateServerInfo(data) {
        // Update server name
        const serverNameElements = document.querySelectorAll('[data-discord-name]');
        serverNameElements.forEach(el => {
            el.textContent = data.name || 'Discord Server';
        });
        
        // Update instant invite
        if (data.instant_invite) {
            const inviteElements = document.querySelectorAll('[data-discord-invite]');
            inviteElements.forEach(el => {
                el.href = data.instant_invite;
            });
        }
    }
    
    updateMemberPreview(members) {
        const memberPreviewContainer = document.querySelector('.discord-member-preview');
        if (!memberPreviewContainer || members.length === 0) return;
        
        memberPreviewContainer.innerHTML = '';
        
        // Show first 5 online members
        const onlineMembers = members.filter(member => member.status === 'online').slice(0, 5);
        
        onlineMembers.forEach(member => {
            const memberElement = document.createElement('div');
            memberElement.className = 'discord-member-item';
            memberElement.innerHTML = `
                <div class="member-avatar">
                    <img src="${member.avatar_url}" alt="${member.username}" loading="lazy">
                    <div class="member-status ${member.status}"></div>
                </div>
                <span class="member-name">${member.username}</span>
            `;
            memberPreviewContainer.appendChild(memberElement);
        });
        
        // Add "and X more" if there are more members
        if (members.length > 5) {
            const moreElement = document.createElement('div');
            moreElement.className = 'discord-member-more';
            moreElement.textContent = `+${members.length - 5} more`;
            memberPreviewContainer.appendChild(moreElement);
        }
    }
    
    updateVoiceChannels(channels) {
        const voiceChannelsContainer = document.querySelector('.discord-voice-channels');
        if (!voiceChannelsContainer) return;
        
        voiceChannelsContainer.innerHTML = '';
        
        const voiceChannels = channels.filter(channel => channel.type === 2); // Voice channels
        
        if (voiceChannels.length === 0) {
            voiceChannelsContainer.innerHTML = '<p class="no-voice-activity">No active voice channels</p>';
            return;
        }
        
        voiceChannels.forEach(channel => {
            const channelElement = document.createElement('div');
            channelElement.className = 'voice-channel-item';
            channelElement.innerHTML = `
                <div class="voice-channel-info">
                    <i class="fas fa-volume-up"></i>
                    <span class="channel-name">${channel.name}</span>
                </div>
                <span class="channel-members">${channel.members?.length || 0} members</span>
            `;
            voiceChannelsContainer.appendChild(channelElement);
        });
    }
    
    updateStatus(status) {
        const statusElements = document.querySelectorAll('.widget-status .status-dot');
        const statusTextElements = document.querySelectorAll('.widget-status span');
        
        statusElements.forEach(el => {
            el.className = `status-dot ${status}`;
        });
        
        statusTextElements.forEach(el => {
            el.textContent = status === 'online' ? 'Online' : 'Offline';
        });
    }
    
    showFallbackData() {
        // Show static fallback data when API is unavailable
        this.updateMemberCount(1250); // Fallback member count
        
        const serverNameElements = document.querySelectorAll('[data-discord-name]');
        serverNameElements.forEach(el => {
            el.textContent = 'Discord Server';
        });
    }
    
    animateCounter(elements, target) {
        elements.forEach(element => {
            const start = parseInt(element.textContent.replace(/,/g, '')) || 0;
            const duration = 2000;
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
        });
    }
    
    easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
    }
    
    startAutoUpdate() {
        setInterval(() => {
            this.loadWidgetData();
        }, this.options.updateInterval);
    }
    
    setupEventListeners() {
        // Refresh widget data when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && Date.now() - this.cache.lastUpdate > 60000) {
                this.loadWidgetData();
            }
        });
        
        // Handle widget iframe load errors
        const widgetIframes = document.querySelectorAll('iframe[src*="discord.com/widget"]');
        widgetIframes.forEach(iframe => {
            iframe.addEventListener('error', () => {
                console.warn('Discord widget iframe failed to load');
                this.showWidgetError(iframe);
            });
        });
    }
    
    showWidgetError(iframe) {
        const errorElement = document.createElement('div');
        errorElement.className = 'discord-widget-error';
        errorElement.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h4>Widget Unavailable</h4>
                <p>The Discord widget is temporarily unavailable.</p>
                <a href="${this.cache.data?.instant_invite || 'https://discord.gg/YOUR_INVITE_CODE'}" 
                   class="btn btn-primary" target="_blank">
                    <i class="fab fa-discord"></i>
                    Join Server Directly
                </a>
            </div>
        `;
        
        iframe.parentNode.replaceChild(errorElement, iframe);
    }
    
    // Public methods
    refresh() {
        console.log('🔄 Refreshing Discord widget data...');
        this.loadWidgetData();
    }
    
    getServerData() {
        return this.cache.data;
    }
    
    isServerOnline() {
        return this.cache.isOnline;
    }
}

// Initialize Discord Widget when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize with your server ID
    window.discordWidget = new DiscordWidget('1402945206516715612', {
        updateInterval: 30000, // Update every 30 seconds
        showMemberCount: true,
        showOnlineCount: true,
        showVoiceChannels: true,
        animateCounters: true
    });
    
    console.log('🎮 Discord Widget System Ready!');
});

// Global refresh function
window.refreshDiscordWidget = function() {
    if (window.discordWidget) {
        window.discordWidget.refresh();
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscordWidget;
}
