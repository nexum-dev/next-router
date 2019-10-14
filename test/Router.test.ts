import Router from '../src/Router';
import { Routes } from '../src/types';
import Route from '../src/Route/Route';

it('Router setRoutes', () => {
  const routes: Routes = {
    test: {
      pattern: '/test',
      page: '/test',
    },
  };

  const routes2: Routes = {
    test2: {
      pattern: '/test2',
      page: '/test2',
    },
  };

  const router = new Router(routes);
  router.setRoutes(routes2);
  const match = router.getRoutes();

  const expected = {
    test2: new Route(routes2.test2.pattern, routes2.test2.page),
  };

  expect(JSON.stringify(match)).toEqual(JSON.stringify(expected));
});

it('Router addRoutes', () => {
  const routes: Routes = {
    test: {
      pattern: '/test',
      page: '/test',
    },
  };

  const routes2: Routes = {
    test2: {
      pattern: '/test2',
      page: '/test2',
    },
  };

  const router = new Router(routes);
  router.addRoutes(routes2);
  const match = router.getRoutes();

  const expected = {
    test: new Route(routes.test.pattern, routes.test.page),
    test2: new Route(routes2.test2.pattern, routes2.test2.page),
  };

  expect(JSON.stringify(match)).toEqual(JSON.stringify(expected));
});
