import type { AppContext } from 'next/app';
import type NextLink from 'next/link';
import Link from './Link';
import Router from './Router';
import withNextRouterFactory from './hocs/withNextRouter';
import type { CurrentRoute, RouterMatch, Routes } from './types';

let router: Router;
// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
let link;
// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
let withNextRouter;

interface Constructable<T> {
  new (routes: Routes): T;
}

export const init = (
  routes: Routes,
  RouterClass?: Constructable<Router>,
  LinkFactory?: (router: Router) => typeof NextLink,
  getRouterMatchFunction?: (appCtx: AppContext, router: Router) => RouterMatch,
) => {
  router = RouterClass ? new RouterClass(routes) : new Router(routes);
  link = LinkFactory ? LinkFactory(router) : Link(router);
  withNextRouter = withNextRouterFactory(router, getRouterMatchFunction);
};

const useRouter = (): CurrentRoute => {
  if (!router) {
    throw new Error(
      'next-router: Router is not set. You have to initialize next-router first.',
    );
  }
  return router.getCurrentRoute();
};

export { Router as RouterClass, Link as LinkFactory, withNextRouterFactory };
export { router as Router };
export { link as Link };
export { withNextRouter, useRouter };
export { default as RouteClass } from './Route';
export type {
  Routes,
  RouteMatch,
  RouteAssemble,
  LinkProps,
  CurrentRoute,
} from './types';
