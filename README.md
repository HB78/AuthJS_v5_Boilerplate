# Next.js Authentication Boilerplate

<img src="/auth.jpg" alt="Auth JS V5 Banner" width="100%" />

A modern, secure authentication boilerplate built with Next.js 15 and Auth.js v5, featuring email verification, two-factor authentication, and role-based access control.

## 🌟 Features

- **Complete Authentication System**

  - Email & Password Authentication
  - OAuth Providers Support
  - Email Verification
  - Two-Factor Authentication (2FA)
  - Password Reset Functionality
  - Remember Me Option

- **Security Features**

  - JWT Session Handling
  - CSRF Protection
  - Rate Limiting
  - Secure Password Hashing (bcrypt)
  - Input Validation and Sanitization (Zod)

- **User Management**
  - Role-Based Access Control (User/Admin)
  - User Profile Management
  - Account Settings
  - Session Management

## 🛠️ Tech Stack

### Core

- [Next.js 15](https://nextjs.org/) - React Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Auth.js v5](https://authjs.dev/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database

### UI & Styling

- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI Components
- [Lucide React](https://lucide.dev/) - Icons
- [Sonner](https://sonner.emilkowal.ski/) - Toast Notifications

### Form & Validation

- [React Hook Form](https://react-hook-form.com/) - Form Management
- [Zod](https://zod.dev/) - Schema Validation

### Email

- [Resend](https://resend.com/) - Email Service

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL Database
- npm or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://your-repository-url.git
cd your-project-name
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Fill in your environment variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
RESEND_API_KEY="your-resend-api-key"
```

4. Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

5. Start the development server:

```bash
npm run dev
# or
pnpm dev
```

## 📁 Project Structure

```
├── app/
│   ├── api/         # API routes
│   ├── auth/        # Authentication pages
│   └── settings/    # User settings pages
├── components/      # React components
├── lib/            # Utility functions
├── prisma/         # Database schema and migrations
└── types/          # TypeScript type definitions
```

## 🔒 Authentication Flow

1. **Email/Password Registration**

   - User submits registration form
   - Email verification token generated
   - Verification email sent
   - User verifies email
   - Account activated

2. **Two-Factor Authentication**

   - User enables 2FA in settings
   - 2FA code required on login
   - Backup codes provided

3. **Password Reset**
   - User requests password reset
   - Reset token generated
   - Reset email sent
   - User sets new password

## 🛡️ Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens are encrypted and secure
- CSRF protection enabled
- Rate limiting on authentication endpoints
- Input validation using Zod schemas
- Secure session handling

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [Auth.js Documentation](https://authjs.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
