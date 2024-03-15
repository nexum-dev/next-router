import Router from '../src/Router';
import { Routes } from '../src/types';
import Route from '../src/Route/Route';

describe('Router AI tests', () => {
  let router: Router;
  const routes: Routes = {
    test: {
      pattern: '/test',
      page: '/test',
    },
  };

  beforeEach(() => {
    router = new Router(routes);
  });

  it('should add routes correctly', () => {
    const newRoutes: Routes = {
      newTest: {
        pattern: '/newTest',
        page: '/newTest',
      },
    };
    router.addRoutes(newRoutes);
    expect(Object.keys(router.getRoutes())).toContain('newTest');
  });

  it('should match routes correctly', () => {
    const match = router.match('/test');
    expect(match.matched).toBeTruthy();
    expect(match.route).toEqual('test');
  });

  it('should assemble routes correctly', () => {
    const assembled = router.assemble('test', {});
    expect(assembled.path).toEqual('/test');
    expect(assembled.page).toEqual('/test');
  });

  it('should throw error when no route matched in assemble', () => {
    expect(() => router.assemble('noMatch', {})).toThrow();
  });

  it('should get link props correctly', () => {
    const linkProps = router.getLinkProps('test', { id: 1 }, 'section');
    expect(linkProps).toEqual({
      href: { pathname: '/test', query: { id: 1 } },
      as: '/test#section',
    });
  });

  it('should get link props without hash correctly', () => {
    const linkProps = router.getLinkProps('test', { id: 1 });
    expect(linkProps).toEqual({
      href: { pathname: '/test', query: { id: 1 } },
      as: '/test',
    });
  });

  it('should get link props without hash correctly with malformed data', () => {
    const linkProps = router.getLinkProps('test', { id: "%25%DE%20" });
    expect(linkProps).toEqual({
      href: { pathname: '/test', query: { id: "%25%DE%20" } },
      as: '/test',
    });
  });

  it('should throw error when no route matched in getLinkProps', () => {
    expect(() => router.getLinkProps('noMatch', {})).toThrow();
  });

  it('should get link props from href correctly when route is matched', () => {
    const href = '/test';
    const linkProps = router.getLinkPropsFromHref(href);
    expect(linkProps).toEqual({
      href: { pathname: '/test', query: {} },
      as: '/test',
    });
  });

  it('should get link props from href correctly when route is not matched', () => {
    const href = '/noMatch';
    const linkProps = router.getLinkPropsFromHref(href);
    expect(linkProps).toEqual({
      href: '/noMatch',
      as: '/noMatch',
    });
  });
});

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
