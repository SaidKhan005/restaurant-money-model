# The Restaurant Money Model

A complete visual system mapping how restaurants generate profit - from demand attraction through capacity, experience, behavior, and economics to the final outcome.

Built as a static site with a modular source structure and a Node.js build pipeline.

**Live site:** [https://saidkhan005.github.io/restaurant-money-model/](https://saidkhan005.github.io/restaurant-money-model/)

---

## Project Structure

```
Restaurant money model/
├── src/
│   ├── css/                  # Source stylesheets (10 files)
│   │   ├── base.css          # Reset, body, container
│   │   ├── layout.css        # Header gradient, beliefs grid, system overview
│   │   ├── flow-chart.css    # Nodes, cards, colors, headers
│   │   ├── components.css    # Content boxes, lists, grids, lever cards
│   │   ├── connections.css   # Arrows, labels, explanations between nodes
│   │   ├── closing.css       # Final rule, upgraded rule
│   │   ├── navigation.css    # Sticky nav bar, scroll behavior
│   │   ├── collapsible.css   # Expandable deep-dive sections
│   │   ├── back-to-top.css   # Back-to-top button, scroll margin
│   │   └── responsive.css    # Media queries (must load last)
│   ├── partials/             # HTML partials (22 files)
│   │   ├── head.html         # DOCTYPE, meta tags, CSS links
│   │   ├── body-open.html
│   │   ├── navigation.html   # Sticky nav with anchor links
│   │   ├── container-open.html
│   │   ├── header.html       # Page title
│   │   ├── core-beliefs.html # 5 foundational beliefs
│   │   ├── system-overview.html
│   │   ├── flow-chart-open.html
│   │   ├── node-1-demand.html      # Node 1: Demand / Attraction
│   │   ├── connection-1-2.html
│   │   ├── node-2-capacity.html    # Node 2: Capacity
│   │   ├── connection-2-3.html
│   │   ├── node-3-experience.html  # Node 3: Experience
│   │   ├── connection-3-4.html
│   │   ├── node-4-behavior.html    # Node 4: Behavior
│   │   ├── connection-4-5.html
│   │   ├── node-5-economics.html   # Node 5: Economics
│   │   ├── connection-5-6.html
│   │   ├── node-6-profit.html      # Node 6: Profit
│   │   ├── flow-chart-close.html
│   │   ├── closing-sections.html   # Hidden loop + Operator's Commandment
│   │   └── footer.html
│   ├── diagnostic/           # Profit Diagnostic tool (separate build)
│   │   ├── partials/         # 9 HTML partials
│   │   ├── css/              # 8 CSS files
│   │   ├── js/               # diagnostic.js (quiz logic + scoring)
│   │   ├── assets/           # favicon
│   │   └── build.js          # Diagnostic build script
│   └── build.js              # Main site build script
├── docs/                     # Main site output (GitHub Pages)
│   ├── index.html
│   └── css/
├── docs-diagnostic/          # Diagnostic tool output
│   ├── index.html
│   ├── css/
│   └── js/
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (any recent version)

### Build

```bash
# Build main site
npm run build

# Build diagnostic tool
node src/diagnostic/build.js
```

### Preview Locally

Open `docs/index.html` or `docs-diagnostic/index.html` in a browser, or serve them:

```bash
npx serve docs
npx serve docs-diagnostic
```

## Making Changes

1. **Edit content** - Modify the relevant HTML partial in `src/partials/` or `src/diagnostic/partials/`
2. **Edit styles** - Modify the relevant CSS file in `src/css/` or `src/diagnostic/css/`
3. **Rebuild** - Run the appropriate build command
4. **Deploy** - Commit and push; GitHub Pages auto-deploys from `docs/`

### CSS Load Order (Main Site)

The CSS files must load in a specific order. The order is defined in `src/partials/head.html`:

1. `base.css` - Foundation styles
2. `layout.css` - Page structure
3. `flow-chart.css` - Node layout
4. `components.css` - Reusable elements
5. `connections.css` - Arrow connectors
6. `closing.css` - Final sections
7. `navigation.css` - Overrides `body { padding-top }` from base
8. `collapsible.css` - Accordion sections
9. `back-to-top.css` - Overrides `connection` padding and adds `scroll-margin-top`
10. `responsive.css` - **Must always load last** (media query overrides)

## Hosting

The site is hosted on GitHub Pages, serving from the `docs/` folder on the `master` branch.
