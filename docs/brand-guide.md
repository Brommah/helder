# Helder Brand Guide

*Versie 1.0 — Januari 2026*

---

## 1. Brand Story

### Missie
Wij geloven dat elk huis een verhaal verdient. Helder maakt bouwprocessen transparant door digitale woningpaspoorten te creëren die de complete DNA van een woning vastleggen — van eerste fundament tot laatste afwerking.

### Visie
Een wereld waarin elke woningeigenaar volledig inzicht heeft in hun huis: alle materialen, alle keuzes, alle garanties. Gedocumenteerd, geverifieerd, en altijd toegankelijk.

### Kernwaarden
1. **Transparantie** — Eerlijk, open, niets te verbergen
2. **Kwaliteit** — Precisie in elk detail
3. **Innovatie** — AI-gestuurd, toekomstgericht
4. **Vertrouwen** — Blockchain-beveiligd, onweerlegbaar

### Brand Personality
- **Professioneel** maar toegankelijk
- **Innovatief** maar betrouwbaar
- **Direct** maar empathisch
- **Premium** maar niet arrogant

---

## 2. Logo Usage

### Primary Logo
Het Helder logo bestaat uit de naam "HELDER" in hoofdletters met een punt accent.

```
HELDER.
```

### Logo Varianten
| Variant | Gebruik |
|---------|---------|
| Dark on Light | Primair, voor lichte achtergronden |
| Light on Dark | Voor donkere achtergronden |
| Monochrome | Print, gravure, beperkte kleuren |

### Clearspace
Minimale ruimte rond het logo: hoogte van de letter "H" aan alle zijden.

### Minimum Size
- Print: 24mm breedte
- Screen: 80px breedte

### Don'ts
- ❌ Logo niet roteren
- ❌ Geen schaduw of effecten toevoegen
- ❌ Verhoudingen niet aanpassen
- ❌ Geen andere kleuren dan gespecificeerd
- ❌ Logo niet op drukke achtergronden plaatsen

---

## 3. Color Palette

### Primary Colors

| Naam | Hex | RGB | Gebruik |
|------|-----|-----|---------|
| Helder Blue | `#93b9e6` | 147, 185, 230 | Accent, CTAs, highlights |
| Helder Dark | `#1a1a2e` | 26, 26, 46 | Headlines, primary text |

### Neutral Palette

| Naam | Hex | Tailwind | Gebruik |
|------|-----|----------|---------|
| Slate 900 | `#0f172a` | slate-900 | Headlines, dark UI |
| Slate 700 | `#334155` | slate-700 | Body text |
| Slate 500 | `#64748b` | slate-500 | Secondary text |
| Slate 300 | `#cbd5e1` | slate-300 | Borders |
| Slate 100 | `#f1f5f9` | slate-100 | Backgrounds |
| Slate 50 | `#f8fafc` | slate-50 | Page backgrounds |

### Semantic Colors

| Naam | Hex | Tailwind | Gebruik |
|------|-----|----------|---------|
| Success | `#16a34a` | green-600 | Completed, verified |
| Warning | `#d97706` | amber-600 | Alerts, attention |
| Error | `#dc2626` | red-600 | Errors, critical |
| Info | `#0284c7` | sky-600 | Information |

### Color Usage Guidelines

**Helder Blue (#93b9e6)**
- Primary CTA buttons (hover state)
- Active navigation items
- Progress bars
- Accent highlights
- AI-related elements

**Helder Dark (#1a1a2e)**
- Primary button default state
- Main headlines
- Sidebar navigation
- Footer

---

## 4. Typography

### Font Family
**Inter** — A modern sans-serif optimized for screens.

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale

| Element | Size | Weight | Letter Spacing | Transform |
|---------|------|--------|----------------|-----------|
| H1 | 64-128px | 900 (Black) | -0.03em | UPPERCASE |
| H2 | 48-80px | 900 (Black) | -0.03em | UPPERCASE |
| H3 | 28-40px | 900 (Black) | 0.1em | UPPERCASE |
| H4 | 18-24px | 700 (Bold) | 0.1em | UPPERCASE |
| Body | 16px | 400 (Regular) | normal | normal |
| Body Small | 14px | 500 (Medium) | normal | normal |
| Caption | 12px | 600 (Semibold) | 0.05em | normal |
| Label | 10-11px | 900 (Black) | 0.2em | UPPERCASE |

### Heading Styles

```css
/* H1 - Hero Headlines */
.h1 {
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 0.9;
  text-transform: uppercase;
}

/* H2 - Section Headlines */
.h2 {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 0.9;
  text-transform: uppercase;
}

/* Labels */
.label {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
```

---

## 5. Component Patterns

### Buttons

**Primary Button**
```html
<button class="px-10 py-5 bg-slate-900 text-white font-black uppercase tracking-wider hover:bg-[#93b9e6] transition-colors">
  BUTTON TEXT
</button>
```

**Secondary Button**
```html
<button class="px-10 py-5 border-2 border-slate-200 text-slate-900 font-black uppercase tracking-wider hover:border-[#93b9e6] hover:text-[#93b9e6] transition-all">
  BUTTON TEXT
</button>
```

**Ghost Button**
```html
<button class="px-6 py-3 text-[#93b9e6] font-bold uppercase tracking-wider hover:text-slate-900 transition-colors">
  BUTTON TEXT
</button>
```

### Cards

**Standard Card**
```html
<div class="bg-white border border-slate-200 p-6">
  <h3 class="font-black uppercase tracking-wider">TITLE</h3>
  <p class="text-slate-500">Content</p>
</div>
```

**Feature Card (with accent)**
```html
<div class="bg-white border-l-4 border-[#93b9e6] p-6">
  <h3 class="font-black uppercase tracking-wider">TITLE</h3>
  <p class="text-slate-500">Content</p>
</div>
```

**Hover Card**
```html
<div class="bg-white border border-slate-200 p-6 hover:border-[#93b9e6] hover:-translate-y-1 hover:shadow-lg transition-all">
  <!-- Content -->
</div>
```

### Form Elements

**Input Field**
```html
<input 
  type="text"
  class="w-full px-4 py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#93b9e6] focus:bg-white outline-none transition-all font-medium"
  placeholder="Placeholder"
/>
```

**Label**
```html
<label class="block text-xs font-black text-slate-900 mb-3 uppercase tracking-wider">
  LABEL TEXT
</label>
```

### Badges

**Status Badge**
```html
<span class="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
  Opgeleverd
</span>
```

**Info Badge**
```html
<span class="px-3 py-1 bg-[#93b9e6] text-slate-900 text-[10px] font-black uppercase tracking-wider">
  AI Actief
</span>
```

---

## 6. Iconography

### Icon Library
We gebruiken **Lucide React** voor consistente iconografie.

```bash
npm install lucide-react
```

### Icon Sizes
| Context | Size | Example |
|---------|------|---------|
| Inline with text | 16px (w-4 h-4) | Navigation items |
| Button icons | 20px (w-5 h-5) | CTA buttons |
| Feature icons | 24px (w-6 h-6) | Feature cards |
| Hero icons | 32-48px | Section highlights |

### Icon Style Guidelines
- Use `strokeWidth={2}` for consistency
- Align icons with text using `flex items-center`
- Use color classes, not inline colors
- Add hover states where interactive

### Common Icons
| Purpose | Icon |
|---------|------|
| Home | `Home` |
| Documents | `FileText` |
| Timeline | `Clock` |
| Materials | `Package` |
| Share | `Share2` |
| AI | `Brain`, `Sparkles` |
| Security | `Shield`, `Lock` |
| Success | `CheckCircle2` |
| Warning | `AlertTriangle` |
| Error | `XCircle` |

---

## 7. Photography Style

### Characteristics
- **Lighting**: Natural, bright, golden hour preferred
- **Composition**: Clean, uncluttered, subject-focused
- **Color**: Warm tones, blues complementing brand color
- **Feel**: Professional yet approachable

### Construction Photography
- Document real progress authentically
- Show craftsmanship and quality
- Include human elements (workers, tools)
- Capture natural lighting conditions

### Lifestyle Photography
- Feature diverse Dutch families
- Show genuine emotions (pride, happiness)
- Modern, contemporary home settings
- Avoid overly staged or artificial scenes

### Product Screenshots
- Clean, minimal UI backgrounds
- Consistent device frames
- Real data (anonymized)
- Helder Blue accent highlights

---

## 8. Voice and Tone

### Brand Voice
- **Direct**: Geen omhaal, to the point
- **Professional**: Expertise zonder arrogantie
- **Empathisch**: We begrijpen de investering
- **Positief**: Focus op waarde en mogelijkheden

### Writing Guidelines

**Do:**
- Gebruik actieve zinnen
- Wees specifiek en concreet
- Spreek de lezer direct aan (u/uw)
- Gebruik Nederlandse terminologie

**Don't:**
- Vermijd jargon zonder uitleg
- Geen overdreven superlatieven
- Geen negatieve framing
- Geen Engelse termen waar Nederlandse bestaan

### Tone per Context

| Context | Tone | Voorbeeld |
|---------|------|-----------|
| Marketing | Inspirerend, ambitieus | "Bouw uw droomhuis met complete transparantie" |
| Dashboard | Zakelijk, informatief | "3 documenten toegevoegd deze week" |
| Errors | Behulpzaam, empathisch | "Er ging iets mis. We zoeken een oplossing." |
| Success | Bevestigend, positief | "Perfect! Uw document is veilig opgeslagen." |

### CTA Patterns

| Type | Voorbeelden |
|------|-------------|
| Primary | "START NU", "BEKIJK DEMO", "ONTDEK MEER" |
| Secondary | "Meer informatie", "Bekijk details" |
| Navigation | "Naar dashboard", "Terug" |

---

## 9. Motion & Animation

### Principles
1. **Subtiel**: Animaties versterken, niet afleiden
2. **Snel**: Maximaal 300ms voor UI interactions
3. **Natuurlijk**: Easing voor organisch gevoel
4. **Consistent**: Zelfde timing en easing patterns

### Timing
| Type | Duration | Easing |
|------|----------|--------|
| Micro-interactions | 150ms | ease-out |
| Transitions | 200-300ms | ease-in-out |
| Page transitions | 300-400ms | ease-out |
| Progress animations | 800ms | ease-out |

### Animation Library
We gebruiken **Framer Motion** voor React animaties.

```tsx
import { motion } from 'framer-motion'

// Fade in up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

---

## 10. Spacing & Layout

### Spacing Scale
Based on 4px base unit (Tailwind default).

| Name | Value | Tailwind |
|------|-------|----------|
| xs | 4px | p-1 |
| sm | 8px | p-2 |
| md | 16px | p-4 |
| lg | 24px | p-6 |
| xl | 32px | p-8 |
| 2xl | 48px | p-12 |
| 3xl | 64px | p-16 |

### Container Widths
| Type | Max Width | Class |
|------|-----------|-------|
| Content | 1600px | max-w-[1600px] |
| Prose | 800px | max-w-prose |
| Form | 500px | max-w-md |

### Grid System
- 12-column grid for complex layouts
- CSS Grid for 2D layouts
- Flexbox for component alignment

---

## 11. Accessibility

### Color Contrast
All text meets WCAG 2.1 AA standards:
- Normal text: minimum 4.5:1 contrast ratio
- Large text: minimum 3:1 contrast ratio

### Focus States
```css
.focus-visible:focus {
  outline: 2px solid #93b9e6;
  outline-offset: 2px;
}
```

### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover and active states
- Keyboard navigable
- Screen reader friendly labels

---

## 12. Implementation

### Tailwind Config
```js
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        helder: {
          blue: '#93b9e6',
          dark: '#1a1a2e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

### CSS Variables
```css
:root {
  --helder-blue: #93b9e6;
  --helder-dark: #1a1a2e;
  --font-sans: 'Inter', sans-serif;
}
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial release |

---

*© 2026 Helder Woningbouw B.V. — Alle rechten voorbehouden*
