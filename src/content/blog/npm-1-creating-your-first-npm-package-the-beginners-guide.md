---
title: 'Creating Your First NPM Package: The Beginners Guide'
publishDate: 2025-01-24
categories: ['JavaScript', 'NPM', 'Package Development']
excerpt: 'Learn how to create, structure, and publish your first NPM package with TypeScript support, dual module formats, and professional configuration.'
series: 'NPM Package Development'
seriesPart: 1
image: '/blogs/npm/creating-your-first-npm-package-the-beginners-guide.webp'
featured: true
readingTime: 15
tags: ['JavaScript', 'NPM', 'TypeScript', 'Package Development', 'Rollup']
slug: 'creating-your-first-npm-package-the-beginners-guide'
---

## **Introduction: Building Your First NPM Package**

Creating your own NPM package might seem daunting at first, but it's one of the most rewarding ways to contribute to the JavaScript ecosystem. Whether you're building utility functions, React components, or complex libraries, understanding how to properly structure and configure an NPM package is essential for modern JavaScript development.

In this comprehensive guide, we'll build a string manipulation package from scratch, covering every step from initial setup to dual module support with TypeScript definitions. By the end, you'll have a solid foundation for an NPM package that you can extend and improve for production use.

> **Complete Code**: The full source code for this tutorial is available on GitHub: [how-to-make-npm-package/ex1/strings](https://github.com/dhrvrm/how-to-make-npm-package/tree/ex1/strings)

> **Series Note**: This is Chapter 1 of the NPM Package Development series. [Chapter 2 is also available](/blog/publishing-your-npm-package-from-code-to-registry) on how publish the package you're going to make here.

---

## **Project Setup and Structure**

Let's start by creating our project structure. We'll build a string manipulation library that provides common utility functions like capitalization, slugification, and text truncation.

### **Directory Structure**

Here's the complete directory structure we'll create:

```
string-manipulation-examples/
├── src/
│   ├── index.ts
│   ├── capitalizeFirstLetter.ts
│   ├── reverseWords.ts
│   ├── slugifyText.ts
│   └── truncateString.ts
├── lib/                    # Generated build output
│   ├── index.cjs
│   ├── index.esm.js
│   └── types/
│       └── index.d.ts
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── rollup.config.js
├── README.md
└── LICENSE
```

### **Initialize Your Repository**

First, create a new repository on GitHub with a README and MIT license, then clone it locally:

```bash
git clone https://github.com/yourusername/your-package-name.git
cd your-package-name
```

### **Create the Basic Structure**

Set up your project structure with the essential files:

```bash
mkdir src
touch src/index.ts
touch .gitignore
```

Add the following to your `.gitignore` file:

```gitignore
lib
node_modules
```

This ensures we don't commit our build artifacts or dependencies to version control.

---

## **Package.json Configuration**

The `package.json` file is the heart of your NPM package. It contains metadata about your package and tells various tools how to handle your code.

### **Initialize Package.json**

Run the following command to create your initial `package.json`:

```bash
npm init
```

Follow the prompts and customize the details. Here's what your `package.json` should look like after initialization:

```json
{
	"name": "string-manipulation-examples",
	"version": "1.0.0",
	"description": "A comprehensive string manipulation library with TypeScript support",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"repository": {
		"type": "git",
		"url": "git+https://github.com/dhrvrm/how-to-make-npm-package.git"
	},
	"keywords": [
		"string",
		"manipulation",
		"capitalize",
		"slugify",
		"truncate",
		"reverse"
	],
	"author": "dhrvrm",
	"license": "MIT",
	"bugs": {
		"url": "https://github.com/dhrvrm/how-to-make-npm-package/issues"
	},
	"homepage": "https://github.com/dhrvrm/how-to-make-npm-package#readme"
}
```

> **Quick Tip:** Choose descriptive keywords that developers might search for. This improves your package's discoverability on NPM.

> **Quick Tip:** Keep your package version at 1.0.0 during development. Only increment version numbers when you're ready to publish or make significant changes. This helps maintain consistency throughout the tutorial.

> **Quick Tip:** Use descriptive package names that clearly indicate functionality. Avoid generic names like "utils" or "helpers" as they're likely already taken and don't communicate purpose.

### **Understanding Package Names and Scoping**

Package names in NPM come in two flavors: **scoped** and **unscoped**.

- **Unscoped packages** look like `string-manipulation-examples` and are always public.
- **Scoped packages** look like `@yournamespace/package-name` and can be either public or private.

For learning purposes, we'll use an unscoped name, but in production, consider using scoped packages for better namespace management.

---

## **Building Your Package Functions**

Now let's create the actual functionality for our string manipulation package.

### **Create Individual Function Files**

Create separate files for each utility function. This promotes modularity and makes testing easier.

**`src/capitalizeFirstLetter.ts`:**

```typescript
export function capitalizeFirstLetter(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}
```

**`src/reverseWords.ts`:**

```typescript
export function reverseWords(str: string): string {
	return str.split(' ').reverse().join(' ');
}
```

**`src/slugifyText.ts`:**

```typescript
export function slugifyText(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-');
}
```

**`src/truncateString.ts`:**

```typescript
export function truncateString(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str;
	return str.slice(0, maxLength) + '...';
}
```

### **Create the Main Index File**

The index file serves as the main entry point and exports all your functions:

**`src/index.ts`:**

```typescript
import { capitalizeFirstLetter } from './capitalizeFirstLetter';
import { slugifyText } from './slugifyText';
import { truncateString } from './truncateString';
import { reverseWords } from './reverseWords';

export { capitalizeFirstLetter, slugifyText, truncateString, reverseWords };
```

---

## **TypeScript Configuration**

TypeScript provides type safety and generates declaration files that help developers using your package.

### **Install TypeScript**

```bash
npm install --save-dev typescript@5.4.5
```

> **Version Note:** We're using TypeScript 5.4.5 for this tutorial to ensure consistency. You can use newer versions, but some configuration options might differ slightly.

### **Create TypeScript Configuration**

Create a `tsconfig.json` file in your project root:

```json
{
	"compilerOptions": {
		"declaration": true,
		"declarationDir": "lib/types",
		"target": "es6",
		"moduleResolution": "node"
	},
	"include": ["src/**/*"],
	"exclude": ["node_modules", "lib"]
}
```

**Key Configuration Options:**

- **`declaration: true`** - Generates TypeScript declaration files (`.d.ts`)
- **`declarationDir`** - Specifies where to output declaration files
- **`target: "es6"`** - Compiles to ES6 for modern browser compatibility
- **`moduleResolution: "node"`** - Uses Node.js module resolution strategy

> **Quick Tip:** Always set `declaration: true` in your TypeScript config. This generates `.d.ts` files that provide excellent IntelliSense support for users of your package, making it much more developer-friendly.

---

## **Setting Up Rollup for Bundling**

Rollup is excellent for creating optimized bundles for libraries. We'll configure it to output both CommonJS and ES modules.

### **Install Rollup Dependencies**

```bash
npm install --save-dev rollup@4.17.2 rollup-plugin-typescript2@0.36.0 rollup-plugin-delete@2.0.0
```

> **Version Note:** We're using specific versions for this tutorial to ensure everything works as expected. Rollup 4.17.2 and rollup-plugin-typescript2 0.36.0 are stable versions that work well together.

### **Create Rollup Configuration**

Create a `rollup.config.js` file:

```javascript
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';

export default {
	input: 'src/index.ts',
	output: [
		{
			file: 'lib/index.cjs',
			format: 'cjs',
		},
		{
			file: 'lib/index.esm.js',
			format: 'esm',
		},
	],
	plugins: [
		del({
			targets: ['lib/*'],
		}),
		typescript({
			useTsconfigDeclarationDir: true,
		}),
	],
};
```

**Configuration Breakdown:**

- **`input`** - Entry point for bundling (`src/index.ts`)
- **`output`** - Array defining both CommonJS and ES module outputs
- **`del` plugin** - Cleans the `lib` directory before each build
- **`typescript` plugin** - Handles TypeScript compilation and uses our `tsconfig` settings

---

## **Module System Support**

JavaScript has evolved through several module systems. Our package will support both **CommonJS (CJS)** and **ES Modules (ESM)** to ensure maximum compatibility.

CommonJS uses `require()` and `module.exports`, while ESM uses `import` and `export`. Modern Node.js versions support loading ES modules from CommonJS, but we'll provide both formats for broader compatibility.

### **Update Package.json for ES Modules**

Add the following fields to your `package.json`:

```json
{
	"name": "string-manipulation-examples",
	"version": "1.0.0",
	"description": "A comprehensive string manipulation library with TypeScript support",
	"main": "lib/index.cjs",
	"type": "module",
	"scripts": {
		"build": "rollup -c",
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"repository": {
		"type": "git",
		"url": "git+https://github.com/dhrvrm/how-to-make-npm-package.git"
	},
	"keywords": [
		"string",
		"manipulation",
		"capitalize",
		"slugify",
		"truncate",
		"reverse"
	],
	"author": "dhrvrm",
	"license": "MIT",
	"bugs": {
		"url": "https://github.com/dhrvrm/how-to-make-npm-package/issues"
	},
	"homepage": "https://github.com/dhrvrm/how-to-make-npm-package#readme",
	"devDependencies": {
		"rollup": "^4.17.2",
		"rollup-plugin-delete": "^2.0.0",
		"rollup-plugin-typescript2": "^0.36.0",
		"typescript": "^5.4.5"
	}
}
```

The `"type": "module"` field tells Node.js to treat our source files as ES modules, which is necessary since we're using `export` syntax in our Rollup config.

---

## **Modern Entry Points with Exports Field**

The modern way to define entry points uses the `exports` field, which provides better control over how your package is imported.

### **Configure Modern Entry Points**

Update your `package.json` to include the `exports` field:

```json
{
	"name": "string-manipulation-examples",
	"version": "1.0.0",
	"description": "A comprehensive string manipulation library with TypeScript support",
	"main": "lib/index.cjs",
	"exports": {
		"import": {
			"default": "./lib/index.esm.js",
			"types": "./lib/types/index.d.ts"
		},
		"require": {
			"default": "./lib/index.cjs",
			"types": "./lib/types/index.d.ts"
		}
	},
	"files": ["lib"],
	"type": "module",
	"scripts": {
		"build": "rollup -c"
	},
	"repository": {
		"type": "git",
		"url": "git+https://github.com/dhrvrm/how-to-make-npm-package.git"
	},
	"keywords": [
		"string",
		"manipulation",
		"capitalize",
		"slugify",
		"truncate",
		"reverse"
	],
	"author": "dhrvrm",
	"license": "MIT",
	"bugs": {
		"url": "https://github.com/dhrvrm/how-to-make-npm-package/issues"
	},
	"homepage": "https://github.com/dhrvrm/how-to-make-npm-package#readme",
	"devDependencies": {
		"rollup": "^4.17.2",
		"rollup-plugin-delete": "^2.0.0",
		"rollup-plugin-typescript2": "^0.36.0",
		"typescript": "^5.4.5"
	}
}
```

**Key Additions:**

- **`exports`** - Modern entry point definition supporting both `import`/`require`
- **`files`** - Specifies which files to include in the published package
- **`main`** - Fallback for older Node.js versions that don't support `exports` field

The `exports` field prevents consumers from importing internal modules not explicitly exposed, providing better encapsulation.

> **Quick Tip:** The `exports` field is the modern way to define package entry points. It provides better security by preventing access to internal files and gives you fine-grained control over how your package is consumed.

> **Quick Tip:** Always test your package locally before publishing. Use `npm link` to create a symbolic link and test your package in a real project environment.

---

## **Building Your Package**

Now let's build our package and see everything come together.

### **Run the Build**

```bash
npm run build
```

This command will:

- Clean the `lib` directory
- Compile TypeScript files
- Generate both CommonJS and ES module bundles
- Create TypeScript declaration files

After building, your `lib` directory should contain:

```
lib/
├── index.cjs          # CommonJS bundle
├── index.esm.js       # ES module bundle
└── types/
    └── index.d.ts     # TypeScript declarations
```

### **Verify Your Build**

Check what files will be published using the dry-run flag:

```bash
npm publish --dry-run
```

This shows exactly which files will be included in your published package without actually publishing it.

> **Quick Tip:** Use `npm publish --dry-run` before every publish to verify exactly what files will be included. This prevents accidentally publishing sensitive files or build artifacts.

> **Quick Tip:** Keep your `lib` directory in `.gitignore` but include it in the `files` field of `package.json`. This ensures the built files are published but not tracked in version control.

---

## **Key Takeaways**

- **Package.json is crucial** - It serves as the instruction manual for your package, telling tools and consumers how to interact with your code.
- **Dual module support** - Providing both CommonJS and ES module formats ensures compatibility across different environments and project setups.
- **TypeScript declarations** - Type definitions make your package more developer-friendly and catch errors at compile time.
- **Modern entry points** - The `exports` field provides better control over package interfaces and prevents internal module access.
- **Build tooling matters** - Rollup creates optimized bundles while maintaining clean, readable output.
- **This is a foundation** - While this setup is solid, production packages typically need testing, CI/CD, documentation, and more robust error handling.

---

## **Quick Debug Tips**

- **Build Errors:** Ensure all TypeScript files are properly typed and imported.
- **Module Resolution Issues:** Verify that your `tsconfig.json` and `rollup.config.js` use consistent module resolution settings.
- **Import/Export Mismatches:** Check that your source code uses consistent ES module syntax.

---

## **Quiz: Test Your Understanding**

Test your knowledge of NPM package development concepts:

### **Question 1: Package.json Configuration**

**What is the purpose of the `files` field in `package.json`?**

<details>
<summary>Click to reveal answer</summary>

The `files` field specifies which files and directories should be included when your package is published to NPM. It acts as a whitelist, ensuring only the necessary files (like your built `lib` directory) are published while excluding development files, source code, and other artifacts.

**Example:**

```json
{
	"files": ["lib", "README.md"]
}
```

This would only publish the `lib` directory and README file, excluding everything else.

</details>

### **Question 2: Module Formats**

**Why do we need both CommonJS and ES module formats?**

<details>
<summary>Click to reveal answer</summary>

We provide both formats for maximum compatibility:

- **CommonJS (CJS)** - Required for older Node.js versions and tools that don't support ES modules
- **ES Modules (ESM)** - Modern standard that enables tree-shaking, better bundler optimization, and native browser support

This dual approach ensures your package works in any environment, from legacy Node.js applications to modern bundlers and browsers.

</details>

### **Question 3: TypeScript Configuration**

**What does the `declaration: true` option in `tsconfig.json` accomplish?**

<details>
<summary>Click to reveal answer</summary>

The `declaration: true` option generates TypeScript declaration files (`.d.ts`) alongside your compiled JavaScript. These files provide:

- **Type information** for IDEs and TypeScript compilers
- **IntelliSense support** in editors like VS Code
- **Type safety** for consumers of your package
- **Better developer experience** with autocomplete and error checking

Without this, TypeScript users would lose type information when using your package.

</details>

### **Question 4: Modern Package Exports**

**How does the `exports` field improve upon the traditional `main` field?**

<details>
<summary>Click to reveal answer</summary>

The `exports` field provides several advantages over `main`:

- **Better security** - Prevents access to internal files not explicitly exposed
- **Multiple entry points** - Can define different entry points for different module systems
- **Conditional exports** - Can provide different versions for different environments
- **Type definitions** - Can specify TypeScript declaration files
- **Subpath exports** - Can expose specific subdirectories or files

**Example:**

```json
{
	"exports": {
		"import": "./lib/index.esm.js",
		"require": "./lib/index.cjs",
		"types": "./lib/types/index.d.ts"
	}
}
```

</details>

---

## **Practical Assignment: Extend Your Package**

### **Assignment: Add a New Utility Function**

Create a new utility function called `removeExtraSpaces` that removes multiple consecutive spaces from a string, leaving only single spaces. Add it to your package following the same pattern as the existing functions.

**Requirements:**

1. Create `src/removeExtraSpaces.ts` with the function
2. Add proper TypeScript types
3. Export it from `src/index.ts`
4. Test it locally

**Starter Code:**

```typescript
// src/removeExtraSpaces.ts
export function removeExtraSpaces(str: string): string {
	// Your implementation here
	// Should convert "hello    world" to "hello world"
}
```

### **Bonus Challenge: Add JSDoc Documentation**

Add comprehensive JSDoc comments to all your functions for better documentation and IDE support.

**Example:**

````typescript
/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The input string to capitalize
 * @returns The string with the first letter capitalized
 *
 * @example
 * ```typescript
 * capitalizeFirstLetter("hello world") // "Hello world"
 * capitalizeFirstLetter("") // ""
 * ```
 */
export function capitalizeFirstLetter(str: string): string {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}
````

### **Testing Your Implementation**

Create a simple test file to verify your functions work correctly:

```typescript
// test.js
import { removeExtraSpaces, capitalizeFirstLetter } from './lib/index.esm.js';

console.log(removeExtraSpaces('hello    world')); // "hello world"
console.log(capitalizeFirstLetter('hello world')); // "Hello world"
```

---

## **Next Steps**

Congratulations! You've successfully created a solid foundation for an NPM package with TypeScript support and dual module formats. This is a great starting point, but there's still work to do before it's truly production-ready. In the next part of this series, we'll explore:

- Adding comprehensive testing with Jest
- Setting up continuous integration
- Publishing to NPM registry
- Version management and semantic versioning
- Documentation and README best practices
- Error handling and edge cases
- Performance optimization

Your package foundation is ready for the next level of development and enhancement.

---

## **Chapter Summary**

In this chapter, we've covered:

✅ **Project Structure** - Setting up a basic but well-organized package layout  
✅ **Package Configuration** - Understanding `package.json` and modern exports  
✅ **TypeScript Integration** - Adding type safety and declaration files  
✅ **Build System** - Configuring Rollup for dual module support  
✅ **Development Workflow** - Building and testing your package locally

**What's Next?** This foundation is solid, but production packages need much more. In the next chapter, we'll enhance this package with testing, documentation, and prepare it for publication to the NPM registry.
