import { getUrlParams } from '../src/utils';

it('getUrlParams', () => {
  const params = getUrlParams('name=stefan&city=cologne');

  expect(JSON.stringify(params)).toEqual(
    JSON.stringify({
      name: 'stefan',
      city: 'cologne',
    })
  );
});
