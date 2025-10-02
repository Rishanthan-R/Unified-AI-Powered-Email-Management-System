# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt-token"
}
```

#### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt-token"
}
```

#### GET /auth/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Email Accounts

#### GET /email-accounts
Get all email accounts for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "accounts": [
    {
      "id": "uuid",
      "provider": "gmail",
      "email": "user@gmail.com",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /email-accounts/gmail/auth
Initiate Gmail OAuth2 authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
}
```

#### GET /email-accounts/outlook/auth
Initiate Outlook OAuth2 authentication.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "authUrl": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?..."
}
```

#### POST /email-accounts/imap
Add an IMAP email account.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "imapHost": "imap.example.com",
  "imapPort": 993,
  "imapPassword": "password"
}
```

**Response (201):**
```json
{
  "account": {
    "id": "uuid",
    "provider": "imap",
    "email": "user@example.com"
  }
}
```

#### DELETE /email-accounts/:id
Delete an email account.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Account deleted successfully"
}
```

### Emails

#### GET /emails
Get all emails with optional filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50, max: 100)
- `priority` (optional): Filter by priority (low, medium, high, urgent)
- `sentiment` (optional): Filter by sentiment (positive, neutral, negative)

**Response (200):**
```json
{
  "emails": [
    {
      "id": "uuid",
      "messageId": "message-id",
      "from": "sender@example.com",
      "to": "recipient@example.com",
      "subject": "Email subject",
      "body": "Email content",
      "receivedDate": "2024-01-01T00:00:00.000Z",
      "isRead": false,
      "aiIntent": "inquiry",
      "aiSentiment": "positive",
      "aiPriority": "high",
      "aiSummary": "AI-generated summary",
      "emailAccount": {
        "email": "user@gmail.com",
        "provider": "gmail"
      }
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 2
}
```

#### GET /emails/:id
Get email by ID with details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "email": {
    "id": "uuid",
    "messageId": "message-id",
    "from": "sender@example.com",
    "to": "recipient@example.com",
    "subject": "Email subject",
    "body": "Email content",
    "receivedDate": "2024-01-01T00:00:00.000Z",
    "isRead": false,
    "aiIntent": "inquiry",
    "aiSentiment": "positive",
    "aiPriority": "high",
    "aiSummary": "AI-generated summary",
    "emailAccount": {
      "email": "user@gmail.com",
      "provider": "gmail"
    },
    "autoReplies": []
  }
}
```

#### POST /emails/sync
Sync emails from an account.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "emailAccountId": "uuid"
}
```

**Response (200):**
```json
{
  "message": "Emails synced successfully",
  "count": 10
}
```

#### PATCH /emails/:id/read
Mark an email as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Email marked as read"
}
```

#### POST /emails/:id/auto-reply
Generate an AI-powered auto-reply.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "autoReply": {
    "id": "uuid",
    "emailId": "uuid",
    "generatedReply": "Thank you for your inquiry...",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Product Catalog

#### GET /products
Get all products with optional filters.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 50)
- `search` (optional): Search query for product names

**Response (200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "productName": "Widget Pro",
      "productSku": "WGT-001",
      "description": "Professional widget tool",
      "price": 99.99,
      "category": "Tools",
      "availability": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 1
}
```

#### POST /products/upload
Upload a product catalog (CSV or JSON).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
Form data with file field named `catalog`

**Response (201):**
```json
{
  "message": "Products uploaded successfully",
  "count": 25
}
```

#### POST /products
Create a single product.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productName": "Widget Pro",
  "productSku": "WGT-001",
  "description": "Professional widget tool",
  "price": 99.99,
  "category": "Tools",
  "availability": true
}
```

**Response (201):**
```json
{
  "product": {
    "id": "uuid",
    "productName": "Widget Pro",
    "productSku": "WGT-001",
    "description": "Professional widget tool",
    "price": 99.99,
    "category": "Tools",
    "availability": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### PUT /products/:id
Update a product.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productName": "Widget Pro Updated",
  "price": 109.99,
  "availability": false
}
```

**Response (200):**
```json
{
  "product": {
    "id": "uuid",
    "productName": "Widget Pro Updated",
    "price": 109.99,
    "availability": false
  }
}
```

#### DELETE /products/:id
Delete a product.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

#### DELETE /products
Delete all products for the user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "All products deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "error": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication required"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**429 Too Many Requests:**
```json
{
  "error": "Too many requests, please try again later"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

- General API endpoints: 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per 15 minutes per IP

## Notes

- All dates are in ISO 8601 format
- All IDs are UUIDs
- File uploads are limited to 10MB
- JWT tokens expire after 7 days
