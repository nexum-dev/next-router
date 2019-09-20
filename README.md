# next-router

> A routing library for Next.js

[![NPM](https://img.shields.io/npm/v/@nx/next-router.svg)](https://www.npmjs.com/package/@nx/next-router)

#### Installation

`npm install @nx/next-router`

# Introduction

This library is inspired by and works very similar than [next-routes](https://github.com/fridays/next-routes).
It works with a custom server or with Next.js 9 file system routing.

##### Differences:

- Build with TypeScript
- Route configuration is provided as Object
- Url Hashes support

## How to

### Define the routes

Create a file like `routes.config.(ts|js)` and paste the following:

```javascript
import { Router, Routes, Link } from '@nx/next-router';

const routes: Routes = {
  'user': {
    pattern: '/user',
    page: '/user',
  },
  'home': {
    pattern: '/',
    page: '/index',
  }
};

const router = new Router(routes);
const link = Link(router);

export { router as Router };
export { link as Link };
```

We look at one root defininion:

```javascript
'user': { // This is the route name
  pattern: '/user', // This is the url pattern to call the page
  page: '/user', // This is the next page (pages/user.js or pages/user/index.js)
},

```

The pattern can be anything that [path-to-regexp](https://github.com/pillarjs/path-to-regexp) understands.
So a route with an optional parameter would be `/user/:name?` for example.
path-to-regexp by the way is the same library that express is using for the routing.

### Usage

You can use the exported Link component instead of the next/link.

```jsx

// /user pattern
<Link route="user">
  <a>Got to User page</a>
</Link>

// /user/:name pattern
<Link route="user" params={{ name: 'stefan' }}>
  <a>Got to User detail page</a>
</Link>

```

