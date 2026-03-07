# The Restaurant Money Model

A complete visual system mapping how restaurants generate profit — from demand attraction through capacity, experience, behavior, and economics to the final outcome.

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
│   └── build.js              # Build script
├── docs/                     # Built output (served by GitHub Pages)
│   ├── index.html            # Assembled from all partials
│   └── css/                  # Copied from src/css/
├── index.html                # Original monolithic file (kept for reference)
├── extract.js                # One-time script used to split the original file
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (any recent version)

### Build

```bash
npm run build
```

This assembles all HTML partials into `docs/index.html` and copies the CSS files to `docs/css/`.

### Preview Locally

Open `docs/index.html` directly in a browser, or serve it:

```bash
npx serve docs
```

## Making Changes

1. **Edit content** — Modify the relevant HTML partial in `src/partials/`
2. **Edit styles** — Modify the relevant CSS file in `src/css/`
3. **Rebuild** — Run `npm run build`
4. **Deploy** — Commit and push; GitHub Pages auto-deploys from `docs/`

### CSS Load Order

The CSS files must load in a specific order to maintain correct styling. The order is defined in `src/partials/head.html` and must not be changed without understanding the cascade dependencies:

1. `base.css` — Foundation styles
2. `layout.css` — Page structure
3. `flow-chart.css` — Node layout
4. `components.css` — Reusable elements
5. `connections.css` — Arrow connectors
6. `closing.css` — Final sections
7. `navigation.css` — Overrides `body { padding-top }` from base
8. `collapsible.css` — Accordion sections
9. `back-to-top.css` — Overrides `connection` padding and adds `scroll-margin-top`
10. `responsive.css` — **Must always load last** (media query overrides)

## Hosting

The site is hosted on GitHub Pages, serving from the `docs/` folder on the `master` branch. Any push to `master` that changes `docs/` will trigger a redeploy automatically.
