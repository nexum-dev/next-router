import Router from './Router';
import Link from './Link';
import withNextRouterFactory from './hocs/withNextRouter';
import { CurrentRoute, RouterMatch, Routes } from './types';
import { AppContext } from 'next/app';
declare let router: Router;
declare let link: any;
declare let withNextRouter: any;
interface Constructable<T> {
    new (routes: Routes): T;
}
export declare const init: (routes: Routes, RouterClass?: Constructable<Router> | undefined, LinkFactory?: ((router: Router) => (props: any) => any) | undefined, getRouterMatchFunction?: ((appCtx: AppContext, router: Router) => RouterMatch) | undefined) => void;
declare const useRouter: () => CurrentRoute;
export { Router as RouterClass, Link as LinkFactory, withNextRouterFactory };
export { router as Router };
export { link as Link };
export { withNextRouter, useRouter };
export { default as RouteClass } from './Route';
export { Routes, RouteMatch, RouteAssemble, LinkProps, CurrentRoute, } from './types';
