import * as React from 'react';
import { NextComponentType } from 'next';
import { AppContext } from 'next/app';
import Router from './../Router';
import { CurrentRoute, RouterMatch } from './../types';
interface WrappedAppProps {
    initialProps: any;
    nextRouter_currentRoute: CurrentRoute;
}
declare const _default: (router: Router, getRouterMatchFunction?: ((appCtx: AppContext, router: Router) => RouterMatch) | undefined) => (App: NextComponentType | any) => {
    new (props: WrappedAppProps | Readonly<WrappedAppProps>): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<WrappedAppProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<WrappedAppProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<WrappedAppProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<WrappedAppProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<WrappedAppProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<WrappedAppProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<WrappedAppProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<WrappedAppProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<WrappedAppProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    new (props: WrappedAppProps, context: any): {
        render(): JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<WrappedAppProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<WrappedAppProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<WrappedAppProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<WrappedAppProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<WrappedAppProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<WrappedAppProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<WrappedAppProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<WrappedAppProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<WrappedAppProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    getInitialProps: (appCtx: AppContext) => Promise<{
        nextRouter_currentRoute: {
            route: string;
            page: string;
            params: any;
            query: any;
            hash: string;
        };
        initialProps: {};
    }>;
    contextType?: React.Context<any> | undefined;
};
export default _default;
