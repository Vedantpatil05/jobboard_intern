# Job Board Application - Project Overview

## Project Structure

### Frontend (`/frontent`)
- **Components**: Reusable UI components (e.g., `job-card.tsx`)
- **App**: Main application routes and pages
  - `/home`: Main job listing page
  - `/profile`: User profile and preferences
- **Hooks**: Custom React hooks for shared logic
- **Lib**: Utility functions and API clients
- **Types**: TypeScript type definitions
- **Public**: Static assets

### Backend (`/backend`)
- **Routes**: API endpoints
  - `/match`: Job matching logic
  - `/stats`: Analytics and statistics
  - `/user`: User management
- **Services**: Business logic
  - `embeddings.ts`: Text embedding generation
  - `similarity.ts`: Similarity calculations
  - `mergeUserData.ts`: Data processing
- **Models**: Data models and database schemas

## Data Flow

1. **Initial Load**
   - Frontend loads and fetches job listings
   - User data is retrieved if authenticated

2. **Job Search/Filter**
   - User interacts with search/filter components
   - API requests are sent to backend with query parameters
   - Backend processes request and returns filtered results

3. **Job Details**
   - User selects a job
   - Detailed job information is fetched
   - Related jobs are suggested based on similarity

4. **User Actions**
   - Save/unsave jobs
   - Apply for positions
   - Update profile/preferences

## Key Components

### Job Card (`components/job-card.tsx`)
- Displays job listing summary
- Expandable details view
- Save/unsave functionality
- Skills and requirements display

### API Integration
- Currently using hardcoded data
- Ready for dynamic API integration (see DYNAMIC_DATA_GUIDE.md)

## State Management
- React Context for global state
- Local component state for UI interactions
- API state management (loading, error, success states)

## Authentication
- JWT-based authentication
- Protected routes
- Role-based access control (if applicable)

## Environment Configuration
- Environment variables for API endpoints
- Feature flags
- Third-party service configurations

## Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Build for production: `npm run build`

## Deployment
- Frontend: Static hosting (Vercel, Netlify, etc.)
- Backend: Node.js server (Express)
- Database: [Specify database if applicable]

## Dependencies
- Frontend: React, Next.js, TypeScript, TailwindCSS
- Backend: Node.js, Express, [Add other backend deps]
