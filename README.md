# Egirls Website

A modern, responsive website built with React following best practices for code organization and maintainability.

## 🏗️ Project Structure

```
/src
  /components
    /shared
      MacOSHeader.css          # Shared macOS-style header styles
    # Reusable UI components go here
  
  /pages
    LandingPage.js            # Landing page with hero image
    LandingPage.css
    Terminal.js               # Main terminal interface with routing
    Terminal.css              # Terminal styles
    AboutPage.js              # About page component
    AboutPage.css
    PhotosPage.js             # Photos gallery page
    PhotosPage.css
    IdentityPage.js           # Brand identity collage page
    IdentityPage.css
    ManifestoPage.js          # Manifesto with typing effect
    ManifestoPage.css
    WineNightPage.js          # Wine night photos grid
    WineNightPage.css
    TransmissionsPage.js       # Transmissions page
    TransmissionsPage.css
    TattoosPage.js            # Tattoos page
    TattoosPage.css
  
  /scripts
    # Image optimization and utility scripts
  
  App.js                      # Main app with React Router
  App.css                     # Global app styles
  index.js                    # Entry point
  index.css                   # Global styles
```

## 🚀 Features

- **Clean Architecture**: Each page is a separate component with its own CSS file
- **Responsive Design**: Mobile-first approach with touch/swipe support
- **macOS-style UI**: Consistent window controls and styling across all pages
- **Image Optimization**: Built-in image optimization scripts
- **React Router**: Clean navigation between pages
- **Modular CSS**: Shared styles with page-specific overrides

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📱 Pages

1. **Landing Page**: Hero image with scroll-to-reveal terminal
2. **Terminal**: Command-line interface with navigation
3. **About**: Information about the egirls collective
4. **Photos**: Photo gallery with navigation
5. **Identity**: Interactive brand asset collage
6. **Manifesto**: Typing effect with manifesto text
7. **Wine Night**: Photo grid from wine night event
8. **Transmissions**: Future content page
9. **Tattoos**: Future tattoo designs page

## 🎨 Design Principles

- **Consistency**: All pages use the same macOS-style header
- **Responsiveness**: Mobile-first design with progressive enhancement
- **Performance**: Optimized images and lazy loading
- **Accessibility**: Proper alt text and semantic HTML
- **Maintainability**: Clean separation of concerns

## 🔧 Scripts

The `/scripts` directory contains utility scripts for:
- Image optimization
- File management
- Build automation

## 📦 Dependencies

- React 18+
- React Router DOM
- Modern CSS features
- Image optimization tools

## 🚀 Deployment

The build process creates an optimized production bundle in the `/build` directory, ready for deployment to any static hosting service.

# Reverted to working state
