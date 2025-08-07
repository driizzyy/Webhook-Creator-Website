// Discord API Utilities
// Author: driizzyy
// Version: 1.0.0 - Utility functions for Discord API integration

class DiscordAPIUtils {
    static SERVER_ID = '1402945206516715612';
    static WIDGET_API_URL = `https://discord.com/api/guilds/${DiscordAPIUtils.SERVER_ID}/widget.json`;
    static WIDGET_IFRAME_URL = `https://discord.com/widget?id=${DiscordAPIUtils.SERVER_ID}&theme=dark`;
    
    // Cache for API responses
    static cache = {
        data: null,
        lastUpdate: 0,
        ttl: 60000 // 1 minute TTL
    };
    
    /**
     * Fetch Discord server widget data
     * @param {boolean} useCache - Whether to use cached data if available
     * @returns {Promise<Object>} Discord widget data
     */
    static async fetchWidgetData(useCache = true) {
        const now = Date.now();
        
        // Return cached data if still valid
        if (useCache && this.cache.data && (now - this.cache.lastUpdate) < this.cache.ttl) {
            return this.cache.data;
        }
        
        try {
            const response = await fetch(this.WIDGET_API_URL);
            
            if (!response.ok) {
                throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Update cache
            this.cache.data = data;
            this.cache.lastUpdate = now;
            
            console.log('✅ Discord widget data fetched:', data);
            return data;
            
        } catch (error) {
            console.warn('⚠️ Failed to fetch Discord widget data:', error);
            
            // Return cached data if available, even if expired
            if (this.cache.data) {
                console.log('📦 Using cached Discord data');
                return this.cache.data;
            }
            
            // Return fallback data
            return this.getFallbackData();
        }
    }
    
    /**
     * Get fallback data when API is unavailable
     * @returns {Object} Fallback widget data
     */
    static getFallbackData() {
        return {
            id: this.SERVER_ID,
            name: 'Discord Webhook Creator Pro',
            instant_invite: 'https://discord.gg/YOUR_INVITE_CODE',
            presence_count: 1250,
            members: [],
            channels: []
        };
    }
    
    /**
     * Format member count for display
     * @param {number} count - Member count
     * @returns {string} Formatted count
     */
    static formatMemberCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        }
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    }
    
    /**
     * Get status color for member status
     * @param {string} status - Member status (online, idle, dnd, offline)
     * @returns {string} Color code
     */
    static getStatusColor(status) {
        const colors = {
            online: '#43b581',
            idle: '#faa61a',
            dnd: '#f04747',
            offline: '#747f8d'
        };
        return colors[status] || colors.offline;
    }
    
    /**
     * Update DOM elements with Discord data
     * @param {Object} data - Discord widget data
     */
    static updateDOM(data) {
        // Update server name
        const nameElements = document.querySelectorAll('[data-discord-name]');
        nameElements.forEach(el => {
            if (data.name) {
                el.textContent = data.name;
            }
        });
        
        // Update member counts
        const memberElements = document.querySelectorAll('[data-discord-members]');
        memberElements.forEach(el => {
            const count = data.presence_count || 0;
            el.textContent = this.formatMemberCount(count);
        });
        
        // Update online counts
        const onlineElements = document.querySelectorAll('[data-discord-online]');
        onlineElements.forEach(el => {
            const count = data.members ? data.members.filter(m => m.status === 'online').length : 0;
            el.textContent = this.formatMemberCount(count);
        });
        
        // Update invite links
        const inviteElements = document.querySelectorAll('[data-discord-invite]');
        inviteElements.forEach(el => {
            if (data.instant_invite) {
                el.href = data.instant_invite;
            }
        });
    }
    
    /**
     * Create member avatar element
     * @param {Object} member - Member data
     * @returns {HTMLElement} Avatar element
     */
    static createMemberAvatar(member) {
        const avatar = document.createElement('div');
        avatar.className = 'member-avatar';
        
        const img = document.createElement('img');
        img.src = member.avatar_url || `https://cdn.discordapp.com/embed/avatars/${member.discriminator % 5}.png`;
        img.alt = member.username;
        img.loading = 'lazy';
        
        const status = document.createElement('div');
        status.className = `member-status ${member.status}`;
        status.style.backgroundColor = this.getStatusColor(member.status);
        
        avatar.appendChild(img);
        avatar.appendChild(status);
        
        return avatar;
    }
    
    /**
     * Generate Discord embed code for sharing
     * @param {Object} options - Embed options
     * @returns {string} HTML embed code
     */
    static generateEmbedCode(options = {}) {
        const {
            width = 350,
            height = 500,
            theme = 'dark'
        } = options;
        
        return `<iframe src="${this.WIDGET_IFRAME_URL}&theme=${theme}" width="${width}" height="${height}" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`;
    }
    
    /**
     * Check if Discord widget is available
     * @returns {Promise<boolean>} Widget availability
     */
    static async isWidgetAvailable() {
        try {
            const response = await fetch(this.WIDGET_API_URL, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    /**
     * Get widget statistics
     * @returns {Promise<Object>} Widget statistics
     */
    static async getWidgetStats() {
        try {
            const data = await this.fetchWidgetData();
            
            const onlineMembers = data.members ? data.members.filter(m => m.status === 'online') : [];
            const voiceChannels = data.channels ? data.channels.filter(c => c.type === 2) : [];
            const voiceMembers = voiceChannels.reduce((total, channel) => {
                return total + (channel.members ? channel.members.length : 0);
            }, 0);
            
            return {
                totalMembers: data.presence_count || 0,
                onlineMembers: onlineMembers.length,
                voiceMembers: voiceMembers,
                voiceChannels: voiceChannels.length,
                serverName: data.name || 'Unknown Server',
                lastUpdated: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Failed to get widget stats:', error);
            return {
                totalMembers: 0,
                onlineMembers: 0,
                voiceMembers: 0,
                voiceChannels: 0,
                serverName: 'Unknown Server',
                lastUpdated: new Date().toISOString(),
                error: error.message
            };
        }
    }
    
    /**
     * Initialize Discord widget on page load
     */
    static async init() {
        console.log('🎮 Initializing Discord API Utils...');
        
        try {
            const data = await this.fetchWidgetData();
            this.updateDOM(data);
            
            // Set up periodic updates
            setInterval(async () => {
                try {
                    const freshData = await this.fetchWidgetData(false);
                    this.updateDOM(freshData);
                } catch (error) {
                    console.warn('Failed to update Discord data:', error);
                }
            }, 60000); // Update every minute
            
        } catch (error) {
            console.error('Failed to initialize Discord widget:', error);
        }
    }
}

// Auto-initialize when DOM is loaded
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        DiscordAPIUtils.init();
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscordAPIUtils;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.DiscordAPIUtils = DiscordAPIUtils;
}
