# Unified AI-Powered Email Management System

A comprehensive SaaS application that unifies Gmail, Outlook, and IMAP email accounts into a single intelligent inbox with AI-powered features.

## Features

### Email Management
- **Unified Inbox**: Connect and manage multiple email accounts (Gmail, Outlook, IMAP) in one place
- **OAuth2 Integration**: Secure authentication for Gmail and Outlook
- **Real-time Sync**: Fetch and sync emails from all connected accounts

### AI-Powered Intelligence
- **Intent Detection**: Automatically classify email intent (inquiry, complaint, request, feedback, order, etc.)
- **Sentiment Analysis**: Analyze email sentiment (positive, neutral, negative)
- **Priority Classification**: Smart prioritization (low, medium, high, urgent)
- **Auto-Reply Generation**: Generate contextual, professional email responses
- **AI Summaries**: Get quick summaries of email content

### Product Catalog Integration
- **Catalog Upload**: Upload product catalogs via CSV or JSON
- **Product-Aware Responses**: AI generates responses with relevant product information
- **Catalog Management**: Add, edit, and delete products

### Security & Compliance
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt password encryption
- **Rate Limiting**: Protection against abuse
- **GDPR Compliant**: Data privacy and security measures
- **Input Validation**: Comprehensive request validation

## Technology Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** database with Sequelize ORM
- **OpenAI API** for NLP and AI features
- **OAuth2** for Gmail and Outlook integration
- **IMAP** support for custom email servers

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Responsive Design** for mobile and desktop

## Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- OpenAI API key
- Gmail OAuth2 credentials (optional)
- Outlook OAuth2 credentials (optional)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
   - Database credentials
   - JWT secret
   - OpenAI API key
   - OAuth2 credentials (if using Gmail/Outlook)

5. Set up the database:
```bash
npm run db:sync
```

6. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure the API URL in `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Documentation

### Authentication

#### Register
```
POST /api/auth/register
Body: { email, password, firstName?, lastName? }
Response: { user, token }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { user, token }
```

#### Get Profile
```
GET /api/auth/profile
Headers: Authorization: Bearer <token>
Response: { user }
```

### Email Accounts

#### Get Email Accounts
```
GET /api/email-accounts
Headers: Authorization: Bearer <token>
Response: { accounts: [] }
```

#### Connect Gmail
```
GET /api/email-accounts/gmail/auth
Headers: Authorization: Bearer <token>
Response: { authUrl }
```

#### Connect Outlook
```
GET /api/email-accounts/outlook/auth
Headers: Authorization: Bearer <token>
Response: { authUrl }
```

#### Add IMAP Account
```
POST /api/email-accounts/imap
Headers: Authorization: Bearer <token>
Body: { email, imapHost, imapPort, imapPassword }
Response: { account }
```

### Emails

#### Get Emails
```
GET /api/emails?page=1&limit=50&priority=high&sentiment=positive
Headers: Authorization: Bearer <token>
Response: { emails: [], total, page, totalPages }
```

#### Get Email by ID
```
GET /api/emails/:id
Headers: Authorization: Bearer <token>
Response: { email }
```

#### Sync Emails
```
POST /api/emails/sync
Headers: Authorization: Bearer <token>
Body: { emailAccountId }
Response: { message, count }
```

#### Mark as Read
```
PATCH /api/emails/:id/read
Headers: Authorization: Bearer <token>
Response: { message }
```

#### Generate Auto-Reply
```
POST /api/emails/:id/auto-reply
Headers: Authorization: Bearer <token>
Response: { autoReply }
```

### Product Catalog

#### Get Products
```
GET /api/products?page=1&limit=50&search=query
Headers: Authorization: Bearer <token>
Response: { products: [], total, page, totalPages }
```

#### Upload Catalog
```
POST /api/products/upload
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data
Body: FormData with 'catalog' file (CSV or JSON)
Response: { message, count }
```

#### Create Product
```
POST /api/products
Headers: Authorization: Bearer <token>
Body: { productName, productSku?, description?, price?, category?, availability? }
Response: { product }
```

## Usage Guide

### 1. Register/Login
- Create a new account or login with existing credentials
- You'll be redirected to the dashboard

### 2. Connect Email Accounts
- Go to "Email Accounts" tab
- Click "Connect Gmail" or "Connect Outlook" for OAuth2 authentication
- Or add IMAP account with manual credentials
- Click "Sync" to fetch emails from connected accounts

### 3. View and Manage Emails
- Go to "Emails" tab to see your unified inbox
- Emails are automatically analyzed for intent, sentiment, and priority
- Click on any email to view details and AI insights
- Use "Generate AI Reply" to create contextual responses

### 4. Upload Product Catalog
- Go to "Product Catalog" tab
- Upload a CSV or JSON file with product information
- Products will be used to enhance AI-generated responses

### Product Catalog Format

#### CSV Example:
```csv
productName,productSku,description,price,category,availability
Widget Pro,WGT-001,Professional widget tool,99.99,Tools,true
Widget Lite,WGT-002,Basic widget tool,49.99,Tools,true
```

#### JSON Example:
```json
[
  {
    "productName": "Widget Pro",
    "productSku": "WGT-001",
    "description": "Professional widget tool",
    "price": 99.99,
    "category": "Tools",
    "availability": true
  }
]
```

## OAuth2 Setup

### Gmail OAuth2

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Create OAuth2 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/gmail/callback`
6. Copy Client ID and Client Secret to `.env`

### Outlook OAuth2

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Add permissions: Mail.Read, Mail.Send, offline_access
4. Add redirect URI: `http://localhost:5000/api/auth/outlook/callback`
5. Copy Application (client) ID and Client Secret to `.env`

## Security Considerations

- Always use HTTPS in production
- Store sensitive credentials in environment variables
- Regularly rotate JWT secrets
- Implement proper rate limiting
- Keep dependencies updated
- Follow GDPR guidelines for data handling
- Encrypt sensitive data at rest
- Implement audit logging

## Deployment

### Using Docker (Recommended)

See `docker-compose.yml` for containerized deployment.

### Manual Deployment

1. Set up PostgreSQL database
2. Configure production environment variables
3. Build frontend: `npm run build`
4. Deploy backend to your server
5. Serve frontend static files
6. Set up reverse proxy (nginx/Apache)
7. Configure SSL/TLS certificates

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### OAuth2 Issues
- Verify redirect URIs match exactly
- Check OAuth2 credentials are correct
- Ensure proper scopes are requested

### Email Sync Issues
- Check account credentials
- Verify OAuth2 tokens are valid
- Check IMAP server settings

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review API documentation

## Roadmap

- [ ] Advanced email filtering
- [ ] Custom AI training
- [ ] Email templates
- [ ] Scheduling and reminders
- [ ] Mobile apps
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Team collaboration features
