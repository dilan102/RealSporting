# Full-Screen Preloader - Integration Guide

## 📋 Overview

A production-ready full-screen preloader with the following features:
- Pure HTML/CSS/JavaScript (no external dependencies)
- Fixed full-screen overlay with dark background
- Horizontal scanner line animation with cyan neon glow
- Animated logo with pulse effect
- Glitch exit animation after 3.5 seconds
- Smooth fade-out reveal
- Fully customizable timing and colors

---

## 📁 Files Created

| File | Location | Purpose |
|------|----------|---------|
| `preloader.css` | `/public/preloader.css` | Standalone CSS file (for external linking) |
| `preloader.js` | `/public/preloader.js` | Standalone JavaScript file (for external linking) |
| `preloader.html` | `/public/preloader.html` | Full demo page with embedded styles/scripts |
| `Preloader.tsx` | `/components/ui/Preloader.tsx` | Next.js React component (recommended for app/) |

---

## 🚀 Integration Methods

### Method 1: Next.js Component (Recommended)

Best for modern Next.js applications using the App Router.

#### Step 1: Import styles in your layout

**File:** `app/layout.tsx`

```tsx
import './globals.css';
import '/public/preloader.css'; // Add this line

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

#### Step 2: Import and use the Preloader component

**File:** `app/layout.tsx`

```tsx
'use client';

import Preloader from '@/components/ui/Preloader';
import './globals.css';
import '/public/preloader.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Preloader logoSrc="/brand/logo.png" duration={3500} />
        {children}
      </body>
    </html>
  );
}
```

#### Component Props

```typescript
interface PreloaderProps {
  /** Path to the club logo image (default: '/brand/logo.png') */
  logoSrc?: string;
  
  /** Duration before preloader starts exiting in milliseconds (default: 3500) */
  duration?: number;
  
  /** Optional callback when preloader animation completes */
  onComplete?: () => void;
}
```

#### Example with callback

```tsx
<Preloader
  logoSrc="/brand/logo.png"
  duration={3500}
  onComplete={() => {
    console.log('Preloader animation complete!');
    // Trigger additional actions here
  }}
/>
```

---

### Method 2: External CSS/JS Files (Alternative)

For simpler projects or when you need maximum control.

#### Step 1: Add to your HTML head

```html
<head>
  <link rel="stylesheet" href="/preloader.css">
  <script defer src="/preloader.js"></script>
</head>
```

#### Step 2: Add the preloader markup

```html
<body>
  <!-- PRELOADER MARKUP -->
  <div id="preloader">
    <div id="scanner-container">
      <div id="scanner-line"></div>
    </div>
    <img 
      id="preloader-logo" 
      src="/brand/logo.png" 
      alt="Club Logo"
    >
  </div>

  <!-- Your page content -->
  <div id="app">
    <!-- ... -->
  </div>
</body>
```

---

### Method 3: Standalone HTML File

For testing, reference, or standalone use.

```bash
# Open the demo
open /public/preloader.html
# or
firefox /public/preloader.html
```

The demo includes:
- ✅ Complete working example
- ✅ Control buttons for testing
- ✅ Integration instructions
- ✅ API reference

---

## 🎨 Customization

### Change Scanner Color

Edit the gradient color in `preloader.css`:

```css
#scanner-line {
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 255, 255, 0.8) 25%,        /* ← Change cyan to your color */
    rgba(255, 255, 255, 1) 50%,        /* ← White center */
    rgba(0, 255, 255, 0.8) 75%,        /* ← Change cyan to your color */
    transparent 100%
  );
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.6),  /* ← Glow color */
              /* ... */;
}
```

Example: **Red neon**
```css
rgba(255, 0, 0, 0.8)      /* Red instead of cyan */
rgba(255, 0, 0, 0.6)      /* Red glow instead of cyan */
```

Example: **Green neon**
```css
rgba(0, 255, 0, 0.8)      /* Green instead of cyan */
rgba(0, 255, 0, 0.6)      /* Green glow instead of cyan */
```

### Change Background Color

Edit in `preloader.css`:

```css
#preloader {
  background-color: #0a0a0a;  /* ← Change to your color */
}
```

### Change Duration

#### In React component:
```tsx
<Preloader duration={5000} />  <!-- 5 seconds instead of 3.5 -->
```

#### In external JS:
```javascript
const PRELOADER_DURATION = 5000;  // Modify this constant
```

### Change Logo Size

Edit in `preloader.css`:

```css
#preloader-logo {
  width: 150px;           /* ← Change width */
  max-width: 200px;       /* ← Change max-width */
}
```

### Disable Glitch Effect

Remove the glitch class application in `preloader.js`:

```javascript
// Comment out or remove this line:
preloader.classList.add('glitch-out');

// The preloader will fade out without the glitch effect
```

---

## 🎮 JavaScript API

When using external files or in any context, you can access the preloader API:

```javascript
// Check if preloader is active
if (window.PreloaderAPI.isActive()) {
  console.log('Preloader is running');
}

// Manually exit the preloader
window.PreloaderAPI.exit();

// Reset the preloader to initial state
window.PreloaderAPI.reset();

// Listen for completion event
document.addEventListener('preloaderComplete', () => {
  console.log('Preloader animation finished!');
});
```

---

## ⏱️ Animation Timing

The complete sequence:

| Phase | Duration | Description |
|-------|----------|-------------|
| **Scan Loop** | 0-3500ms | Scanner line sweeps top to bottom, logo pulses |
| **Glitch** | 3500-4300ms | Rapid distortions and color shifts (800ms) |
| **Fade Out** | 4300-4700ms | Smooth opacity fade to 0 (400ms) |
| **Complete** | 4700ms+ | Preloader hidden, page revealed |

---

## 🐛 Troubleshooting

### Logo doesn't appear

✅ Check the `logoSrc` path is correct
✅ Ensure the image file exists in `/public/brand/`
✅ The component includes a SVG fallback if the image fails to load

### Preloader doesn't hide

✅ Make sure the CSS file is loaded
✅ Check browser console for errors
✅ Verify the preloader div exists in DOM

### Scanner line not showing

✅ Check that `#scanner-container` and `#scanner-line` divs exist
✅ Verify CSS is properly linked
✅ Check z-index isn't blocked by other elements

### Animation stuttering

✅ Use CSS animations (handled automatically)
✅ Reduce other heavy JS on the page
✅ Check GPU acceleration in browser DevTools

---

## 📊 Browser Compatibility

- ✅ Chrome/Edge 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Android Chrome)

Uses only standard CSS features:
- CSS Flexbox
- CSS Animations (@keyframes)
- CSS Gradients
- CSS Filters (hue-rotate)
- Standard DOM APIs

---

## 🔒 Security Notes

- No external requests (self-contained)
- No inline event handlers (uses addEventListener)
- CSP-compatible
- No eval() or dangerous patterns

---

## 📝 Example: Custom Implementation

```tsx
'use client';

import Preloader from '@/components/ui/Preloader';
import { useEffect } from 'react';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Listen for preloader completion
    const handlePreloaderComplete = () => {
      console.log('Welcome! Page is fully loaded');
      
      // Trigger analytics
      // trackPageView();
      
      // Start other initialization
      // initializeApp();
    };

    document.addEventListener('preloaderComplete', handlePreloaderComplete);
    return () => {
      document.removeEventListener('preloaderComplete', handlePreloaderComplete);
    };
  }, []);

  return (
    <html lang="es">
      <body>
        <Preloader 
          logoSrc="/brand/logo.png"
          duration={3500}
          onComplete={() => console.log('Preloader done!')}
        />
        {children}
      </body>
    </html>
  );
}
```

---

## 🎯 Summary

| Need | Solution |
|------|----------|
| Next.js app | Use `<Preloader />` component in layout.tsx |
| Static HTML | Use preloader.html directly or link CSS/JS |
| Customization | Edit preloader.css for colors/sizes |
| Testing | Open preloader.html in browser |
| Control | Use window.PreloaderAPI methods |

---

## 📞 Support

For questions or issues:
1. Check the demo at `/public/preloader.html`
2. Review the commented code in `preloader.js` and `preloader.css`
3. Use browser DevTools to debug animations
4. Check the `onComplete` callback for integration testing

**Happy preloading! 🚀**
