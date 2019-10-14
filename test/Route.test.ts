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
