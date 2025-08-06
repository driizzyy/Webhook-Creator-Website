# Discord Webhook Creator Pro - Website

A professional, modern website for the Discord Webhook Creator Pro tool. Built with vanilla HTML, CSS, and JavaScript for optimal performance and GitHub Pages compatibility.

## 🌟 Features

### Design & User Experience
- **Modern Professional Design** - Clean, Discord-inspired aesthetics
- **Fully Responsive** - Perfect display on all devices and screen sizes
- **Smooth Animations** - Engaging scroll animations and hover effects
- **Accessible** - WCAG compliant with keyboard navigation support
- **Fast Loading** - Optimized for performance with minimal dependencies

### Functionality
- **Interactive Navigation** - Smooth scrolling with mobile-friendly hamburger menu
- **GitHub API Integration** - Real-time repository stats and release information
- **Animated Counters** - Eye-catching statistics with scroll-triggered animations
- **Developer Showcase** - Professional profile section for driizzyy
- **Download Center** - Easy access to latest releases and source code

### Technical Features
- **GitHub Pages Ready** - Optimized for seamless GitHub Pages deployment
- **SEO Optimized** - Proper meta tags and semantic HTML structure
- **Cross-browser Compatible** - Works perfectly on all modern browsers
- **Progressive Enhancement** - Core functionality works without JavaScript
- **Performance Monitoring** - Built-in performance tracking for optimization

## 🚀 Quick Start

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/driizzyy/Webhook-Creator.git
   cd Webhook-Creator/website
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Visit `http://localhost:8000` to view the website

### GitHub Pages Deployment
1. Push the website files to your repository
2. Go to repository Settings → Pages
3. Select source branch (usually `main` or `gh-pages`)
4. Set folder to `/website` if files are in a subdirectory
5. Your site will be available at `https://driizzyy.github.io/Webhook-Creator/`

## 📁 File Structure

```
website/
├── index.html          # Main HTML file with semantic structure
├── docs.html          # Docs HTML file with for tool documentation
├── styles.css          # Comprehensive CSS with custom properties
├── script.js           # Modular JavaScript for all functionality
└── README.md           # This documentation file
```

## 🎨 Customization

### Colors & Themes
The website uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #5865f2;      /* Discord Blurple */
    --secondary-color: #57F287;     /* Discord Green */
    --accent-color: #FEE75C;        /* Discord Yellow */
    /* ... more variables */
}
```

### Content Updates
- **Hero Section**: Update title, description, and stats in `index.html`
- **Features**: Modify feature cards in the features section
- **Updates Timeline**: Add new version information to the timeline
- **Developer Info**: Update profile information and social links

### GitHub Integration
The website automatically fetches:
- Repository star count
- Latest release information
- Download statistics
- Version numbers

Configure in `script.js`:
```javascript
const CONFIG = {
    GITHUB_API_BASE: 'https://api.github.com/repos/driizzyy/Webhook-Creator',
    GITHUB_REPO_URL: 'https://github.com/driizzyy/Webhook-Creator',
    // ... other settings
};
```

## 🔧 Technical Specifications

### Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### Accessibility Features
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimized
- High contrast mode support
- Reduced motion preferences

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1200px

## 🔄 API Integration

The website integrates with GitHub API to provide:
- Real-time repository statistics
- Latest release information
- Download links
- Version updates

All API calls include graceful fallbacks for offline functionality.

## 🚀 Deployment Options

### GitHub Pages (Recommended)
- Automatic deployment from repository
- Custom domain support
- SSL/HTTPS included
- CDN distribution

### Alternative Platforms
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based continuous deployment
- **Firebase Hosting**: Google's hosting platform
- **Surge.sh**: Simple static hosting

## 📊 Analytics & Monitoring

### Performance Monitoring
Built-in performance tracking includes:
- Page load times
- Core Web Vitals
- User interaction metrics
- API response times

### Analytics Integration
Ready for analytics platforms:
- Google Analytics 4
- Plausible Analytics
- Fathom Analytics
- Custom analytics solutions

## 🔒 Security Features

- **Content Security Policy** ready
- **HTTPS enforced** on GitHub Pages
- **No sensitive data** exposed
- **Secure API calls** with error handling
- **XSS protection** through proper encoding

## 🎯 SEO Optimization

- Semantic HTML5 structure
- Open Graph meta tags
- Twitter Card support
- Structured data markup
- Sitemap ready
- Robot.txt friendly

## 🤝 Contributing

To contribute to the website:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test locally
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Contribution Guidelines
- Follow existing code style and structure
- Test on multiple devices and browsers
- Ensure accessibility standards are maintained
- Update documentation as needed
- Keep performance optimized

## 📄 License

This website is part of the Discord Webhook Creator Pro project and is licensed under the MIT License. See the main repository's LICENSE file for details.

## 🆘 Support

Need help with the website?

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our Discord server for community support
- **Email**: Contact driizzyy for direct support

## 🏆 Credits

**Designer & Developer**: DriizzyyB (driizzyy)
**Framework**: Vanilla HTML/CSS/JavaScript
**Icons**: Font Awesome
**Fonts**: Google Fonts (Inter)
**Hosting**: GitHub Pages

---

**Made with ❤️ by driizzyy | Professional Discord Tools**

