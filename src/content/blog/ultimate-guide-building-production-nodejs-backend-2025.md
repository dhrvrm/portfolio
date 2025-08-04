---
title: 'The Ultimate Guide to Building a Production-Grade Node.js Backend in 2025'
publishDate: 2025-08-06
categories: ['Node.js', 'Backend Development', 'TypeScript']
excerpt: 'Learn how to set up a robust, scalable, and maintainable Express.js backend with TypeScript, Prisma, and modern best practices for production applications.'
image: '/blogs/nodejs/ultimate-guide-building-production-nodejs-backend-2025.webp'
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
---

## **Introduction: Building Production-Ready Backends in 2025**

Building a production-ready backend in 2025 requires more than just throwing together some Express routes. Modern applications demand type safety, robust error handling, comprehensive testing, and security best practices that go far beyond basic CRUD operations.

In this comprehensive guide, we'll build a complete Node.js backend using the Controller-Service-Repository pattern with TypeScript, Prisma ORM, and modern tooling. By the end, you'll have a scalable, maintainable, and production-grade backend that follows industry best practices.

> **Complete Code**: The full source code for this tutorial is available on GitHub: [production-nodejs-backend-2025](https://github.com/dhrvrm/production-nodejs-backend-2025)

---

## **Why This Architecture Matters**

Modern backend development requires careful consideration of several critical factors:

- **Type Safety** - Catch errors at compile time, not runtime
- **Database Abstraction** - Clean, type-safe database operations
- **Input Validation** - Prevent security vulnerabilities and data corruption
- **Error Handling** - Graceful failure management across the application
- **Testing** - Reliable, maintainable test suites for confidence
- **Logging** - Comprehensive observability for debugging and monitoring
- **Security** - Protection against common attacks and vulnerabilities

This guide shows you how to build a backend that ticks all these boxes using modern tools and architectural patterns.

---

## **Architecture Overview**

We'll implement the **Controller-Service-Repository Pattern** - a proven architecture that separates concerns and makes your code maintainable and testable:

```
┌─────────────────┐
│   Controller    │ ← HTTP handling, request/response
├─────────────────┤
│    Service      │ ← Business logic, orchestration
├─────────────────┤
│  Repository     │ ← Data access, database operations
└─────────────────┘
```

### **Why This Pattern?**

- **Single Responsibility** - Each layer has one job and does it well
- **Testability** - Easy to mock dependencies for unit testing
- **Maintainability** - Changes in one layer don't affect others
- **Scalability** - Easy to add new features without breaking existing code

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
npm install -D typescript @types/node @types/express @types/cors @types/morgan jest supertest @types/jest ts-jest
```

### **Why These Packages?**

- **Express** - The web framework (still the most popular and mature)
- **CORS** - Handle cross-origin requests securely
- **Helmet** - Security headers for protection
- **Morgan** - HTTP request logging for observability
- **Dotenv** - Environment variable management
- **Zod** - Runtime type validation (better than Joi in 2025)
- **Winston** - Structured logging for production
- **Prisma** - Type-safe database ORM
- **Jest + Supertest** - Testing framework and HTTP testing

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

Create the following directory structure:

```
src/
├── config/
│   ├── database.ts
│   ├── environment.ts
│   └── logger.ts
├── controllers/
│   └── userController.ts
├── services/
│   └── userService.ts
├── repositories/
│   └── userRepository.ts
├── middleware/
│   ├── errorHandler.ts
│   ├── validation.ts
│   └── auth.ts
├── routes/
│   └── userRoutes.ts
├── types/
│   └── index.ts
├── utils/
│   └── errors.ts
├── app.ts
└── server.ts
```

This structure follows the **Separation of Concerns** principle and makes the codebase maintainable and scalable.

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

Create `src/types/index.ts`:

```typescript
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

Create `src/repositories/userRepository.ts`:

```typescript
import { PrismaClient, User } from '@prisma/client';
import { CreateUserInput, UpdateUserInput } from '../types';
import { NotFoundError, ConflictError } from '../utils/errors';
import logger from '../config/logger';

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

Create `src/services/userService.ts`:

```typescript
import { User } from '@prisma/client';
import { CreateUserInput, UpdateUserInput } from '../types';
import { UserRepository } from '../repositories/userRepository';
import logger from '../config/logger';

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

Create `src/controllers/userController.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { ApiResponse } from '../types';
import { AppError } from '../utils/errors';
import logger from '../config/logger';

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

Create `src/routes/userRoutes.ts`:

```typescript
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { UserRepository } from '../repositories/userRepository';
import {
	validate,
	createUserSchema,
	updateUserSchema,
} from '../middleware/validation';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// GET /api/users
router.get('/', (req, res, next) => userController.getAllUsers(req, res, next));

// GET /api/users/:id
router.get('/:id', (req, res, next) =>
	userController.getUserById(req, res, next)
);

// POST /api/users
router.post('/', validate(createUserSchema), (req, res, next) =>
	userController.createUser(req, res, next)
);

// PUT /api/users/:id
router.put('/:id', validate(updateUserSchema), (req, res, next) =>
	userController.updateUser(req, res, next)
);

// DELETE /api/users/:id
router.delete('/:id', (req, res, next) =>
	userController.deleteUser(req, res, next)
);

export default router;
```

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

// API routes
app.use('/api/users', userRoutes);

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

### **Why Testing Matters**

Testing is crucial for production applications because:

- **Confidence** - Deploy with confidence knowing your code works
- **Refactoring** - Safe to refactor without breaking functionality
- **Documentation** - Tests serve as living documentation
- **Bug Prevention** - Catch issues before they reach production

### **Test Setup**

Create `jest.config.js`:

```javascript
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/server.ts'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html'],
};
```

### **API Tests**

Create `src/__tests__/user.test.ts`:

```typescript
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('User API', () => {
	beforeAll(async () => {
		// Clean database before tests
		await prisma.user.deleteMany();
	});

	afterAll(async () => {
		await prisma.$disconnect();
	});

	describe('POST /api/users', () => {
		it('should create a new user', async () => {
			const userData = {
				email: 'test@example.com',
				name: 'Test User',
			};

			const response = await request(app)
				.post('/api/users')
				.send(userData)
				.expect(201);

			expect(response.body.success).toBe(true);
			expect(response.body.data.email).toBe(userData.email);
			expect(response.body.data.name).toBe(userData.name);
			expect(response.body.data.id).toBeDefined();
		});

		it('should return 400 for invalid email', async () => {
			const userData = {
				email: 'invalid-email',
				name: 'Test User',
			};

			const response = await request(app)
				.post('/api/users')
				.send(userData)
				.expect(400);

			expect(response.body.success).toBe(false);
			expect(response.body.error).toContain('Validation failed');
		});
	});

	describe('GET /api/users', () => {
		it('should return all users', async () => {
			const response = await request(app).get('/api/users').expect(200);

			expect(response.body.success).toBe(true);
			expect(Array.isArray(response.body.data)).toBe(true);
		});
	});
});
```

### **Jest Configuration**

Add test scripts to `package.json`:

```json
{
	"scripts": {
		"test": "jest",
		"test:watch": "jest --watch",
		"test:coverage": "jest --coverage",
		"test:e2e": "jest --config jest.e2e.config.js"
	}
}
```

---

## **Package Scripts**

Add these scripts to your `package.json`:

```json
{
	"scripts": {
		"dev": "ts-node-dev --respawn --transpile-only src/server.ts",
		"build": "tsc",
		"start": "node dist/server.js",
		"test": "jest",
		"test:watch": "jest --watch",
		"test:coverage": "jest --coverage",
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

- **TypeScript** - Type safety and better developer experience
- **Prisma** - Type-safe database operations
- **Zod** - Runtime type validation
- **Winston** - Structured logging
- **Jest** - Modern testing framework
- **Express** - Mature, well-supported web framework

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

## **Important Disclaimer: Architecture Considerations**

Before we conclude, it's important to note that this architecture serves as an excellent foundation for beginners and small to medium-sized applications. However, it's not a one-size-fits-all solution for all production scenarios.

### **When This Architecture Works Well**

- **Small to medium applications** - Perfect for startups and MVPs
- **Learning and skill development** - Great foundation for understanding patterns
- **Rapid prototyping** - Quick to implement and iterate
- **Team onboarding** - Easy for new developers to understand

### **When You Might Need Different Approaches**

As your application grows in complexity and scale, you might consider:

- **Microservices Architecture** - Separate services for different domains
- **Monorepo Structure** - Multiple related services in a single repository
- **Event-Driven Architecture** - Asynchronous communication between services
- **Domain-Driven Design (DDD)** - More complex domain modeling
- **CQRS Pattern** - Separate read and write models
- **Event Sourcing** - Append-only event logs for state reconstruction
- **OpenAPI/Swagger Documentation** - Auto-generated API documentation and testing
- **Caching Strategy** - Redis or in-memory caching for frequently accessed data

### **Production Reality Check**

In real-world production environments, you might encounter:

- **Team scaling** - Multiple teams working on different services
- **Technology diversity** - Different services using different tech stacks
- **Deployment complexity** - Container orchestration, service mesh, etc.
- **Data consistency** - Distributed transactions and eventual consistency
- **Operational overhead** - Monitoring, logging, and debugging across services

> **Quick Tip**: Start with this architecture and evolve it based on your actual needs. Don't over-engineer from day one, but be prepared to refactor when the complexity demands it.

---

## **Conclusion**

This setup provides you with a production-grade Node.js backend that's:

- **Type-safe** with TypeScript
- **Well-architected** with clean separation of concerns
- **Testable** with comprehensive test coverage
- **Secure** with proper validation and error handling
- **Observable** with structured logging
- **Scalable** with modular design
- **Maintainable** with clear patterns and conventions

The architecture and patterns used here will scale with your application and make it easy to add new features while maintaining code quality and reliability. Whether you're building a small API or a large-scale application, these foundations will serve you well in 2025 and beyond.

**Remember**: This is a solid foundation, not a rule of thumb. Use it as a starting point and adapt it to your specific needs as your application and team grow.

> **Quick Tip**: Start with this foundation and gradually add features like authentication, rate limiting, caching, and monitoring as your application grows.

> **Next Steps**: Consider adding JWT authentication, Redis caching for API performance, API documentation with OpenAPI/Swagger, and monitoring with tools like Prometheus and Grafana for a complete production setup.
