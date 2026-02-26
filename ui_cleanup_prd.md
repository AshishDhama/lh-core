# Product Requirements Document (PRD): UI Cleanup & Design Mode Implementation

## 1. Executive Summary
**Objective**: Resolve visual duplication and spacing inconsistencies within the application's core navigation shell (`Sidebar` and `Header`), while correctly elevating the "Design Mode" switch to become a global layout controller in the top bar.
**Context**: The current `Sidebar` component duplicates language and theme controls that already exist in the global `Header`. It also hides the "Design Mode" switcher in the sidebar, which conceptually fails because specific Design Modes (like "Brilliant") dictate entirely different layout structures that shouldn't be constrained inside `DashboardLayout`.

## 2. Issues Identified
1. **Design Mode Switcher Placement**: The sidebar currently houses the `DesignModeSwitcher`. This feature should sit in the global `Header` since changing the design mode can drastically alter the entire layout of the page (e.g. bypassing the standard sidebar entirely).
2. **Control Duplication**: The `SidebarFooterControls` component renders a language selector (`EN/HI`) and a theme switch (`Sun/Moon`). These identical controls are already prominently featured in the top `Header.tsx`.
3. **Sidebar Top Spacing Bug**: The `DashboardLayout` fixes the `Sidebar` directly under the `Header` (`top-16`). However, the `Sidebar` component internally renders an empty `h-16` logo block across the top of its layout, resulting in a dead 64px gap above the navigation links.

## 3. Implementation Plan
Changes will require modifying `src/forge/patterns/Sidebar.tsx` and `src/forge/patterns/Header.tsx`.

### Action Items
*   [ ] **Relocate `DesignModeSwitcher` to Header**:
    *   Move the `designModes` constant array and `DesignModeSwitcher` component from `Sidebar.tsx` to `Header.tsx`.
    *   Refactor the `DesignModeSwitcher` to render horizontally and cleanly fit into the `Header`'s top-right actions area alongside the theme/language toggles.
*   [ ] **Remove `SidebarFooterControls` Component**:
    *   Delete the `SidebarFooterControls` function component from `Sidebar.tsx`.
    *   Remove unused imports for `useThemeStore` and `useTranslation` in `Sidebar.tsx`.
*   [ ] **Remove Empty Sidebar Header/Logo Area**:
    *   Inside the main `Sidebar` render function, delete the `div` containing the logo/header area (`<div className={cn('flex items-center h-16...'>...</div>`).
    *   Remove the `logo` prop from `SidebarProps`.
*   [ ] **Clean Up Sidebar Render Logic**:
    *   Remove the `{!collapsed && (<> ... </>)}` block at the bottom of the `Sidebar` component which formerly rendered the deleted footer controls.
