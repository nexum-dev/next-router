import Route from '../src/Route';

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
