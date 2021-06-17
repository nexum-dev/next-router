export declare type Route = {
    pattern: string;
    page: string;
    [key: string]: any;
};
export declare type Routes = {
    [key: string]: Route;
};
export declare type RouteMatch = {
    page: string;
    params: any;
    query: any;
    matched: boolean;
    path: string;
    hash: string;
};
export declare type RouterMatch = RouteMatch & {
    route: string;
};
export declare type CurrentRoute = {
    route: string;
    page: string;
    params: any;
    query: any;
    hash: string;
} | null;
export declare type RouteAssemble = {
    page: string;
    path: string;
};
export declare type LinkProps = {
    href: string | {
        pathname: string;
        query: any;
    };
    as: string;
};
