import * as React from 'react';
import Router from '../Router';
export declare type LinkProps = {
    route?: string;
    params?: any;
    hash?: string;
    href?: string;
    children: React.ReactElement<any>;
    [key: string]: any;
};
declare const Link: (router: Router) => ({ route, params, hash, href, children, ...props }: LinkProps) => JSX.Element;
export default Link;
