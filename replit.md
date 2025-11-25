# WeddingInvite.ai

## Overview
WeddingInvite.ai is a video invitation platform inspired by 247invites.com, designed for the Indian and Arabic/Middle Eastern wedding markets. It enables users to customize multi-page video invitation templates, preview watermarked versions, make payments, and receive full-quality videos via WhatsApp. The business model is pay-per-template, offering a cinematic, premium experience for culturally specific wedding invitations with features like a multi-page editor and WhatsApp integration.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The frontend is built with React and TypeScript, using Vite, Wouter for routing, and TanStack Query for server state management. The UI features Shadcn/ui (New York style) based on Radix UI and Tailwind CSS, focusing on a cinematic, premium aesthetic with specific typography, HSL-based theming, and a mobile-first responsive design. Key features include an interactive video preview on template cards and an editor with page-by-page editing, zoom controls, and pan functionality.

### Backend
The backend is an Express.js server with TypeScript, providing RESTful APIs for template management, contact forms, and article content. It uses Drizzle ORM with PostgreSQL for data storage and Zod for validation. Media files are stored and served via Replit Object Storage.

### Database
The project uses Drizzle ORM with PostgreSQL, featuring schemas for `templates`, `contacts`, `articles`, `template_pages`, `customizations`, `orders`, `payments`, `downloads`, `analytics_events`, and `sessions`. Drizzle Kit handles schema migrations.

### Authentication
A dual authentication system supports traditional email/password (JWT-based with bcrypt) and Google Sign-In using Firebase Auth with a redirect flow. Firebase Admin SDK verifies Google tokens server-side. The system ensures consistent user payload structures across all authentication methods and handles auth-gated previews with auto-save functionality.

### Template Filtering System
The Templates page (`/templates`, `/templates/wedding`, `/templates/birthday`) features a comprehensive filtering system inspired by 247invites.com:

**Quick Filter Chips:**
- Wedding page: Save the Date, Engagement Ceremony, Hindu Wedding, South Indian, Marathi, Rajasthani, Jain, Punjabi, Muslim, Christian, Bengali
- Birthday page: Birthday Invites, Kids Birthday, Adult Milestones

**Filter Sheet Panel (left-side slide-out):**
- Type: Video, Card
- Sort by: Popular, Newest, Low to High, High to Low
- Photo: With Photo, Without Photo
- Card Orientation: Portrait, Landscape

**Features:**
- URL state sync for shareable filtered views
- Active filters display with individual remove buttons
- Clear all functionality
- Server-side filtering via API query params

**Database Columns:**
- `subcategory`: Primary subcategory for quick chip filtering
- `popularityScore`: Numeric score for Popular sort

### My Templates Page
The My Templates page (`/my-templates`) displays user's projects in two sections:
- **Paid Templates**: Sorted by `paidAt` (newest first), shows View/Download/Share buttons
- **Generated Templates**: Sorted by `updatedAt` (newest first), shows Edit/View/Download buttons

Features:
- **VideoPreviewModal**: Responsive video preview adapting to portrait/landscape orientation
- **Actual File Download**: Uses `finalUrl` or `previewUrl` for paid template downloads
- **Cross-Platform Share**: Web Share API with clipboard fallback for all devices

### Design System & SEO
The design emphasizes a premium, cinematic aesthetic with generous whitespace, elegant animations, and video-centric layouts optimized for mobile. Culturally authentic elements are incorporated. SEO targets India, UAE, and Saudi Arabia with an enhanced `SEOHead` component, WhatsApp-optimized Open Graph tags, mobile-first meta tags, `hreflang`, and comprehensive schema markup.

## External Dependencies

### Authentication
- **Firebase**: Client SDK for Google Sign-In.
- **Firebase Admin SDK**: Server-side token verification.
- **openid-client**: OpenID Connect client.

### UI/UX
- **Radix UI**: Headless UI primitives.
- **Shadcn/ui**: Pre-built component library.
- **Lucide React**: Icon library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Class Variance Authority (CVA)**: Type-safe variant system.
- **clsx & tailwind-merge**: Class utility functions.
- **embla-carousel-react**: Carousel functionality.
- **cmdk**: Command palette component.

### Data & State Management
- **TanStack Query (React Query)**: Server state management.
- **React Hook Form**: Form state management with Zod resolver.
- **Zod**: Runtime type validation.

### Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM.
- **@neondatabase/serverless**: PostgreSQL driver.
- **Drizzle Zod**: Zod schema generation from Drizzle.

### Development & Utilities
- **Vite**: Build tool and dev server.
- **TypeScript**: Type safety.
- **ESBuild**: Production build bundler.
- **TSX**: TypeScript execution for development.
- **wouter**: Lightweight routing library.
- **date-fns**: Date manipulation.
- **memoizee**: Memoization utility.

### Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express.
- **@replit/object-storage**: Replit Object Storage client.
- **@google-cloud/storage**: Google Cloud Storage client.
- **@uppy/**: File upload components.

### Critical Integrations
- **Razorpay**: Payment gateway.
- **After Effects API**: External video rendering service.
- **WhatsApp Business API**: For video delivery.