import Route from '../src/Route';
import Router from "../src/Router";
import {Routes} from "../src";

describe('Route match', () => {
  it('matches one named pattern', () => {
    const pattern = '/user/:name';
    const page = '/user';
    const asPath = '/user/stefan';

    const route = new Route(pattern, page);
    const match = route.match(asPath);

    const expected = {
      page,
      path: asPath,
      params: { name: 'stefan' },
      query: {},
      hash: '',
      matched: true,
    };

    expect(match).toEqual(expected);
  });

  it('matches one optional named pattern', () => {
    const pattern = '/user/:name?';
    const page = '/user';
    const asPath = '/user';

    const route = new Route(pattern, page);
    const match = route.match(asPath);

    const expected = {
      page,
      path: asPath,
      params: {},
      query: {},
      hash: '',
      matched: true,
    };

    expect(match).toEqual(expected);
  });
});

describe('Route assemble', () => {
  it('assemble one named param', () => {
    const pattern = '/user/:name';
    const page = '/user';

    const route = new Route(pattern, page);

    const assembled = route.assemble({ name: 'stefan' });

    expect(assembled).toEqual('/user/stefan');
  });

  it('assemble one optional param', () => {
    const pattern = '/user/:name?';
    const page = '/user';

    const route = new Route(pattern, page);

    const assembled = route.assemble({});

    expect(assembled).toEqual('/user');
  });

  it('assemble one optional param', () => {
    const pattern = '/user/:name?';
    const page = '/user';

    const route = new Route(pattern, page);

    const assembled = route.assemble({name: "stu%deff"});

    expect(assembled).toEqual('/user/stu%25deff');
  });

  it('assemble param value with slashes', () => {
    const pattern = '/:cms';
    const page = '/cms';

    const route = new Route(pattern, page);

    const assembled = route.assemble({ cms: 'de/dynamic-page/subpage' });

    expect(assembled).toEqual('/de%2Fdynamic-page%2Fsubpage');
  });

  it('assemble segment param', () => {
    const pattern = '/:cms+';
    const page = '/cms';

    const route = new Route(pattern, page);

    const assembled = route.assemble({
      cms: ['de', 'dynamic-page', 'subpage'],
    });

    expect(assembled).toEqual('/de/dynamic-page/subpage');
  });

  it('assemble segment param with spaces in the params', () => {
    const pattern = '/:cms+';
    const page = '/cms';

    const route = new Route(pattern, page);

    const assembled = route.assemble({
      cms: ['de', 'dyn amic-pa ge', 'su bpag e'],
    });

    expect(assembled).toEqual("/de/dyn%20amic-pa%20ge/su%20bpag%20e");
  });

  it('assemble segment param with invalid octets', () => {
    const pattern = '/:cms+';
    const page = '/cms';

    const route = new Route(pattern, page);

    const assembled = route.assemble({
      cms: ['de', '%25%DE%20', 'subpage'],
    });

    expect(assembled).toEqual("/de/%2525%25DE%2520/subpage");
  });

  it('assemble segment param with non-hexadecimal characters in percent-encoded octets', () => {
    const pattern = '/:cms+';
    const page = '/cms';

    const route = new Route(pattern, page);

    const assembled = route.assemble({
      cms: ['de', '%ZZ%YY', '%41%42%43%G1%H2'],
    });

    expect(assembled).toEqual("/de/%25ZZ%25YY/%2541%2542%2543%25G1%25H2");
  });

  it('assemble with special character', () => {
    const pattern = '/user/:name';
    const page = '/user';

    const route = new Route(pattern, page);

    const assembled = route.assemble({ name: 'stéfan' });

    expect(assembled).toEqual('/user/st%C3%A9fan');
  });

  it('assemble with special character', () => {
    const pattern = '/user/:name';
    const page = '/user';

    const route = new Route(pattern, page);

    const assembled = route.assemble({ name: 'stéfan' });

    expect(assembled).toEqual('/user/st%C3%A9fan');
  });

  it('assemble with optional trailing slash', () => {
    const pattern = '/user/:name/(.*)?';
    const page = '/user';

    const route = new Route(pattern, page);

    const assembled = route.assemble({ name: 'stefan' });

    expect(assembled).toEqual('/user/stefan');
  });
});

describe('RouterAItests', () => {
  let router: Router;
  const routes: Routes = {
    test: {
      pattern: '/test/:anything?',
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

  it('should throw error when no route matched in assemble', () => {
    expect(() => router.assemble('noMatch', {})).toThrow();
  });
});
