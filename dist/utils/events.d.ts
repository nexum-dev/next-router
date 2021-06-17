import Router from 'Router/Router';
declare type Handler = (...evts: any[]) => void;
export declare type Events = {
    on(type: string, handler: Handler): void;
    off(type: string, handler: Handler): void;
};
export default function events(router: Router): Events;
export {};
