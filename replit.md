# WeddingInvite.ai

## Overview
WeddingInvite.ai is a video invitation platform inspired by 247invites.com, targeting the Indian and Arabic/Middle Eastern wedding markets. It allows users to browse and customize multi-page video invitation templates, preview watermarked versions, make payments, and download full-quality videos with WhatsApp delivery. The business model is pay-per-template. Key features include a multi-page editor with instant preview generation and WhatsApp integration for video delivery, aiming to provide a cinematic, premium experience for culturally specific wedding invitations.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, using Vite for building and Wouter for routing. TanStack Query manages server state. The UI leverages Shadcn/ui (New York style) built on Radix UI primitives and Tailwind CSS, emphasizing a cinematic, premium aesthetic with specific typography and HSL-based theming. It features a mobile-first, responsive design.

### Backend Architecture
The backend is an Express.js server with TypeScript, providing RESTful API endpoints for template management, contact forms, and article content. It uses Drizzle ORM with PostgreSQL for data storage, with Zod for validation across API requests and database schemas.

### Database & Data Models
The project utilizes Drizzle ORM with PostgreSQL. The schema includes core entities like `templates`, `contacts`, `articles`, `template_pages`, `customizations`, `orders`, `payments`, `downloads`, `analytics_events`, and `sessions`. Drizzle Kit is used for schema migrations.

### Design System Implementation
The design aims for a premium, cinematic aesthetic, prioritizing generous whitespace, elegant animations, and video-centric layouts optimized for portrait mobile formats. It incorporates culturally authentic design elements and a mobile-first responsive approach.

### SEO Implementation
The SEO strategy is comprehensive, targeting India as the primary market, followed by UAE and Saudi Arabia. It includes an enhanced `SEOHead` component supporting multi-schema, WhatsApp-optimized Open Graph tags, mobile-first meta tags, and `hreflang` for bilingual content. Homepage and country-specific landing pages are optimized with relevant keywords, schema markup (Organization, WebSite, FAQPage, CollectionPage, BreadcrumbList), and locale settings. A sitemap.xml and robots.txt are deployed to guide search engines.

### Video Preview on Template Cards
Template cards feature an interactive video preview: on hover, a muted, looped video plays, and on click, users can toggle play/pause. This provides instant visual engagement without navigating away from the templates page.

### Media Storage
Media files, specifically template images and videos, are stored using Replit Object Storage. These files are served via a secured API endpoint (`/api/media/Ind/:filename`), ensuring they are not publicly exposed while still being efficiently streamed with proper content headers, caching, and error handling.

## External Dependencies

### UI/UX
- **Radix UI**: Headless UI primitives.
- **Shadcn/ui**: Pre-built component variants.
- **Lucide React**: Icon library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Class Variance Authority (CVA)**: Type-safe variant system.
- **clsx & tailwind-merge**: Utilities for class merging.
- **embla-carousel-react**: Carousel functionality.
- **cmdk**: Command palette component.

### Data & State Management
- **TanStack Query (React Query)**: Server state management.
- **React Hook Form**: Form state management with Zod resolver.
- **Zod**: Runtime type validation.

### Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM.
- **@neondatabase/serverless**: PostgreSQL driver.
- **Drizzle Zod**: Zod schema generation from Drizzle tables.

### Development & Utilities
- **Vite**: Build tool and dev server.
- **TypeScript**: Type safety.
- **ESBuild**: Production build bundler for server code.
- **TSX**: TypeScript execution for development server.
- **wouter**: Lightweight routing library.
- **date-fns**: Date formatting and manipulation.
- **memoizee**: Memoization utility.

### Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express.
- **@replit/object-storage**: Replit Object Storage client.
- **@google-cloud/storage**: Google Cloud Storage client (for object storage, though Replit Object Storage is primarily used).
- **@uppy/\***: File upload components.

### Authentication
- **openid-client**: OpenID Connect client.

### Critical Integrations
- **Razorpay**: Payment gateway.
- **After Effects API**: External service for video rendering.
- **WhatsApp Business API**: For video delivery to users.