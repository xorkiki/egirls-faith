# Landing Page Image Disappearance - Diagnosis

## BEFORE (Working Version):

```css
.landing-page {
  position: relative;
  width: 100vw;
  height: 200vh;
  overflow: hidden;  /* ← Key difference */
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
```

## AFTER (Broken Version):

```css
.landing-page {
  position: relative;
  width: 100vw;
  height: 200vh;
  overflow-x: hidden;  /* ← Changed */
  overflow-y: auto;     /* ← Changed - This is the problem! */
  background-color: #000;
  box-sizing: border-box;
}

.background-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  background-color: #000;  /* ← Added */
}
```

## ROOT CAUSE IDENTIFIED:

The change from `overflow: hidden` to `overflow-y: auto` creates a **scrollable container** on `.landing-page`, but:

1. The scroll handler in LandingPage.js uses `window.addEventListener('scroll')` and `window.pageYOffset`
2. The `.background-container` is `position: fixed` with `z-index: -1`
3. When `.landing-page` becomes a scrollable container, the fixed background might be positioned relative to the scrolling container instead of the viewport
4. The background-color we added to `.landing-page` might also be covering the image

Actually wait - `position: fixed` should position relative to the viewport, not the container. So that shouldn't be the issue.

Let me think... The real issue might be that with `overflow-y: auto`, the `.landing-page` container itself scrolls, and the fixed background is behind everything (z-index: -1). But if the container is scrolling, the image should still be visible...

OH WAIT! I see it now. The issue is that we need `overflow: hidden` to keep the scroll on the window level, not the container level. The landing page scroll mechanism depends on window scroll, not container scroll.

## THE FIX:

We need to keep `overflow: hidden` for the landing page to preserve the scroll mechanism, but we can still prevent horizontal scroll by using `overflow-x: hidden` explicitly.