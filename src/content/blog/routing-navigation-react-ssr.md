---
title: 'Chapter 5: Routing and Navigation in SSR'
publishDate: 2025-02-12
categories: ['React', 'SSR', 'Routing']
excerpt: 'Learn how to implement routing and navigation in React SSR using React Router, including dynamic routes, nested routes, and redirects.'
series: 'Teaching Myself Some More React'
seriesPart: 5
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
image: '/blogs/teching-myself-react.webp'
featured: true
readingTime: 12
tags: ['React', 'SSR', 'Routing', 'Dynamic Routes', 'React Router']
slug: 'routing-navigation-react-ssr'
---

## **Introduction: Dynamic Routing in SSR**

Routing is a fundamental part of any web application, enabling users to navigate between different views or pages. In Client-Side Rendering (CSR), routing happens entirely in the browser. However, in Server-Side Rendering (SSR), routing involves both the server and client working together to ensure seamless navigation, SEO-friendly URLs, and dynamic data fetching.

This chapter covers:

1. How to implement routing with React Router for SSR.
2. Handling dynamic and nested routes.
3. Implementing a 404 page and redirects in SSR.
4. Managing shared state between the server and client.

---

## **1. Setting Up React Router for SSR**

React Router provides tools for routing in both CSR and SSR. For SSR, we use the `StaticRouter` on the server and the `BrowserRouter` on the client.

#### **Update Your React App**

```javascript
// src/shared/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';

const Home = () => <h1>Home Page</h1>;
const About = () => <h1>About Page</h1>;
const NotFound = () => <h1>404: Page Not Found</h1>;

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/about' element={<About />} />
			<Route path='*' element={<NotFound />} />
		</Routes>
	);
};

export default App;
```

---

## **2. Integrating Routing on the Server**

The server needs to handle all routes and pass the URL to the `StaticRouter`.

#### **Update the Server**

```javascript
// src/server/index.js
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from '../shared/App';
import { renderHtml } from './template';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('*', (req, res) => {
	const context = {};
	const appHtml = renderToString(
		<StaticRouter location={req.url} context={context}>
			<App />
		</StaticRouter>
	);

	// Handle redirects
	if (context.url) {
		return res.redirect(301, context.url);
	}

	res.send(renderHtml(appHtml));
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
```

---

## **3. Handling Dynamic Routes**

Dynamic routes allow you to create pages for variable content like user profiles or product details.

#### **Dynamic Route Component**

```javascript
// src/shared/App.js
const UserProfile = ({ id }) => {
	return <h1>User Profile: {id}</h1>;
};

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/about' element={<About />} />
			<Route path='/user/:id' element={<UserProfile />} />
			<Route path='*' element={<NotFound />} />
		</Routes>
	);
};
```

#### **Server Integration**

Ensure the server handles dynamic routes:

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

## **4. Nested Routes**

Nested routes allow components to render subcomponents based on deeper paths.

#### **Add Nested Routes**

```javascript
// src/shared/About.js
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';

const Team = () => <h2>Our Team</h2>;
const Mission = () => <h2>Our Mission</h2>;

const About = () => {
	return (
		<div>
			<h1>About Page</h1>
			<nav>
				<Link to='/about/team'>Team</Link>
				<Link to='/about/mission'>Mission</Link>
			</nav>
			<Routes>
				<Route path='team' element={<Team />} />
				<Route path='mission' element={<Mission />} />
			</Routes>
		</div>
	);
};

export default About;
```

#### **Update App Component**

```javascript
// src/shared/App.js
import About from './About';

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/about/*' element={<About />} />
			<Route path='/user/:id' element={<UserProfile />} />
			<Route path='*' element={<NotFound />} />
		</Routes>
	);
};
```

---

## **5. Implementing a 404 Page**

React Router automatically renders a `Route` without a path for unmatched URLs.

#### **Add a Catch-All Route**

```javascript
<Route path='*' element={<NotFound />} />
```

---

## **6. Handling Redirects**

You can use the `context` object in `StaticRouter` to manage server-side redirects.

#### **Server-Side Redirect**

```javascript
const context = {};
const appHtml = renderToString(
	<StaticRouter location={req.url} context={context}>
		<App />
	</StaticRouter>
);

if (context.url) {
	return res.redirect(301, context.url);
}
```

#### **Client-Side Redirect**

Use `Navigate` from React Router:

```javascript
import { Navigate } from 'react-router-dom';

const Login = () => {
	const isAuthenticated = false;
	return isAuthenticated ? <h1>Welcome Back</h1> : <Navigate to='/' />;
};
```

---

## **7. Managing Shared State Between Routes**

SSR often requires passing state between the server and client. Use a serialized initial state to hydrate the client.

#### **Server-Side State**

```javascript
const initialState = { user: { name: 'John Doe' } };
const appHtml = renderToString(
	<StaticRouter location={req.url} context={context}>
		<App initialState={initialState} />
	</StaticRouter>
);

res.send(renderHtml(appHtml, initialState));
```

#### **Client-Side Hydration**

```javascript
const initialState = window.__INITIAL_STATE__;
ReactDOM.hydrateRoot(
	document.getElementById('root'),
	<App initialState={initialState} />
);
```

---

## **Key Takeaways**

1. Use `StaticRouter` for server-side routing and `BrowserRouter` for client-side navigation.
2. Handle dynamic routes and nested routes to build scalable applications.
3. Redirects and 404 pages are seamlessly managed with React Router v6.

---

## **Quiz**

1. **What is the purpose of `StaticRouter` in SSR?**
2. **How can you manage 404 pages in SSR?**
3. **Explain how redirects work in SSR with `StaticRouter`**.

---

## **Practical Assignment**

- **Assignment:** Extend the SSR app to include:
  1. A `/blog/:slug` dynamic route that fetches server-side data for the blog post.
  2. A nested `/settings/profile` and `/settings/account` route.

---
