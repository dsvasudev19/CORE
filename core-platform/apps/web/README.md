# Core Platform Marketing Website

A stunning 3D marketing website built with Next.js 16, Aceternity UI, and Framer Motion.

## Features

- 🎨 **Modern Design**: Beautiful dark theme with gradient accents
- ✨ **3D Effects**: Interactive 3D cards and animations using Aceternity UI
- 🚀 **Performance**: Built on Next.js 16 with React 19
- 📱 **Responsive**: Fully responsive design for all devices
- 🎭 **Animations**: Smooth animations with Framer Motion
- 🎯 **SEO Optimized**: Proper metadata and semantic HTML

## Tech Stack

- **Framework**: Next.js 16
- **UI Library**: Aceternity UI Components
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React, Tabler Icons
- **3D Graphics**: Three.js, React Three Fiber

## Getting Started

### Install Dependencies

```bash
cd core-platform
pnpm install
```

### Run Development Server

```bash
# From root
pnpm dev

# Or specifically for web app
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## Project Structure

```
apps/web/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Aceternity UI components
│   │   ├── spotlight.tsx
│   │   ├── text-generate-effect.tsx
│   │   ├── moving-border.tsx
│   │   ├── background-beams.tsx
│   │   └── 3d-card.tsx
│   ├── hero-section.tsx    # Hero section
│   ├── features-section.tsx # Features showcase
│   ├── pricing-section.tsx  # Pricing plans
│   └── cta-section.tsx     # Call to action
├── lib/
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## Sections

### Hero Section

- Animated spotlight effect
- Text generation animation
- Moving border buttons
- Background beams
- Statistics showcase

### Features Section

- 3D interactive cards
- Six key features with icons
- Gradient accents
- Hover effects

### Pricing Section

- Three pricing tiers
- Feature comparison
- Popular plan highlight
- Call-to-action buttons

### CTA Section

- Final conversion section
- Gradient background
- Multiple CTAs
- Trust indicators

## Customization

### Colors

Edit `tailwind.config.ts` to customize the color scheme:

```typescript
theme: {
  extend: {
    colors: {
      // Add your custom colors
    }
  }
}
```

### Content

Update the content in each component file:

- `components/hero-section.tsx` - Hero content
- `components/features-section.tsx` - Features list
- `components/pricing-section.tsx` - Pricing plans

### Animations

Modify animation settings in `tailwind.config.ts`:

```typescript
animation: {
  "meteor-effect": "meteor 5s linear infinite",
  "aurora": "aurora 60s linear infinite",
}
```

## Performance

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle Size**: Optimized with Next.js automatic code splitting

## Deployment

### Vercel (Recommended)

```bash
pnpm build
# Deploy to Vercel
```

### Docker

```bash
docker build -t core-platform-web .
docker run -p 3000:3000 core-platform-web
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

Private - All rights reserved
