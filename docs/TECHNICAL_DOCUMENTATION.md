# Multi-Step Data Collection Platform - Technical Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Authentication System](#authentication-system)
7. [API Endpoints](#api-endpoints)
8. [Frontend Components](#frontend-components)
9. [State Management](#state-management)
10. [File Export System](#file-export-system)
11. [Admin Panel](#admin-panel)
12. [Deployment](#deployment)
13. [Development Workflow](#development-workflow)

---

## Overview

This is a **multi-step data collection platform** built as a full-stack web application. The platform enables users to fill out complex, multi-section questionnaires with automatic state persistence, draft management, and multiple export formats.

### Key Features

- **Multi-step wizard interface** with 10 configurable steps
- **Dual authentication system** (OAuth + local email/password)
- **Automatic draft saving** with state persistence
- **Role-based access control** (user/admin)
- **Admin dashboard** for submission management
- **Multiple export formats** (JSON, CSV, TXT)
- **Responsive design** with modern UI components
- **Type-safe API** with end-to-end TypeScript

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  React 19 + TypeScript + Tailwind CSS + shadcn/ui          │
│  - Multi-step wizard                                        │
│  - Form state management (React Hook Form + Zod)           │
│  - tRPC React Query hooks                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/tRPC
                     │
┌────────────────────▼────────────────────────────────────────┐
│                       Server Layer                           │
│  Express 4 + tRPC 11 + TypeScript                          │
│  - RESTful API endpoints                                    │
│  - Authentication middleware                                │
│  - Business logic & validation                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Drizzle ORM
                     │
┌────────────────────▼────────────────────────────────────────┐
│                      Database Layer                          │
│  MySQL/TiDB (via Drizzle ORM)                              │
│  - Users table (auth + roles)                              │
│  - Submissions table (questionnaire data)                  │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client** sends tRPC request via React Query
2. **Server** validates request through tRPC middleware
3. **Authentication** layer verifies JWT token or OAuth session
4. **Business logic** processes request using Drizzle ORM
5. **Database** executes query and returns results
6. **Response** flows back through tRPC to client with type safety

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.1.7 | Build tool & dev server |
| **Tailwind CSS** | 4.1.14 | Utility-first styling |
| **shadcn/ui** | Latest | Component library (Radix UI) |
| **React Hook Form** | 7.64.0 | Form state management |
| **Zod** | 4.1.12 | Schema validation |
| **Wouter** | 3.3.5 | Client-side routing |
| **tRPC React Query** | 11.6.0 | Type-safe API client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express** | 4.21.2 | HTTP server |
| **tRPC** | 11.6.0 | Type-safe API layer |
| **Drizzle ORM** | 0.44.5 | Database ORM |
| **MySQL2** | 3.15.0 | MySQL driver |
| **bcryptjs** | 3.0.2 | Password hashing |
| **jsonwebtoken** | 9.0.2 | JWT authentication |
| **Zod** | 4.1.12 | Runtime validation |
| **SuperJSON** | 1.13.3 | Serialization (Date, Map, Set) |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **pnpm** | 10.15.1 | Package manager |
| **tsx** | 4.19.1 | TypeScript execution |
| **Drizzle Kit** | 0.31.4 | Database migrations |
| **Vitest** | 2.1.4 | Unit testing |
| **Prettier** | 3.6.2 | Code formatting |
| **esbuild** | 0.25.0 | Production bundling |

---

## Project Structure

```
family_questionnaire/
├── client/                      # Frontend application
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── _core/              # Core utilities
│   │   │   └── hooks/          # Custom React hooks
│   │   │       └── useAuth.ts  # Authentication hook
│   │   ├── components/         # React components
│   │   │   ├── steps/          # Wizard step components
│   │   │   │   ├── ConsentStep.tsx
│   │   │   │   ├── RespondentStep.tsx
│   │   │   │   ├── ParentsStep.tsx
│   │   │   │   ├── SiblingsStep.tsx
│   │   │   │   ├── GrandparentsStep.tsx
│   │   │   │   ├── GreatGrandparentsStep.tsx
│   │   │   │   ├── PlacesStep.tsx
│   │   │   │   ├── TraditionsStep.tsx
│   │   │   │   ├── AdditionalInfoStep.tsx
│   │   │   │   └── ReviewStep.tsx
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── StepWizard.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── contexts/           # React contexts
│   │   │   └── ThemeContext.tsx
│   │   ├── hooks/              # Custom hooks
│   │   ├── lib/                # Libraries
│   │   │   └── trpc.ts         # tRPC client setup
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Questionnaire.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── NotFound.tsx
│   │   ├── App.tsx             # Main app component
│   │   ├── main.tsx            # Entry point
│   │   ├── index.css           # Global styles
│   │   └── const.ts            # Constants
│   └── index.html              # HTML template
│
├── server/                      # Backend application
│   ├── _core/                  # Core server utilities
│   │   ├── context.ts          # tRPC context
│   │   ├── cookies.ts          # Cookie management
│   │   ├── env.ts              # Environment variables
│   │   ├── index.ts            # Server entry point
│   │   ├── localAuth.ts        # Local auth middleware
│   │   ├── oauth.ts            # OAuth integration
│   │   ├── trpc.ts             # tRPC setup
│   │   ├── systemRouter.ts     # System routes
│   │   ├── notification.ts     # Notification service
│   │   ├── llm.ts              # LLM integration
│   │   ├── imageGeneration.ts  # Image generation
│   │   └── voiceTranscription.ts
│   ├── auth.ts                 # Auth utilities
│   ├── db.ts                   # Database queries
│   ├── routers.ts              # Main tRPC router
│   ├── fileStorage.ts          # File operations
│   ├── pdfExport.ts            # Export utilities
│   └── storage.ts              # S3 storage
│
├── drizzle/                     # Database layer
│   ├── schema.ts               # Database schema
│   ├── relations.ts            # Table relations
│   ├── migrations/             # Migration files
│   └── meta/                   # Migration metadata
│
├── shared/                      # Shared code
│   ├── const.ts                # Shared constants
│   ├── schema.ts               # Shared schemas
│   └── types.ts                # Shared types
│
├── data/                        # Data storage
│   └── submissions/            # Exported submissions
│       ├── *.json              # Individual submissions
│       └── all_submissions.csv # Aggregated CSV
│
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
├── drizzle.config.ts           # Drizzle config
└── vitest.config.ts            # Vitest config
```

---

## Database Schema

### Users Table

Stores user accounts with support for both OAuth and local authentication.

```typescript
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),        // OAuth identifier
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  password: varchar("password", { length: 255 }),            // bcrypt hash
  loginMethod: varchar("loginMethod", { length: 64 }),       // "oauth" | "local"
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
```

**Fields:**
- `id`: Auto-increment primary key
- `openId`: Unique OAuth identifier (nullable for local auth)
- `email`: Unique email address
- `password`: bcrypt hashed password (nullable for OAuth)
- `loginMethod`: Authentication method used
- `role`: User role (`user` or `admin`)
- `createdAt`, `updatedAt`, `lastSignedIn`: Timestamps

### Submissions Table

Stores questionnaire submissions with draft/submitted status.

```typescript
export const submissions = mysqlTable("submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  data: text("data").notNull(),                              // JSON string
  status: mysqlEnum("status", ["draft", "submitted"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  submittedAt: timestamp("submittedAt"),
});
```

**Fields:**
- `id`: Auto-increment primary key
- `userId`: Foreign key to users table
- `token`: Unique UUID for accessing submission
- `data`: JSON-serialized questionnaire data
- `status`: `draft` or `submitted`
- `submittedAt`: Timestamp when submitted (null for drafts)

**Data Field Structure:**

The `data` field stores JSON with the following structure:

```json
{
  "consent": {
    "dataProcessing": true,
    "publicationConsent": true
  },
  "respondent": {
    "fullName": "string",
    "birthDate": "YYYY-MM-DD",
    "birthPlace": "string",
    "currentAddress": "string",
    "phone": "string",
    "email": "string"
  },
  "parents": {
    "father": { /* person object */ },
    "mother": { /* person object */ }
  },
  "siblings": {
    "sibling1": { /* person object */ },
    "sibling2": { /* person object */ }
  },
  "grandparents": {
    "paternalGrandfather": { /* person object */ },
    "paternalGrandmother": { /* person object */ },
    "maternalGrandfather": { /* person object */ },
    "maternalGrandmother": { /* person object */ }
  },
  "greatGrandparents": {
    "relative1": { /* person object */ }
  },
  "places": {
    "place1": {
      "location": "string",
      "period": "string",
      "description": "string"
    }
  },
  "traditions": {
    "holidays": "string",
    "customs": "string",
    "legends": "string"
  },
  "additionalInfo": {
    "stories": "string",
    "documents": "string"
  }
}
```

---

## Authentication System

### Dual Authentication Strategy

The platform supports two authentication methods:

1. **OAuth (Manus)** - External OAuth provider
2. **Local** - Email/password with JWT

### Authentication Flow

#### Local Registration

```typescript
// Client
const { mutate: register } = trpc.auth.register.useMutation();
register({ email, password, name });

// Server (routers.ts)
auth.register
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
  }))
  .mutation(async ({ input, ctx }) => {
    // 1. Check if user exists
    const existingUser = await getUserByEmail(input.email);
    if (existingUser) throw new Error("User exists");
    
    // 2. Hash password with bcrypt
    const hashedPassword = await hashPassword(input.password);
    
    // 3. Create user in database
    await createLocalUser(input.email, hashedPassword, input.name);
    
    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      ENV.jwtSecret,
      { expiresIn: "30d" }
    );
    
    // 5. Set HTTP-only cookie
    ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
    
    return { success: true, user };
  });
```

#### Local Login

```typescript
// Client
const { mutate: login } = trpc.auth.login.useMutation();
login({ email, password });

// Server (routers.ts)
auth.login
  .input(z.object({
    email: z.string().email(),
    password: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    // 1. Find user by email
    const user = await getUserByEmail(input.email);
    if (!user || !user.password) throw new Error("Invalid credentials");
    
    // 2. Verify password with bcrypt
    const isValid = await verifyPassword(input.password, user.password);
    if (!isValid) throw new Error("Invalid credentials");
    
    // 3. Update last sign-in timestamp
    await updateUserLastSignIn(user.id);
    
    // 4. Generate JWT and set cookie
    const token = jwt.sign({ userId: user.id, email: user.email }, ENV.jwtSecret);
    ctx.res.cookie(COOKIE_NAME, token, cookieOptions);
    
    return { success: true, user };
  });
```

### Password Security

**Hashing Algorithm:** bcrypt with 10 salt rounds

```typescript
// server/auth.ts
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Session Management

**JWT Token Structure:**

```json
{
  "userId": 123,
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1237159890
}
```

**Cookie Configuration:**

```typescript
// server/_core/cookies.ts
export function getSessionCookieOptions(req: Request) {
  return {
    httpOnly: true,           // Prevent XSS attacks
    secure: isProduction,     // HTTPS only in production
    sameSite: "lax" as const, // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
  };
}
```

### Authorization Middleware

**Protected Procedures:**

```typescript
// server/_core/trpc.ts
export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});
```

**Admin-only Procedures:**

```typescript
// server/routers.ts
admin.getAllSubmissions.query(async ({ ctx, input }) => {
  if (ctx.user.role !== "admin") {
    throw new Error("Access denied. Admin role required.");
  }
  // ... admin logic
});
```

### Frontend Authentication Hook

```typescript
// client/src/_core/hooks/useAuth.ts
export function useAuth() {
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();
  
  return {
    user,
    loading: isLoading,
    error,
    isAuthenticated: !!user,
  };
}
```

---

## API Endpoints

### tRPC Router Structure

All API endpoints are defined in `server/routers.ts` using tRPC.

#### Authentication Router (`auth`)

| Endpoint | Type | Auth | Description |
|----------|------|------|-------------|
| `auth.me` | query | public | Get current user |
| `auth.logout` | mutation | public | Clear session cookie |
| `auth.register` | mutation | public | Register new user |
| `auth.login` | mutation | public | Login with email/password |

**Example Usage:**

```typescript
// Get current user
const { data: user } = trpc.auth.me.useQuery();

// Register
const { mutate: register } = trpc.auth.register.useMutation();
register({ email: "user@example.com", password: "pass123", name: "John" });

// Login
const { mutate: login } = trpc.auth.login.useMutation();
login({ email: "user@example.com", password: "pass123" });

// Logout
const { mutate: logout } = trpc.auth.logout.useMutation();
logout();
```

#### Questionnaire Router (`questionnaire`)

| Endpoint | Type | Auth | Description |
|----------|------|------|-------------|
| `questionnaire.getMyDraft` | query | protected | Get or create user's draft |
| `questionnaire.create` | mutation | protected | Create new draft (legacy) |
| `questionnaire.get` | query | public | Get submission by token |
| `questionnaire.save` | mutation | public | Auto-save draft |
| `questionnaire.submit` | mutation | public | Submit questionnaire |
| `questionnaire.list` | query | protected | List user's submissions |
| `questionnaire.exportJSON` | query | public | Export as JSON |
| `questionnaire.exportCSV` | query | public | Export as CSV |
| `questionnaire.exportPDF` | query | public | Export as TXT |

**Example Usage:**

```typescript
// Get or create draft
const { data: draft } = trpc.questionnaire.getMyDraft.useQuery();
// Returns: { token: string, data: object, updatedAt: Date }

// Auto-save draft
const { mutate: save } = trpc.questionnaire.save.useMutation();
save({ token: "uuid-here", data: formData });

// Submit questionnaire
const { mutate: submit } = trpc.questionnaire.submit.useMutation();
submit({ token: "uuid-here", data: formData });

// Export JSON
const { data: json } = trpc.questionnaire.exportJSON.useQuery({ token: "uuid" });

// Export CSV
const { data: csv } = trpc.questionnaire.exportCSV.useQuery({ token: "uuid" });

// Export TXT
const { data: txt } = trpc.questionnaire.exportPDF.useQuery({ token: "uuid" });
```

#### Admin Router (`admin`)

| Endpoint | Type | Auth | Description |
|----------|------|------|-------------|
| `admin.getAllSubmissions` | query | admin | Get all submissions |
| `admin.getSubmission` | query | admin | Get submission details |

**Example Usage:**

```typescript
// Get all submissions (admin only)
const { data: submissions } = trpc.admin.getAllSubmissions.useQuery({
  status: "submitted" // optional filter
});

// Get specific submission (admin only)
const { data: submission } = trpc.admin.getSubmission.useQuery({
  token: "uuid-here"
});
```

---

## Frontend Components

### Multi-Step Wizard

The questionnaire uses a custom `StepWizard` component to manage navigation between steps.

**Component:** `client/src/components/StepWizard.tsx`

```typescript
interface StepWizardProps {
  steps: Array<{
    id: number;
    title: string;
    component: React.ReactNode;
  }>;
  currentStep: number;
  onStepChange: (step: number) => void;
}
```

### Step Components

Each step is a self-contained component using React Hook Form:

**Example:** `client/src/components/steps/RespondentStep.tsx`

```typescript
interface RespondentStepProps {
  form: UseFormReturn<QuestionnaireFormData>;
}

export function RespondentStep({ form }: RespondentStepProps) {
  const { control, formState: { errors } } = form;
  
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="respondent.fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* More fields... */}
    </div>
  );
}
```

### Dashboard Layout

**Component:** `client/src/components/DashboardLayout.tsx`

Provides a consistent layout for authenticated pages with:
- Sidebar navigation
- Header with user menu
- Responsive mobile menu
- Logout functionality

### UI Components (shadcn/ui)

All UI components are from shadcn/ui library, located in `client/src/components/ui/`:

- `button.tsx` - Button variants
- `input.tsx` - Form inputs
- `card.tsx` - Card containers
- `dialog.tsx` - Modal dialogs
- `table.tsx` - Data tables
- `alert.tsx` - Alert messages
- `badge.tsx` - Status badges
- `select.tsx` - Dropdown selects
- `textarea.tsx` - Multi-line inputs
- `calendar.tsx` - Date picker
- `checkbox.tsx` - Checkboxes
- `radio-group.tsx` - Radio buttons
- `tabs.tsx` - Tab navigation
- `accordion.tsx` - Collapsible sections
- `toast.tsx` - Toast notifications (via Sonner)

---

## State Management

### Form State

**Library:** React Hook Form + Zod

**Schema Definition:** `client/src/pages/Questionnaire.tsx`

```typescript
const questionnaireSchema = z.object({
  consent: z.object({
    dataProcessing: z.boolean(),
    publicationConsent: z.boolean(),
  }),
  respondent: z.object({
    fullName: z.string().min(1),
    birthDate: z.string().optional(),
    birthPlace: z.string().optional(),
    currentAddress: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  }),
  parents: z.any().optional(),
  siblings: z.any().optional(),
  grandparents: z.any().optional(),
  greatGrandparents: z.any().optional(),
  places: z.any().optional(),
  traditions: z.any().optional(),
  additionalInfo: z.any().optional(),
});

type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;
```

**Form Initialization:**

```typescript
const form = useForm<QuestionnaireFormData>({
  resolver: zodResolver(questionnaireSchema),
  defaultValues: {
    consent: {
      dataProcessing: false,
      publicationConsent: false,
    },
    respondent: {
      fullName: "",
      birthDate: "",
      birthPlace: "",
      currentAddress: "",
      phone: "",
      email: "",
    },
    parents: {},
    siblings: {},
    grandparents: {},
    greatGrandparents: {},
    places: {},
    traditions: {},
    additionalInfo: {},
  },
});
```

### Auto-Save Mechanism

**Implementation:** Debounced form watch + tRPC mutation

```typescript
// Watch form changes
const formData = form.watch();

// Debounced auto-save
useEffect(() => {
  const timer = setTimeout(() => {
    if (token) {
      saveMutation.mutate({ token, data: formData });
    }
  }, 2000); // Save after 2 seconds of inactivity
  
  return () => clearTimeout(timer);
}, [formData, token]);
```

### Server State

**Library:** TanStack Query (via tRPC)

**Configuration:** `client/src/main.tsx`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      headers: () => ({
        "Content-Type": "application/json",
      }),
    }),
  ],
  transformer: superjson, // Handles Date, Map, Set serialization
});
```

### Local Storage

Draft token is stored in localStorage for persistence:

```typescript
// Save token
localStorage.setItem("questionnaireToken", token);

// Retrieve token
const savedToken = localStorage.getItem("questionnaireToken");
```

---

## File Export System

### Export Formats

The platform supports three export formats:

1. **JSON** - Full structured data
2. **CSV** - Tabular format for spreadsheets
3. **TXT** - Human-readable text format

### JSON Export

**Endpoint:** `questionnaire.exportJSON`

**Implementation:** `server/routers.ts`

```typescript
exportJSON: publicProcedure
  .input(z.object({ token: z.string() }))
  .query(async ({ input }) => {
    const submission = await getSubmissionByToken(input.token);
    if (!submission) throw new Error("Not found");
    
    return {
      data: JSON.parse(submission.data),
      json: JSON.stringify(JSON.parse(submission.data), null, 2),
    };
  });
```

**Client Usage:**

```typescript
const { data } = trpc.questionnaire.exportJSON.useQuery({ token });

// Download as file
const blob = new Blob([data.json], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `questionnaire-${token}.json`;
a.click();
```

### CSV Export

**Endpoint:** `questionnaire.exportCSV`

**Implementation:** `server/pdfExport.ts`

```typescript
export function generateCSV(data: any): string {
  const rows: string[][] = [];
  
  // Header row
  rows.push(["Section", "Field", "Value"]);
  
  // Flatten nested data
  function flattenObject(obj: any, prefix = "") {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        flattenObject(value, `${prefix}${key}.`);
      } else {
        rows.push([prefix.split(".")[0], key, String(value)]);
      }
    }
  }
  
  flattenObject(data);
  
  // Convert to CSV string
  return rows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
  ).join("\n");
}
```

### TXT Export

**Endpoint:** `questionnaire.exportPDF`

**Implementation:** `server/pdfExport.ts`

```typescript
export async function generatePDFSimple(data: any): Promise<string> {
  let pdfContent = "";
  
  pdfContent += "=".repeat(60) + "\n";
  pdfContent += "QUESTIONNAIRE SUBMISSION\n";
  pdfContent += "=".repeat(60) + "\n\n";
  
  // Consent section
  if (data.consent) {
    pdfContent += "--- CONSENT ---\n";
    pdfContent += `Data Processing: ${data.consent.dataProcessing ? "Yes" : "No"}\n`;
    pdfContent += `Publication: ${data.consent.publicationConsent ? "Yes" : "No"}\n\n`;
  }
  
  // Respondent section
  if (data.respondent) {
    pdfContent += "--- RESPONDENT ---\n";
    pdfContent += formatObject(data.respondent);
    pdfContent += "\n";
  }
  
  // Parents section
  if (data.parents) {
    pdfContent += "--- PARENTS ---\n";
    pdfContent += formatObject(data.parents);
    pdfContent += "\n";
  }
  
  // ... more sections
  
  return pdfContent;
}

function formatObject(obj: any, indent = 0): string {
  let result = "";
  const spaces = "  ".repeat(indent);
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "object" && value !== null) {
      result += `${spaces}${key}:\n`;
      result += formatObject(value, indent + 1);
    } else {
      result += `${spaces}${key}: ${value}\n`;
    }
  }
  
  return result;
}
```

### File Storage

**Server-side storage:** `data/submissions/`

When a questionnaire is submitted, files are automatically saved:

```typescript
// server/fileStorage.ts
export async function saveSubmissionJSON(token: string, data: any) {
  const dir = path.join(process.cwd(), "data", "submissions");
  await fs.mkdir(dir, { recursive: true });
  
  const filePath = path.join(dir, `${token}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

export async function appendSubmissionCSV(data: any) {
  const dir = path.join(process.cwd(), "data", "submissions");
  const csvPath = path.join(dir, "all_submissions.csv");
  
  const csv = generateCSV(data);
  await fs.appendFile(csvPath, csv + "\n");
}
```

---

## Admin Panel

### Access Control

Admin panel is protected by role-based access control:

```typescript
// Check in tRPC procedure
if (ctx.user.role !== "admin") {
  throw new Error("Access denied. Admin role required.");
}
```

### Admin Dashboard Features

**Page:** `client/src/pages/AdminDashboard.tsx`

1. **Submissions List**
   - View all submissions (draft + submitted)
   - Filter by status
   - Sort by date
   - Search by respondent name

2. **Submission Details**
   - View full questionnaire data
   - See user information
   - Export individual submission

3. **Bulk Export**
   - Export all submissions as CSV
   - Download aggregated data

### Admin API Endpoints

**Get All Submissions:**

```typescript
const { data: submissions } = trpc.admin.getAllSubmissions.useQuery({
  status: "submitted" // optional: "draft" | "submitted"
});

// Returns array of:
{
  id: number;
  userId: number;
  token: string;
  status: "draft" | "submitted";
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date | null;
  userEmail: string;
  userName: string;
  respondentName: string; // Extracted from JSON
}
```

**Get Submission Details:**

```typescript
const { data: submission } = trpc.admin.getSubmission.useQuery({
  token: "uuid-here"
});

// Returns:
{
  id: number;
  userId: number;
  token: string;
  data: object; // Full questionnaire data
  status: "draft" | "submitted";
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
```

### Admin UI Components

**Submissions Table:**

```typescript
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Respondent</TableHead>
      <TableHead>User Email</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Submitted</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {submissions.map(s => (
      <TableRow key={s.id}>
        <TableCell>{s.respondentName}</TableCell>
        <TableCell>{s.userEmail}</TableCell>
        <TableCell>
          <Badge variant={s.status === "submitted" ? "default" : "secondary"}>
            {s.status}
          </Badge>
        </TableCell>
        <TableCell>{formatDate(s.submittedAt)}</TableCell>
        <TableCell>
          <Button onClick={() => viewDetails(s.token)}>View</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## Deployment

### Environment Variables

**Required variables:**

```bash
# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret
JWT_SECRET=your-secret-key-here

# OAuth (if using Manus OAuth)
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=your-app-id

# Owner Info
OWNER_OPEN_ID=owner-oauth-id
OWNER_NAME=Admin Name

# App Config
VITE_APP_TITLE=Questionnaire Platform
VITE_APP_LOGO=https://example.com/logo.png

# Node Environment
NODE_ENV=production
```

### Build Process

**Development:**

```bash
pnpm install
pnpm dev
```

**Production:**

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm db:push

# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

### Build Output

```
dist/
├── index.js          # Bundled server (Express + tRPC)
├── client/           # Static frontend assets
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
│   └── ...
```

### Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations (`pnpm db:push`)
- [ ] Build application (`pnpm build`)
- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up SSL certificate
- [ ] Configure firewall rules
- [ ] Set up backup strategy for database
- [ ] Configure log rotation
- [ ] Set up monitoring (CPU, memory, disk)
- [ ] Test all authentication flows
- [ ] Test file export functionality
- [ ] Verify admin panel access

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name example.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Frontend static files
    location / {
        root /var/www/app/dist/client;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Development Workflow

### Getting Started

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd family_questionnaire
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run database migrations:**
   ```bash
   pnpm db:push
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

### Development Scripts

```bash
# Start dev server (hot reload)
pnpm dev

# Type check
pnpm check

# Format code
pnpm format

# Run tests
pnpm test

# Database migrations
pnpm db:push

# Build for production
pnpm build

# Start production server
pnpm start
```

### Database Migrations

**Generate migration:**

```bash
# Edit drizzle/schema.ts
# Then run:
pnpm db:push
```

This will:
1. Generate SQL migration files in `drizzle/`
2. Apply migrations to database
3. Update `drizzle/meta/` metadata

**Migration files:**

```
drizzle/
├── 0000_cold_ender_wiggin.sql
├── 0001_regular_young_avengers.sql
├── 0002_naive_tag.sql
└── meta/
    ├── 0000_snapshot.json
    ├── 0001_snapshot.json
    ├── 0002_snapshot.json
    └── _journal.json
```

### Adding New Steps

1. **Create step component:**
   ```typescript
   // client/src/components/steps/NewStep.tsx
   export function NewStep({ form }: { form: UseFormReturn<QuestionnaireFormData> }) {
     return (
       <div className="space-y-6">
         {/* Step content */}
       </div>
     );
   }
   ```

2. **Update schema:**
   ```typescript
   // client/src/pages/Questionnaire.tsx
   const questionnaireSchema = z.object({
     // ... existing fields
     newSection: z.object({
       field1: z.string(),
       field2: z.number(),
     }).optional(),
   });
   ```

3. **Add to wizard:**
   ```typescript
   const steps = [
     // ... existing steps
     {
       id: 11,
       title: "New Step",
       component: <NewStep form={form} />,
     },
   ];
   ```

4. **Update ReviewStep:**
   ```typescript
   // client/src/components/steps/ReviewStep.tsx
   {data.newSection && renderSection("New Section", data.newSection, "purple")}
   ```

5. **Update export functions:**
   ```typescript
   // server/pdfExport.ts
   if (data.newSection) {
     pdfContent += "--- NEW SECTION ---\n";
     pdfContent += formatObject(data.newSection);
     pdfContent += "\n";
   }
   ```

### Testing

**Unit tests with Vitest:**

```typescript
// server/auth.test.ts
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "./auth";

describe("Password hashing", () => {
  it("should hash password correctly", async () => {
    const password = "test123";
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
    expect(hash).toMatch(/^\$2[aby]\$/);
  });
  
  it("should verify password correctly", async () => {
    const password = "test123";
    const hash = await hashPassword(password);
    const isValid = await verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });
});
```

**Run tests:**

```bash
pnpm test
```

### Code Style

**Prettier configuration:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2
}
```

**Format code:**

```bash
pnpm format
```

### Debugging

**Server-side:**

```typescript
// Add console.log in server code
console.log("[DEBUG]", { userId, token, data });
```

**Client-side:**

```typescript
// Use React DevTools
// Add console.log in components
console.log("[DEBUG]", formData);
```

**Database queries:**

```typescript
// Enable Drizzle query logging
const db = drizzle(connection, { logger: true });
```

---

## Appendix

### Common Issues

**Issue:** Database connection fails

**Solution:** Check `DATABASE_URL` format and network connectivity

```bash
# Test connection
mysql -h host -u user -p database
```

---

**Issue:** JWT token invalid

**Solution:** Verify `JWT_SECRET` is set and consistent across deployments

---

**Issue:** Auto-save not working

**Solution:** Check browser console for errors, verify token is set

---

### Performance Optimization

1. **Database indexing:**
   ```sql
   CREATE INDEX idx_submissions_user_id ON submissions(userId);
   CREATE INDEX idx_submissions_token ON submissions(token);
   CREATE INDEX idx_submissions_status ON submissions(status);
   ```

2. **Query optimization:**
   ```typescript
   // Use select() to fetch only needed fields
   const submissions = await db
     .select({
       id: submissions.id,
       token: submissions.token,
       status: submissions.status,
     })
     .from(submissions)
     .where(eq(submissions.userId, userId));
   ```

3. **Frontend optimization:**
   - Lazy load step components
   - Debounce auto-save
   - Use React.memo for expensive components
   - Optimize bundle size with code splitting

---

### Security Considerations

1. **SQL Injection:** Protected by Drizzle ORM parameterized queries
2. **XSS:** React auto-escapes JSX content
3. **CSRF:** SameSite cookie policy
4. **Password Storage:** bcrypt with 10 salt rounds
5. **Session Security:** HTTP-only cookies, secure flag in production
6. **Input Validation:** Zod schemas on client and server
7. **Authorization:** Role-based access control for admin routes

---

### License

MIT License - See LICENSE file for details

---

### Support

For technical support or questions:
- GitHub Issues: [repository-url]/issues
- Email: support@example.com
- Documentation: [docs-url]

---

**Document Version:** 1.0.0  
**Last Updated:** December 2024  
**Author:** Development Team
