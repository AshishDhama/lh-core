# Product Requirements Document (PRD): Brilliant-Inspired UI Redesign

## 1. Executive Summary
**Objective**: Redesign the existing Home Page and Programme (Learning Paths) Page to achieve structural, visual, and behavioral parity with the provided reference designs. 
**Core Philosophy**: Transform the platform from a purely functional dashboard into an inviting, gamified, and low-cognitive-load learning environment. The design must emphasize extensive "breathing space", soft component boundaries, clear content hierarchies, and tactical use of gamification.

## 2. Global Design System & Aesthetics

### 2.1. "Breathing Space" (The Whitespace Architecture)
The luxurious feel of this design comes primarily from its negative space.
*   **Macro-Layout Padding**: The main content wrapper should have a maximum width container (approx. `1100px` - `1200px`) centered on the screen. Section margins must be massive (at least `48px` to `64px` vertical margins between distinct rows).
*   **Background vs. Foreground Contrast**: Use a very soft off-white or feather-grey (e.g., `#F9F9FB`) for the global application background. This is crucial because it makes the pure white (`#FFFFFF`) component cards visually pop off the page.
*   **Component Padding (Micro Whitespace)**: Inside every card, padding must be exceptionally generous (minimum `24px` to `32px`). Text, illustrations, and buttons should **never** feel close to the component's edge boundaries. 

### 2.2. Borders, Shadows & Radii
*   **Border Radii**: Deeply rounded corners are mandatory. Use `16px` to `24px` for primary container cards. Buttons should utilize fully rounded shapes (pill-shape `.rounded-full`) to feel tactile.
*   **Borders & Elevation**: Avoid harsh, dark drop shadows. Instead, map cards with a soft, 1px solid border in a very light grey (`#E5E5E5` or `#F0F0F0`). Pair this with extremely subtle, diffuse hover shadows (`box-shadow: 0 4px 20px rgba(0,0,0,0.04)`).

### 2.3. Typography & Theming
*   **Font Family**: A modern, geometric sans-serif (e.g., Inter, SF Pro. or circular).
*   **Typography Hierarchy**:
    *   **Overlines** (e.g., "RECOMMENDED"): Uppercase, heavy letter-spacing (tracking), bold text, tinted to match the module theme (`12px`).
    *   **Titles**: Crisp, near-black (`#1F2937`), heavy font weight.
    *   **Subtitles/Descriptions**: Muted medium-grey (`#6B7280`), standard weight (`14px` - `16px`).
*   **Dynamic Theming**: Interactive elements (like buttons) inherit the color of the subject matter. For instance, Programming modules utilize a vibrant **Purple** (`#8B5CF6`) while Scientific Thinking utilizes a warm **Yellow/Gold** (`#FACC15`).

### 2.4. Design Tokens & Styling
*   **Strict Token Usage**: All styles—including colors, spacing, typography, radii, and shadows—MUST be implemented using a centralized design token system (e.g., Tailwind configuration, CSS variables, or a styled-components theme).
*   **No Hardcoding**: Hard-coded hex codes (`#FFFFFF`), pixel measurements (`24px`), or other raw CSS values directly inline within components are strictly prohibited to ensure maintainability and consistency.

---

## 3. Page Level Specifications

### 3.1. Main Navigation (Global Header)
*   **Layout Structure**: Sticky top horizontal bar with a pure white background and a 1px bottom border.
*   **Left Side**: Application Logo. "Home" and "Courses" links. The active page features a thin, solid black underline indicator anchored just below the text.
*   **Right Side (User Gamification Hub)**:
    *   **Premium Upsell**: A pill-shaped outline button "Go Premium".
    *   **Tracker Chips**: Small rounded-rectangle badges showing current "Streak" (🔥 icon) and "Energy" (⚡ icon) count alongside a numeric value. These are outlined with light grey boundaries.
    *   **Menu**: Standard hamburger/drawer icon.

### 3.2. Home Page (Dashboard Layout)
The Home Page employs an asymmetric two-column grid. Left Column takes up `~30%` of the width (Max ~`320px`), while the Right Column takes up `~70%`. There is a wide gap (`24px` - `32px`) between columns.

#### A. Left Column (Gamification & Monetization)
1.  **Streak Tracker Card**:
    *   **Header**: Large numeric value (`0`) next to a stylized lightning/energy bolt icon.
    *   **Subtext**: "Solve X problems to start a streak".
    *   **Visualizer**: A row of 5 circular UI nodes representing days (Th, F, S, Su, M). Completed days get a solid fill; incomplete days have a light grey border.
2.  **Premium Upsell Card**:
    *   Distinct from other cards, this features a soft gradient or warm-tint background to separate it from pure learning content.
    *   Text: "Unlock all learning with Premium to get smarter, faster."
    *   Button: "Explore Premium" with a smooth linear gradient background (e.g., soft purple to peach/orange).
3.  **Leagues / Progress Card (Locked State)**:
    *   Visually muted. Lower opacity text and a greyscale lock iconography.
    *   "UNLOCK LEAGUES: Complete one lesson".

#### B. Right Column (Active Learning Feed)
**Main Hero Assessment Card (e.g., "Thinking in Code"):**
*   **Alignment**: All headers ("RECOMMENDED", Subject Title, "LEVEL 1") are perfectly center-aligned.
*   **Hero Image**: A high-fidelity, 3D-styled, flat vector illustration representing the current topic visually.
*   **Lesson Steps List (Vertical Node System)**:
    *   These items are stacked vertically below the image and left-aligned.
    *   **Active/Unlocked Step**: Features a dimensional active node (e.g., a green gem icon `🟢` nestled inside an outer grey ring) and bold title text ("Writing Programs").
    *   **Locked Step**: Features a flat, generic grey oval node icon, and muted light-grey title text ("Sequencing Commands").
*   **Call-To-Action (Bottom)**:
    *   A massive, full-width "Start" button spanning the inner width of the card. 
    *   Using the Dynamic Theming logic (Purple for Code, Gold for Science).

### 3.3. Programme Page (Learning Paths)
*   **Hero Header**: Huge left-aligned title "Learning Paths", followed by a muted subtitle "Step-by-step paths to mastery".
*   **Path Sections (Horizontal Stack)**: The page is divided into large stacked sections (e.g., "Foundations for Algebra", "Programming & CS").
    *   **Row Header**: Features a distinct, slightly larger abstract 3D icon to the far left. Next to it, the bold Category Title, accompanied by a muted, inline sub-title description.
    *   **Horizontal Carousel**: 
        *   A scrollable flex-row of square assessment cards native to that category. 
        *   Implementation must visually hide native browser scrollbars (`scrollbar-width: none` or Webkit equivalents).
        *   Items should have `16px` to `20px` spacing between them. 
        *   Add a floating circular "Next Arrow" button anchored to the right edge (casting a shadow) to indicate carousel overflow.

**Square Assessment Cards (Within the Carousel)**:
*   **Shape**: Perfect Squares. Light grey borders (`1px solid #E5E5E5`).
*   **Centering**: Central 3D vector illustration perfectly aligned to both axis. Subtitle text sits centered at the very bottom.
*   **Micro-Level Details**:
    *   **"NEW" Badge**: An absolutely positioned micro-pill badge (Vibrant Green background, white text) resting exactly on top of the top-left or top-right border of the card, breaking the boundary.
    *   **Progress Indicators**: For courses already in progress, inject a highly slim (`~4px` height) progress bar filling from left to right spanning the absolute bottom border width of the square card.

## 4. Interaction & Motion Design
*   **Hover Elevations**: All interactive cards and square items should elevate slightly on user cursor hover. Use a CSS transform (`translateY(-4px)`) combined with a slightly deeper, darker shadow.
*   **Button Squeeze**: Clicking primary buttons (like "Start" or "Explore Premium") should trigger a brief, subtle scale-down effect (`scale: 0.97`) to mimic the real-world tactility of pressing a button down.
*   **CSS Animations**: Apply a uniform, snappy timing function (e.g., `transition: all 0.2s ease-out`) across all interactable elements to heavily reduce friction.
