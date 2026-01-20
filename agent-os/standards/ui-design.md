# UI/UX Design Standards

## Design Tokens (Tailwind)

### Colors
```typescript
// Primary - Deep Architectural Blue
primary: {
  50: '#f0f7fd',  // Backgrounds, hover states
  100: '#e0eefa', // Light backgrounds
  600: '#2563a8', // Primary buttons, links
  700: '#1e4a80', // Dark primary
  900: '#142340', // Text on light
}

// Accent - Warm Terracotta  
accent: {
  500: '#d97757', // Accent elements
  600: '#c25836', // Hover states
}

// Success - Natural Green
success: {
  100: '#dcf3e9', // Success backgrounds
  500: '#34a379', // Success text/icons
  600: '#228459', // Success buttons
}

// Verified - Blockchain Purple
verified: {
  100: '#f3edfb', // Verified backgrounds
  500: '#8b5cce', // Verified badges
  600: '#6d43af', // Verified emphasis
}
```

### Spacing Scale
```css
/* Use consistent spacing */
p-2  /* 8px - tight */
p-3  /* 12px - compact */
p-4  /* 16px - standard */
p-6  /* 24px - comfortable */
p-8  /* 32px - spacious */
gap-4 /* Standard gap */
gap-6 /* Large gap */
```

### Border Radius
```css
rounded-lg   /* 8px - buttons, inputs */
rounded-xl   /* 12px - cards, badges */
rounded-2xl  /* 16px - large cards */
rounded-full /* Pills, avatars */
```

## Component Patterns

### Cards
```jsx
// Standard card
<div className="card p-6">
  {/* Content */}
</div>

// Interactive card
<div className="card-hover p-6">
  {/* Clickable content */}
</div>

// Stats card
<div className="card p-4">
  <div className="flex items-center gap-3">
    <div className="p-2 bg-primary-100 rounded-lg">
      <Icon className="w-5 h-5 text-primary-600" />
    </div>
    <div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  </div>
</div>
```

### Buttons
```jsx
// Primary action
<button className="btn-primary">
  <Icon className="w-4 h-4" />
  <span>Primary Action</span>
</button>

// Secondary action
<button className="btn-secondary">Secondary</button>

// Ghost/subtle action
<button className="btn-ghost">Ghost</button>
```

### Badges
```jsx
// Status badges
<span className="badge badge-success">Voltooid</span>
<span className="badge badge-warning">In behandeling</span>
<span className="badge badge-verified">Geverifieerd</span>
```

### Form Inputs
```jsx
<div>
  <label className="label">Label</label>
  <input className="input" placeholder="Placeholder..." />
</div>

// With icon
<div className="relative">
  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
  <input className="input pl-10" />
</div>
```

## Layout Patterns

### Dashboard Layout
```jsx
<div className="min-h-screen bg-slate-50">
  {/* Fixed sidebar */}
  <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r">
    {/* Navigation */}
  </aside>
  
  {/* Main content with margin */}
  <main className="ml-64">
    {/* Sticky header */}
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b z-30">
      {/* Header content */}
    </header>
    
    {/* Content area */}
    <div className="p-8">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Grid Layouts
```jsx
// Stats grid
<div className="grid md:grid-cols-4 gap-4">
  {/* 4 stat cards */}
</div>

// Content with sidebar
<div className="grid lg:grid-cols-3 gap-8">
  <div className="lg:col-span-2">{/* Main content */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

## Animation Guidelines
```css
/* Transitions - use for interactive elements */
transition-all duration-200    /* Quick transitions */
transition-all duration-300    /* Standard transitions */

/* Animations - use sparingly */
animate-fade-in      /* Page/modal entrance */
animate-slide-up     /* Toast/modal entrance */
animate-pulse-slow   /* Active indicators */
```

## Dutch Language
- All UI text in Dutch
- Use formal "u" form, not informal "je"
- Be concise and professional
- Example phrases:
  - "Bekijk details" (not "Klik hier")
  - "Uploaden" (not "Upload")
  - "Opslaan" (not "Save")
  - "Annuleren" (not "Cancel")
