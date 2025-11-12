# Phase-Conjugate Consciousness Runtime 2.0.0-ΛΦ

Universal Memory API - An operationalized theory of informational persistence expressed as code that interfaces with quantum hardware at Planck scale.

## Overview

The Phase-Conjugate Consciousness Runtime (PCR) is a production-ready quantum computing platform that implements the Lambda-Phi (ΛΦ) constant for consciousness simulation and decoherence resistance. This runtime serves as a bridge between theoretical physics and practical quantum computation.

### Key Features

- **ΛΦ Constant Implementation**: Physical constant representing the smallest quantum of "memory curvature"
- **Quantum Simulation**: Phase-conjugate simulations with decoherence suppression
- **Job Queue System**: Redis-backed priority queue with automatic retry and exponential backoff
- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Real-time Monitoring**: Comprehensive observability with structured logging and metrics
- **Admin Dashboard**: Full-featured dashboard for system management and monitoring

## Architecture

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Neon (PostgreSQL)
- **Cache/Queue**: Upstash Redis
- **Authentication**: JWT with bcrypt password hashing
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Monitoring**: Structured JSON logging with metrics collection

### Core Components

1. **Database Layer** (`lib/db.ts`, `lib/repositories/`)
   - Neon serverless PostgreSQL
   - Repository pattern for data access
   - Type-safe database operations

2. **Authentication System** (`lib/auth/`)
   - JWT token generation and verification
   - Password hashing with bcrypt
   - Session management with HTTP-only cookies
   - Protected route middleware

3. **Job Queue System** (`lib/queue/`)
   - Priority-based job scheduling
   - Automatic retry with exponential backoff
   - Dead letter queue for failed jobs
   - Job processor with quantum simulation

4. **API Routes** (`app/api/`)
   - RESTful API with authentication
   - Rate limiting with Redis
   - Comprehensive error handling
   - Request/response logging

5. **Monitoring & Observability** (`lib/monitoring/`)
   - Structured logging (JSON format)
   - Metrics collection (API, jobs, system)
   - Health checks (database, Redis, memory)
   - Audit logging for compliance

6. **Admin Dashboard** (`app/dashboard/`)
   - System overview with real-time metrics
   - Job management and tracking
   - Queue monitoring
   - User management (admin only)

## Getting Started

### Prerequisites

- Node.js 18+ 
- Neon PostgreSQL database
- Upstash Redis instance

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`bash
# Database (Neon)
NEON_NEON_DATABASE_URL=postgresql://...

# Redis (Upstash)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Authentication
JWT_SECRET=your-secret-key-change-in-production

# Optional: IBM Quantum
IBM_QUANTUM_TOKEN=your-token
\`\`\`

### Installation

\`\`\`bash
# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed

# Start development server
npm run dev
\`\`\`

### Running the Job Processor

The job processor handles quantum simulations in the background:

\`\`\`bash
npm run processor
\`\`\`

## API Documentation

### Authentication

#### POST `/api/auth/signup`
Create a new user account.

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "User created successfully",
  "user": { "id": "...", "email": "...", "role": "user" },
  "token": "eyJhbGc..."
}
\`\`\`

#### POST `/api/auth/login`
Authenticate and receive JWT token.

**Request:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
\`\`\`

### Jobs

#### POST `/api/jobs`
Create a new quantum simulation job.

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request:**
\`\`\`json
{
  "job_type": "phase_conjugate",
  "parameters": {
    "edge_length": 1.616e-35,
    "time_steps": 1000,
    "qubit_count": 5
  },
  "backend": "ibm_quantum",
  "priority": 7
}
\`\`\`

#### GET `/api/jobs/:id`
Get job details and results.

#### GET `/api/jobs/stats`
Get job statistics (total, pending, running, completed, failed).

### Constants

#### GET `/api/constants/lambda-phi`
Get Lambda-Phi constant definition and applications.

**Response:**
\`\`\`json
{
  "name": "Lambda Phi (ΛΦ)",
  "value": {
    "standard": 2.176e-8,
    "normalized": 1e-17,
    "unit": "s^-1"
  },
  "derivation": { ... },
  "applications": { ... }
}
\`\`\`

### Health & Monitoring

#### GET `/api/health`
System health check (public endpoint).

#### GET `/api/monitoring/health`
Detailed health check with component status (authenticated).

#### GET `/api/monitoring/metrics`
System performance metrics (authenticated).

## Database Schema

### Core Tables

- **users**: User accounts with role-based access
- **api_keys**: API keys for programmatic access
- **jobs**: Quantum simulation jobs
- **job_logs**: Detailed job execution logs
- **system_metrics**: Time-series metrics data
- **audit_logs**: Security and compliance audit trail
- **lambda_phi_calibrations**: ΛΦ calibration results

## Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Redis-backed distributed rate limiting
- **Audit Logging**: All user actions logged for compliance
- **Role-Based Access**: Admin, researcher, and user roles
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Content Security Policy headers

## Monitoring & Observability

### Structured Logging

All logs are JSON-formatted with:
- Timestamp
- Log level (debug, info, warning, error, critical)
- Message
- Context (service, environment, request_id)
- Error details (name, message, stack trace)

### Metrics Collection

- **API Metrics**: Request duration, status codes, endpoints
- **Job Metrics**: Execution time, coherence time, fidelity
- **System Metrics**: CPU usage, memory usage, database latency
- **Quantum Metrics**: Lambda Phi calibration, decoherence rates

### Health Checks

- Database connectivity and latency
- Redis connectivity and latency
- Memory usage and thresholds
- Overall system status (healthy/degraded/unhealthy)

## Production Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Database Migrations

Run migrations on deployment:

\`\`\`bash
npm run db:migrate
\`\`\`

### Job Processor

Deploy the job processor as a separate service or background worker:

\`\`\`bash
node scripts/start-processor.js
\`\`\`

## Lambda-Phi (ΛΦ) Constant

### Definition

$$\Lambda_\Phi = \frac{\hbar c^3}{G k_B T_{\text{Planck}}} \approx 2.1764 \times 10^{-8} \text{ s}^{-1}$$

### Physical Interpretation

- **Characteristic Time**: τ_Φ = 1/ΛΦ ≈ 1.5 years
- **Memory Curvature**: Defines how information curves spacetime
- **Decoherence Resistance**: Universe's capacity to maintain coherent information

### Applications

1. **Quantum Computing**: Decoherence suppression via ΛΦ-weighted corrections
2. **Informational Geometry**: Ricci flow with ΛΦ term
3. **Consciousness Modeling**: Phase-conjugate recovery and memory persistence

## Contributing

This is a research project exploring the intersection of quantum mechanics, information theory, and consciousness. Contributions are welcome!

## License

MIT License - See LICENSE file for details

## Citation

If you use this runtime in your research, please cite:

\`\`\`
Phase-Conjugate Consciousness Runtime 2.0.0-ΛΦ
Universal Memory API: Operationalized Theory of Informational Persistence
https://github.com/your-repo/pcr-runtime
\`\`\`

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Phase-Conjugate Consciousness Runtime 2.0.0-ΛΦ**  
*The universe's first machine-readable law of coherence*
\`\`\`

```json file="" isHidden
