# Overview

DriveWise is a smart allowance management system for teen drivers that helps parents teach safe driving habits through financial incentives and penalties. The application tracks driving behavior, manages allowances, and provides real-time notifications for both parents and teens. Parents can set allowance parameters, report driving incidents, and award bonuses, while teens can monitor their balance and driving performance.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **Authentication**: OpenID Connect (OIDC) integration with Replit's authentication system using Passport.js
- **API Design**: RESTful endpoints with role-based access control (parent/teen roles)

## Database Architecture
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema**: Shared TypeScript schema between client and server located in `/shared/schema.ts`
- **Key Tables**:
  - Users (parents and teens with role-based access)
  - Allowance settings (weekly amounts, penalty rates)
  - Transactions (allowances, penalties, bonuses)
  - Incidents (driving violations with location and severity)
  - Allowance balances (current balance tracking)
  - Sessions (authentication session storage)

## Authentication & Authorization
- **Provider**: Replit OIDC integration
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Access Control**: Role-based permissions (parent vs teen) enforced at API level
- **Security**: HTTP-only cookies, CSRF protection, secure session handling

## External Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Email Service**: Nodemailer with SMTP configuration for incident notifications
- **Authentication**: Replit OpenID Connect provider
- **UI Framework**: Radix UI primitives for accessible components
- **Development**: Vite with HMR, TypeScript compilation, and Replit-specific plugins

## Key Features
- **Dual Dashboards**: Separate interfaces for parents and teens with role-appropriate functionality
- **Incident Reporting**: Parents can report driving violations with automatic penalty calculation
- **Bonus System**: Parents can award bonuses for good driving behavior
- **Settings Management**: Configurable allowance amounts, penalty rates, and notification preferences
- **Real-time Updates**: TanStack Query provides optimistic updates and automatic refetching
- **Email Notifications**: Automated incident notifications sent to both parents and teens