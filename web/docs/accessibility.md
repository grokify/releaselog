# Accessibility

ReleaseLog is designed to meet WCAG 2.2 Level AA accessibility standards.

## Features

### Keyboard Navigation

All interactive elements are keyboard accessible:

- **Tab**: Navigate between focusable elements
- **Enter/Space**: Activate buttons and sortable column headers
- **Arrow keys**: Navigate within dropdowns (when open)

### Screen Reader Support

- Semantic HTML structure (table, thead, tbody)
- ARIA labels on interactive elements
- Live regions for dynamic content updates
- Descriptive table captions

### Visual Accessibility

- Color contrast ratios meet WCAG AA (4.5:1 for text, 3:1 for large text)
- Focus indicators on all interactive elements
- No reliance on color alone for information

### Skip Link

A skip link is provided for keyboard users to bypass navigation:

```html
<a href="#releaselog-table" class="rl-skip-link">Skip to release table</a>
```

## CSS Classes

### Screen Reader Only

Hide content visually but keep it accessible to screen readers:

```html
<span class="rl-sr-only">Additional context for screen readers</span>
```

### Skip Link

```css
.rl-skip-link {
  position: absolute;
  left: -9999px;
}

.rl-skip-link:focus {
  position: fixed;
  top: 10px;
  left: 10px;
  /* visible styling */
}
```

## ARIA Attributes

### Sortable Headers

```html
<th role="columnheader button"
    tabindex="0"
    aria-sort="ascending"
    aria-label="Date, sortable column, sorted ascending, press Enter to sort">
  Date
  <span class="releaselog-sort-icon" aria-hidden="true"></span>
</th>
```

### Table

```html
<table class="releaselog-table"
       role="grid"
       aria-label="Release log"
       aria-describedby="releaselog-caption">
  <caption id="releaselog-caption" class="rl-sr-only">
    Release log showing 25 of 100 releases
  </caption>
</table>
```

### Live Region

```html
<div class="rl-sr-only" role="status" aria-live="polite" id="releaselog-status">
  Showing 25 releases
</div>
```

## High Contrast Mode

Styles adapt for `prefers-contrast: more`:

```css
@media (prefers-contrast: more) {
  .releaselog {
    --rl-text: #000000;
    --rl-border: #000000;
  }
}
```

## Reduced Motion

Animations are disabled for `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  .releaselog * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Testing

### Manual Testing

1. Navigate using keyboard only (Tab, Enter, Escape)
2. Test with screen reader (VoiceOver, NVDA, JAWS)
3. Test in high contrast mode
4. Verify focus indicators are visible
5. Check color contrast ratios

### Automated Testing

Use tools like:

- [axe DevTools](https://www.deque.com/axe/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)

## Compliance

ReleaseLog aims to meet:

- **WCAG 2.2 Level AA**
- **Section 508** (US federal accessibility requirements)
- **EN 301 549** (EU accessibility standard)

## Reporting Issues

If you encounter accessibility issues, please report them on GitHub with:

1. Description of the barrier
2. Assistive technology used (if applicable)
3. Browser and operating system
4. Steps to reproduce
