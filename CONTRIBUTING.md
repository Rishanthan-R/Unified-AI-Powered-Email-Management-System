# Contributing to Unified AI Email Manager

Thank you for considering contributing to the Unified AI Email Manager! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- Clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- Clear and descriptive title
- Detailed description of the proposed functionality
- Use cases and benefits
- Any potential implementation approach

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit your changes** with clear messages
6. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Keep changes focused and atomic
- Follow existing code style
- Include tests for new features
- Update documentation as needed
- Reference related issues in the description

#### Commit Message Format

```
type(scope): brief description

Detailed description (if needed)

Fixes #issue-number
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(email): add email filtering by date range

fix(auth): resolve token expiration issue

docs(api): update authentication endpoints documentation
```

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Setup Steps

1. Clone your fork:
```bash
git clone https://github.com/your-username/Unified-AI-Powered-Email-Management-System.git
cd Unified-AI-Powered-Email-Management-System
```

2. Install dependencies:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your configuration
```

4. Set up the database:
```bash
cd backend
npm run db:sync
```

5. Start development servers:
```bash
# Backend (in one terminal)
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm start
```

## Coding Standards

### Backend (Node.js)

- Use ES6+ features
- Use async/await for asynchronous operations
- Follow existing file structure
- Add JSDoc comments for functions
- Use meaningful variable and function names
- Handle errors appropriately
- Validate input data

Example:
```javascript
/**
 * Fetch emails from a specific account
 * @param {string} accountId - Email account ID
 * @param {Object} options - Fetch options
 * @returns {Promise<Array>} Array of emails
 */
async function fetchEmails(accountId, options = {}) {
  try {
    // Implementation
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}
```

### Frontend (React/TypeScript)

- Use functional components with hooks
- Use TypeScript for type safety
- Follow React best practices
- Keep components focused and reusable
- Use meaningful prop names
- Add proper types for props and state

Example:
```typescript
interface EmailListProps {
  emails: Email[];
  onEmailClick: (email: Email) => void;
  loading?: boolean;
}

const EmailList: React.FC<EmailListProps> = ({ emails, onEmailClick, loading = false }) => {
  // Implementation
};
```

### Testing

- Write unit tests for new features
- Ensure existing tests pass
- Aim for good test coverage
- Test edge cases and error scenarios

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## Documentation

- Update README.md for significant changes
- Update API_DOCUMENTATION.md for API changes
- Add JSDoc/TSDoc comments for new functions
- Include usage examples where helpful

## Feature Requests

We welcome feature requests! When submitting:

1. Check if the feature already exists or is planned
2. Clearly describe the feature and its benefits
3. Provide use cases
4. Consider implementation complexity
5. Be open to discussion and feedback

## Questions?

- Open an issue with the `question` label
- Check existing documentation
- Review closed issues for similar questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project documentation (for significant contributions)
- Release notes (for major features/fixes)

## Thank You!

Your contributions make this project better. We appreciate your time and effort!
