# Comprehensive Landing Page Debug Analysis

## Current Structure:

```html
<div className="landing-page">  <!-- position: relative, height: 200vh, overflow: hidden, background-color: #000 -->
  <div className="background-container">  <!-- position: fixed, z-index: -1 -->
    <div className="background-image" />  <!-- position: absolute, backgroundImage: url(/hero.png) -->
    <div className="fade-overlay" />  <!-- position: absolute, z-index: 1, opacity: 0 -->
  </div>
</div>
```

## Potential Issues:

### 1. Z-INDEX ISSUE (MOST LIKELY!)
`.background-container` has `z-index: -1` which puts it BEHIND the `.landing-page` element.
Since `.landing-page` has `background-color: #000`, the fixed container is behind the black background!

**Solution**: Change `z-index: -1` to `z-index: 0` or remove z-index entirely (default is auto/0 for fixed)

### 2. BACKGROUND-COLOR ON PARENT
`.landing-page` has `background-color: #000` which we added for white bars fix.
But this creates a visual layer that the fixed element (z-index: -1) sits behind!

**Solution**: Remove background-color from `.landing-page` OR adjust z-index hierarchy

### 3. OVERFLOW HIDDEN
`.landing-page` has `overflow: hidden` which might clip the fixed child on mobile

**Solution**: Fixed elements should not be clipped by overflow: hidden, but worth checking

### 4. VIEWPORT UNITS ON MOBILE
Using `100vw` and `100vh` on mobile can cause issues with browser chrome

**Solution**: Check if this is the issue, but unlikely since original worked

### 5. TRANSFORM ISSUES
The background-image div uses transform for scaling - could cause issues on mobile

**Solution**: Verify transform works, but original had this too

## RECOMMENDED FIX:

The most likely issue is the z-index: -1 combined with the background-color: #000 on .landing-page.
We need to either:
1. Remove z-index: -1 and use z-index: 0 (or auto)
2. OR remove background-color from .landing-page (but keep global html/body)

Option 1 is safer - keep the background-color for white bars fix, just fix the z-index.