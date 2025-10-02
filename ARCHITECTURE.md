# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Frontend (TypeScript)                             │  │
│  │  - Login/Register Pages                                  │  │
│  │  - Dashboard with Email/Accounts/Products Tabs          │  │
│  │  - Responsive UI                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Node.js/Express Backend                                 │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐       │  │
│  │  │ Controllers│  │ Middleware │  │   Routes    │       │  │
│  │  └────────────┘  └────────────┘  └─────────────┘       │  │
│  │                                                          │  │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐       │  │
│  │  │  Services  │  │   Models   │  │   Utils     │       │  │
│  │  └────────────┘  └────────────┘  └─────────────┘       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
         │              │              │              │
         │              │              │              │
         ▼              ▼              ▼              ▼
┌────────────┐  ┌─────────────┐  ┌──────────┐  ┌────────────┐
│ PostgreSQL │  │   OpenAI    │  │  Gmail   │  │  Outlook   │
│  Database  │  │     API     │  │   API    │  │    API     │
└────────────┘  └─────────────┘  └──────────┘  └────────────┘
```

## Component Architecture

### Frontend Components

```
src/
├── pages/
│   ├── Login.tsx           # User authentication
│   ├── Register.tsx        # User registration
│   └── Dashboard.tsx       # Main application interface
├── services/
│   ├── api.ts             # Axios configuration
│   ├── authService.ts     # Authentication API calls
│   ├── emailService.ts    # Email management API calls
│   ├── emailAccountService.ts  # Account management API calls
│   └── productService.ts  # Product catalog API calls
└── types/                 # TypeScript type definitions
```

### Backend Structure

```
src/
├── config/
│   └── database.js        # PostgreSQL configuration
├── models/
│   ├── User.js           # User model
│   ├── EmailAccount.js   # Email account model
│   ├── Email.js          # Email model
│   ├── AutoReply.js      # Auto-reply model
│   └── ProductCatalog.js # Product catalog model
├── controllers/
│   ├── authController.js
│   ├── emailController.js
│   ├── emailAccountController.js
│   └── productCatalogController.js
├── services/
│   ├── aiService.js      # OpenAI integration
│   ├── emailService.js   # Email fetching/syncing
│   └── oauthService.js   # OAuth2 handling
├── middleware/
│   ├── auth.js          # JWT authentication
│   ├── validation.js    # Input validation
│   └── rateLimiter.js   # Rate limiting
├── routes/
│   └── index.js         # Route definitions
└── server.js            # Application entry point
```

## Data Flow

### Email Synchronization Flow

```
User Action
    │
    ▼
Frontend: Click "Sync" button
    │
    ▼
API: POST /api/emails/sync
    │
    ▼
Backend: emailService.syncEmails()
    │
    ├─► OAuth2 Token Refresh (if needed)
    │
    ├─► Fetch emails from provider
    │   ├─► Gmail API
    │   ├─► Outlook API
    │   └─► IMAP
    │
    ├─► For each new email:
    │   ├─► AI Analysis
    │   │   ├─► Intent Detection
    │   │   ├─► Sentiment Analysis
    │   │   ├─► Priority Classification
    │   │   └─► Summary Generation
    │   │
    │   └─► Save to Database
    │
    └─► Return results to Frontend
```

### AI Auto-Reply Generation Flow

```
User Action
    │
    ▼
Frontend: Click "Generate AI Reply"
    │
    ▼
API: POST /api/emails/:id/auto-reply
    │
    ▼
Backend: emailController.generateAutoReply()
    │
    ├─► Get email content
    │
    ├─► Get user's product catalog
    │
    ├─► AI Service
    │   ├─► Detect product mentions
    │   ├─► Build context with products
    │   └─► Generate reply via OpenAI
    │
    ├─► Save auto-reply to database
    │
    └─► Return reply to Frontend
```

### Authentication Flow

```
User Registration/Login
    │
    ▼
Frontend: Submit credentials
    │
    ▼
API: POST /api/auth/register or /api/auth/login
    │
    ├─► Validate input
    │
    ├─► Hash password (register only)
    │
    ├─► Save/Verify user in database
    │
    ├─► Generate JWT token
    │
    └─► Return token to Frontend
        │
        ▼
    Frontend: Store token in localStorage
        │
        ▼
    All subsequent API calls include:
    Authorization: Bearer <token>
```

## Database Schema

### Users Table
```sql
Users
├── id (UUID, PK)
├── email (String, Unique)
├── password (String, Hashed)
├── firstName (String, Optional)
├── lastName (String, Optional)
├── isActive (Boolean)
├── createdAt (Timestamp)
└── updatedAt (Timestamp)
```

### EmailAccounts Table
```sql
EmailAccounts
├── id (UUID, PK)
├── userId (UUID, FK → Users)
├── provider (Enum: gmail, outlook, imap)
├── email (String)
├── accessToken (Text, Encrypted)
├── refreshToken (Text, Encrypted)
├── tokenExpiry (Timestamp)
├── imapHost (String, Optional)
├── imapPort (Integer, Optional)
├── imapPassword (String, Optional)
├── isActive (Boolean)
├── createdAt (Timestamp)
└── updatedAt (Timestamp)
```

### Emails Table
```sql
Emails
├── id (UUID, PK)
├── emailAccountId (UUID, FK → EmailAccounts)
├── messageId (String)
├── from (String)
├── to (Text)
├── subject (Text)
├── body (Text)
├── receivedDate (Timestamp)
├── isRead (Boolean)
├── aiIntent (String)
├── aiSentiment (String)
├── aiPriority (Enum: low, medium, high, urgent)
├── aiSummary (Text)
├── createdAt (Timestamp)
└── updatedAt (Timestamp)
```

### AutoReplies Table
```sql
AutoReplies
├── id (UUID, PK)
├── emailId (UUID, FK → Emails)
├── generatedReply (Text)
├── status (Enum: pending, approved, rejected, sent)
├── sentAt (Timestamp, Optional)
├── createdAt (Timestamp)
└── updatedAt (Timestamp)
```

### ProductCatalog Table
```sql
ProductCatalog
├── id (UUID, PK)
├── userId (UUID, FK → Users)
├── productName (String)
├── productSku (String, Optional)
├── description (Text, Optional)
├── price (Decimal, Optional)
├── category (String, Optional)
├── availability (Boolean)
├── metadata (JSONB, Optional)
├── createdAt (Timestamp)
└── updatedAt (Timestamp)
```

## Security Architecture

### Authentication & Authorization
- JWT-based authentication
- Bcrypt password hashing (salt rounds: 10)
- Token expiration: 7 days
- HTTP-only cookies (recommended for production)

### API Security
- Rate limiting (100 req/15min for general API, 5 req/15min for auth)
- Input validation using express-validator
- CORS protection
- Helmet.js security headers
- Request size limits (10MB for file uploads)

### Data Security
- Encrypted OAuth2 tokens at rest
- Encrypted IMAP passwords
- Parameterized database queries (SQL injection prevention)
- Secure environment variable management

## Scalability Considerations

### Horizontal Scaling
- Stateless backend design (supports multiple instances)
- Load balancer ready (no session affinity required)
- JWT tokens don't require shared session storage

### Database Optimization
- Indexed columns for common queries
- Connection pooling (max 5 connections per instance)
- Prepared statements for performance

### Caching Strategy
- JWT token caching in client
- Redis can be added for API response caching
- Email metadata caching

### Async Processing
- Email sync can be moved to background jobs
- AI processing can be queued
- Webhook support for real-time email notifications

## Monitoring & Logging

### Application Logs
- Request logging (Morgan in development)
- Error logging with stack traces
- Security event logging (failed auth, rate limits)

### Performance Monitoring
- API response times
- Database query performance
- External API call latency (OpenAI, Gmail, Outlook)

### Health Checks
- GET /api/health endpoint
- Database connectivity check
- External API availability check

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + TypeScript | UI Framework |
| State Management | React Hooks | Component state |
| HTTP Client | Axios | API communication |
| Backend | Node.js 18 + Express 5 | API server |
| Database | PostgreSQL 15 | Data persistence |
| ORM | Sequelize | Database modeling |
| AI/NLP | OpenAI GPT-3.5 | Email analysis & replies |
| Email APIs | Gmail API, Graph API, IMAP | Email integration |
| Authentication | JWT + bcrypt | Security |
| Validation | express-validator | Input validation |
| Rate Limiting | express-rate-limit | API protection |
| Containerization | Docker + Docker Compose | Deployment |
| Proxy | Nginx | Reverse proxy & SSL |

## Deployment Architecture

```
Internet
    │
    ▼
Nginx (SSL/TLS Termination)
    │
    ├─► Static Files (React Build)
    │
    └─► /api → Backend Container(s)
                    │
                    ├─► PostgreSQL Container
                    │
                    └─► External APIs
                        ├─► OpenAI
                        ├─► Gmail
                        └─► Outlook
```

## Development vs Production

| Feature | Development | Production |
|---------|------------|------------|
| Database | Local PostgreSQL | Managed PostgreSQL |
| HTTPS | HTTP | HTTPS with valid cert |
| Secrets | .env file | Environment variables |
| Frontend | Dev server | Static build via Nginx |
| Logs | Console | File + Log aggregation |
| Error Handling | Detailed errors | Generic errors |
| Database Sync | Auto-sync on start | Manual migrations |
| Rate Limiting | Relaxed | Strict |

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Redis for caching and job queues
- [ ] Elasticsearch for email search
- [ ] S3 for email attachment storage
- [ ] GraphQL API option
- [ ] Microservices architecture
- [ ] Multi-tenancy support
- [ ] Advanced analytics dashboard
