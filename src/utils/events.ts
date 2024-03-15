import type Router from 'Router/Router';
import { default as NextRouter } from 'next/router';

type Handler = (...evts: any[]) => void;

export type EventType =
  | 'routeChangeStart'
  | 'beforeHistoryChange'
  | 'routeChangeComplete'
  | 'routeChangeError'
  | 'hashChangeStart'
  | 'hashChangeComplete';

export type Events = {
  on(type: EventType, handler: Handler): void;
  off(type: EventType, handler: Handler): void;
};

type Handlers = { handler: Handler; handlerRouter: Handler };

type Cache = { [s: string]: Handlers[] };

const getHandlerRouter =
  (router: Router, handler: Handler) =>
  (...evts: any[]) => {
    let url = evts[0];
    if (evts.length > 1 && typeof evts[1] === 'string') {
      url = evts[1];
    }
    const routerMatch = router.match(url);
    const currentRoute = router.currentRouteFromMatch(routerMatch);
    if (evts.length === 1) {
      handler(currentRoute);
    } else {
      handler(evts[0], currentRoute);
    }
  };

const findHandlersIndex = (arr: Handlers[], handler: Handler) => {
  return arr.findIndex((handlers) => {
    return handlers.handler === handler;
  });
};

export default function events(router: Router): Events {
  const all: Cache = Object.create(null);

  return {
    on(type: EventType, handler: Handler) {
      const handlerRouter = getHandlerRouter(router, handler);
      NextRouter.events.on(type, handlerRouter);
      // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
      (all[type] || (all[type] = [])).push({ handler, handlerRouter });
    },
    off(type: EventType, handler: Handler) {
      if (all[type]) {
        const handlersIndex = findHandlersIndex(all[type], handler);
        if (handlersIndex >= 0) {
          const handlerRouter = all[type][handlersIndex].handlerRouter;
          NextRouter.events.off(type, handlerRouter);
          all[type].splice(handlersIndex, 1);
        }
      }
    },
  };
}
