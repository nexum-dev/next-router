import { getUrlParams } from './../utils';
const pathToRegexp = require('path-to-regexp');

import { PathFunction, Key } from 'path-to-regexp';
import { RouteMatch } from '../types';

class Route {
  private page: string;
  private keys: Key[];
  private compiled: PathFunction;
  private regex: RegExp;

  constructor(pattern: string, page: string) {
    this.page = page;
    this.compiled = pathToRegexp.compile(pattern);
    this.keys = [];
    // @ts-ignore
    this.regex = pathToRegexp(pattern, this.keys);
  }

  private valuesToParams(values: any, keys: Key[]) {
    return values.reduce((params: any, val: any, i: number) => {
      if (val === undefined) return params;
      return Object.assign(params, {
        [keys[i].name]: decodeURIComponent(val),
      });
    }, {});
  }

  match(asPath: string): RouteMatch {
    const asPathSplitted = asPath.split('#');
    const asPathNoHash = asPathSplitted[0];

    const asPathNoHashSplitted = asPathNoHash.split('?');
    const asPathNoHashNoQuery = asPathNoHashSplitted[0];

    // get query params
    let queryParams = {};
    if (asPathNoHashSplitted.length > 1) {
      queryParams = getUrlParams(asPathNoHashSplitted[1]);
    }

    // get hash
    const hash = asPathSplitted.length > 1 ? asPathSplitted[1] : '';

    const match = this.regex.exec(asPathNoHashNoQuery);
    if (match !== null) {
      const params = this.valuesToParams(match.slice(1), this.keys);
      return {
        params,
        query: queryParams,
        hash,
        path: asPath,
        page: this.page,
        matched: true,
      };
    }
    return {
      params: {},
      query: queryParams,
      hash: hash,
      path: asPath,
      page: '',
      matched: false,
    };
  }

  assemble(params: any): string {
    const compiled = this.compiled(params);
    return compiled === '' ? '/' : compiled.replace(/%23/g, '#');
  }

  getPage(): string {
    return this.page;
  }
}

export default Route;
