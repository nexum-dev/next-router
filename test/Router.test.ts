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

it('Router getLinkPropsFromHref', () => {
  const routes: Routes = {
    pdp: {
      pattern: '/:products*/id/:productId/(.*)?',
      page: '/pdp',
    },
  };

  const router = new Router(routes);

  const linkProps = router.getLinkPropsFromHref(
    '/musik/cd/eilish-billie/dont-smile-at-me/id/1234/'
  );

  const expected = {
    href: {
      pathname: '/pdp',
      query: {
        0: '',
        products: 'musik/cd/eilish-billie/dont-smile-at-me',
        productId: '1234',
      },
    },
    as: '/musik%2Fcd%2Feilish-billie%2Fdont-smile-at-me/id/1234/',
  };

  expect(JSON.stringify(linkProps)).toEqual(JSON.stringify(expected));
});
