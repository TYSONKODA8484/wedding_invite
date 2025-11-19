# WeddingInvite.ai

## Overview

**NEW DIRECTION (Nov 2024)**: WeddingInvite.ai is a 247invites.com-style video invitation platform focused on the Indian + Arabic/Middle East markets. Users browse templates, customize multi-page invitations (6-7 pages) with text and photos, preview watermarked low-quality videos, pay via Razorpay, and download full-quality videos with WhatsApp delivery.

**Market Focus**: Indian and Arabic wedding markets only (MVP test market launch)

**Business Model**: Pay-per-template (NO subscriptions). Prices range from ₹1,200-₹2,900 per template.

**Key Differentiator**: 247invites-style multi-page editor with instant preview generation and WhatsApp integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## Current Build Status (Nov 19, 2024)

### ✅ COMPLETED:
1. Replit Auth integration installed (login/signup with Google, GitHub, Email)
2. PostgreSQL database provisioned
3. Object Storage integration installed (for user photo uploads + template assets)
4. Package dependencies installed (openid-client, memoizee, @google-cloud/storage)

### 🔨 IN PROGRESS:
- Database schema design for wedding invite platform
- Core infrastructure files (replitAuth.ts, objectStorage.ts, storage.ts)

### ⏳ TODO (Manual Steps Required):
1. **Object Storage Bucket Setup**: Create bucket via Replit UI, set PUBLIC_OBJECT_SEARCH_PATHS and PRIVATE_OBJECT_DIR env vars
2. **After Effects API**: External service for video rendering (user must provide API endpoint)
3. **Razorpay Integration**: User must provide RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
4. **WhatsApp Business API**: Optional - user must set up Meta Business account + API keys

## System Architecture

### Frontend Architecture
**Technology Stack**: React with TypeScript, Vite build tool, Wouter for routing, TanStack Query for server state management.

**UI Framework**: Shadcn/ui component library (New York style variant) built on Radix UI primitives with Tailwind CSS for styling. The design system emphasizes a cinematic, premium aesthetic with:
- Typography: Playfair Display (serif headings), Inter (body text), Cormorant Garamond (decorative accents)
- Custom color scheme supporting light/dark modes with HSL-based theming
- Responsive grid layouts optimized for template browsing and cultural showcase

**Component Architecture**: 
- Presentational components for templates, categories, cultures, testimonials
- SEO component for dynamic meta tag management
- Reusable card components (TemplateCard, CategoryCard, CultureCard) for consistent UI patterns
- Form handling via React Hook Form with Zod validation

**Routing Structure**: Multi-page application with dedicated routes for:
- Template browsing and detail pages
- Category-specific landing pages (wedding, engagement, baby, corporate)
- Culture-specific pages with SEO-optimized slugs
- Country-based template discovery
- Marketing pages (pricing, how-it-works, blog, enterprise, about, contact, FAQ)

### Backend Architecture
**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful endpoints for:
- Template retrieval with filtering by category, culture, and style (`/api/templates`)
- Individual template lookup by slug (`/api/templates/:slug`)
- Contact form submissions (`/api/contact`)
- Article/blog content (`/api/articles`)

**Data Storage Strategy**: Currently using in-memory storage (MemStorage class) with seed data for templates, contacts, and articles. The architecture abstracts storage behind an IStorage interface, enabling future migration to persistent database solutions.

**Request/Response Handling**: JSON-based API with error handling, request logging middleware, and validation using Zod schemas. Raw body capture for potential webhook integrations.

### Database & Data Models
**Schema Definition**: Drizzle ORM configured for PostgreSQL with type-safe schema definitions in `/shared/schema.ts`.

**Core Entities**:
- **Templates**: Video invitation templates with fields for title, slug, category, culture, style, duration, orientation, media URLs, pricing, and premium status
- **Contacts**: Form submissions capturing name, email, subject, message, phone
- **Articles**: Blog content with title, slug, excerpt, content, author, category, publish date, and media

**Schema Validation**: Zod schemas generated from Drizzle tables via drizzle-zod for runtime validation and type inference.

**Migration Strategy**: Drizzle Kit configured for schema migrations with PostgreSQL dialect. Database URL expected via environment variable `DATABASE_URL`.

### Design System Implementation
**Premium Cinematic Aesthetic**: Design guidelines document specifies Airbnb-inspired card layouts, Netflix-style video-first interface, and luxury wedding platform aesthetics. Key principles:
- Generous whitespace and elegant animations
- Video-centric layouts with aspect ratios optimized for portrait mobile formats (9:16)
- Cultural authenticity in design elements
- Professional polish signaling high-quality output

**Responsive Design**: Mobile-first approach with breakpoints at 768px (md), 1024px (lg), 1280px (xl). Spacing scale using Tailwind units (4, 6, 8, 12, 16, 20, 24, 32).

**Typography Hierarchy**: Structured from H1 Hero (text-6xl/7xl) down to Caption (text-sm), with semantic font family assignments for different content types.

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless UI primitives (@radix-ui/react-*) for accessible components including dialogs, dropdowns, accordions, tooltips, navigation menus
- **Shadcn/ui**: Pre-built component variants configured in components.json
- **Lucide React**: Icon library for consistent iconography

### Data Management
- **TanStack Query (React Query)**: Server state management, caching, and data fetching with custom query client configuration
- **React Hook Form**: Form state management with Zod resolver integration
- **Zod**: Runtime type validation and schema definition

### Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migration support
- **@neondatabase/serverless**: PostgreSQL driver compatible with serverless environments
- **Drizzle Zod**: Integration layer for generating Zod schemas from Drizzle tables

### Styling & Theming
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Class Variance Authority (CVA)**: Type-safe variant system for component styling
- **clsx & tailwind-merge**: Utility for conditional class merging

### Development Tools
- **Vite**: Build tool and dev server with React plugin
- **TypeScript**: Type safety across client, server, and shared code
- **ESBuild**: Production build bundler for server code
- **TSX**: TypeScript execution for development server

### Asset Management
Generated images stored in `/attached_assets/generated_images/` directory, referenced via Vite's asset import system with `@assets` alias.

### Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express sessions (prepared for authentication implementation)

### Additional Libraries
- **date-fns**: Date formatting and manipulation
- **embla-carousel-react**: Carousel/slider functionality for template showcases
- **cmdk**: Command palette component (likely for search/navigation)
- **wouter**: Lightweight routing library (~1.2KB alternative to React Router)