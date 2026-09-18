# Technical showcase contract

The UI Kit page is a reference a person or another agent can use to build screens. Its primary content is design foundations, implementation contracts, and live examples. Keep the document shell simple: a short title/scope, section navigation, then the reference sections below. Product branding can influence the shared design; long introductions, promotional copy, decorative illustrations, invented product metrics, and a full product flow do not explain the kit and should not dominate it.

Adapt headings to the user's language, but preserve technical identifiers. Reuse an existing component explorer when appropriate; these sections can be linked pages rather than one long page. They must be present and directly discoverable in the rendered showcase, not only described in Markdown or hidden in CSS. Start with a small useful scale for the agreed scenarios rather than generating an exhaustive design system.

## 1. Colors

Organize color roles under these visible semantic names: `primary`, `secondary`, `neutral`, `success`, `warning`, `error`. A brand/story name may appear as extra context but cannot replace a role. Distinguish palette values from their uses (for example primary foreground/background, muted neutral text, border, or error surface). Do not generate every shade of every role without a use.

Each shown token has its identifier, actual color value, swatch, intended use, and important pairing/state guidance. Show text/background pairs where relevant so a swatch alone does not imply readable contrast. Labels or icons carry status as well as color. Use the same tokens in components and examples.

In brownfield, map the semantic roles to adopted existing tokens; preserve their source names/imports unless a rename or migration is authorized. Mark missing or undecided roles explicitly and resolve them through the interview instead of silently inventing an adopted value. Every role remains visible even when its value awaits agreement.

## 2. Typography

Provide a dedicated type specimen and specification table for the adopted text roles: headings, body, labels, and supporting/caption text as needed. For each role show a rendered sample, source token/class, family and fallback, font size with units, weight, line-height, and letter-spacing when set. Include desktop/mobile values or a fluid-sizing rule where they differ, and when the role should be used.

Typography is not complete with only a font name, a decorative phrase, and one body-size caption. Use neutral sample text of useful length to expose wrapping and hierarchy. The specimen must use the actual shared typography definitions.

## 3. Sizing & spacing

Show the adopted spacing scale as named tokens with numeric values/units and measurable visual examples. State which steps serve inline gaps, control padding, card padding, section spacing, and page gutters. A base-unit claim such as “4px rhythm” without the actual scale and usage is insufficient.

Document the component sizes needed by the agreed scenarios: control heights, icon sizes, touch/hit areas, relevant widths, radii, and borders. If these change responsively, show the rule. Keep spacing, physical control size, and hit area distinguishable. Render examples from the same sizing/spacing sources as the components; examples must not maintain separate literal values that can drift.

## 4. Layout — desktop and mobile

Expose container widths/max-widths, grid/column rules, page gutters, gaps, and the breakpoints or container-query thresholds that govern them. Explain what changes at each transition: stacking, column count, navigation, reading order, full-width controls, or overflow handling, limited to the patterns this kit supports.

Include visible desktop and mobile examples of the same representative layout with labeled viewport widths. Use the real shared layout primitives. Sized live previews or an adjustable viewport are useful; a reduced desktop illustration labeled “mobile” is not evidence. If previews are embedded, make them respond to their own viewport/container rather than accidentally inheriting the desktop page width. Verify the actual responsive page at a desktop and mobile width as well. Keep the documentation shell's navigation separate from the product layout pattern being specified.

## 5. Components, states, and composition

After the foundations, show the basic and compound components needed for the selected scenarios. Use neutral technical names and concise source/import/API pointers, supported variants/sizes/states, and guidance about intended use. Show meaningful default, hover/focus/active, disabled/loading, validation, and empty/success/error states where the component has them; do not invent every state for every component. Label a simulated visual state as such and also verify actual interactive behavior when applicable.

A small working composition can prove that the same components fit together. Put it after the reference material or in a separately linked example. Its purpose is to demonstrate reuse and layout; avoid building an entire application merely to present a kit. Domain-specific components are valid when required by the agreed scenario, but theme-specific copy cannot replace their technical description.

## Completion check

Verify the rendered sections and their correspondence to shared sources: all six color roles, type-role specifications, actual spacing/sizing scales, explicit layout rules, real desktop/mobile examples, and the scoped component/state catalog. Present unfinished decisions and unavailable checks explicitly. A future screen author must be able to choose the right token, text style, dimension, layout, and component from this document without reverse-engineering a demo page.
