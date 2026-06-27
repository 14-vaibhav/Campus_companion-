# CampusHub — Design System Documentation

> **Design Theme:** *Academic Ethereal — Sunset Edition*
> A premium glassmorphism UI with warm sunset tones, smooth animations, and a mobile-first layout optimised for campus life.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Spacing System](#4-spacing-system)
5. [Border Radius](#5-border-radius)
6. [Elevation & Glass Effects](#6-elevation--glass-effects)
7. [Motion & Transitions](#7-motion--transitions)
8. [Component Library](#8-component-library)
9. [Layout & Navigation](#9-layout--navigation)
10. [Page Designs](#10-page-designs)
11. [Admin Console](#11-admin-console)
12. [Accessibility & UX Principles](#12-accessibility--ux-principles)

---

## 1. Brand Identity

| Property     | Value                                  |
|--------------|----------------------------------------|
| App Name     | **CampusHub**                          |
| Tagline      | *Campus, covered.*                     |
| Icon         | `school` (Material Symbols Outlined)   |
| Logo Shape   | Rounded square, 68×68px, radius 20px  |
| Logo Gradient| `#ae2f34` → `#ff6b6b` (135deg)        |
| Logo Shadow  | `0 16px 40px rgba(174,47,52, 0.35)`   |

### Brand Voice
- **Warm** — feels like a friend who knows campus
- **Efficient** — information at a glance, no clutter
- **Trustworthy** — verified badges, clear status indicators

---

## 2. Color Palette

### Primary — Crimson Red `#ae2f34`
Used for CTAs, active states, logo gradients, and key UI accents.

```
--color-primary:               #ae2f34   ← Deep Crimson (main brand)
--color-primary-container:     #ff6b6b   ← Soft Red (gradient endpoint)
--color-on-primary:            #ffffff   ← White text on primary
--color-primary-fixed:         #ffdad8   ← Pale rose (backgrounds)
--color-primary-fixed-dim:     #ffb3b0   ← Muted rose
--color-on-primary-fixed:      #410006   ← Deep text on light primary
--color-on-primary-fixed-variant: #8c1520
--color-inverse-primary:       #ffb3b0
```

### Secondary — Amber Gold `#705d00`
Used for greeting labels, accent text, secondary chips.

```
--color-secondary:             #705d00   ← Deep Amber
--color-secondary-container:   #fdd73b   ← Bright Yellow
--color-on-secondary:          #ffffff
--color-on-secondary-container:#715d00
--color-secondary-fixed:       #ffe173
--color-secondary-fixed-dim:   #e8c426
```

### Tertiary — Warm Grey `#615e57`
Supporting neutral tones for metadata, icons, and borders.

```
--color-tertiary:              #615e57
--color-tertiary-container:    #9f9b93
--color-on-tertiary:           #ffffff
--color-on-tertiary-container: #35332d
--color-tertiary-fixed:        #e7e2d9
```

### Surface Scale
```
--color-surface:                    #f4fafd   ← Page background
--color-surface-dim:                #d4dbdd
--color-surface-bright:             #f4fafd
--color-surface-container-lowest:   #ffffff
--color-surface-container-low:      #eef5f7   ← Card fill (light)
--color-surface-container:          #e8eff1   ← Hover/chip background
--color-surface-container-high:     #e2e9ec
--color-surface-container-highest:  #dde4e6
--color-surface-variant:            #dde4e6
```

### Content Colors
```
--color-on-surface:            #161d1f   ← Primary body text
--color-on-surface-variant:    #584140   ← Secondary/subdued text
--color-inverse-surface:       #2b3234
--color-inverse-on-surface:    #ebf2f4
```

### Outline
```
--color-outline:               #8c706f   ← Borders, placeholder text
--color-outline-variant:       #e0bfbd   ← Subtle dividers, input borders
```

### Semantic Colors
```
--color-error:         #ba1a1a   ← Errors, destructive actions
--color-error-container: #ffdad6
--color-success:       #10b981   ← Open/Available status
--color-danger:        #f43f5e   ← Busy/Unavailable status
```

### Service Category Colors
Each service has its own accent color used for icons, chips, and card borders:

| Service     | Icon Color | Background | Material Icon         |
|-------------|-----------|------------|-----------------------|
| Restaurants | `#f59e0b` | `#fef3c7`  | `restaurant`          |
| Salons      | `#6b38d4` | `#ede9fe`  | `content_cut`         |
| Laundries   | `#0ea5e9` | `#e0f2fe`  | `local_laundry_service`|
| Autos       | `#f43f5e` | `#ffe4e6`  | `electric_rickshaw`   |
| Cabs        | `#10b981` | `#d1fae5`  | `directions_car`      |

### Admin Console Colors
The admin panel uses a dark indigo theme completely separate from the user-facing app:

```
Background:  linear-gradient(135deg, #0f0a2e → #1e1b4b → #312e81)
Glass panel: rgba(255,255,255, 0.06)
Border:      rgba(255,255,255, 0.10)
Accent:      #818cf8 (Indigo 400) / #a78bfa (Violet 400)
Success:     #34d399 (Emerald 400)
Danger:      #f87171 (Red 400)
```

---

## 3. Typography

### Font Family
```
--font-family: 'Plus Jakarta Sans', sans-serif;
```
Loaded from Google Fonts. Variable font with weights 400–800.

### Type Scale

| Role                  | Size   | Weight | Usage                        |
|-----------------------|--------|--------|------------------------------|
| Page Title / H1       | 24–28px| 800    | Hero headings                |
| Section Title / H2    | 20px   | 700–800| Card/modal headings          |
| App Bar Brand         | 20px   | 800    | CampusHub wordmark           |
| Body / List Item      | 15px   | 600–700| Primary content              |
| Body Secondary        | 14px   | 500    | Descriptions, subtitles      |
| Caption / Label       | 12–13px| 600–700| Metadata, time, status       |
| Micro / Badge         | 11px   | 700    | Uppercase labels, badges     |
| Nano / Fine Print     | 9–10px | 800    | Notification badges          |

### Letter Spacing
- **Headings:** `-0.01em` to `-0.02em` (tight, premium feel)
- **Uppercase labels:** `+0.04em` to `+0.06em` (readable at small sizes)
- **Body text:** `0` (natural tracking)

---

## 4. Spacing System

Based on an **8px grid**:

```
--space-xs:   4px    ← Icon gaps, micro padding
--space-sm:   12px   ← Inner card padding (small)
--space-md:   24px   ← Section gaps, form spacing
--space-lg:   40px   ← Page-level vertical rhythm
--space-xl:   64px   ← Hero areas
--space-base:  8px   ← Base unit
--space-container-margin: 20px  ← Page edge padding
--space-gutter:           16px  ← Card inner gutter
```

### Common Padding Patterns
| Context              | Padding         |
|----------------------|-----------------|
| Page wrapper         | `24px 20px`     |
| Glass card           | `16px 20px`     |
| Modal content        | `20px 24px 24px`|
| Button (primary)     | `14px 28px`     |
| Button (secondary)   | `13px 24px`     |
| Chip / filter pill   | `7px 16px`      |
| Input field          | `14px 16px 14px 48px` |
| Bottom nav item      | `8px 16px`      |

---

## 5. Border Radius

```
--radius-sm:   4px    ← Micro tags, inline elements
--radius-md:   8px    ← Buttons, table cells, small cards
--radius-lg:   16px   ← Cards, inputs, service tiles
--radius-xl:   24px   ← Modals, login card, large panels
--radius-full: 9999px ← Chips, pills, avatars, badges
```

---

## 6. Elevation & Glass Effects

CampusHub uses **glassmorphism** as its core card style throughout the user-facing app.

### Glass Card (`.glass-card`)
```css
background:      rgba(255, 255, 255, 0.72)
backdrop-filter: blur(12px)
border:          1px solid rgba(255, 255, 255, 0.45)
box-shadow:      0 8px 24px rgba(174, 47, 52, 0.07)
border-radius:   16px

:hover
  box-shadow:    0 16px 36px rgba(174, 47, 52, 0.14)
  transform:     translateY(-2px)
```

### Page Background
```css
background: linear-gradient(135deg, #f4fafd 0%, #fef5f5 50%, #ffdad8 100%)
```

### Decorative Orbs
Two fixed blurred radial circles give the background a warm, living feel:

| Orb   | Size      | Position         | Color                              | Animation         |
|-------|-----------|------------------|------------------------------------|-------------------|
| Orb 1 | 400×400px | Top-right        | `rgba(255,107,107, 0.15)` Red      | `orbFloat` 8s     |
| Orb 2 | 500×500px | Bottom-left      | `rgba(253,215,59, 0.12)` Yellow    | `orbFloat` 10s reversed |

```css
@keyframes orbFloat {
  0%, 100% { transform: translateY(0)   scale(1);    }
  50%       { transform: translateY(-20px) scale(1.05); }
}
```

### Top App Bar
```css
background:      rgba(248, 249, 255, 0.85)
backdrop-filter: blur(16px)
border-bottom:   1px solid rgba(199, 196, 216, 0.4)
height:          64px
position:        sticky, top: 0, z-index: 50
```

---

## 7. Motion & Transitions

### Transition Tokens
```
--transition-fast:   150ms cubic-bezier(0.4, 0, 0.2, 1)   ← Hover, focus
--transition-base:   250ms cubic-bezier(0.4, 0, 0.2, 1)   ← Card, button
--transition-spring: 350ms cubic-bezier(0.34, 1.56, 0.64, 1) ← Bounce/scale
```

### Animation Classes
| Class                  | Keyframe      | Duration | Use                         |
|------------------------|---------------|----------|-----------------------------|
| `.animate-fade-in-up`  | `fadeInUp`    | 0.4s     | Page sections, cards        |
| `.animate-fade-in`     | `fadeIn`      | 0.3s     | Overlays, modals            |
| `.animate-scale-in`    | `scaleIn`     | 0.25s    | Modal open, menu pop        |

```css
@keyframes fadeInUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn    { from { opacity:0; }                             to { opacity:1; }                          }
@keyframes scaleIn   { from { opacity:0; transform:scale(0.95); }     to { opacity:1; transform:scale(1); }      }
@keyframes spin      { to   { transform: rotate(360deg); }                                                       }
@keyframes statusPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
```

### Staggered List Children (`.stagger`)
Children animate in sequence with 50ms delays (up to 6 items):
```css
.stagger > *:nth-child(1) { animation-delay: 0.05s; }
.stagger > *:nth-child(2) { animation-delay: 0.10s; }
/* ... up to nth-child(6) at 0.30s */
```

### Micro-interactions
- **Service cards:** `translateY(-4px)` on hover + colored shadow
- **Primary button:** `translateY(-1px)` on hover, `scale(0.98)` on active
- **Glass card:** `translateY(-2px)` on hover
- **Driver cards:** `translateY(-2px)` on hover

---

## 8. Component Library

### Buttons

#### `.btn-primary`
```
Gradient: #ae2f34 → #ff6b6b (135deg)
Padding:  14px 28px
Shadow:   0 8px 24px rgba(174,47,52, 0.30)
Hover:    shadow intensifies, translateY(-1px)
```

#### `.btn-secondary`
```
Background: transparent
Border:     1.5px solid rgba(53,37,205, 0.30)
Color:      var(--color-primary)
Hover:      light fill rgba(53,37,205, 0.05)
```

#### `.btn-ghost`
```
Background: transparent
No border
Color:      var(--color-on-surface-variant)
Hover:      var(--color-surface-container) fill
```

#### `.btn-icon`
```
Size:     40×40px, circular
Padding:  0
Hover:    light surface container fill
```

---

### Input Fields

#### `.input-field`
```
Padding:        14px 16px 14px 48px  ← space for leading icon
Background:     rgba(255,255,255, 0.8)
Border:         1.5px solid var(--color-outline-variant)
Border-radius:  var(--radius-lg)
Focus:          border → primary, 3px indigo glow ring
```

#### `.input-wrapper`
Positions a leading Material Symbol icon (`input-icon`) centered left at 14px, which turns primary-colored on focus.

---

### Status Chips (`.status-chip`)

| State     | Class       | Background                    | Text Color |
|-----------|-------------|-------------------------------|------------|
| Open      | `.open`     | `rgba(16,185,129, 0.15)`      | `#065f46`  |
| Closed    | `.closed`   | `rgba(244,63,94, 0.12)`       | `#9f1239`  |
| Available | `.available`| `rgba(16,185,129, 0.15)`      | `#065f46`  |
| Busy      | `.busy`     | `rgba(244,63,94, 0.12)`       | `#9f1239`  |

Each chip includes a 7px dot (`.status-dot`) — the open/available dot has a `statusPulse` animation.

---

### Modal (`.modal-overlay` / `.modal-panel`)

```
Overlay:  rgba(11,28,48, 0.6) + blur(4px), full viewport, z-index 1000
Panel:    white, radius-xl, max-height 90dvh, overflow-y auto
Open anim: scaleIn 0.25s spring
Close:    Escape key or click outside overlay
```

---

### Pagination

Prev/Next arrows + up to 7 numbered page buttons. Active page uses primary background. Disabled arrows at 40% opacity.

---

### Verified Badge (`.verified-badge`)

```
Color:  #1d4ed8 (blue)
Icon:   verified (Material Symbol, 14px, #3b82f6)
```

---

### Drag & Drop Upload (`.dropzone`)

```
Border:     2px dashed var(--color-outline-variant)
Background: var(--color-surface-container-low)
Hover/Active: border → primary, subtle primary tint fill
```

Includes a progress bar at the bottom that fills during upload.

---

## 9. Layout & Navigation

### App Shell
All protected pages are wrapped in `AppShell`, which provides:

1. **Sticky top app bar** (64px) — logo, username pill, logout icon
2. **Decorative orbs** (fixed, pointer-events none)
3. **Page content** (`<main>`, z-index 1)
4. **Fixed bottom navigation** (72px)

Page content uses `paddingBottom: 88px` to clear the bottom nav.

### Bottom Navigation (`.bottom-nav`)
```
Height:     72px
Background: rgba(255,255,255, 0.90) + blur(16px)
Border-top: 1px solid var(--color-outline-variant)
z-index:    100
```

| Tab     | Icon               | Route        |
|---------|--------------------|--------------|
| Hub     | `grid_view` (filled)| `/home`     |
| Saved   | `favorite`         | `/favorites` |
| Alerts  | `notifications`    | `/notifications` |
| Profile | `person`           | `/profile`   |

Active tab: primary color + `rgba(53,37,205, 0.08)` background pill + 4px dot indicator below.
A badge counter appears on **Saved** and **Alerts** when the user has bookmarked items or has unread notifications.

---

### Page Max-Width
All page content is constrained to `max-width: 600px`, centered with `margin: 0 auto` — optimised for mobile-first but readable on desktop.

---

### Responsive Behaviour
- The layout is **single-column mobile-first** throughout
- Service cards on Home use a **2-column CSS Grid**; the last odd card spans full width
- The admin console uses a wider `max-width: 1200px` with a horizontal scrollable data table

---

## 10. Page Designs

### Login Page
- **Background:** warm sunset gradient (`#f4fafd → #fff5f5 → #ffdad8`) with 3 animated orbs
- **Logo card:** crimson gradient rounded square, centered above the auth card
- **Auth card:** glassmorphic panel, `blur(16px)`, max-width 440px
- **Tab toggle:** "Sign In" / "Create Account" pill switcher with white active tab
- **Social options:** Google OAuth button + dashed "Continue as Guest" button
- **Forgot password:** right-aligned ghost text button (UI only)

### Home Page
- **Hero section:** time-aware greeting (`Good morning/afternoon/evening`) + username
- **Service grid:** 2-column card grid with category icon, label, subtitle, chevron, and hover lift
- **Google Ads slot:** placeholder banner between grid and footer banner
- **Info banner:** gradient crimson panel with `auto_awesome` icon

### Service List Pages (Restaurants / Salons / Laundries)
- Header with category icon + title + results count
- Rounded full `SearchBar` with clear button
- Filter chips: All / Open Now 🟢 / Closed
- Card list: logo/icon, name + verified badge, subtitle, StatusChip, ♥ favorite button, chevron
- Tap card → Detail Modal with full info, hours, pricing, Call/Copy button

### Driver Pages (Cabs / Autos)
- Same shell but driver-focused: circular avatar, vehicle info, base fare
- Filter: All Drivers / ✅ Verified Only
- Tap driver → modal with vehicle details + call button
- ♥ favorite button on each card

### Favorites Page
- Filter chips by service type (All / Restaurants / Salons / Laundries / Cabs / Autos)
- Card list: icon, name, subtitle, colored type badge, View + Remove actions
- Empty state: `favorite_border` icon + CTA to explore
- Discover More Services button at bottom

### Notifications Page
- Filter chips: All / Unread / Deals / Alerts / Updates / Info
- Glass card list showing notification titles, text, relative timestamps, icons, and action options
- Red dot pulse indicators for unread alerts
- Single-tap to read, dismiss individual buttons, and a bottom "Clear All" button

### Profile Page
- Circular avatar with gradient + first-letter initial
- Username, email, role badge (admin vs user)
- Saved count stat in avatar card
- **Saved Services** → navigates to `/favorites` with badge count
- **Recent Activity** → expands inline panel showing last 5 saved items
- **Notifications** → animated toggle switch (localStorage-persisted)
- Sign Out button (red, full-width)

---

## 11. Admin Console

A completely distinct dark-themed interface at `/control-center`.

### Design Language
- Deep indigo dark gradient background
- Frosted glass panels (`rgba(255,255,255, 0.06)` + `blur(16px)`)
- Indigo/violet accents (`#818cf8`, `#a78bfa`)
- No glassmorphism cards — replaced with translucent dark panels

### Layout
- **Sticky admin header** (64px): admin shield icon, "Admin Console" label, INTERNAL badge, nav buttons
- **Stats row** (3-column): Total Records, Active Service, Current Page
- **Tab nav**: service type pills with active gradient in service color
- **Table panel**: glassmorphic dark card with header (title + search + refresh + Add New), scrollable data table, pagination footer

### Data Table
Columns: Name | Location / Vehicle | Status | Verified | Actions

Actions per row:
- **Edit** — indigo ghost button → opens Create/Edit modal
- **Delete** — red ghost button → opens Delete Confirm modal

### Broadcast Panel (Admin Notifications Tab)
- **Select Type** dropdown, Title input (max 60 chars), Body textarea (max 200 chars)
- **Send Broadcast** button to post to all users
- **Active Broadcasts** history table showing sent alerts with Delete action

### Search Input (Admin)
Dark-themed search bar inside the table header — sends query to API, clears on tab switch.

### Create / Edit Modal
- White modal panel (contrasts dark bg)
- Dynamic fields per service type (text, textarea, number, time, checkbox, image upload)
- Image upload with drag & drop preview + progress bar
- Save / Cancel buttons

### Delete Confirm Modal
- Warning text with item name in bold
- Cancel + red Delete button

---

## 12. Accessibility & UX Principles

### Focus & Keyboard
- All interactive elements are reachable via keyboard
- Modals trap `Escape` → close
- Form inputs have `required`, `autoComplete`, and `type` attributes set correctly

### Screen Reader
- `.sr-only` utility class available for visually-hidden labels
- Images have meaningful `alt` text
- Icon buttons have `title` attributes

### Motion Preferences
> ⚠️ **TODO:** Add `@media (prefers-reduced-motion: reduce)` to disable animations for users who prefer it.

### Loading States
- Spinner: `progress_activity` icon with `spin 1s linear infinite` on all async fetches
- Full-page loading overlay via `.page-loading`
- Skeleton-free design — spinners used instead for simplicity

### Error States
- Toast notifications (react-hot-toast) for all API success/failure events
- Global 401 interceptor → auto-logout + redirect to `/`
- "No results" empty states with icon + helpful message

### Guest Mode
- Guests can browse all service listings without authenticating
- Token stored as the literal string `"guest"` — excluded from `Authorization` headers
- Soft nudge toast: *"Sign in to unlock all features"*

### Secret Admin Access
- 5 rapid clicks on the CampusHub logo in `AppShell` → navigates to `/control-center` (admin only)
- Route is not listed in any visible navigation

---

## File Structure Reference

```
src/
├── context/
│   ├── AuthContext.jsx         ← JWT auth state, login/logout/guest
│   ├── FavoritesContext.jsx    ← localStorage favorites per service type
│   └── NotificationsContext.jsx ← localStorage notifications (7d expiry, admin broadcasts)
├── services/
│   ├── api.js                  ← Axios instance, auth interceptor, 401 handler
│   ├── authService.js          ← Login, register, getMe, Google OAuth
│   └── dataService.js          ← CRUD for all 5 service categories + image upload
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx        ← Top bar + bottom nav + orbs wrapper
│   │   └── ProtectedRoute.jsx  ← Auth guard + Admin guard
│   └── ui/
│       ├── SearchBar.jsx       ← Input with clear button
│       ├── Pagination.jsx      ← Page navigation with sliding window
│       ├── Modal.jsx           ← Overlay panel with escape/outside close
│       ├── StatusChip.jsx      ← Open/Closed/Available/Busy chips
│       ├── FileUploader.jsx    ← Drag & drop image upload with progress
│       └── GoogleAdBanner.jsx  ← AdSense slot with dev placeholder
├── pages/
│   ├── LoginPage.jsx           ← Auth (email + Google + guest)
│   ├── HomePage.jsx            ← Service grid + greeting
│   ├── FavoritesPage.jsx       ← Saved services with filters
│   ├── NotificationsPage.jsx   ← Saved announcements with filter chips & deletion
│   ├── ProfilePage.jsx         ← User info + activity + notification toggle
│   ├── services/
│   │   ├── ServiceListPage.jsx ← Reusable list + modal + favorites
│   │   ├── DriverListPage.jsx  ← Driver-specific list + favorites
│   │   ├── RestaurantsPage.jsx
│   │   ├── SalonsPage.jsx
│   │   ├── LaundriesPage.jsx
│   │   ├── CabsPage.jsx
│   │   └── AutosPage.jsx
│   └── admin/
│       └── AdminPage.jsx       ← Full CRUD admin console + notifications broadcast
├── index.css                   ← Global design tokens + utility classes
├── App.jsx                     ← Router + providers
└── main.jsx                    ← Entry point + GoogleOAuthProvider
```

---

*Last updated: June 2026 · CampusHub Design System v1.0*
