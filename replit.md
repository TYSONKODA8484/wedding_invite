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
- All Templates page (`/templates`): 
  - Categories: Wedding, Birthday, Anniversary, Engagement, Baby Shower, Housewarming, Corporate Events
  - Regions: India, UAE, Saudi Arabia, Gulf Region, South Asia (separated by visual divider)
- Wedding page: Save the Date, Engagement Ceremony, Hindu Wedding, South Indian, Marathi, Rajasthani, Jain, Punjabi, Muslim, Christian, Bengali, Arabic, Gulf Wedding
- Birthday page: Birthday Invites, Kids Birthday, Adult Milestones, First Birthday, Sweet 16

**Filter Sheet Panel (dropdown):**
- Type: Video, Card
- Sort by: Popular, Newest, Low to High, High to Low
- Photo: With Photo, Without Photo
- Card Orientation: Portrait, Landscape
- Region: India, UAE, Saudi Arabia, Gulf Region, South Asia

**Features:**
- URL state sync for shareable filtered views
- Active filters display with individual remove buttons
- Clear all functionality
- Server-side filtering via API query params
- Infinite scroll pagination with 25 templates per batch

**Database Columns:**
- `subcategory`: Primary subcategory for quick chip filtering
- `region`: Target region for templates (india, uae, saudi, gulf, south_asia)
- `popularityScore`: Numeric score for Popular sort

### My Templates Page
The My Templates page (`/my-templates`) displays user's projects in two sections:
- **Paid Templates**: Sorted by `paidAt` (newest first), shows View/Download/Share buttons
- **Generated Templates**: Sorted by `updatedAt` (newest first), shows Edit/View/Download buttons

Features:
- **VideoPreviewModal**: Responsive video preview adapting to portrait/landscape orientation
- **Actual File Download**: Uses type-specific URLs for downloads
- **Cross-Platform Share**: Web Share API with clipboard fallback for all devices

**Type-Specific URL Columns (December 2025):**
Projects now store URLs in type-specific database columns:
- `card_preview_url`: Preview image for card templates
- `card_final_url`: Final downloadable file for paid card templates
- `video_preview_url`: Preview video for video templates
- `video_final_url`: Final downloadable file for paid video templates

The PUT `/api/projects/:id` endpoint automatically routes `previewUrl`/`finalUrl` to the correct type-specific column based on template type (card vs video). This ensures proper file management for downloading and sharing.

### Music System (December 2025)
Video templates now include complete background music support:

**Database Schema:**
- `music` table: Stock music library with id, name, url, duration, category (wedding/birthday)
- `templates.defaultMusicId`: Links video templates to default background music
- `projects.customMusicUrl`: User-uploaded custom music stored per-project

**Stock Music Library (6 tracks in object storage):**
- Wedding: Epic Love Romantic, Hopeful Acoustic, Enchanted Music
- Birthday: Magical Orchestral, Orchestral Joy, Uplifting Corporate

**API Endpoints:**
- GET `/api/music` - Returns full music library
- GET `/api/music/:id` - Returns single music track details
- GET `/api/templates/:id` now includes `defaultMusic` object for video templates

**Editor UI (Complete):**
- Music button in header (visible only for video templates)
- Background Music modal with:
  - Stock music library browsable by category
  - Custom music upload via file input
  - Audio player with play/pause, progress bar, seek, mute controls
  - Duration display and track selection
- Proper memory cleanup for object URLs (using ref tracking)
- Playback error handling with state synchronization

### Design System & SEO
The design emphasizes a premium, cinematic aesthetic with generous whitespace, elegant animations, and video-centric layouts optimized for mobile. Culturally authentic elements are incorporated. SEO targets India, UAE, and Saudi Arabia with an enhanced `SEOHead` component, WhatsApp-optimized Open Graph tags, mobile-first meta tags, `hreflang`, and comprehensive schema markup.

### SEO Landing Pages (November 2025)
Comprehensive SEO landing page system targeting regional and category-specific search traffic:

**Regional Pages:**
- `/india` - India market with Hindi localization, market stats (10M+ weddings/year), popular styles (South Indian, Marathi, Punjabi, etc.), ceremonies
- `/uae` - UAE market with Arabic localization, market stats (50K+ weddings/year), Gulf-specific content
- `/saudi-arabia` - Saudi Arabia market with Arabic localization, premium positioning

**Category Pages:**
- `/wedding-invitation-video` - Wedding video invitations with feature highlights
- `/birthday-invitation-video` - Birthday video invitations
- `/wedding-invitation-card` - Digital wedding invitation cards
- `/birthday-invitation-card` - Digital birthday cards

**Combined Pages:**
All 12 combinations of region + category (e.g., `/india/wedding-invitation-video`, `/uae/birthday-invitation-card`)

**Features:**
- Dynamic content localization per region (market stats, currency symbols, ceremonies)
- Schema markup: CollectionPage, BreadcrumbList, FAQPage, Organization
- hreflang tags for language alternates (en-IN, ar-AE, ar-SA)
- Popular Searches internal linking for SEO juice distribution
- FAQ sections with structured data
- Template showcase with filtered results by region/category
- Market stats section with weddings/year and digital adoption metrics

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