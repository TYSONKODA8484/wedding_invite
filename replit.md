# WeddingInvite.ai

## Overview

WeddingInvite.ai is a video invitation platform inspired by 247invites.com, specifically targeting the Indian and Arabic/Middle Eastern wedding markets. It enables users to browse templates, customize multi-page invitations with text and photos, preview watermarked low-quality videos, make payments, and download full-quality videos with WhatsApp delivery. The business model is pay-per-template, with prices ranging from ₹1,200-₹2,900. Its key differentiator is a multi-page editor with instant preview generation and WhatsApp integration for video delivery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript, using Vite for building, and Wouter for routing. TanStack Query manages server state. The UI leverages Shadcn/ui (New York style) built on Radix UI primitives and Tailwind CSS. The design emphasizes a cinematic, premium aesthetic with specific typography (Playfair Display, Inter, Cormorant Garamond), HSL-based theming, and responsive grid layouts. Component architecture includes presentational components, an SEO component for dynamic meta tags, reusable cards, and React Hook Form with Zod validation for forms. Routing supports template browsing, detail pages, category-specific landings, and focused market cultures (Indian, UAE, Saudi Arabian weddings).

### Backend Architecture
The backend is an Express.js server with TypeScript. It provides RESTful API endpoints for template management, contact form submissions, and article content. Data storage currently uses an in-memory solution (MemStorage class) with seed data, abstracting storage behind an `IStorage` interface for future database migration. The API uses JSON for requests/responses, includes error handling, logging middleware, and Zod for validation.

### Database & Data Models
The project uses Drizzle ORM with PostgreSQL. The schema defines core entities like `templates`, `contacts`, and `articles`, with `template_pages`, `customizations`, `orders`, `payments`, `downloads`, `analytics_events`, and `sessions` also being core. Zod schemas are generated from Drizzle tables for validation. Drizzle Kit is configured for schema migrations.

### Design System Implementation
The design aims for a premium, cinematic aesthetic inspired by Airbnb, Netflix, and luxury wedding platforms. It prioritizes generous whitespace, elegant animations, video-centric layouts optimized for portrait mobile formats (9:16), and culturally authentic design elements. A mobile-first responsive design approach is used with Tailwind CSS breakpoints and spacing scale. Typography is structured hierarchically with semantic font family assignments.

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless UI primitives for accessible components.
- **Shadcn/ui**: Pre-built component variants.
- **Lucide React**: Icon library.

### Data Management
- **TanStack Query (React Query)**: Server state management, caching, and data fetching.
- **React Hook Form**: Form state management with Zod resolver.
- **Zod**: Runtime type validation and schema definition.

### Database & ORM
- **Drizzle ORM**: Type-safe PostgreSQL ORM.
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments.
- **Drizzle Zod**: Integration for generating Zod schemas from Drizzle tables.

### Styling & Theming
- **Tailwind CSS**: Utility-first CSS framework.
- **Class Variance Authority (CVA)**: Type-safe variant system for component styling.
- **clsx & tailwind-merge**: Utilities for conditional class merging.

### Development Tools
- **Vite**: Build tool and dev server.
- **TypeScript**: Type safety.
- **ESBuild**: Production build bundler for server code.
- **TSX**: TypeScript execution for development server.

### Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express.

### Additional Libraries
- **date-fns**: Date formatting and manipulation.
- **embla-carousel-react**: Carousel functionality.
- **cmdk**: Command palette component.
- **wouter**: Lightweight routing library.
- **@google-cloud/storage**: Google Cloud Storage client.
- **@uppy/\***: File upload components.
- **openid-client**: OpenID Connect client.
- **memoizee**: Memoization utility.

### Critical Integrations (Manual Setup Required)
- **Object Storage**: Google Cloud Storage or compatible service for public and private assets.
- **Razorpay**: Payment gateway for transaction processing.
- **After Effects API**: External service for video rendering (preview and final quality).
- **WhatsApp Business API**: For video delivery to users.