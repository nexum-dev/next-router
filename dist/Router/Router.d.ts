import { RouterMatch, CurrentRoute, Routes, RouteAssemble, LinkProps } from '../types';
import Route from '../Route';
import { Events } from '../utils/events';
declare class Router {
    private routes;
    private currentRoute;
    events: Events;
    constructor(routes: Routes);
    setRoutes(routes: Routes): void;
    addRoutes(routes: Routes): void;
    getRoutes(): {
        [key: string]: Route;
    };
    match(asPath: string): RouterMatch;
    assemble(route: string, params: any): RouteAssemble;
    getLinkProps(route: string, params?: any, hash?: string): LinkProps;
    getLinkPropsFromHref(href: string, transformFn?: (href: string) => string): LinkProps;
    push(route: string, params?: any, hash?: string, options?: any): Promise<boolean>;
    pushHref(href: string, options?: any): Promise<boolean>;
    replace(route: string, params?: any, hash?: string, options?: any): Promise<boolean>;
    replaceHref(href: string, options?: any): Promise<boolean>;
    getRequestHandler(renderFunction: Function): (req: any, res: any, next: any) => any;
    currentRouteFromMatch(routerMatch: RouterMatch): CurrentRoute;
    setCurrentRoute(currentRoute: CurrentRoute): void;
    getCurrentRoute(): CurrentRoute;
}
export default Router;
