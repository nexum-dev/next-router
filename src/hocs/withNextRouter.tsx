import * as React from 'react';
import { NextComponentType, NextPageContext } from 'next';
import { AppContext } from 'next/app';
import Router from './../Router';
import { CurrentRoute, RouteMatch } from './../types';

interface WrappedAppProps {
  initialProps: any;
  currentRoute: CurrentRoute;
}

const getCurrentRoute = (appCtx: AppContext, router: Router): CurrentRoute => {
  const asPath = appCtx.ctx.asPath || '';

  // remove get query params
  const pathNoQuery = asPath.split('?')[0];

  const {
    matched,
    page,
    params,
    route,
    hash,
  }: RouteMatch & { route: string } = router.match(pathNoQuery);
  if (!matched) {
    if (appCtx.ctx.res) {
      appCtx.ctx.res.statusCode = 404;
    }
  }
  router.setCurrentRoute({ route, page, params, hash });

  appCtx.ctx.query = params;

  return {
    route,
    page,
    params,
    hash,
  };
};

export default (router: Router, getCurrentRouteFunction?: Function) => {
  if (!getCurrentRouteFunction) {
    getCurrentRouteFunction = getCurrentRoute;
  }

  return (App: NextComponentType | any) =>
    class WrappedApp extends React.Component<WrappedAppProps> {
      public static getInitialProps = async (appCtx: AppContext) => {
        let initialProps = {};
        const currentRoute =
          getCurrentRouteFunction && getCurrentRouteFunction(appCtx, router);

        if ('getInitialProps' in App) {
          initialProps = await App.getInitialProps.call(App, appCtx);
        }

        return {
          currentRoute,
          initialProps,
        };
      };

      public render() {
        const { initialProps, currentRoute, ...props } = this.props;

        // set current route on hydration
        if (!router.getCurrentRoute()) {
          router.setCurrentRoute(currentRoute);
        }

        return <App {...props} {...initialProps} />;
      }
    };
};
