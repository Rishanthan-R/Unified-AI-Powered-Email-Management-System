# Quick Start Guide

Get the Unified AI Email Manager up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 12+ installed and running
- OpenAI API key (get one at https://platform.openai.com/)

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/Unified-AI-Powered-Email-Management-System.git
cd Unified-AI-Powered-Email-Management-System
```

## Step 2: Set Up PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE unified_email_db;

# Exit psql
\q
```

## Step 3: Configure Backend

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
```

**Minimum required configuration in `.env`:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=unified_email_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_random_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here

FRONTEND_URL=http://localhost:3000
```

**Initialize the database:**
```bash
npm run db:sync
```

**Start the backend server:**
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend should now be running at `http://localhost:5000`

## Step 4: Configure Frontend

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file
nano .env
```

**Configure `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Start the frontend:**
```bash
npm start
```

Frontend should now be running at `http://localhost:3000`

## Step 5: Create an Account

1. Open your browser and go to `http://localhost:3000`
2. Click on "Register"
3. Fill in your details:
   - Email
   - Password (minimum 6 characters)
   - First Name (optional)
   - Last Name (optional)
4. Click "Register"

You'll be automatically logged in and redirected to the dashboard!

## Step 6: Connect Email Accounts

### Option A: Connect Gmail (OAuth2)

**Prerequisites:**
- Google Cloud Console account
- Gmail API enabled
- OAuth2 credentials created

**Steps:**
1. Go to "Email Accounts" tab
2. Click "Connect Gmail"
3. You'll be redirected to Google login
4. Authorize the application
5. You'll be redirected back to the dashboard

### Option B: Connect Outlook (OAuth2)

**Prerequisites:**
- Azure Portal account
- Microsoft Graph API access
- OAuth2 app registration

**Steps:**
1. Go to "Email Accounts" tab
2. Click "Connect Outlook"
3. You'll be redirected to Microsoft login
4. Authorize the application
5. You'll be redirected back to the dashboard

### Option C: Connect IMAP Account

**For Gmail IMAP:**
1. Enable IMAP in Gmail settings
2. Generate an App Password (if 2FA is enabled)
3. Use settings:
   - Host: `imap.gmail.com`
   - Port: `993`
   - Email: your Gmail address
   - Password: your App Password

**For Other Providers:**
- Use your provider's IMAP settings

## Step 7: Sync Emails

1. Go to "Email Accounts" tab
2. Click "Sync" next to your connected account
3. Wait for emails to be fetched and analyzed
4. Go to "Emails" tab to see your unified inbox

## Step 8: Upload Product Catalog (Optional)

1. Go to "Product Catalog" tab
2. Prepare a CSV or JSON file (see examples in `sample-catalog.csv` or `sample-catalog.json`)
3. Click "Choose File" and select your catalog
4. Click "Upload Catalog"
5. Your products will be used for AI-generated responses

## Using the Dashboard

### View Emails
- **Emails Tab**: See all emails from all connected accounts
- Click on any email to view details
- Unread emails are highlighted
- Emails show AI-generated insights:
  - Intent (inquiry, complaint, request, etc.)
  - Sentiment (positive, neutral, negative)
  - Priority (low, medium, high, urgent)
  - Summary

### Generate Auto-Replies
1. Click on an email to view details
2. Click "Generate AI Reply"
3. Review the AI-generated response
4. The response considers your product catalog (if uploaded)

### Manage Accounts
- View all connected email accounts
- Sync emails from specific accounts
- Delete accounts you no longer need

### Manage Products
- View your product catalog
- Upload bulk products via CSV/JSON
- Products enhance AI-generated email responses

## Troubleshooting

### Backend won't start

**Database connection error:**
```bash
# Verify PostgreSQL is running
sudo systemctl status postgresql

# Check if database exists
psql -U postgres -l | grep unified_email_db
```

**Port already in use:**
```bash
# Change PORT in backend/.env to a different port
PORT=5001
```

### Frontend won't start

**Port already in use:**
- React will prompt you to use a different port
- Or change the port in package.json

**API connection errors:**
- Verify backend is running
- Check `REACT_APP_API_URL` in frontend/.env

### OAuth2 Issues

**Gmail/Outlook connection fails:**
- Verify OAuth2 credentials in backend/.env
- Check redirect URIs match exactly
- Ensure APIs are enabled

**For Development Without OAuth2:**
- Use IMAP connection instead
- No OAuth2 setup required

### Email Sync Issues

**No emails appear:**
- Check if accounts are connected
- Click "Sync" button manually
- Check backend logs for errors

**IMAP connection fails:**
- Verify IMAP settings
- Check if IMAP is enabled on your email provider
- For Gmail: Enable "Less secure app access" or use App Password

## Quick Tips

1. **First-time Setup**: Use IMAP for quick testing (no OAuth2 setup needed)
2. **Testing AI Features**: Upload the sample product catalog to test product-aware responses
3. **Performance**: For development, sync emails in small batches
4. **Security**: Don't commit your `.env` files to version control

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- See [SECURITY.md](SECURITY.md) for security best practices

## Support

Having issues? 
1. Check the logs: Backend terminal and frontend browser console
2. Review the troubleshooting section above
3. Check existing GitHub issues
4. Open a new issue with details

## Congratulations! 🎉

You now have a fully functional AI-powered email management system!

Start exploring the features and see how AI can help manage your emails more efficiently.
