import { default as NextRouter } from 'next/router';
import {
  RouterMatch,
  CurrentRoute,
  Routes,
  RouteAssemble,
  LinkProps,
} from '../types';
import Route from '../Route';
import events, { Events } from '../utils/events';

class Router {
  private routes: { [key: string]: Route } = {};
  private currentRoute: CurrentRoute = null;
  public events: Events;

  constructor(routes: Routes) {
    this.setRoutes(routes);
    this.events = events(this);
  }

  setRoutes(routes: Routes): void {
    this.routes = {};
    this.addRoutes(routes);
  }

  addRoutes(routes: Routes): void {
    for (const route in routes) {
      if (!routes.hasOwnProperty(route)) {
        continue;
      }
      this.routes[route] = new Route(routes[route].pattern, routes[route].page);
    }
  }

  getRoutes(): { [key: string]: Route } {
    return this.routes;
  }

  match(asPath: string): RouterMatch {
    for (const route in this.routes) {
      if (!this.routes.hasOwnProperty(route)) {
        continue;
      }

      const matched = this.routes[route].match(asPath);
      if (matched.matched) {
        return { ...matched, route };
      }
    }

    return {
      route: '',
      params: {},
      query: {},
      path: asPath,
      page: '',
      hash: '',
      matched: false,
    };
  }

  assemble(route: string, params: any): RouteAssemble {
    if (this.routes[route]) {
      return {
        path: this.routes[route].assemble(params),
        page: this.routes[route].getPage(),
      };
    }
    throw new Error('next-router: No route matched');
  }

  getLinkProps(route: string, params: any = {}, hash: string = ''): LinkProps {
    const assembled = this.assemble(route, params);
    const hashSuffix = hash !== '' ? `#${hash}` : '';
    return {
      href: { pathname: assembled.page, query: params },
      as: `${assembled.path}${hashSuffix}`,
    };
  }

  getLinkPropsFromHref(
    href: string,
    transformFn: (href: string) => string = (href) => href,
  ): LinkProps {
    const hrefSlash = href.substr(0, 1) !== '/' ? `/${href}` : href;
    const match = this.match(transformFn(hrefSlash));
    if (match.matched) {
      return this.getLinkProps(match.route, match.params, match.hash);
    }
    return {
      href,
      as: href,
    };
  }

  push(
    route: string,
    params: any = {},
    hash: string = '',
    options: any = {},
  ): Promise<boolean> {
    const props = this.getLinkProps(route, params, hash);
    return NextRouter.push(props.href, props.as, options);
  }

  pushHref(href: string, options: any = {}): Promise<boolean> {
    const props = this.getLinkPropsFromHref(href);
    return NextRouter.push(props.href, props.as, options);
  }

  replace(
    route: string,
    params: any = {},
    hash: string = '',
    options: any = {},
  ): Promise<boolean> {
    const props = this.getLinkProps(route, params, hash);
    return NextRouter.replace(props.href, props.as, options);
  }

  replaceHref(href: string, options: any = {}): Promise<boolean> {
    const props = this.getLinkPropsFromHref(href);
    return NextRouter.replace(props.href, props.as, options);
  }

  getRequestHandler(renderFunction: Function) {
    return (req: any, res: any, next: any) => {
      // don't render next url's
      const isNextUrl = req.url.match(/^\/_next|^\/static/);
      if (isNextUrl) {
        return next();
      }

      // try to match request url
      const { matched, route, page, params, query, hash } = this.match(req.url);

      if (matched) {
        // set current route for later access
        this.setCurrentRoute({ route, page, params, query, hash });

        // call render function
        if (renderFunction) {
          return renderFunction(req, res, page, params, query, route);
        }
      }

      next();
    };
  }

  currentRouteFromMatch(routerMatch: RouterMatch): CurrentRoute {
    const { route, page, params, query, hash } = routerMatch;
    return {
      route,
      page,
      params,
      query,
      hash,
    };
  }

  setCurrentRoute(currentRoute: CurrentRoute) {
    this.currentRoute = currentRoute;
  }

  getCurrentRoute(): CurrentRoute {
    return this.currentRoute;
  }
}

export default Router;
