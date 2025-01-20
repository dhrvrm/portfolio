---
title: 'Chapter 2: The React Rendering Lifecycle'
publishDate: 2025-01-22
categories: ['React', 'Performance', 'SSR']
excerpt: 'Explore how React’s rendering lifecycle works in both CSR and SSR, the role of hydration, and handling lifecycle hooks effectively.'
series: 'Teaching Myself Some More React'
seriesPart: 2
author:
  {
    name: 'Dhruv',
    avatar: 'https://avatars.githubusercontent.com/u/48381412?v=4',
    bio: 'Senior Frontend Developer specializing in React',
    social:
      {
        twitter: 'https://x.com/verma1300',
        linkedin: 'https://www.linkedin.com/in/dhruvv/',
        github: 'https://github.com/dhrvrm',
      },
  }
image: '/blog/react-rendering-lifecycle.jpg'
featured: true
readingTime: 10
tags: ['React', 'SSR', 'Hydration', 'Rendering', 'Web Development']
slug: 'react-rendering-lifecycle-csr-ssr'
---

## **Introduction: The Heart of React Rendering**

At the core of any React application lies the rendering lifecycle — the sequence of processes that React uses to update the user interface (UI). For Server-Side Rendering (SSR), this lifecycle expands beyond the client, requiring developers to consider how rendering behaves both on the server and during hydration on the client.

This chapter dives into:

1. How React renders components in CSR and SSR.
2. Hydration: Why it’s critical and how it works.
3. Lifecycle methods and hooks relevant to SSR.
4. Key differences between server and client rendering lifecycles.

---

## **The React Rendering Process**

### **1. Client-Side Rendering (CSR) Lifecycle**

In CSR, rendering occurs entirely in the browser:

1. **Initial JavaScript Execution**:
   - React reads the component tree and virtual DOM structure.
   - The virtual DOM is reconciled with the real DOM.
2. **State and Props Updates**:
   - React re-renders components when state or props change.
   - Only the differences are patched into the DOM (diffing algorithm).
3. **UI Update**:
   - The browser reflects the updated UI for the user.

### **2. Server-Side Rendering (SSR) Lifecycle**

In SSR, React skips the browser for the initial rendering:

1. **Rendering on the Server**:
   - Components are converted into HTML using `renderToString()` or `renderToPipeableStream()`.
   - React doesn’t use the DOM; instead, it generates a static string.
2. **Delivery to the Client**:
   - The server sends fully-rendered HTML to the browser.
   - The browser renders the HTML for immediate display.
3. **Hydration on the Client**:
   - React binds event listeners and prepares the app for interactivity.
   - The static HTML becomes a fully functional React app.

---

## **Hydration: Bridging SSR and CSR**

### **What Is Hydration?**

Hydration is the process where React:

1. Scans the server-rendered HTML.
2. Attaches React's virtual DOM to the existing DOM.
3. Makes the page interactive (e.g., event listeners).

### **Why Hydration Matters**

Without hydration, SSR-only pages would display static content with no interactivity. Hydration ensures the seamless handoff from server-rendered HTML to a React-powered, dynamic application.

### **Hydration Process in Steps**

1. Browser receives the SSR HTML.
2. React's `ReactDOM.hydrateRoot()` method:
   - Matches the existing DOM with the virtual DOM.
   - Updates only necessary components to avoid re-rendering the entire tree.
3. Event listeners and other interactivity are attached.

---

## **Lifecycle Hooks in SSR**

React’s lifecycle hooks behave differently during SSR. Let’s explore key lifecycle hooks and their roles:

### **1. `constructor()`**

- Used for initializing state and binding methods.
- Executes only once on the server and again on the client during hydration.

### **2. `componentDidMount()`**

- **Not executed on the server.**
- Runs after hydration on the client.
- Example Use: Fetching data that depends on client-specific APIs (e.g., `window` or `localStorage`).

### **3. `componentWillUnmount()`**

- Relevant only on the client.
- Cleans up event listeners or other resources.

### **4. `useEffect()`**

- Skipped during server rendering.
- Runs only on the client after hydration.
- **SSR Pro Tip**: Use `useEffect()` for browser-specific code like analytics or DOM manipulations.

### **5. `getDerivedStateFromProps()`**

- Executes on both the server and the client.
- Ideal for deriving state based on props during SSR.

---

## **Differences Between Server and Client Rendering**

| **Aspect**            | **SSR**                                       | **CSR**                                    |
| --------------------- | --------------------------------------------- | ------------------------------------------ |
| **Initial Rendering** | On the server, outputting HTML as a string.   | In the browser, updating the DOM directly. |
| **Lifecycle Hooks**   | Limited hooks (e.g., no `componentDidMount`). | All lifecycle hooks available.             |
| **Data Fetching**     | Happens before rendering on the server.       | Often done after rendering in the browser. |
| **Hydration**         | Required for interactivity.                   | Not applicable.                            |

---

## **Common Challenges with SSR Rendering Lifecycle**

1. **Mismatched HTML:**
   - If server-rendered HTML doesn’t match the client-rendered output, React throws warnings.
   - **Fix**: Ensure consistent data fetching and rendering logic on the server and client.
2. **Skipping Browser-Specific Code:**
   - Direct DOM manipulations or use of browser APIs (`window`, `document`) during SSR will cause errors.
   - **Fix**: Wrap such logic in `useEffect()` or check for `typeof window`.
3. **State Rehydration:**
   - Ensuring the server-rendered state matches the client’s initial state.
   - **Fix**: Serialize and pass the state from the server to the client.

---

## **Pro Tips for Managing SSR Lifecycle**

1. **Avoid Non-Serializable State:**
   - Ensure state objects are JSON-serializable for seamless transfer between server and client.
2. **Use Static Site Generation (SSG) for Rarely Updated Pages:**
   - Save SSR for dynamic content.
3. **Optimize Hydration Time:**
   - Minimize heavy computations during hydration by deferring them with `useEffect()`.
4. **Leverage Streaming for Large Pages:**
   - Use React’s `renderToPipeableStream()` to progressively send HTML to the client.

---

## **Key Takeaways**

1. React’s lifecycle hooks behave differently in SSR; plan your logic to account for server and client differences.
2. Hydration bridges the gap between static server-rendered HTML and dynamic client-side React apps.
3. Errors in SSR often stem from mismatched HTML or improper state serialization.

---

## **Quiz**

1. **What is the role of hydration in SSR?**
2. **Which lifecycle hooks are skipped during SSR, and why?**
3. **What common mistakes lead to mismatched HTML warnings in SSR?**
4. **Why does `useEffect` not run during SSR?**
5. **Explain how to handle browser-specific code in an SSR React app.**

---

## **Practical Assignment**

- **Assignment:** Implement a React app with SSR, rendering a list of blog posts on the server and hydrating it on the client. Add a button that filters posts dynamically after hydration.
- **Expected Outcome:** A fully server-rendered blog page that becomes interactive after hydration.

---
