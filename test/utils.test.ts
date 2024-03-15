import { getUrlParams } from '../src/utils';
import {
    customDecodeURIComponent,
    decode,
    decodeComponents,
    safeDecodeUriComponent
} from "../src/utils/safeDecodeUriComponents";



describe('decodeComponents', () => {
    it('should decode URI components correctly', () => {
        const components = ['%41', '%42', '%43'];
        const result = decodeComponents(components);
        expect(result).toEqual(['ABC']);
    });

    it('should return the same components when decoding fails', () => {
        const components = ['%G1', '%H2'];
        const result = decodeComponents(components);
        expect(result).toEqual(components);
    });
});

describe('decode', () => {
    it('should decode URI component correctly', () => {
        const encodedURI = encodeURIComponent('Hello World');
        const result = decode(encodedURI);
        expect(result).toEqual('Hello World');
    });

    it('should handle malformed URI', () => {
        const malformedURI = '%25%de%20';
        const result = decode(malformedURI);
        expect(result).toEqual('%%de ');
    });
});

describe('customDecodeURIComponent', () => {
    it('should decode URI component correctly', () => {
        const encodedURI = encodeURIComponent('Hello World');
        const result = customDecodeURIComponent(encodedURI);
        expect(result).toEqual('Hello World');
    });

    it('should handle malformed URI', () => {
        const malformedURI = '%25%DE%20';
        const result = customDecodeURIComponent(malformedURI);
        expect(result).toEqual('%%DE ');
    });

    it('should return the same input when decoding fails', () => {
        const undecodableURI = '%G1%H2';
        const result = customDecodeURIComponent(undecodableURI);
        expect(result).toEqual(undecodableURI);
    });

    it('should replace BOM correctly', () => {
        const bomURI = '%FE%FF';
        const result = customDecodeURIComponent(bomURI);
        expect(result).toEqual('\uFFFD\uFFFD');
    });
});

describe('safeDecodeUriComponent', () => {
    it('should decode URI component correctly', () => {
        const encodedURI = encodeURIComponent('Hello World');
        const result = safeDecodeUriComponent(encodedURI);
        expect(result).toEqual('Hello World');
    });

    it('should throw an error when input is not a string', () => {
        expect(() => safeDecodeUriComponent(123)).toThrow(TypeError);
    });

    it('should handle malformed URI', () => {
        const malformedURI = '%25%de%20';
        const result = safeDecodeUriComponent(malformedURI);
        expect(result).toEqual('%%de ');
    });

    it('should handle undecodable URI', () => {
        const undecodableURI = '%G1%H2';
        const result = safeDecodeUriComponent(undecodableURI);
        expect(result).toEqual(undecodableURI);
    });
});

it('getUrlParams', () => {
  const params = getUrlParams('name=stefan&city=cologne');

  expect(JSON.stringify(params)).toEqual(
    JSON.stringify({
      name: 'stefan',
      city: 'cologne',
    })
  );
});

it('getUrlParams from malformed url', () => {
  const params = getUrlParams('name=ste%defan&city=cologne');

  expect(JSON.stringify(params)).toEqual(
    JSON.stringify({
      name: 'ste%defan',
      city: 'cologne',
    })
  );
});

it('getUrlParams from malformed url2', () => {
  const params = getUrlParams('name=%E0%A4%A&city=cologne');

  expect(JSON.stringify(params)).toEqual(
    JSON.stringify({
      name: '%E0%A4%A',
      city: 'cologne',
    })
  );
});

it('getUrlParams from malformed url3', () => {
  const params = getUrlParams('name=%ZZ%YY&city=cologne');

  expect(JSON.stringify(params)).toEqual(
    JSON.stringify({
      name: '%ZZ%YY',
      city: 'cologne',
    })
  );
});

it('getUrlParams from malformed url3', () => {
  const params = getUrlParams('param=%41%42%43%G1%H2');

  expect(JSON.stringify(params)).toEqual(
    JSON.stringify({
        param: "ABC%G1%H2"
    })
  );
});
