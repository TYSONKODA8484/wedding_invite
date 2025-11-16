# WeddingInvite.ai Design Guidelines

## Design Approach
**Reference-Based Cinematic Premium**: Drawing inspiration from Airbnb's elegant card layouts, Netflix's video-first interface, and luxury wedding platforms. This is a high-touch, emotionally-driven platform where visual excellence directly impacts conversion.

## Core Design Principles
1. **Cinematic First**: Every page should feel like a premium experience with generous whitespace, elegant animations, and video-centric layouts
2. **Cultural Respect**: Design elements should adapt to showcase diverse cultural aesthetics authentically
3. **Trust Through Polish**: Premium finish in every detail signals professional quality of video output

## Typography System

**Font Families** (Google Fonts):
- Primary: Playfair Display (headings, elegant serif)
- Secondary: Inter (body text, clean sans-serif)
- Accent: Cormorant Garamond (decorative elements)

**Hierarchy**:
- H1 Hero: text-6xl lg:text-7xl, Playfair Display, font-bold
- H1 Page: text-5xl lg:text-6xl, Playfair Display, font-bold
- H2 Section: text-4xl lg:text-5xl, Playfair Display, font-semibold
- H3 Component: text-2xl lg:text-3xl, Playfair Display, font-semibold
- Body Large: text-lg lg:text-xl, Inter, font-normal
- Body: text-base lg:text-lg, Inter, font-normal
- Caption: text-sm, Inter, font-medium

## Layout System

**Spacing Scale**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24, 32 for consistency
- Section padding: py-16 md:py-24 lg:py-32
- Component spacing: gap-8 lg:gap-12
- Card padding: p-6 lg:p-8
- Element margins: mb-4, mb-6, mb-8

**Container Widths**:
- Full-width sections: w-full with inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Content sections: max-w-6xl mx-auto
- Text content: max-w-3xl mx-auto
- Template grids: max-w-7xl mx-auto

**Grid System**:
- Template grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Category cards: grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- Culture showcases: grid-cols-1 md:grid-cols-2

## Component Library

### Navigation
- Sticky header with blur backdrop (backdrop-blur-md)
- Logo left, main nav center, "Create Invite" CTA right
- Mobile: hamburger menu with slide-in drawer
- Transparent on hero, solid on scroll

### Hero Sections

**Homepage Hero** (100vh):
- Full-screen video background with subtle overlay
- Centered content with large heading + tagline + dual CTAs
- Animated scroll indicator at bottom

**Page Heroes** (60-80vh):
- Background imagery relevant to page theme
- Layered content (breadcrumbs, heading, description, CTA)
- Cultural pages: authentic cultural imagery/patterns

### Template Cards
- Aspect ratio 9:16 for video previews (portrait)
- Hover: subtle lift (scale-105) + shadow increase
- Preview thumbnail with play icon overlay
- Title, category tag, duration badge
- "Use Template" CTA button with blur background when on image

### Filter System (Templates Hub)
- Horizontal scrollable filter chips on mobile
- Multi-row filter bar on desktop
- Active filters show count badge
- Smooth filter transitions

### Video Preview Components
- Autoplay on hover (desktop) or tap (mobile)
- Muted by default with unmute option
- Loading skeleton with shimmer
- Fullscreen option icon

### Category Sections
- Large category cards with background imagery
- Icon + title + count + description
- 2-column on tablet, 3-4 column on desktop

### Cultural Showcase
- Featured culture cards with traditional patterns/colors
- Region name in local script + English
- Representative iconography
- Template count indicator

### Testimonial Cards
- Customer photo (circular, bordered)
- Quote in italic
- Name + event type + date
- 5-star rating display
- Video testimonials with play button

### Pricing Cards
- Equal height cards with outline highlighting featured plan
- Header section with plan name + price
- Feature list with checkmarks
- CTA button (primary for featured, secondary for others)
- "Most Popular" badge on recommended plan

### Process Flow (How It Works)
- Large numbered circles (1, 2, 3)
- Step title + description
- Connecting lines/arrows between steps
- Visual representation (icon or image) per step

### Footer
- Multi-column layout: Company, Resources, Culture, Countries, Legal
- Newsletter signup with email input + button
- Social media icons
- Trust badges (secure, money-back, support)
- Secondary navigation links

## Page-Specific Layouts

### Homepage Sections (in order):
1. Cinematic video hero (100vh)
2. Why Choose Us (3-4 feature cards)
3. Popular Categories (6-8 category cards)
4. Featured Templates (8-12 template grid)
5. Cultural Showcase (6-8 culture cards)
6. How It Works (3 steps)
7. Testimonials (carousel or 3-column grid)
8. Final CTA section with video background
9. Rich footer

### Templates Hub:
- Filter bar (sticky below nav)
- Template count + sort options
- Template grid (infinite scroll or pagination)
- Side category navigation (desktop)

### Template Detail:
- Large video preview (hero-sized)
- Title + description + metadata
- "What you can customize" section with icons
- Related templates carousel
- Sticky "Use Template" CTA

### Culture/Country Pages:
- Cultural hero with authentic imagery
- SEO intro paragraph (max-w-3xl)
- Cultural symbols/traditions showcase
- Template grid filtered to that culture
- Related cultures sidebar

## Images

**Hero Images Needed**:
- Homepage: Cinematic wedding video still (couple in elegant setting)
- Templates Hub: Collage of various video templates
- Wedding Category: Romantic wedding ceremony
- Engagement: Couple proposal moment
- Each Culture Page: Authentic cultural wedding imagery (traditional attire, ceremonies)
- Each Country Page: Landmark or cultural wedding scene from that country
- Premium/Luxury: High-end venue or luxury wedding details
- Enterprise: Professional event setup

**Supporting Images**:
- Template card thumbnails (video stills)
- Customer testimonial photos
- Cultural pattern overlays/backgrounds
- Icon illustrations for features

## Animations (Minimal & Purposeful)

**Use only**:
- Fade-in on scroll for sections (once)
- Smooth hover transforms on cards
- Page transition fades
- Video preview autoplay
- CTA button subtle pulse (only on primary hero CTA)

**Avoid**: Excessive parallax, continuous animations, distracting effects

## Accessibility
- Focus indicators on all interactive elements
- ARIA labels on video controls, filters
- Semantic HTML throughout
- Keyboard navigation support
- Alt text on all images
- High contrast text on backgrounds

## Mobile-First Considerations
- Touch-friendly target sizes (min 44x44px)
- Simplified navigation drawer
- Stacked layouts (single column) on mobile
- Larger tap targets for filters
- WhatsApp share button prominent on mobile
- Optimized video loading for mobile bandwidth