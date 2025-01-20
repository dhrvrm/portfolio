---
title: 'Chapter 4: Basic SSR Setup'
publishDate: 2025-02-05
categories: ['React', 'SSR', 'Setup']
excerpt: 'Learn how to implement a basic Server-Side Rendering (SSR) setup for React applications using Node.js, Express, and React’s renderToString.'
series: 'Teaching Myself Some More React'
seriesPart: 4
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
image: '/blog/basic-ssr-setup.jpg'
featured: true
readingTime: 10
tags: ['React', 'SSR', 'Server-Side Rendering', 'Express', 'Hydration']
slug: 'basic-react-ssr-setup'
---

## **Introduction: From Concept to Code**

In this chapter, we will implement a basic Server-Side Rendering (SSR) setup for a React application using **Node.js**, **Express.js**, and **React's `renderToString()`** function. By the end, you’ll have a functional SSR app capable of rendering React components on the server and delivering pre-rendered HTML to the client.

---

## **1. Rendering Your First React Component on the Server**

The foundation of SSR is rendering React components to HTML strings on the server. Let’s create a basic example.

### **Step 1: React Component**

```javascript
// src/shared/App.js
import React from 'react';

const App = () => {
	return (
		<div>
			<h1>Hello, Server-Side Rendering!</h1>
			<p>This is a React component rendered on the server.</p>
		</div>
	);
};

export default App;
```

### **Step 2: Server Code**

```javascript
// src/server/index.js
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../shared/App';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('*', (req, res) => {
	const appHtml = renderToString(<App />);

	res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SSR Example</title>
      </head>
      <body>
        <div id="root">${appHtml}</div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
```

### **Run the Server**

```bash
npm run dev
```

### **Expected Output**

When you navigate to `http://localhost:3000`, the server renders the React component, and you see the HTML content.

---

## **2. Structuring a Dynamic HTML Template**

Hardcoding HTML isn’t scalable. Let’s create a template function for dynamic HTML generation.

### **Template Function**

```javascript
// src/server/template.js
export const renderHtml = (reactHtml) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SSR Example</title>
    </head>
    <body>
      <div id="root">${reactHtml}</div>
    </body>
  </html>
`;
```

### **Update the Server**

```javascript
// src/server/index.js
import { renderHtml } from './template';

app.get('*', (req, res) => {
	const appHtml = renderToString(<App />);
	res.send(renderHtml(appHtml));
});
```

---

## **3. Adding Dynamic Data**

React SSR supports rendering dynamic content from the server.

### **Server with Dynamic Props**

```javascript
app.get('*', (req, res) => {
	const appProps = { name: 'React Developer' };
	const appHtml = renderToString(<App {...appProps} />);

	res.send(renderHtml(appHtml));
});
```

### **Update the React Component**

```javascript
// src/shared/App.js
const App = ({ name }) => {
	return (
		<div>
			<h1>Hello, {name}!</h1>
			<p>This is a React component rendered on the server with dynamic data.</p>
		</div>
	);
};
```

### **Expected Output**

The app now dynamically greets the user based on server-provided props.

---

## **4. Setting Up Hydration**

Hydration ensures the static server-rendered HTML becomes a fully interactive React app.

### **Client-Side Entry Point**

```javascript
// src/client/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../shared/App';

const root = ReactDOM.hydrateRoot(document.getElementById('root'), <App />);
```

### **Update Webpack Config**

Add a client-side Webpack build:

```javascript
const clientConfig = {
	entry: './src/client/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'client.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
		],
	},
};

module.exports = [serverConfig, clientConfig];
```

### **Serve the Client Script**

Update your HTML template to include the client-side bundle:

```javascript
export const renderHtml = (reactHtml) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SSR Example</title>
    </head>
    <body>
      <div id="root">${reactHtml}</div>
      <script src="/dist/client.js"></script>
    </body>
  </html>
`;
```

---

## **5. Handling Routes**

React Router enables dynamic routing in SSR.

### **Add React Router**

```bash
npm install react-router-dom
```

### **React Component with Routes**

```javascript
// src/shared/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;

const App = () => {
	return (
		<Router>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route path='/about' component={About} />
			</Switch>
		</Router>
	);
};

export default App;
```

### **Support Routes on the Server**

```javascript
app.get('*', (req, res) => {
	const context = {};
	const appHtml = renderToString(
		<StaticRouter location={req.url} context={context}>
			<App />
		</StaticRouter>
	);

	res.send(renderHtml(appHtml));
});
```

---

## **6. Debugging Common Issues**

1. **Mismatched HTML**:

   - Ensure server and client use the same React version.
   - Fix dynamic data discrepancies.

2. **Missing Routes**:
   - Use `StaticRouter` on the server and `BrowserRouter` on the client.

---

## **Key Takeaways**

1. SSR allows you to serve pre-rendered React components as HTML.
2. Hydration bridges server-rendered HTML with React's interactivity.
3. React Router works seamlessly in SSR with `StaticRouter`.

---

## **Quiz**

1. **What is the role of `renderToString` in SSR?**
2. **Why is hydration necessary for SSR apps?**
3. **How do you pass dynamic data to server-rendered React components?**

---

## **Practical Assignment**

- **Assignment:** Extend the SSR setup to include routing for `/`, `/about`, and a dynamic `/user/:id` route. Render user details server-side based on the route parameter.

---
