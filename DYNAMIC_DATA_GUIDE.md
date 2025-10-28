# Dynamic Data Integration Guide

This document provides step-by-step instructions for transitioning from hardcoded data to dynamic API integration in the Job Board application.

## 1. API Configuration

### Environment Variables
Create or update the `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com/api
# For local development: http://localhost:3001/api
```

## 2. API Service Layer

Create a new file at `frontent/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function fetchJobs(params?: Record<string, string>): Promise<ApiResponse<Job[]>> {
  try {
    const query = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/jobs?${query}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    return { data: [], error: error.message };
  }
}

export async function fetchJobById(id: string): Promise<ApiResponse<Job>> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
    const data = await response.json();
    return { data };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

// Add other API calls as needed
```

## 3. Update Components

### Job List Component
Update your job listing component to use the API:

```typescript
import { useEffect, useState } from 'react';
import { fetchJobs } from '@/lib/api';
import { JobCard } from './job-card';

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      const { data, error } = await fetchJobs();
      if (error) {
        setError('Failed to load jobs');
        console.error(error);
      } else {
        setJobs(data);
      }
      setLoading(false);
    };

    loadJobs();
  }, []);

  if (loading) return <div>Loading jobs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} {...job} />
      ))}
    </div>
  );
}
```

## 4. Backend API Endpoints

Ensure your backend has the following endpoints:

### GET /api/jobs
Returns a list of jobs with optional query parameters for filtering.

**Query Parameters:**
- `search`: Text search in job title/description
- `location`: Filter by location
- `type`: Job type (full-time, part-time, etc.)
- `skills`: Comma-separated list of required skills

**Response:**
```json
{
  "data": [
    {
      "id": "123",
      "companyLogo": "/path/to/logo.png",
      "role": "Senior Developer",
      "company": "Tech Corp",
      "location": "Remote",
      "type": "Full-time",
      "skills": ["React", "Node.js", "TypeScript"],
      "matchPercent": 85
    }
  ]
}
```

### GET /api/jobs/:id
Returns detailed information about a specific job.

**Response:**
```json
{
  "data": {
    "id": "123",
    "role": "Senior Developer",
    "company": "Tech Corp",
    "location": "Remote",
    "type": "Full-time",
    "description": "Job description...",
    "requirements": ["5+ years experience", "Bachelor's degree"],
    "skills": ["React", "Node.js", "TypeScript"],
    "postedDate": "2023-01-15",
    "applicationDeadline": "2023-02-15"
  }
}
```

## 5. Error Handling

Implement error boundaries and loading states:

```typescript
// frontent/components/error-boundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong. Please try again later.</div>;
    }

    return this.props.children;
  }
}
```

## 6. Testing the Integration

1. Start your backend server
2. Update the `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
3. Run the frontend: `npm run dev`
4. Verify data is being loaded from the API
5. Test error scenarios (network errors, invalid responses)

## 7. Performance Optimization

### Client-side Caching
Consider implementing React Query or SWR for data fetching and caching:

```bash
npm install @tanstack/react-query
```

```typescript
// frontent/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Image Optimization
For company logos and other images, use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src={companyLogo}
  alt={`${company} logo`}
  width={32}
  height={32}
  className="rounded-md object-cover"
  unoptimized={companyLogo.startsWith('http')}
/>
```

## 8. Security Considerations

1. **CORS**: Configure CORS on your backend to only allow requests from trusted domains
2. **Rate Limiting**: Implement rate limiting on your API endpoints
3. **Input Validation**: Validate all user inputs on both client and server
4. **HTTPS**: Always use HTTPS in production
5. **API Keys**: Store API keys and sensitive information in environment variables

## 9. Deployment

### Frontend
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

### Backend
- Vercel Serverless Functions
- AWS Lambda
- Heroku
- DigitalOcean App Platform

## 10. Monitoring and Logging

1. **Frontend Error Tracking**:
   - Sentry
   - LogRocket

2. **API Monitoring**:
   - New Relic
   - Datadog
   - AWS CloudWatch

## Support

For any issues or questions, please contact [Your Contact Information].
