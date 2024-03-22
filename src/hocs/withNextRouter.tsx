import * as React from 'react';
import type { NextComponentType } from 'next';
import type { AppContext } from 'next/app';
import type Router from './../Router';
import type { CurrentRoute, RouterMatch } from './../types';

interface WrappedAppProps {
  initialProps: any;
  nextRouter_currentRoute: CurrentRoute;
}

const getRouterMatch = (appCtx: AppContext, router: Router): RouterMatch => {
  const asPath = appCtx.ctx.asPath || '';
  return router.match(asPath);
};

export default (
  router: Router,
  getRouterMatchFunction?: (appCtx: AppContext, router: Router) => RouterMatch,
) => {
  const routerMatchFunction = getRouterMatchFunction || getRouterMatch;

  return (App: NextComponentType | any) =>
    class WrappedApp extends React.Component<WrappedAppProps> {
      public static getInitialProps = async (appCtx: AppContext) => {
        let initialProps = {};

        let routerMatch: RouterMatch = {
          route: '',
          params: {},
          query: {},
          path: '',
          page: '',
          hash: '',
          matched: false,
        };

        routerMatch = routerMatchFunction(appCtx, router);

        if (!routerMatch.matched) {
          if (appCtx.ctx.res) {
            appCtx.ctx.res.statusCode = 404;
          }
        }

        const { route, page, params, query, hash } = routerMatch;
        const nextRouter_currentRoute = { route, page, params, query, hash };
        router.setCurrentRoute(nextRouter_currentRoute);

        appCtx.ctx.query = { ...query, ...params };

        if ('getInitialProps' in App) {
          initialProps = await App.getInitialProps.call(App, appCtx);
        }

        return {
          nextRouter_currentRoute,
          initialProps,
        };
      };

      public render() {
        const { initialProps, nextRouter_currentRoute, ...props } = this.props;

        // set current route on hydration
        if (!router.getCurrentRoute()) {
          router.setCurrentRoute(nextRouter_currentRoute);
        }

        return <App {...props} {...initialProps} />;
      }
    };
};
