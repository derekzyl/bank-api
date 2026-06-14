---
name: Midnight Developer Portal
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00a572'
  on-tertiary-container: '#00311f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  sidebar-width: 280px
  gutter: 24px
  section-gap: 64px
  element-gap: 16px
  stack-tight: 8px
---

## Brand & Style

The design system is engineered for the high-performance ethos of the Banks API. It targets developers and financial engineers who require speed, security, and precision. The visual language moves away from generic dark themes toward a sophisticated **Corporate / Modern** aesthetic with a **Minimalist** lean. 

The emotional response should be one of "Informed Security"—a sense that the platform is as robust and reliable as the banking data it serves. By using a "Midnight" palette, we create a focused, low-strain environment for deep technical work. The style is characterized by sharp hierarchy, high-density information layouts, and surgical precision in spacing.

## Colors

The palette is rooted in a "Midnight" foundation. The primary background uses a near-black navy to reduce glare, while surfaces utilize deep slate grays to create logical grouping.

- **Primary (Blue-600):** Used for primary actions and active states, signifying intelligence and trust.
- **Secondary (Slate-400):** Reserved for supporting UI text and icons to keep focus on the data.
- **Tertiary (Emerald-500):** Specifically for "Success" states and "GET" method badges, representing high performance and availability.
- **Neutral (Slate-950):** The core background, providing maximum contrast for the crisp white and blue-tinted text layers.

## Typography

This design system employs a dual-font strategy. **Hanken Grotesk** is the workhorse for the UI, offering a clean, contemporary feel that scales beautifully from large headings to small body text. **JetBrains Mono** is utilized for all technical data, including API endpoints, parameters, and code snippets, ensuring that characters are easily distinguishable.

Hierarchy is enforced through weight and color contrast rather than just size. Code blocks use a slightly tighter line height to maintain structural integrity during long scrolls.

## Layout & Spacing

The layout follows a **Fixed Grid** system for the main content area to ensure optimal readability for technical documentation. A persistent left-hand navigation sidebar (280px) provides quick access to the API structure.

- **Desktop:** 12-column grid within the main content container. Documentation follows a single-column flow with code examples positioned either inline or in a secondary right-hand column (depending on width).
- **Tablet:** Sidebar collapses into a drawer; margins reduce to 32px.
- **Mobile:** Margins reduce to 16px. Code blocks allow horizontal scrolling to prevent layout breakage.

Vertical rhythm is strictly maintained using a 8px baseline, with larger 64px gaps between major API endpoints to visually separate distinct functions.

## Elevation & Depth

To maintain a "secure" and "precise" feel, the design system avoids heavy shadows. Depth is communicated through **Tonal Layers** and **Low-contrast Outlines**:

1.  **Level 0 (Background):** The "Midnight" base (#020617).
2.  **Level 1 (Containers):** Cards and code blocks use a subtle "Slate" fill (#1E293B) with a 1px solid border (#334155).
3.  **Level 2 (Interactive):** Hover states on sidebar items and buttons use a primary-tinted glow (low opacity blue) rather than a shadow, suggesting a digital, backlit interface.

## Shapes

The design system uses a **Soft** shape language. While the banking sector is traditionally sharp and rigid, the 0.25rem (4px) corner radius provides a modern, "refined software" feel without appearing too playful or consumer-grade.

- **Buttons & Inputs:** 4px radius.
- **Code Containers:** 8px (rounded-lg) to separate them from the flow of the page.
- **Method Badges:** 2px radius for a technical, "stamp" appearance.

## Components

### Buttons & Badges
- **Primary Action:** Solid Blue-600 with white text. No gradient.
- **Method Badges (GET, POST):** Monospaced font, uppercase, using tertiary emerald background for GET and primary blue for others, with 10% opacity background and 100% opacity text for high legibility.

### Code Snippets
- **Container:** Slate-900 background with a 1px Slate-800 border.
- **Syntax Highlighting:** High-contrast palette using cyan, pink, and lime to ensure key-value pairs are instantly recognizable.
- **Copy Tool:** Small icon-only button in the top-right corner, appearing on hover.

### API Tables
- **Header:** Label-caps typography, border-bottom only.
- **Rows:** Subtle zebra-striping using a 2% white overlay on alternate rows to help eye-tracking across long parameter lists.

### Sidebar Navigation
- **Active State:** Left-border accent (2px Primary Blue) with a subtle text weight increase.
- **Grouping:** Use the "label-caps" style for section headers (e.g., "CORE RESOURCES") to create clear segmentation.