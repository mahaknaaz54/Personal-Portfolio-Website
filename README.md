# Mahak Naaz – Personal Portfolio Website

## Overview

A professional, multi-page personal portfolio website for **Mahak Naaz**, a BTech student and aspiring software developer. Built as an internship assignment to demonstrate mastery of:

- Semantic HTML5 structure
- WCAG 2.1 accessibility guidelines
- Modern CSS3 techniques
- Responsive web design
- SEO best practices
- Vanilla JavaScript (minimal)

---

## Pages

| Page            | File            | Description                                      |
|-----------------|-----------------|--------------------------------------------------|
| Home            | `index.html`    | Hero, about preview, skills, selected projects, CTA |
| About           | `about.html`    | Introduction, education, skills, goals, sidebar  |
| Projects        | `projects.html` | Filterable project cards with details            |
| Contact         | `contact.html`  | Accessible contact form + contact info           |

---

## Technology Stack

| Technology      | Purpose                                  |
|-----------------|------------------------------------------|
| HTML5           | Semantic structure, landmarks, ARIA      |
| CSS3            | Design system, layout, responsive design |
| JavaScript (ES6+)| Theme toggle, nav, form validation, filter |
| Google Fonts    | Plus Jakarta Sans typeface               |

**No frameworks. No libraries. No bundlers.**  
Pure HTML5 + CSS3 + Vanilla JavaScript as required by the internship assignment.

---

## Project Structure

```text
Portfolio/
├── index.html          # Home page
├── about.html          # About page
├── projects.html       # Projects page
├── contact.html        # Contact page
├── css/
│   └── style.css       # Shared design system + all page styles
├── js/
│   └── script.js       # Minimal accessible JavaScript
├── images/
│   └── profile.png     # Profile illustration
└── README.md           # This file
```

---

## How to Run

This is a static website. No build step is required.

### Option 1 – Open directly in browser

```bash
open index.html
```

Or simply drag `index.html` into any web browser.

### Option 2 – Use a local server (recommended for Lighthouse testing)

Using Python:

```bash
python3 -m http.server 8000
```

Then visit: `http://localhost:8000`

Using Node.js `http-server`:

```bash
npx http-server . -p 8000
```

Then visit: `http://localhost:8000`

---

## Lighthouse Testing Instructions

For accurate Lighthouse scores, serve the site via a local HTTP server (not `file://`).

1. Open Chrome or Chromium
2. Navigate to `http://localhost:8000`
3. Open DevTools → **Lighthouse** tab
4. Select categories: **Performance**, **Accessibility**, **Best Practices**, **SEO**
5. Choose device: **Desktop** and **Mobile**
6. Click **Analyze page load**

### Target Scores

| Category       | Target |
|----------------|--------|
| Accessibility  | 100    |
| SEO            | 100    |
| Best Practices | 95+    |
| Performance    | 90+    |

---

## Accessibility Features Implemented

- ✅ **Skip navigation link** — visible on keyboard focus, links to `#main-content`
- ✅ **Semantic HTML5 landmarks** — `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<address>`, `<figure>` where appropriate
- ✅ **Heading hierarchy** — One `<h1>` per page, logical `h1 → h2 → h3` hierarchy
- ✅ **`aria-label`** on all navigation regions, icon-only buttons, and icon links
- ✅ **`aria-current="page"`** on the active navigation link
- ✅ **`aria-expanded`** + **`aria-controls`** on the mobile menu toggle button
- ✅ **`aria-labelledby`** on all major sections
- ✅ **`aria-invalid`** + **`aria-describedby`** on form fields with validation errors
- ✅ **`role="alert"` + `aria-live="polite"`** on form error messages
- ✅ **`aria-required="true"`** on all required form inputs
- ✅ **`aria-hidden="true"`** on all decorative SVGs and visual-only elements
- ✅ **`focusable="false"`** on all inline SVGs
- ✅ **Meaningful `alt` text** on all meaningful images
- ✅ **`alt=""`** on decorative images
- ✅ **Visible `:focus-visible` outline** — 3px solid accent color, 4px offset
- ✅ **Logical tab order** throughout all pages
- ✅ **No keyboard traps**
- ✅ **Escape key closes** the mobile navigation menu
- ✅ **Arrow key navigation** within the project filter bar
- ✅ **`autocomplete`** attributes on all relevant form inputs
- ✅ **All form controls have explicit `<label>` elements** — no placeholder-only fields
- ✅ **Form validation** — accessible error messages, not color-dependent
- ✅ **WCAG AA color contrast** on all text/background combinations (verified)
- ✅ **`prefers-reduced-motion`** media query — disables all animations for users who prefer it
- ✅ **No information conveyed by color alone**
- ✅ **`lang="en"`** on `<html>` element
- ✅ **Buttons** use `<button>` element, not clickable `<div>`
- ✅ **Links** use `<a>` with descriptive text (no "click here")
- ✅ **Dark/Light mode toggle** — theme persists via `localStorage`
- ✅ **Touch-friendly targets** — minimum 40×40px for interactive elements

---

## SEO Features Implemented

- ✅ **Unique `<title>`** on every page
- ✅ **Unique `<meta name="description">`** on every page
- ✅ **`<meta name="viewport" content="width=device-width, initial-scale=1.0">`** on every page
- ✅ **`<meta name="author" content="Mahak Naaz">`** on every page
- ✅ **`<link rel="canonical">`** on every page
- ✅ **Open Graph meta tags** (`og:title`, `og:description`, `og:type`, `og:locale`) on every page
- ✅ **Semantic HTML** — proper use of landmark elements provides content structure for search engines
- ✅ **Correct heading hierarchy** — one `<h1>` per page, logical nesting
- ✅ **Descriptive link text** — no "click here" or "read more" without context
- ✅ **`alt` attributes** on all images
- ✅ **`<address>`** element used for contact information (semantic meaning for search engines)
- ✅ **Clean URLs** (relative links)
- ✅ **No duplicate content** across pages
- ✅ **Fast load time** — no external JavaScript libraries, fonts loaded with `preconnect`

---

## Placeholders to Replace

The following placeholders are clearly marked in the HTML and must be replaced with your actual information:

| Placeholder                          | Location               | What to replace with                     |
|--------------------------------------|------------------------|------------------------------------------|
| `[Replace with your branch]`         | All pages              | Your BTech branch (e.g., Computer Science) |
| `[Replace with your university]`     | `index.html`, `about.html` | Your university name               |
| `[Replace with your university name]`| `about.html`           | Full university name                     |
| `[Replace with your city]`           | `about.html`           | Your city/state                          |
| `[Replace with your school name]`    | `about.html`           | Your Class XII school name               |
| `[Replace with your stream...]`      | `about.html`           | Your Class XII stream                    |
| `[Year]`                             | `about.html`           | Year of Class XII completion             |
| `[Replace with your GitHub URL]`     | All pages              | Your GitHub profile URL                  |
| `[Replace with your GitHub username]`| `contact.html`         | Your GitHub username                     |
| `[Replace with your LinkedIn URL]`   | All pages              | Your LinkedIn profile URL                |
| `[Replace with your email]`          | All pages              | Your email address                       |
| `[Replace with your GitHub URL for this project]` | `projects.html` | GitHub URL for each project    |
| `[Add your current topic]`           | `about.html` sidebar   | A topic you're currently learning        |

---

## Design System

- **Font:** Plus Jakarta Sans (Google Fonts)
- **Accent color (light):** `#0D8F6F` (emerald green — WCAG AA compliant)
- **Accent color (dark):** `#22C79A`
- **Background (light):** `#F7F7F3`
- **Background (dark):** `#0F0F0E`
- **Responsive breakpoints:** 320px, 768px, 900px, 1024px, 1200px (container max)

---

## Assignment Compliance Checklist

- [x] Multi-page portfolio (4 pages)
- [x] Semantic HTML5 elements used correctly
- [x] Proper heading hierarchy (h1 → h2 → h3)
- [x] Skip navigation link
- [x] Keyboard navigation works on all pages
- [x] Visible focus states (`:focus-visible`)
- [x] Accessible contact form with labels
- [x] Form validation with ARIA error messages
- [x] ARIA used appropriately (not excessively)
- [x] Images have meaningful alt text
- [x] Color contrast passes WCAG AA
- [x] Reduced motion preference respected
- [x] Mobile responsive design
- [x] No horizontal overflow
- [x] Unique title per page
- [x] Unique meta description per page
- [x] Clean SEO structure
- [x] No fabricated personal credentials
- [x] README included
