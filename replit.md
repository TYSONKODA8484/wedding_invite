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

## Editor Page - Page-by-Page Editing with Zoom Controls (Nov 20, 2024 - COMPLETE)

### ✅ Professional Page Viewer Implementation

**Layout:**
- 3-column professional editor layout:
  - Left sidebar: Page thumbnails (clickable navigation)
  - Center: PageViewer component displaying selected page
  - Right sidebar: Edit fields for current page

**PageViewer Features:**
- Displays individual pages (not continuous video playback)
- Background image rendering from page media array
- **Zoom Controls:**
  - Zoom In (+25% increments, up to 200%)
  - Zoom Out (-25% decrements, min 100%)
  - Reset to 100%
  - Live zoom percentage display
- **Pan & Zoom Interaction:**
  - When zoomed > 100%, click and drag to pan around the page
  - Smooth transform animations
  - Reset pan on zoom reset
- **Viewport Fitting:**
  - Page fits within viewport without scrolling (default 100% zoom)
  - Responsive sizing: `min(90vh * 9/16, 600px)` maintains 9:16 aspect ratio
  - Max height: 85vh ensures controls are always visible
- **Page Navigation:**
  - Click page thumbnails in left sidebar
  - Use Previous/Next buttons below viewer
  - Page selection updates center preview instantly

**Component Architecture:**
- `PageViewer.tsx` - Zoomable page preview component
- Accepts page object with: `id`, `pageNumber`, `pageName`, `media[]`, `editableFields`
- Background image priority: `position='background'` → first image → thumbnailUrl fallback
- CSS transform-based zoom with transform-origin center
- Mouse event handlers for pan interaction

**User Experience:**
- Users edit templates page-by-page, not as continuous video
- Each page fully visible without scrolling (at default zoom)
- Zoom in to see details, pan to navigate when zoomed
- Instant page switching via thumbnails or nav buttons
- Professional editor matching 247 invites design pattern

### Video Preview on Template Cards
Template cards feature an interactive video preview: on hover, a muted, looped video plays, and on click, users can toggle play/pause. This provides instant visual engagement without navigating away from the templates page.

### Media Storage
Media files, specifically template images and videos, are stored using Replit Object Storage. These files are served via a secured API endpoint (`/api/media/Ind/:filename`), ensuring they are not publicly exposed while still being efficiently streamed with proper content headers, caching, and error handling.

## Preview Workflow - Auth-Gated Preview with Auto-Save (Nov 21, 2024 - COMPLETE)

### ✅ Robust Preview Flow Implementation

**Key Features:**
- Auth-gated preview: Users must be logged in to preview customizations
- Auto-save: All customization data (field values + image previews) saves to database BEFORE showing generation screen
- Seamless auth flow: After login, preview automatically proceeds without user needing to click Preview again
- Race condition handling: Uses `fetchQuery` to guarantee fresh user data before proceeding
- Error handling: Comprehensive error messages and logging throughout the flow

**Preview Button Flow:**
1. User clicks "Preview" → `handlePreview()` called
2. Check authentication:
   - If not logged in and not currently verifying → show auth modal, set `pendingPreview=true`
   - If logged in → proceed to step 3
3. Prevent duplicate requests: Guard with `saveProjectMutation.isPending`
4. Save to database: Call `saveProjectMutation.mutateAsync()` (POST/PUT `/api/projects`)
   - Collects all field values and image previews
   - Sets project status to `"preview_requested"`
   - Returns saved project with ID
5. Show generation loading screen with 0-100% progress
6. On completion: Show preview modal, enable download button

**Authentication Success Flow:**
1. User logs in via AuthModal → `handleAuthSuccess()` called
2. Close auth modal, set `isAuthVerifying=true` flag
3. Force fetch user data using `queryClient.fetchQuery()`:
   - Ensures we have actual user data (not undefined from refetch)
   - Includes credentials in request
4. Wait 100ms for localStorage token persistence
5. If `pendingPreview` was set:
   - Call `handlePreview(freshUserData)` with verified user
   - Reset `pendingPreview=false`
6. Always reset `isAuthVerifying=false` in finally block

**Critical Implementation Details:**
- Uses `queryClient.fetchQuery()` instead of `refetchQueries()` to guarantee user data
- `isAuthVerifying` state prevents auth modal from reopening during verification
- `verifiedUser` parameter in `handlePreview()` eliminates stale closure state
- Token persistence wait ensures `saveProjectMutation` has auth token
- All state resets in finally blocks to prevent stuck states

**Database Operations:**
- POST `/api/projects` - Creates new project if `projectId` is null
- PUT `/api/projects/:id` - Updates existing project
- Status flow: `"draft"` → `"preview_requested"` → (future: `"rendering"` → `"completed"`)
- Customization JSON includes:
  - `fieldValues`: All text/date inputs keyed by `pageId_fieldId`
  - `imagePreviews`: All uploaded images as base64 data URLs

**Component State Management:**
- `showAuthModal`: Controls AuthModal visibility
- `pendingPreview`: Tracks if preview should auto-trigger after login
- `isAuthVerifying`: Prevents modal reopening during auth verification
- `showPreviewLoading`: Controls generation loading screen
- `previewProgress`: 0-100% progress during generation
- `showPreviewModal`: Controls preview player modal
- `downloadEnabled`: Enables download button after preview complete

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