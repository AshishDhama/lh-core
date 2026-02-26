# Product Requirements Document (PRD): Ant Design v5 to v6 Migration

## 1. Executive Summary
**Objective**: Safely and comprehensively upgrade the project's Ant Design (`antd`) dependency from version 5.x to 6.x.
**Scope**: Address all deprecated component APIs, update required peer dependencies (React, `@ant-design/icons`), and ensure styling consistency utilizing the new semantic `styles` and `classNames` patterns introduced in v6.

## 2. Prerequisites & Core Upgrades
*   **React Version**: Must be React `>= 18`. React 17 and earlier are no longer supported. (If present, remove the `@ant-design/v5-patch-for-react-19` package).
*   **Icons Upgrade**: Requires `@ant-design/icons` version `>= 6.0.0`. 
    * *CRITICAL*: `antd@6` is fundamentally incompatible with `@ant-design/icons@5`. They must be upgraded simultaneously.
*   **Browser Support**: Internet Explorer is entirely dropped. Modern browsers supporting CSS variables are required.

## 3. Breaking Changes & Deprecations (API Adjustments)
Ant Design v6 unifies legacy, disparate layout props (like `xxxStyle` and `xxxClassName`) into structured object representations: `styles` and `classNames`. 

Based on our codebase audit, we are **only using a specific subset of Ant Design components**. All migration efforts should be strictly focused on the components we actively employ: `Alert`, `App`, `Avatar`, `Badge`, `Button`, `Card`, `Checkbox`, `ConfigProvider`, `Divider`, `Drawer`, `Input`, `Layout`, `Modal`, `Popover`, `Progress`, `Spin`, `Steps`, `Tag`, `Typography`, and `theme`.

The following are the exact deprecations and adjustments required for *our* specific components.

### 3.1. General Structure Replacements
*   **Alert**:
    *   `closeText` ➔ `closable={{ closeIcon: ... }}`
    *   `message` ➔ `title`
*   **Button & Avatar**:
    *   `Button.Group` ➔ `Space.Compact`
    *   `iconPosition` (Button) ➔ `iconPlacement`
    *   `maxCount`, `maxStyle`, `maxPopoverPlacement`, `maxPopoverTrigger` (Avatar.Group) ➔ `max={{ count: X, style: Y, popover: Z }}`
*   **Card**:
    *   `headStyle` ➔ `styles.header`
    *   `bodyStyle` ➔ `styles.body`
    *   `bordered` ➔ `variant` (e.g., `variant="outlined"` vs `variant="borderless"`)
*   **Divider**:
    *   `type` ➔ `orientation`
    *   `orientationMargin` ➔ `styles.content.margin`
*   **Tag**:
    *   *UI Change*: The default trailing margin (`margin-inline-end`) has been removed in v6. If our custom components `src/forge/primitives/Tag.tsx` or `src/forge/composites/ProgramCard.tsx` rely on this implicit gap, we must reintroduce it either via local flex/gap containers (Recommended) or globally via `ConfigProvider`: `tag={{ styles: { root: { marginInlineEnd: 8 } } }}`.

### 3.2. Overlay Components (Drawer & Modal)
*   **Styles API Integration**:
    *   `headerStyle` ➔ `styles.header`
    *   `bodyStyle` ➔ `styles.body`
    *   `footerStyle` ➔ `styles.footer`
    *   `maskStyle` ➔ `styles.mask`
    *   `contentWrapperStyle` (Drawer) ➔ `styles.wrapper`
    *   `drawerStyle` (Drawer) ➔ `styles.section`
*   **Mask Blur** (*New Feature*): v6 introduces a backdrop blur effect for masks which is **enabled by default**. If our existing modals (`src/forge/patterns/ReportPreviewModal.tsx`) or drawers (`src/forge/layouts/DashboardLayout.tsx`) require the old sharp background look, disable it globally or per-component using `mask={{ blur: false }}`.
*   **Sizing** (Drawer): `width` and `height` ➔ Combined into the `size` property.

## 4. Migration Execution Plan
1. **Dependency Bump**:
    ```bash
    yarn add antd@6 @ant-design/icons@6
    ```
2. **Global Search & Replace (Scoped)**:
    *   Target regex or manual codebase search specifically for the deprecated props inside our used component files (e.g. `src/routes/` and `src/forge/`).
    *   Refactor old styling properties (`bodyStyle=`, etc.) to use the nested `styles` and `classNames` format.
3. **Style Target Audit**:
    *   Review `src/forge/tokens/antTheme.ts` and `src/forge/tokens/modes/utils.ts`. Ensure custom styles are not heavily reliant on internal `.ant-*` DOM hierarchies, as v6 alters DOM structures to improve maintainability.
4. **Quality Assurance Validation**:
    *   Manually verify **Modal and Drawer overlays** for alignment and test if the new default blur effect fits our UI/UX requirements.
    *   Verify spacing of **Tag arrays** (like in search bars or Program cards) to ensure they haven't compacted due to the removed margin.
