# Multi-Step Data Collection Platform

A full-stack web application for collecting structured data through an intuitive multi-step questionnaire interface. Built with modern technologies and designed for scalability, security, and ease of use.

> **Demo Use Case:** This demonstration implementation collects genealogical data in Russian language. The platform is designed to collect any structured data for subsequent post-processing and analysis.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1-61dafb)](https://react.dev/)
[![tRPC](https://img.shields.io/badge/tRPC-11.6-2596be)](https://trpc.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [License](#license)

## ✨ Features

### Core Functionality

- **Multi-Step Wizard Interface** — Intuitive step-by-step data collection with progress tracking
- **Auto-Save & Draft Management** — Automatic state persistence with ability to resume later
- **Dual Authentication** — Support for both OAuth (Manus) and local email/password authentication
- **Role-Based Access Control** — User and admin roles with protected routes
- **Multiple Export Formats** — Export collected data as JSON, CSV, or TXT
- **Admin Dashboard** — Comprehensive management interface for viewing and exporting submissions
- **Responsive Design** — Mobile-friendly interface built with Tailwind CSS and shadcn/ui
- **Type-Safe API** — End-to-end type safety with tRPC and TypeScript

### Technical Highlights

- **Real-time Validation** — Client and server-side validation with Zod schemas
- **Optimistic Updates** — Smooth UX with React Query optimistic updates
- **Database Migrations** — Version-controlled schema changes with Drizzle Kit
- **Security First** — bcrypt password hashing, HTTP-only cookies, CSRF protection
- **Developer Experience** — Hot reload, TypeScript, ESLint, Prettier

## 🛠 Tech Stack

### Frontend

- **React 19** — Modern UI framework with concurrent features
- **TypeScript** — Type-safe development
- **Vite** — Lightning-fast build tool and dev server
- **Tailwind CSS 4** — Utility-first styling
- **shadcn/ui** — High-quality component library built on Radix UI
- **React Hook Form** — Performant form state management
- **Zod** — TypeScript-first schema validation
- **TanStack Query** — Powerful data synchronization
- **Wouter** — Minimalist client-side routing

### Backend

- **Express 4** — Fast, unopinionated web framework
- **tRPC 11** — End-to-end type-safe API layer
- **Drizzle ORM** — TypeScript ORM with SQL-like syntax
- **MySQL/TiDB** — Relational database
- **bcryptjs** — Secure password hashing
- **jsonwebtoken** — JWT authentication
- **SuperJSON** — Enhanced JSON serialization

### DevOps

- **pnpm** — Fast, disk space efficient package manager
- **Drizzle Kit** — Database migration toolkit
- **Vitest** — Unit testing framework
- **esbuild** — Fast JavaScript bundler

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- MySQL 8+ or TiDB database
- Git

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd family_questionnaire
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Set up environment variables:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

Required environment variables:

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

4. **Run database migrations:**

```bash
pnpm db:push
```

5. **Start development server:**

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📚 Documentation

For comprehensive technical documentation, including architecture details, API endpoints, database schema, and development workflows, see:

**[Technical Documentation](docs/technical_documentation.md)**

The technical documentation covers:

- System architecture and request flow
- Complete API reference with examples
- Database schema and data structures
- Authentication and authorization system
- Frontend component architecture
- State management patterns
- File export system implementation
- Admin panel functionality
- Deployment guide and best practices
- Development workflow and testing

## 📁 Project Structure

```
family_questionnaire/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── steps/    # Wizard step components
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utilities and tRPC client
│   │   └── hooks/        # Custom React hooks
│   └── public/           # Static assets
│
├── server/                # Backend application
│   ├── _core/            # Core server utilities
│   ├── routers.ts        # tRPC API routes
│   ├── db.ts             # Database queries
│   ├── auth.ts           # Authentication logic
│   └── pdfExport.ts      # Export utilities
│
├── drizzle/              # Database layer
│   ├── schema.ts         # Database schema
│   └── migrations/       # Migration files
│
├── shared/               # Shared code (client + server)
│   ├── types.ts          # Shared TypeScript types
│   └── const.ts          # Shared constants
│
├── docs/                 # Documentation
│   └── technical_documentation.md
│
└── data/                 # Data storage
    └── submissions/      # Exported submissions
```

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql://user:pass@host:3306/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-here` |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Optional Variables (OAuth)

| Variable | Description |
|----------|-------------|
| `OAUTH_SERVER_URL` | OAuth server base URL |
| `VITE_OAUTH_PORTAL_URL` | OAuth portal URL for frontend |
| `VITE_APP_ID` | OAuth application ID |
| `OWNER_OPEN_ID` | Owner's OAuth identifier |
| `OWNER_NAME` | Owner's display name |

### Optional Variables (Customization)

| Variable | Description |
|----------|-------------|
| `VITE_APP_TITLE` | Application title |
| `VITE_APP_LOGO` | Logo URL |

## 💻 Development

### Available Scripts

```bash
# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm check

# Format code with Prettier
pnpm format

# Run tests
pnpm test

# Generate and apply database migrations
pnpm db:push
```

### Development Workflow

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test:**
   ```bash
   pnpm dev
   pnpm test
   pnpm check
   ```

3. **Format code:**
   ```bash
   pnpm format
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

### Adding New Questionnaire Steps

1. Create step component in `client/src/components/steps/`
2. Update schema in `client/src/pages/Questionnaire.tsx`
3. Add step to wizard configuration
4. Update `ReviewStep.tsx` to display new data
5. Update export functions in `server/pdfExport.ts`

See [Technical Documentation](docs/technical_documentation.md#adding-new-steps) for detailed guide.

## 🚢 Deployment

### Build Process

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Build application
pnpm build

# Start production server
pnpm start
```

### Production Checklist

- [ ] Set all environment variables
- [ ] Configure database connection
- [ ] Run database migrations
- [ ] Build application
- [ ] Set up reverse proxy (nginx/Apache)
- [ ] Configure SSL certificate
- [ ] Set up firewall rules
- [ ] Configure backup strategy
- [ ] Set up monitoring and logging
- [ ] Test authentication flows
- [ ] Verify admin panel access

### Deployment Options

- **VPS/Dedicated Server** — Deploy with PM2 or systemd
- **Docker** — Containerize with Docker and Docker Compose
- **Cloud Platforms** — Deploy to AWS, GCP, Azure, DigitalOcean
- **Platform-as-a-Service** — Deploy to Heroku, Railway, Render

See [Technical Documentation](docs/technical_documentation.md#deployment) for detailed deployment guide.

## 🔒 Security

- **Password Security** — bcrypt hashing with 10 salt rounds
- **Session Management** — HTTP-only cookies with secure flag in production
- **CSRF Protection** — SameSite cookie policy
- **SQL Injection** — Protected by Drizzle ORM parameterized queries
- **XSS Protection** — React auto-escapes JSX content
- **Input Validation** — Zod schemas on client and server
- **Authorization** — Role-based access control for protected routes

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/) — UI framework
- [tRPC](https://trpc.io/) — Type-safe API layer
- [Drizzle ORM](https://orm.drizzle.team/) — TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com/) — Component library
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework

## 📧 Support

For questions, issues, or feature requests:

- **GitHub Issues:** [Create an issue](../../issues)
- **Documentation:** [Technical Documentation](docs/technical_documentation.md)
- **Email:** m.lanin.dev@gmail.com

---

**Built with ❤️ using modern web technologies**
**Author** : Mikhail yashkinSun Lanin | linkedin.com/mikhail-lanin-dev
