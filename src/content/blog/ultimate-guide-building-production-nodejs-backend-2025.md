---
title: 'The Ultimate Guide to Building a Production-Grade Node.js Backend in 2025'
publishDate: 2025-08-06
categories: ['Node.js', 'Backend Development', 'TypeScript']
excerpt: 'A modular backend with clear layers (types, repository, service, controller, routes), Vitest for fast tests, and modern choices like Drizzle or Hono. Updated for how we build backends in 2025.'
image: '/blogs/ultimate-guide-building-production-nodejs-backend-2025.webp'
featured: true
readingTime: 20
tags:
  [
    'Node.js',
    'Express.js',
    'TypeScript',
    'Prisma',
    'Backend Development',
    'API Design',
    'Testing',
    'Security',
  ]
slug: 'ultimate-guide-building-production-nodejs-backend-2025'
howTo:
  name: How to build a production-grade Node.js backend in 2025
  steps:
    - name: Define a module (types, repository, service, controller, routes)
      text: Each feature lives in its own slice with strict layer rules. Routes call Controller only; Controller calls Service; Service calls Repository.
    - name: Add types and validation with Zod
      text: Put Zod schemas in the module types file; parse input in the controller and throw on invalid data.
    - name: Implement repository and service layers
      text: Repository talks to Prisma only. Service holds business logic, uses repo, and throws AppError subclasses.
    - name: Wire controller and routes
      text: Controller validates input, calls service, formats response, and passes errors to next(err). Routes mount controller methods only.
    - name: Add tests with Vitest
      text: Test types with schema.parse; mock repository in service tests; use vi.mock and vi.hoisted for clean mocks.
faqs:
  - question: 'What is the best structure for a Node.js backend in 2025?'
    answer: 'A module-based structure where each feature has its own types, repository, service, controller, and routes. Layers have strict rules: routes to controller to service to repository to database.'
  - question: 'Should I use Prisma or Drizzle for my Node.js backend?'
    answer: 'Both work. Prisma is mature and full-featured; Drizzle is lighter and can be faster. The module pattern in this guide works with either.'
  - question: 'How do I test a Node.js backend with clear layers?'
    answer: 'Use Vitest. Test types with Zod parse; mock the repository in service tests; keep controllers thin so integration or e2e tests can cover the HTTP layer.'
---

## Introduction: Better Ways to Build Backends in 2025

Older guides pushed a single "production" stack: Express, Prisma, Jest, and a flat folder of controllers, services, and repositories. That still works, but we have better options now. Faster tests, clearer boundaries, and tooling that fits how we actually ship.

This guide shows a **module-based** backend: each feature lives in its own slice (types, repository, service, controller, routes), with strict rules for who calls whom. We use **Vitest** for tests (faster, native TypeScript), **Zod** for validation, and keep the door open for **Drizzle** or **Hono** if you want a lighter ORM or a different HTTP layer. The ideas here apply no matter which framework you pick.

---

## Architecture and Testing

How we build modules (types, repository, service, controller, routes) and how we test them. The codebase uses **TypeScript** (`.ts`). Examples below sometimes show `.js` for brevity; use `.ts` and extension-less imports in practice.

### Quick reference

| Layer        | Can call              | Cannot call                    |
| ------------| --------------------- | ------------------------------ |
| Routes       | Controllers only      | Services, Repositories         |
| Controllers  | Services only         | Repositories, other controllers|
| Services     | Repositories, other services | Other repositories       |
| Repositories | Prisma only           | Services, other repositories   |

---

### Part 1: What is a module?

A **module** is a slice of the app around one concept (e.g. templates, sites, customers). Each module has:

1. **Types** – validation (Zod) and shared shapes  
2. **Repository** – database access only (Prisma or Drizzle)  
3. **Service** – business logic; uses repository, throws shared errors  
4. **Controller** – HTTP layer; parse input, call service, format response, `next(err)`  
5. **Routes** – wire paths to controller methods only; live **inside** the module  

Flow:

```
HTTP request → Routes → Controller → Service → Repository → Prisma → DB
                                ↓
                    (parse, format, errors to middleware)
```

**Rules:** Routes call Controller only. Controller calls Service only. Service calls Repository (and other services). Repository calls Prisma only.

---

### Part 2: Building a module

Layout (use **Templates** as the example):

```
src/modules/templates/
├── templates.types.ts
├── templates.repository.ts
├── templates.service.ts
├── templates.controller.ts
├── templates.routes.ts
├── index.ts
└── __tests__/
    ├── templates.types.test.ts
    └── templates.service.test.ts
```

- **Types:** Zod schemas; `schema.parse(...)` in controller.  
- **Repository:** Prisma only; `findAll`, `findById`, `create`, `update`, `delete`.  
- **Service:** Business logic; uses repo, throws `NotFoundError` / `ValidationError` etc.  
- **Controller:** `try` → validate (Zod), call service, `res.json(...)`; `catch` → `next(err)`.  
- **Routes:** `router.get('/', controller.getAll)`, etc. No logic.  
- **Index:** Export routes, service, repo, controller, types. Server mounts `app.use('/api/templates', templatesRoutes)`.

---

### Part 3: Tests (Vitest)

**Commands:** `npm test`, `npm run test:watch`, `npm run test:coverage`.

- **Types tests:** `schema.parse(valid)` / `expect(() => schema.parse(invalid)).toThrow()`. No mocks.  
- **Service tests:** Mock repository (and logger) with `vi.mock`, `vi.hoisted`, `vi.fn`. `beforeEach(() => vi.clearAllMocks())`. Assert on mock calls and return values.  
- **Optional:** Repository tests (real DB), integration tests (supertest). We rely on types plus service tests by default.

---

### Part 4: Checklist for a new module

- [ ] `src/modules/<name>/<name>.types.ts` – Zod schemas  
- [ ] `src/modules/<name>/<name>.repository.ts` – Prisma only  
- [ ] `src/modules/<name>/<name>.service.ts` – Uses repo, throws `AppError` subclasses  
- [ ] `src/modules/<name>/<name>.controller.ts` – Parse, call service, `res.json`, `next(err)`  
- [ ] `src/modules/<name>/<name>.routes.ts` – Router to controller only; export function that returns router  
- [ ] `src/modules/<name>/index.ts` – Export routes, service, repo, controller, types  
- [ ] Mount in `server.ts`: `app.use('/api/<name>', <name>Routes)`  
- [ ] No global `src/routes/<name>.ts`; routes live in the module  
- [ ] `__tests__/<name>.types.test.ts`, `__tests__/<name>.service.test.ts`

---

### Part 5: Layer summary

| Layer       | Responsibility       | Test with                    |
| -----------| -------------------- | ---------------------------- |
| Types      | Validation (Zod)     | Unit tests, no mocks         |
| Repository | DB access (Prisma)  | Optional DB tests            |
| Service    | Business logic       | Unit tests, mock repo        |
| Controller | HTTP layer          | Optional integration        |
| Routes     | Wire paths           | Optional integration         |

**Vitest:** `vi.mock`, `vi.hoisted`, `vi.fn`, `vi.clearAllMocks`, `expect(...).toMatchObject`, `toHaveBeenCalledWith`, `toThrow`.

---

## **Project Setup**

### **Step 1: Initialize the Project**

Create a new directory and initialize your project:

```bash
mkdir production-nodejs-backend
cd production-nodejs-backend
npm init -y
```

### **Step 2: Install Dependencies**

Install the core dependencies for our production backend:

```bash
npm install express cors helmet morgan dotenv zod winston prisma @prisma/client
npm install -D typescript @types/node @types/express @types/cors @types/morgan vitest supertest
```

### **Why These Packages?**

- **Express** – Web framework. For edge or smaller bundles, consider Hono or Fastify later.
- **CORS** – Cross-origin requests.
- **Helmet** – Security headers.
- **Morgan** – HTTP request logging.
- **Dotenv** – Environment variables.
- **Zod** – Runtime validation and shared types. Stays in the types layer.
- **Winston** – Structured logging.
- **Prisma** – Type-safe ORM. For a lighter, SQL-first option, Drizzle is a solid alternative.
- **Vitest** – Fast test runner, native TypeScript and ESM. Replaces Jest for new projects.
- **Supertest** – Optional HTTP integration tests.

### **Step 3: Configure TypeScript**

Create a `tsconfig.json` file:

```json
{
	"compilerOptions": {
		"target": "ES2020",
		"module": "commonjs",
		"lib": ["ES2020"],
		"outDir": "./dist",
		"rootDir": "./src",
		"strict": true,
		"esModuleInterop": true,
		"skipLibCheck": true,
		"forceConsistentCasingInFileNames": true,
		"noUncheckedIndexedAccess": true,
		"exactOptionalPropertyTypes": true,
		"resolveJsonModule": true,
		"declaration": true,
		"declarationMap": true,
		"sourceMap": true
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**Key TypeScript Settings:**

- **strict: true** - Enable all strict type checking
- **noUncheckedIndexedAccess** - Prevent undefined array access
- **exactOptionalPropertyTypes** - Stricter optional property handling

### **Step 4: Set Up Project Structure**

Use a **module-based** layout. Each feature (e.g. users, templates) is a module. Shared config and middleware stay at the top level.

```
src/
├── config/
│   ├── environment.ts
│   └── logger.ts
├── middleware/
│   ├── errorHandler.ts
│   ├── validation.ts
│   └── auth.ts
├── utils/
│   └── errors.ts
├── modules/
│   └── users/
│       ├── users.types.ts
│       ├── users.repository.ts
│       ├── users.service.ts
│       ├── users.controller.ts
│       ├── users.routes.ts
│       ├── index.ts
│       └── __tests__/
│           ├── users.types.test.ts
│           └── users.service.test.ts
├── app.ts
└── server.ts
```

Routes live **inside** each module. The server mounts them: `app.use('/api/users', usersRoutes)`. No global `src/routes/` or `src/controllers/` folder.

---

## **Database Setup with Prisma**

### **Why Prisma?**

Prisma is the modern ORM choice for 2025 because:

- **Type Safety** - Auto-generated types from your schema
- **Migration System** - Version-controlled database changes
- **Query Builder** - Intuitive, chainable API
- **Performance** - Optimized queries and connection pooling

### **Initialize Prisma**

```bash
npx prisma init
```

Choose SQLite for development (you can switch to PostgreSQL/MySQL for production):

```bash
npx prisma init --datasource-provider sqlite
```

### **Define Your Schema**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### **Generate Client and Run Migrations**

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## **Core Implementation**

### **1. Configuration Management**

Create `src/config/environment.ts`:

```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: z.string().transform(Number).default('3000'),
	DATABASE_URL: z.string(),
	JWT_SECRET: z.string().min(32),
	CORS_ORIGIN: z.string().url().optional(),
});

const env = envSchema.parse(process.env);

export default env;
```

**Why Validate Environment Variables?**

- Catch configuration errors early
- Ensure type safety for config values
- Prevent runtime errors from missing env vars

### **2. Type Definitions**

Create `src/modules/users/users.types.ts` (or a shared `src/types/index.ts` if you prefer). Per-module types keep the module self-contained. You can also define Zod schemas here (e.g. `createUserSchema`, `updateUserSchema`) and import them in routes and in types tests.

```typescript
import { z } from 'zod';

export interface User {
	id: string;
	email: string;
	name: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserInput {
	email: string;
	name: string;
}

export interface UpdateUserInput {
	email?: string;
	name?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

// Zod schemas for validation (used in routes and types tests)
export const createUserSchema = z.object({
	body: z.object({
		email: z.string().email(),
		name: z.string().min(2).max(100),
	}),
});
export const updateUserSchema = z.object({
	body: z.object({
		email: z.string().email().optional(),
		name: z.string().min(2).max(100).optional(),
	}),
	params: z.object({ id: z.string().cuid() }),
});
```

### **3. Error Handling**

Create `src/utils/errors.ts`:

```typescript
export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;

	constructor(
		message: string,
		statusCode: number = 500,
		isOperational: boolean = true
	) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this, this.constructor);
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string = 'Resource not found') {
		super(message, 404);
	}
}

export class ConflictError extends AppError {
	constructor(message: string = 'Resource already exists') {
		super(message, 409);
	}
}
```

**Why Custom Error Classes?**

- Consistent error handling across the application
- Proper HTTP status codes
- Stack trace preservation
- Easy to distinguish between operational and programming errors

### **4. Logging with Winston**

Create `src/config/logger.ts`:

```typescript
import winston from 'winston';
import env from './environment';

const logger = winston.createLogger({
	level: env.NODE_ENV === 'production' ? 'info' : 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({ stack: true }),
		winston.format.json()
	),
	defaultMeta: { service: 'nodejs-backend' },
	transports: [
		new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
		new winston.transports.File({ filename: 'logs/combined.log' }),
	],
});

if (env.NODE_ENV !== 'production') {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		})
	);
}

export default logger;
```

**Why Structured Logging?**

- Machine-readable logs for monitoring
- Consistent format across all log entries
- Easy to filter and search
- Better debugging experience

### **5. Input Validation with Zod**

Create `src/middleware/validation.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error) {
			if (error instanceof Error) {
				next(new ValidationError(error.message));
			} else {
				next(new ValidationError('Validation failed'));
			}
		}
	};
};

// Validation schemas
export const createUserSchema = z.object({
	body: z.object({
		email: z.string().email(),
		name: z.string().min(2).max(100),
	}),
});

export const updateUserSchema = z.object({
	body: z.object({
		email: z.string().email().optional(),
		name: z.string().min(2).max(100).optional(),
	}),
	params: z.object({
		id: z.string().cuid(),
	}),
});
```

**Why Zod over Joi?**

- Better TypeScript integration
- Runtime type inference
- More intuitive API
- Better error messages

### **6. Repository Layer**

Create `src/modules/users/users.repository.ts`:

```typescript
import { PrismaClient, User } from '@prisma/client';
import { CreateUserInput, UpdateUserInput } from './users.types';
import { NotFoundError, ConflictError } from '../../utils/errors';
import logger from '../../config/logger';

export class UserRepository {
	constructor(private prisma: PrismaClient) {}

	async findAll(): Promise<User[]> {
		try {
			return await this.prisma.user.findMany({
				orderBy: { createdAt: 'desc' },
			});
		} catch (error) {
			logger.error('Error fetching users:', error);
			throw error;
		}
	}

	async findById(id: string): Promise<User> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id },
			});

			if (!user) {
				throw new NotFoundError(`User with id ${id} not found`);
			}

			return user;
		} catch (error) {
			logger.error(`Error fetching user ${id}:`, error);
			throw error;
		}
	}

	async findByEmail(email: string): Promise<User | null> {
		try {
			return await this.prisma.user.findUnique({
				where: { email },
			});
		} catch (error) {
			logger.error(`Error fetching user by email ${email}:`, error);
			throw error;
		}
	}

	async create(data: CreateUserInput): Promise<User> {
		try {
			const existingUser = await this.findByEmail(data.email);
			if (existingUser) {
				throw new ConflictError(`User with email ${data.email} already exists`);
			}

			return await this.prisma.user.create({
				data,
			});
		} catch (error) {
			logger.error('Error creating user:', error);
			throw error;
		}
	}

	async update(id: string, data: UpdateUserInput): Promise<User> {
		try {
			const user = await this.findById(id);

			if (data.email && data.email !== user.email) {
				const existingUser = await this.findByEmail(data.email);
				if (existingUser) {
					throw new ConflictError(
						`User with email ${data.email} already exists`
					);
				}
			}

			return await this.prisma.user.update({
				where: { id },
				data,
			});
		} catch (error) {
			logger.error(`Error updating user ${id}:`, error);
			throw error;
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await this.findById(id);
			await this.prisma.user.delete({
				where: { id },
			});
		} catch (error) {
			logger.error(`Error deleting user ${id}:`, error);
			throw error;
		}
	}
}
```

**Repository Pattern Benefits:**

- **Abstraction** - Hide database implementation details
- **Testability** - Easy to mock for unit tests
- **Flexibility** - Can switch databases without changing business logic
- **Error Handling** - Centralized database error management

### **7. Service Layer**

Create `src/modules/users/users.service.ts`:

```typescript
import { User } from '@prisma/client';
import { CreateUserInput, UpdateUserInput } from './users.types';
import { UserRepository } from './users.repository';
import logger from '../../config/logger';

export class UserService {
	constructor(private userRepository: UserRepository) {}

	async getAllUsers(): Promise<User[]> {
		logger.info('Fetching all users');
		return await this.userRepository.findAll();
	}

	async getUserById(id: string): Promise<User> {
		logger.info(`Fetching user with id: ${id}`);
		return await this.userRepository.findById(id);
	}

	async createUser(data: CreateUserInput): Promise<User> {
		logger.info(`Creating new user with email: ${data.email}`);

		// Business logic validation
		if (data.name.trim().length < 2) {
			throw new Error('Name must be at least 2 characters long');
		}

		return await this.userRepository.create(data);
	}

	async updateUser(id: string, data: UpdateUserInput): Promise<User> {
		logger.info(`Updating user with id: ${id}`);

		// Business logic validation
		if (data.name && data.name.trim().length < 2) {
			throw new Error('Name must be at least 2 characters long');
		}

		return await this.userRepository.update(id, data);
	}

	async deleteUser(id: string): Promise<void> {
		logger.info(`Deleting user with id: ${id}`);
		await this.userRepository.delete(id);
	}
}
```

**Service Layer Benefits:**

- **Business Logic** - Centralized business rules
- **Orchestration** - Coordinate between multiple repositories
- **Validation** - Business-level validation
- **Transaction Management** - Handle complex operations

### **8. Controller Layer**

Create `src/modules/users/users.controller.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { UserService } from './users.service';
import { ApiResponse } from './users.types';
import { AppError } from '../../utils/errors';

export class UserController {
	constructor(private userService: UserService) {}

	async getAllUsers(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const users = await this.userService.getAllUsers();

			const response: ApiResponse<typeof users> = {
				success: true,
				data: users,
				message: 'Users retrieved successfully',
			};

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async getUserById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const user = await this.userService.getUserById(id);

			const response: ApiResponse<typeof user> = {
				success: true,
				data: user,
				message: 'User retrieved successfully',
			};

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async createUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const userData = req.body;
			const user = await this.userService.createUser(userData);

			const response: ApiResponse<typeof user> = {
				success: true,
				data: user,
				message: 'User created successfully',
			};

			res.status(201).json(response);
		} catch (error) {
			next(error);
		}
	}

	async updateUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			const userData = req.body;
			const user = await this.userService.updateUser(id, userData);

			const response: ApiResponse<typeof user> = {
				success: true,
				data: user,
				message: 'User updated successfully',
			};

			res.status(200).json(response);
		} catch (error) {
			next(error);
		}
	}

	async deleteUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { id } = req.params;
			await this.userService.deleteUser(id);

			const response: ApiResponse<null> = {
				success: true,
				message: 'User deleted successfully',
			};

			res.status(204).json(response);
		} catch (error) {
			next(error);
		}
	}
}
```

**Controller Benefits:**

- **HTTP Handling** - Only HTTP-specific concerns
- **Request/Response** - Handle Express request/response objects
- **Error Delegation** - Pass errors to error handling middleware
- **Status Codes** - Set appropriate HTTP status codes

### **9. Validation Middleware**

Update `src/middleware/validation.ts` to include the schemas:

```typescript
import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, z } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: AnyZodObject) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (error) {
			if (error instanceof Error) {
				next(new ValidationError(error.message));
			} else {
				next(new ValidationError('Validation failed'));
			}
		}
	};
};

// Validation schemas
export const createUserSchema = z.object({
	body: z.object({
		email: z.string().email(),
		name: z.string().min(2).max(100),
	}),
});

export const updateUserSchema = z.object({
	body: z.object({
		email: z.string().email().optional(),
		name: z.string().min(2).max(100).optional(),
	}),
	params: z.object({
		id: z.string().cuid(),
	}),
});
```

### **10. Error Handling Middleware**

Create `src/middleware/errorHandler.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../config/logger';
import env from '../config/environment';

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	logger.error('Error occurred:', {
		error: error.message,
		stack: error.stack,
		url: req.url,
		method: req.method,
		ip: req.ip,
	});

	if (error instanceof AppError) {
		res.status(error.statusCode).json({
			success: false,
			error: error.message,
			...(env.NODE_ENV === 'development' && { stack: error.stack }),
		});
		return;
	}

	// Handle Prisma errors
	if (error.name === 'PrismaClientKnownRequestError') {
		res.status(400).json({
			success: false,
			error: 'Database operation failed',
			...(env.NODE_ENV === 'development' && { details: error.message }),
		});
		return;
	}

	// Handle validation errors
	if (error.name === 'ZodError') {
		res.status(400).json({
			success: false,
			error: 'Validation failed',
			...(env.NODE_ENV === 'development' && { details: error.message }),
		});
		return;
	}

	// Default error
	res.status(500).json({
		success: false,
		error:
			env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
		...(env.NODE_ENV === 'development' && { stack: error.stack }),
	});
};
```

### **11. Routes**

Create `src/modules/users/users.routes.ts`. Routes live in the module and call only the controller.

```typescript
import { Router } from 'express';
import { UserController } from './users.controller';
import {
	validate,
	createUserSchema,
	updateUserSchema,
} from '../../middleware/validation';

export function createUserRoutes(controller: UserController) {
	const router = Router();
	router.get('/', (req, res, next) => controller.getAllUsers(req, res, next));
	router.get('/:id', (req, res, next) => controller.getUserById(req, res, next));
	router.post('/', validate(createUserSchema), (req, res, next) =>
		controller.createUser(req, res, next)
	);
	router.put('/:id', validate(updateUserSchema), (req, res, next) =>
		controller.updateUser(req, res, next)
	);
	router.delete('/:id', (req, res, next) => controller.deleteUser(req, res, next));
	return router;
}
```

The module `index.ts` can export a function that takes Prisma (or a config) and returns the router so the app only does `app.use('/api/users', createUserRoutes(prisma))`.

### **12. Main Application**

Create `src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';
import logger from './config/logger';
import env from './config/environment';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
	cors({
		origin: env.CORS_ORIGIN || '*',
		credentials: true,
	})
);

// Request logging
app.use(
	morgan('combined', {
		stream: {
			write: (message) => logger.info(message.trim()),
		},
	})
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes: mount module routes (e.g. createUserRoutes(prisma) from modules/users)
import { createUserRoutes } from './modules/users';
const prisma = new PrismaClient();
app.use('/api/users', createUserRoutes(prisma));

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		error: `Route ${req.originalUrl} not found`,
	});
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
```

### **13. Server Entry Point**

Create `src/server.ts`:

```typescript
import app from './app';
import env from './config/environment';
import logger from './config/logger';

const server = app.listen(env.PORT, () => {
	logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	logger.info('SIGTERM received, shutting down gracefully');
	server.close(() => {
		logger.info('Process terminated');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	logger.info('SIGINT received, shutting down gracefully');
	server.close(() => {
		logger.info('Process terminated');
		process.exit(0);
	});
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
	logger.error('Unhandled Promise Rejection:', err);
	server.close(() => {
		process.exit(1);
	});
});
```

---

## **Testing Strategy**

We rely on **types tests** (Zod schemas, no mocks) and **service tests** (mock the repository). Integration and repository tests are optional.

### **Vitest Setup**

Add to `package.json` or create `vitest.config.ts`:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		include: ['src/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov', 'html'],
			exclude: ['node_modules', 'dist', '**/*.test.ts'],
		},
	},
	resolve: {
		alias: { '@': path.resolve(__dirname, './src') },
	},
});
```

### **Types Tests**

Create `src/modules/users/__tests__/users.types.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { createUserSchema } from '../users.types';

describe('users.types', () => {
	it('accepts valid create payload', () => {
		const valid = { body: { email: 'a@b.com', name: 'Ab' } };
		expect(createUserSchema.parse(valid)).toMatchObject(valid);
	});

	it('throws on invalid email', () => {
		expect(() =>
			createUserSchema.parse({ body: { email: 'invalid', name: 'Ab' } })
		).toThrow();
	});
});
```

### **Service Tests (Mock Repository)**

Create `src/modules/users/__tests__/users.service.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../users.service';
import { UserRepository } from '../users.repository';

const mockRepo = {
	findAll: vi.fn(),
	findById: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	delete: vi.fn(),
};

beforeEach(() => vi.clearAllMocks());

describe('UserService', () => {
	it('getAllUsers returns repo result', async () => {
		const users = [{ id: '1', email: 'a@b.com', name: 'A', createdAt: new Date(), updatedAt: new Date() }];
		mockRepo.findAll.mockResolvedValue(users);
		const service = new UserService(mockRepo as unknown as UserRepository);
		const result = await service.getAllUsers();
		expect(result).toMatchObject(users);
		expect(mockRepo.findAll).toHaveBeenCalledOnce();
	});

	it('createUser calls repo.create with valid data', async () => {
		const created = { id: '1', email: 'a@b.com', name: 'Ab', createdAt: new Date(), updatedAt: new Date() };
		mockRepo.create.mockResolvedValue(created);
		const service = new UserService(mockRepo as unknown as UserRepository);
		const result = await service.createUser({ email: 'a@b.com', name: 'Ab' });
		expect(mockRepo.create).toHaveBeenCalledWith({ email: 'a@b.com', name: 'Ab' });
		expect(result).toMatchObject(created);
	});
});
```

### **Package Scripts**

Add test scripts to `package.json`:

```json
{
	"scripts": {
		"test": "vitest",
		"test:watch": "vitest --watch",
		"test:coverage": "vitest run --coverage"
	}
}
```

Optional: use Supertest for integration tests against `app`; keep those in a separate `__tests__/integration` or similar so unit tests stay fast.

---

## **Package Scripts**

Add these scripts to your `package.json`:

```json
{
	"scripts": {
		"dev": "ts-node-dev --respawn --transpile-only src/server.ts",
		"build": "tsc",
		"start": "node dist/server.js",
		"test": "vitest",
		"test:watch": "vitest --watch",
		"test:coverage": "vitest run --coverage",
		"lint": "eslint src/**/*.ts",
		"lint:fix": "eslint src/**/*.ts --fix",
		"db:generate": "prisma generate",
		"db:migrate": "prisma migrate dev",
		"db:studio": "prisma studio",
		"db:seed": "ts-node src/scripts/seed.ts"
	}
}
```

---

## **Security Best Practices**

### **1. Input Validation**

- Zod schemas validate all inputs
- Type checking prevents type-related vulnerabilities
- Sanitization removes malicious content

### **2. Security Headers**

- Helmet sets security headers automatically
- CORS configured for your domains
- Rate limiting (can be added with express-rate-limit)

### **3. Environment Variables**

- Never commit secrets to version control
- Validate environment variables on startup
- Use different configs for different environments

### **4. Error Handling**

- Don't expose internal errors in production
- Log all errors for debugging
- Return consistent error responses

---

## **Deployment Ready**

### **Production Build**

```bash
npm run build
npm start
```

### **Environment Variables for Production**

Create `.env.production`:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL="file:./prod.db"
JWT_SECRET="your-super-secure-jwt-secret-key-here"
CORS_ORIGIN="https://yourdomain.com"
```

### **Docker Support (Optional)**

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

---

## **Key Takeaways**

### **Why This Architecture Works**

- **Separation of Concerns** - Each layer has a single responsibility
- **Dependency Injection** - Easy to test and maintain
- **Type Safety** - Catch errors at compile time
- **Error Handling** - Graceful failure management
- **Testing** - Comprehensive test coverage
- **Logging** - Observability for debugging
- **Security** - Protection against common attacks

### **Best Practices Applied**

- **Single Responsibility Principle** - Each class has one job
- **Dependency Inversion** - High-level modules don't depend on low-level modules
- **Open/Closed Principle** - Open for extension, closed for modification
- **Interface Segregation** - Clients don't depend on interfaces they don't use
- **DRY (Don't Repeat Yourself)** - Reusable components and utilities

### **Modern Tooling Choices**

- **TypeScript** – Type safety and better DX.
- **Prisma** – Type-safe ORM. For a lighter, SQL-first option, **Drizzle** is a strong alternative (smaller bundle, great for serverless).
- **Zod** – Runtime validation and shared types in the types layer.
- **Winston** – Structured logging.
- **Vitest** – Fast tests, native ESM and TypeScript. Prefer it over Jest for new Node backends.
- **Express** – Mature and well-supported. For edge or smaller footprint, **Hono** or **Fastify** are good alternatives.

---

## **Modern alternatives in 2025**

The layered module pattern (types, repository, service, controller, routes) does not depend on a specific framework. You can swap pieces and still keep the same boundaries.

- **ORM:** Prisma is full-featured and great for teams. If you want a smaller bundle, SQL-first APIs, or better serverless cold starts, **Drizzle** is a strong choice. Schema lives in TypeScript; you keep the same repository layer, just backed by Drizzle instead of Prisma.
- **HTTP layer:** Express is the default here. **Hono** fits edge and multi-runtime (Node, Bun, Deno) and stays tiny. **Fastify** gives you speed and a solid plugin ecosystem. **Elysia** (Bun-first) is another option if you target Bun. In all cases, routes still call controllers only.
- **Tests:** **Vitest** is the better default for new Node backends: faster than Jest, native ESM and TypeScript, and the same `expect`/mock mental model. Use `vi.mock` for the repository in service tests and keep types tests free of mocks.

Start with the stack in this guide and switch one piece at a time if you need to (e.g. add Drizzle for a new service or move one app to Hono for edge).

---

## **API Examples**

### **Create a User**

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

**Response:**

```json
{
	"success": true,
	"data": {
		"id": "cmdx4xjxp0000s3oqfw50f3be",
		"email": "john@example.com",
		"name": "John Doe",
		"createdAt": "2025-01-25T10:30:00.000Z",
		"updatedAt": "2025-01-25T10:30:00.000Z"
	},
	"message": "User created successfully"
}
```

### **Get All Users**

```bash
curl http://localhost:3000/api/users
```

**Response:**

```json
{
	"success": true,
	"data": [
		{
			"id": "cmdx4xjxp0000s3oqfw50f3be",
			"email": "john@example.com",
			"name": "John Doe",
			"createdAt": "2025-01-25T10:30:00.000Z",
			"updatedAt": "2025-01-25T10:30:00.000Z"
		}
	],
	"message": "Users retrieved successfully"
}
```

### **Update a User**

```bash
curl -X PUT http://localhost:3000/api/users/cmdx4xjxp0000s3oqfw50f3be \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith"
  }'
```

### **Delete a User**

```bash
curl -X DELETE http://localhost:3000/api/users/cmdx4xjxp0000s3oqfw50f3be
```

---

## **When to Use This (and When to Evolve)**

This layout works well for small and medium apps, MVPs, and learning. Routes in modules, clear layers, and Vitest give you a base that is easy to reason about and change.

If you outgrow it, you might add: microservices or a monorepo, event-driven or CQRS-style boundaries, OpenAPI docs, or Redis (or similar) for caching. Start with this, then add complexity only when you need it.

---

## **Conclusion**

You get a backend that is type-safe (TypeScript and Zod), layered by module (types, repository, service, controller, routes), and testable with Vitest and clear boundaries. Add auth, rate limiting, caching, or OpenAPI when you need them. Use this as the base and adapt as your app and team grow.
