// import * as pathToRegexp from 'path-to-regexp';
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
    const hash = asPathSplitted.length > 1 ? asPathSplitted[1] : '';
    const match = this.regex.exec(asPathNoHash);
    if (match !== null) {
      const params = this.valuesToParams(match.slice(1), this.keys);
      return {
        params,
        hash,
        path: asPath,
        page: this.page,
        matched: true,
      };
    }
    return {
      params: null,
      hash: '',
      path: '',
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
