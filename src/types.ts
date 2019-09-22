import * as React from 'react';

export type Route = {
  pattern: string;
  page: string;
  [key: string]: any;
};

export type Routes = {
  [key: string]: Route;
};

export type RouteMatch = {
  page: string;
  params: any;
  matched: boolean;
  path: string;
  hash: string;
};

export type CurrentRoute = {
  route: string;
  page: string;
  params: any;
  hash: string;
} | null;

export type RouteAssemble = {
  page: string;
  path: string;
};

export type LinkProps = {
  href: string | { pathname: string; query: any };
  as: string;
};
