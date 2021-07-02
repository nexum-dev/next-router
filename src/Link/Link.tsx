import * as React from 'react';
import NextLink from 'next/link';
import Router from '../Router';

export type LinkProps = {
  route?: string;
  params?: any;
  hash?: string;
  href?: string;
  children: React.ReactElement<any>;
  [key: string]: any;
};

const Link = (router: Router) => ({
  route,
  params = {},
  hash = '',
  href,
  children,
  ...props
}: LinkProps) => {
  if (!route && !href) {
    throw new Error(
      'next-router: You have to provide a route or a href to the Link'
    );
  }

  let mergedProps;

  if (route) {
    mergedProps = { ...router.getLinkProps(route, params, hash), ...props };
  } else {
    mergedProps = { ...router.getLinkPropsFromHref(href || ''), ...props };
  }

  return <NextLink {...mergedProps}>{children}</NextLink>;
};

export default Link;
