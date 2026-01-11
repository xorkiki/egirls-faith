# Egirls Website

A modern, responsive website for egirls, an experimental publication exploring the chaos of existence in the digital age. Built with React following best practices for code organization and maintainability.

## About

Egirls is a new media experiment for the terminally online. It's an experimental publication that explores digital culture through monthly physical editions called "the transmission" - curated drops of analog artifacts sent through the postal system. The publication features essays on digital philosophy, reflections on being a woman in the digital age, visual manifestos, and art that embodies what it means to be a messy human in a polished algorithmic world.

## Project Structure

```
/src
  /components
    CardStack.js
    EnvelopeScrollReveal.js
    MobileNotesPage.js
    NotesModal.js
    StripeModal.js
    StripeUSModal.js
  
  /pages
    LandingPage.js            # Landing page with hero image and scroll-to-reveal
    LandingPage.css
    Terminal.js               # Main terminal interface with navigation
    Terminal.css
    About.js                  # About egirls page
    About.css
    Transmissions.js          # Transmissions subscription page
    Transmissions.css
    Photos.js                 # Mail club page with interactive notes interface
    Photos.css
    PaperTrail.js             # Inside the envelope page with scroll reveal
    PaperTrail.css
  
  /scripts
    # Image optimization and utility scripts
  
  App.js                      # Main app with React Router
  App.css                     # Global app styles
  index.js                    # Entry point
  index.css                   # Global styles
```

## Features

- Clean Architecture: Each page is a separate component with its own CSS file
- Responsive Design: Mobile-first approach with touch/swipe support
- macOS-style UI: Consistent window controls and styling across all pages
- Image Optimization: Built-in image optimization scripts
- React Router: Clean navigation between pages
- Modular CSS: Shared styles with page-specific overrides

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Pages

1. **Landing Page** (/): Hero image with scroll-to-reveal that transitions to the terminal
2. **Terminal** (/terminal): Command-line interface serving as the main navigation hub
3. **About** (/about): Information about egirls, the publication, and the philosophy
4. **Transmissions** (/confession): Subscription page with Typeform integration for monthly editions
5. **Mail Club** (/mailclub): Interactive page with draggable desktop icons and notes interface
6. **Inside the Envelope** (/insidetheenvelope): Scroll-reveal page showing example envelope and letter content

## Design Principles

- Consistency: All pages use the same macOS-style header with window controls
- Responsiveness: Mobile-first design with progressive enhancement
- Performance: Optimized images and lazy loading
- Accessibility: Proper alt text and semantic HTML
- Maintainability: Clean separation of concerns

## Scripts

The `/scripts` directory contains utility scripts for:
- Image optimization and compression
- File management and cleanup
- Build automation

## Dependencies

- React 18+
- React Router DOM 7+
- Framer Motion
- React Scripts
- Image optimization tools (imagemin, mozjpeg, pngquant, webp)

## Deployment

The build process creates an optimized production bundle in the `/build` directory, ready for deployment to any static hosting service.