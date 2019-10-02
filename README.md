# next-router

> A routing library for Next.js

[![NPM](https://img.shields.io/npm/v/@nx/next-router.svg)](https://www.npmjs.com/package/@nx/next-router)

#### Installation

`npm install @nx/next-router`

# Introduction

This library is inspired by and works very similar than [next-routes](https://github.com/fridays/next-routes).
It works with a custom server or with Next.js 9 file system routing.

##### Differences:

- Built with TypeScript
- Route configuration is provided as Object
- Url Hashes support
- withNextRouter HOC for custom app component (make current route available)
- useRouter hook
- Link and Router available as Singleton thru `import { Link, Router } from '@nx/next-router';`
- Router events with route information

##### TODO:

- Unnamed parameters (does it make sense? -> [unnamed-parameters](https://github.com/pillarjs/path-to-regexp#unnamed-parameters))
- Nested routes

## How to

### Define the routes

Create a file like `routes.config.(ts|js)` and paste the following:

```javascript
import { Routes, init } from '@nx/next-router';

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

init(routes);
```

We look at one route defininion:

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

Import the routes config file once in your application. (e.g. Custom App component)

You can use next-router Link component instead of the next/link.

```jsx
import 'routes.config'; // import this only once and before using Link
import { Link } from '@nx/next-router';

// /user pattern
<Link route="user">
  <a>Got to User page</a>
</Link>

// /user/:name pattern
<Link route="user" params={{ name: 'stefan' }}>
  <a>Got to User detail page</a>
</Link>
```

#### withNextRouter HOC

If you use this HOC the query params and route information will be available in `getInitialProps` and `useRouter` hook.

```jsx
// _app.tsx

import React from 'react';
import App from 'next/app';
import '../routes.config';
import { withNextRouter } from '@nx/next-router';

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return <Component {...pageProps} />;
  }
}

export default withNextRouter(MyApp);
```

```jsx
// next page example

Page.getInitialProps = async ({ query }) => {
  // query contains the matched route params + get params
  return { query };
}
```

```jsx
// useRouter hook example

import React from 'react';
import { useRouter } from '@nx/next-router';

const Component = props => {
  const { route, params, query } = useRouter();

  return (
    <>
      <h1>Route: {route}</h1>

      <p>params:</p>
      {JSON.stringify(params)}

      <p>query:</p>
      {JSON.stringify(query)}
    </>
  );
}
```

#### Custom Router/Link

You can pass a custom Router class, Link component or getRouterMatchFunction to the init function if you need to.
They will be used instead of the built ins with `import { Link, Router } from '@nx/next-router';`.

 ```javascript
 import { Routes, init } from '@nx/next-router';
 
 const routes: Routes = {
   ...
 };
 
 init(routes, YourRouterClass, YourLinkFactory, yourGetRouterMatchFunction);
 ```

#### Custom Server

If you use a custom server you can create more complex routes and are not limited by what you can do with Next.js default routing.

Disable file-system routing

 ```javascript
// next.config.js

module.exports = {
  useFileSystemPublicRoutes: false,
}
 ```

 ```javascript
// server.js

const express = require('express');
const next = require('next');

require('./routes.config');
const Router = require('@nx/next-router').Router;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const render = (req, res, page, params, query, route) => app.render(req, res, page, params);

app.prepare().then(() => {
  const server = express();
  
  server.use(Router.getRequestHandler(render));
  
  server.all('*', (req, res) => {
    return handle(req, res);
  })
  
  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`);
  })
});
 ```

#### Router Events

You can use the same events you know from the original next/router.
But instead of the url you get an object with the route information. (from type CurrentRoute)

 ```javascript
import { Router } from '@nx/next-router';

const handleRouteChange = route => {
  console.log('App is changing to route: ', route);
};

Router.events.on('routeChangeStart', handleRouteChange);
 ```

### License

next-router is [MIT licensed](https://github.com/nexumAG/next-router/blob/master/LICENSE).
