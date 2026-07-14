---
name: Academic Core
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  code:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for high-density information environments where clarity and authority are paramount. It targets educational administrators, faculty, and students, facilitating complex tasks like grade management, scheduling, and student tracking.

The aesthetic follows a **Modern Corporate** direction, blending the structural reliability of enterprise software with the refined cleanliness of contemporary SaaS. It emphasizes a "content-first" approach, using generous whitespace to reduce cognitive load in data-heavy views. The interface should feel stable and institutional yet fast and responsive.

## Colors

The palette is anchored by a deep navy primary, conveying stability and academic tradition. 

- **Primary (#0f172a):** Used for sidebar backgrounds, primary action buttons, and high-level headings.
- **Surface & Background:** Pure white is used for the main content canvas to maximize readability. A subtle slate-gray (#f8fafc) is used for secondary regions, such as table headers and dashboard widgets, to provide structural contrast.
- **Semantic Accents:** Emerald is reserved for "Passed" or "Active" states; Amber for "Probation" or "Pending"; Red for "Failed" or "Urgent Alerts."
- **Dark Mode:** In dark mode, the primary navy shifts to a slightly lighter slate (#1e293b) to maintain depth, and background surfaces move to #020617.

## Typography

The system utilizes **Inter** exclusively to leverage its exceptional legibility in UI contexts. 

- **Hierarchy:** Use `display-lg` only for main dashboard greetings. `headline-lg` is the standard for page titles.
- **Data Tables:** Use `body-sm` for table row content to allow for higher density. Use `label-sm` in Medium or Semibold weight for table headers, usually in all-caps with slight letter spacing.
- **Weights:** Regular (400) is used for body text. Medium (500) for interactive labels. Semibold (600) and Bold (700) are reserved for structural headings and primary buttons.

## Layout & Spacing

The design system employs a **Fixed-Fluid hybrid grid**. 

- **Sidebar:** Fixed width at 260px for desktop. It can be collapsed into a narrow icon-only bar (64px).
- **Main Canvas:** Fluid with a max-width of 1440px to ensure line lengths remain readable on ultra-wide monitors.
- **Grid:** A 12-column system for dashboard layouts. Widgets should span 3, 4, 6, or 12 columns.
- **Mobile:** On screens smaller than 768px, the sidebar transitions to a bottom-sheet or a hidden drawer, and all columns stack vertically with a 16px outer margin.

## Elevation & Depth

Visual hierarchy is managed through **Tonal Layering** and **Subtle Ambient Shadows**.

- **Level 0 (Base):** The main background. No shadow.
- **Level 1 (Cards):** Dashboard widgets and list containers. Use a very soft, diffused shadow: `0px 1px 3px rgba(0,0,0,0.1)`. In dark mode, use a 1px border (#334155) instead of a shadow.
- **Level 2 (Popovers/Menus):** Dropdowns and select menus. Increased shadow for clear separation: `0px 10px 15px -3px rgba(0,0,0,0.1)`.
- **Level 3 (Modals):** Centered dialogs. Require a backdrop blur (8px) on the Level 0 background to focus user attention.

## Shapes

The shape language is conservative and precise. 

- **Small elements (Checkboxes, small buttons):** 0.25rem (4px) radius.
- **Standard elements (Cards, Inputs, Buttons):** 0.5rem (8px) radius.
- **Large elements (Modals, Large Containers):** 0.75rem (12px) radius.
- **Badges/Chips:** Use a full pill-shape (9999px) to distinguish them from interactive buttons.

## Components

- **Buttons:** Primary buttons use the Navy background with white text. Secondary buttons use a slate-100 background. Ghost buttons are used for table actions to keep the UI clean.
- **Tables:** Headers use a subtle gray background (#f8fafc) with a bottom border. Cell padding is 12px vertical and 16px horizontal. Row hover states should be a very light tint of the primary color.
- **Cards:** Cards should have a 1px border (#e2e8f0) and no shadow by default unless they are interactive "hover" cards.
- **Inputs:** Default state has a 1px border. Focus state uses a 2px ring of the primary navy with a slight offset. Error states replace the ring with the accent error color.
- **Badges:** Use a "soft" style—low-opacity background of the semantic color with high-opacity text of the same color (e.g., light emerald background with dark emerald text).
- **Navigation:** The sidebar uses high-contrast typography. Active links should have a subtle left-accent bar (4px) in a lighter blue or emerald to indicate focus.