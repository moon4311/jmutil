# AI Coding Instructions for Web-Util

## Project Overview
Web-Util is a Korean online utility collection built with **Nuxt 3 + Vuetify + Tailwind CSS** using **JavaScript only** (no TypeScript). The app provides developer tools like JSON formatting, string conversion, date/time utilities, color tools, QR generation, and more.

## Architecture & Key Patterns

### Tech Stack & Configuration
- **Build**: pnpm, Node 20.19.4, SSR enabled with aggressive optimization
- **Styling**: Vuetify components + Tailwind utilities, theme unified via Tailwind palette
- **Structure**: `/pages` auto-routing, `/utils` for business logic, `/composables` for Vue reactivity
- **SEO**: Comprehensive meta tags, sitemap generation, analytics integration

### File Organization Patterns
```
utils/           # Pure JS utility functions (JsonUtil.js, StringUtil.js, etc.)
composables/     # Vue reactive logic (useCopy.js, useValidation.js, etc.)
components/      # Reusable UI components with Vuetify + Tailwind
pages/           # Auto-routed pages following /category/tool pattern
layouts/         # Default layout with sidebar navigation and ad integration
```

### Component Architecture
- **Layout**: `default.vue` with responsive sidebar (`SideBar.vue`) and mobile overlay
- **Utilities**: Each tool page uses corresponding `utils/` module + `composables/` for state
- **Copy Pattern**: Every tool implements copy-to-clipboard via `useCopy()` composable
- **Validation**: Input validation through `useValidation()` with real-time feedback

## Development Workflows

### Commands
```bash
pnpm dev          # Development server on localhost:80
pnpm build        # Production build with SSR optimization
pnpm preview      # Preview production build
```

### Adding New Tools
1. Create utility in `/utils/[Name]Util.js` with performance caching
2. Add composable in `/composables/use[Name].js` for reactive state
3. Create page in `/pages/category/tool-name.vue`
4. Update `SideBar.vue` navigation and `nuxt.config.js` sitemap
5. Add redirect mapping in `middleware/redirect.global.js` if needed

### Performance Patterns
- **Caching**: Utility functions use `Map()` caches with size limits (see `JsonUtil.js`)
- **Lazy Loading**: `ClientOnly` for ads, dynamic imports for heavy features
- **SSR Optimization**: Critical CSS inlining, payload extraction disabled

## Project-Specific Conventions

### Styling Approach
- **Component Base**: Vuetify for form controls, layout, buttons
- **Utilities**: Tailwind for spacing, colors, responsive design
- **Common CSS**: Shared styles in `assets/css/common.css` for consistency
- **Color System**: Safelist pattern in `tailwind.config.js` for dynamic color classes

### Korean Localization
- All UI text in Korean, comments in Korean
- Error messages and validation feedback localized
- SEO meta tags optimized for Korean search engines (Naver, Google)

### State Management
- **No Pinia/Vuex**: Uses composables for shared reactive state
- **Performance Focus**: Minimal reactivity, caching for expensive operations
- **Copy-First UX**: Every output has immediate copy functionality

### API & Server Integration
- **Ads**: Kakao Ad platform integration with responsive placement
- **SEO**: Automatic sitemap generation, comprehensive meta tags

## Critical Integration Points

### SEO & Analytics
- Sitemap auto-generates from route definitions in `nuxt.config.js`
- Meta tags include Naver/Google verification codes
- Visit tracking through server API maintains daily/total counts

### Advertisement Integration
- Kakao Ads placed in header and between content sections
- Responsive ad units with `ClientOnly` for SSR compatibility
- AdSense integration with responsive ad placement

### Legacy URL Handling
- Global middleware redirects old URLs (e.g., `/string-utils` → `/string/utils`)
- SEO-safe 301 redirects maintain search rankings

## Common Patterns to Follow

1. **Utility Structure**: Export named functions with JSDoc, implement caching for performance
2. **Page Components**: Use Vuetify form components, integrate copy functionality, validate inputs
3. **Navigation**: Update both `SideBar.vue` menu and `nuxt.config.js` sitemap when adding tools
4. **Error Handling**: Use `useErrorHandler()` composable for consistent error display
5. **Responsive Design**: Mobile-first with sidebar overlay, responsive ad placement

## Key Files for Understanding
- `nuxt.config.js` - SSR optimization, SEO setup, sitemap configuration  
- `layouts/default.vue` - App shell with navigation and ads
- `utils/JsonUtil.js` - Example of performance-optimized utility with caching
- `composables/useCopy.js` - Copy functionality used across all tools
- `pages/data/json.vue` - Complex tool implementation example
