import { default as NextRouter } from 'next/router';
import { RouteMatch, CurrentRoute, Routes, RouteAssemble, LinkProps } from '../types';
import Route from '../Route';

class Router {
  private routes: { [key: string]: Route } = {};
  private currentRoute: CurrentRoute = null;
  private isCurrentRouteSet: boolean = false;

  constructor(routes: Routes) {
    this.addRoutes(routes);
  }

  addRoutes(routes: Routes, overwrite?: boolean): void {
    if (overwrite) {
      this.routes = {};
    }

    for (const route in routes) {
      if (!routes.hasOwnProperty(route)) {
        continue;
      }
      this.routes[route] = new Route(routes[route].pattern, routes[route].page);
    }
  }

  match(asPath: string): RouteMatch & { route: string } {
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
      params: null,
      path: '',
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

  getLinkPropsFromHref(href: string, cleanFunction: (href: string) => string = href => href): LinkProps {
    const hrefSlash = href.substr(0, 1) !== '/' ? `/${href}` : href;
    const match = this.match(cleanFunction(hrefSlash));
    if (match.matched) {
      return this.getLinkProps(match.route, match.params, match.hash);
    }
    return {
      href,
      as: href,
    }
  }

  push(route: string, params: any = {}): Promise<boolean> {
    const props = this.getLinkProps(route, params);
    return NextRouter.push(props.href, props.as);
  }

  replace(route: string, params: any = {}): Promise<boolean> {
    const props = this.getLinkProps(route, params);
    return NextRouter.replace(props.href, props.as);
  }

  getRequestHandler(app: any) {
    const nextHandler = app.getRequestHandler();

    return (req: any, res: any) => {
      const { page, params, matched } = this.match(req.url);

      if (matched) {
        if (!this.isCurrentRouteSet) {
          this.setCurrentRoute({ page, params });
          this.isCurrentRouteSet = true;
        }
        app.render(req, res, page, params);
      } else {
        nextHandler(req, res);
      }
    };
  }

  setCurrentRoute(currentRoute: CurrentRoute) {
    this.currentRoute = currentRoute;
  }

  getCurrentRoute(): CurrentRoute {
    return this.currentRoute;
  }

  getProps() {
    return {
      route: NextRouter.route,
      query: NextRouter.query,
      pathname: NextRouter.pathname,
      asPath: NextRouter.asPath,
    };
  }
}

export default Router;
