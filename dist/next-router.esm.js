import NextRouter from 'next/router';
import { compile, pathToRegexp } from 'path-to-regexp';
import { createElement, Component } from 'react';
import NextLink from 'next/link';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var getUrlParams = function getUrlParams(queryString) {
  if (!queryString) {
    return {};
  }

  var hashes = queryString.split('&');
  var params = {};
  hashes.forEach(function (hash) {
    var _hash$split = hash.split('='),
        key = _hash$split[0],
        val = _hash$split[1];

    if (key) {
      params[key] = val ? decodeURIComponent(val) : null;
    }
  });
  return params;
};

var Route = /*#__PURE__*/function () {
  function Route(pattern, page) {
    this.page = page;
    this.compiled = compile(pattern, {
      encode: encodeURIComponent
    });
    this.keys = []; // @ts-ignore

    this.regex = pathToRegexp(pattern, this.keys);
  }

  var _proto = Route.prototype;

  _proto.valuesToParams = function valuesToParams(values, keys) {
    return values.reduce(function (params, val, i) {
      var _Object$assign;

      if (val === undefined) return params;
      return Object.assign(params, (_Object$assign = {}, _Object$assign[keys[i].name] = decodeURIComponent(val), _Object$assign));
    }, {});
  };

  _proto.match = function match(asPath) {
    var asPathSplitted = asPath.split('#');
    var asPathNoHash = asPathSplitted[0];
    var asPathNoHashSplitted = asPathNoHash.split('?');
    var asPathNoHashNoQuery = asPathNoHashSplitted[0]; // get query params

    var queryParams = {};

    if (asPathNoHashSplitted.length > 1) {
      queryParams = getUrlParams(asPathNoHashSplitted[1]);
    } // get hash


    var hash = asPathSplitted.length > 1 ? asPathSplitted[1] : '';
    var match = this.regex.exec(asPathNoHashNoQuery);

    if (match !== null) {
      var params = this.valuesToParams(match.slice(1), this.keys);
      return {
        params: params,
        query: queryParams,
        hash: hash,
        path: asPath,
        page: this.page,
        matched: true
      };
    }

    return {
      params: {},
      query: queryParams,
      hash: hash,
      path: asPath,
      page: '',
      matched: false
    };
  };

  _proto.assemble = function assemble(params) {
    var compiled = this.compiled(params);
    return compiled === '' ? '/' : compiled.replace(/%23/g, '#');
  };

  _proto.getPage = function getPage() {
    return this.page;
  };

  return Route;
}();

var getHandlerRouter = function getHandlerRouter(router, handler) {
  return function () {
    var url = arguments.length <= 0 ? undefined : arguments[0];

    if (arguments.length > 1 && typeof (arguments.length <= 1 ? undefined : arguments[1]) === "string") {
      url = arguments.length <= 1 ? undefined : arguments[1];
    }

    var routerMatch = router.match(url);
    var currentRoute = router.currentRouteFromMatch(routerMatch);

    if (arguments.length === 1) {
      handler(currentRoute);
    } else {
      handler(arguments.length <= 0 ? undefined : arguments[0], currentRoute);
    }
  };
};

var findHandlersIndex = function findHandlersIndex(arr, handler) {
  return arr.findIndex(function (handlers) {
    return handlers.handler === handler;
  });
};

function events(router) {
  var all = Object.create(null);
  return {
    on: function on(type, handler) {
      var handlerRouter = getHandlerRouter(router, handler);
      NextRouter.events.on(type, handlerRouter);
      (all[type] || (all[type] = [])).push({
        handler: handler,
        handlerRouter: handlerRouter
      });
    },
    off: function off(type, handler) {
      if (all[type]) {
        var handlersIndex = findHandlersIndex(all[type], handler);

        if (handlersIndex >= 0) {
          var handlerRouter = all[type][handlersIndex].handlerRouter;
          NextRouter.events.off(type, handlerRouter);
          all[type].splice(handlersIndex, 1);
        }
      }
    }
  };
}

var Router = /*#__PURE__*/function () {
  function Router(routes) {
    this.routes = {};
    this.currentRoute = null;
    this.setRoutes(routes);
    this.events = events(this);
  }

  var _proto = Router.prototype;

  _proto.setRoutes = function setRoutes(routes) {
    this.routes = {};
    this.addRoutes(routes);
  };

  _proto.addRoutes = function addRoutes(routes) {
    for (var route in routes) {
      if (!routes.hasOwnProperty(route)) {
        continue;
      }

      this.routes[route] = new Route(routes[route].pattern, routes[route].page);
    }
  };

  _proto.getRoutes = function getRoutes() {
    return this.routes;
  };

  _proto.match = function match(asPath) {
    for (var route in this.routes) {
      if (!this.routes.hasOwnProperty(route)) {
        continue;
      }

      var matched = this.routes[route].match(asPath);

      if (matched.matched) {
        return _extends({}, matched, {
          route: route
        });
      }
    }

    return {
      route: '',
      params: {},
      query: {},
      path: asPath,
      page: '',
      hash: '',
      matched: false
    };
  };

  _proto.assemble = function assemble(route, params) {
    if (this.routes[route]) {
      return {
        path: this.routes[route].assemble(params),
        page: this.routes[route].getPage()
      };
    }

    throw new Error('next-router: No route matched');
  };

  _proto.getLinkProps = function getLinkProps(route, params, hash) {
    if (params === void 0) {
      params = {};
    }

    if (hash === void 0) {
      hash = '';
    }

    var assembled = this.assemble(route, params);
    var hashSuffix = hash !== '' ? "#" + hash : '';
    return {
      href: {
        pathname: assembled.page,
        query: params
      },
      as: "" + assembled.path + hashSuffix
    };
  };

  _proto.getLinkPropsFromHref = function getLinkPropsFromHref(href, transformFn) {
    if (transformFn === void 0) {
      transformFn = function transformFn(href) {
        return href;
      };
    }

    var hrefSlash = href.substr(0, 1) !== '/' ? "/" + href : href;
    var match = this.match(transformFn(hrefSlash));

    if (match.matched) {
      return this.getLinkProps(match.route, match.params, match.hash);
    }

    return {
      href: href,
      as: href
    };
  };

  _proto.push = function push(route, params, hash, options) {
    if (params === void 0) {
      params = {};
    }

    if (hash === void 0) {
      hash = '';
    }

    if (options === void 0) {
      options = {};
    }

    var props = this.getLinkProps(route, params, hash);
    return NextRouter.push(props.href, props.as, options);
  };

  _proto.pushHref = function pushHref(href, options) {
    if (options === void 0) {
      options = {};
    }

    var props = this.getLinkPropsFromHref(href);
    return NextRouter.push(props.href, props.as, options);
  };

  _proto.replace = function replace(route, params, hash, options) {
    if (params === void 0) {
      params = {};
    }

    if (hash === void 0) {
      hash = '';
    }

    if (options === void 0) {
      options = {};
    }

    var props = this.getLinkProps(route, params, hash);
    return NextRouter.replace(props.href, props.as, options);
  };

  _proto.replaceHref = function replaceHref(href, options) {
    if (options === void 0) {
      options = {};
    }

    var props = this.getLinkPropsFromHref(href);
    return NextRouter.replace(props.href, props.as, options);
  };

  _proto.getRequestHandler = function getRequestHandler(renderFunction) {
    var _this = this;

    return function (req, res, next) {
      // don't render next url's
      var isNextUrl = req.url.match(/^\/_next|^\/static/);

      if (isNextUrl) {
        return next();
      } // try to match request url


      var _this$match = _this.match(req.url),
          matched = _this$match.matched,
          route = _this$match.route,
          page = _this$match.page,
          params = _this$match.params,
          query = _this$match.query,
          hash = _this$match.hash;

      if (matched) {
        // set current route for later access
        _this.setCurrentRoute({
          route: route,
          page: page,
          params: params,
          query: query,
          hash: hash
        }); // call render function


        if (renderFunction) {
          return renderFunction(req, res, page, params, query, route);
        }
      }

      next();
    };
  };

  _proto.currentRouteFromMatch = function currentRouteFromMatch(routerMatch) {
    var route = routerMatch.route,
        page = routerMatch.page,
        params = routerMatch.params,
        query = routerMatch.query,
        hash = routerMatch.hash;
    return {
      route: route,
      page: page,
      params: params,
      query: query,
      hash: hash
    };
  };

  _proto.setCurrentRoute = function setCurrentRoute(currentRoute) {
    this.currentRoute = currentRoute;
  };

  _proto.getCurrentRoute = function getCurrentRoute() {
    return this.currentRoute;
  };

  return Router;
}();

var Link = function Link(router) {
  return function (_ref) {
    var route = _ref.route,
        _ref$params = _ref.params,
        params = _ref$params === void 0 ? {} : _ref$params,
        _ref$hash = _ref.hash,
        hash = _ref$hash === void 0 ? '' : _ref$hash,
        href = _ref.href,
        children = _ref.children,
        props = _objectWithoutPropertiesLoose(_ref, ["route", "params", "hash", "href", "children"]);

    if (!route && !href) {
      throw new Error('next-router: You have to provide a route or a href to the Link');
    }

    var mergedProps;

    if (route) {
      mergedProps = _extends({}, router.getLinkProps(route, params, hash), props);
    } else {
      mergedProps = _extends({}, router.getLinkPropsFromHref(href || ''), props);
    }

    return createElement(NextLink, Object.assign({}, mergedProps), children);
  };
};

var getRouterMatch = function getRouterMatch(appCtx, router) {
  var asPath = appCtx.ctx.asPath || '';
  return router.match(asPath);
};

var withNextRouterFactory = (function (router, getRouterMatchFunction) {
  if (!getRouterMatchFunction) {
    getRouterMatchFunction = getRouterMatch;
  }

  return function (App) {
    var _a;

    return _a = /*#__PURE__*/function (_React$Component) {
      _inheritsLoose(WrappedApp, _React$Component);

      function WrappedApp() {
        return _React$Component.apply(this, arguments) || this;
      }

      var _proto = WrappedApp.prototype;

      _proto.render = function render() {
        var _this$props = this.props,
            initialProps = _this$props.initialProps,
            nextRouter_currentRoute = _this$props.nextRouter_currentRoute,
            props = _objectWithoutPropertiesLoose(_this$props, ["initialProps", "nextRouter_currentRoute"]); // set current route on hydration


        if (!router.getCurrentRoute()) {
          router.setCurrentRoute(nextRouter_currentRoute);
        }

        return createElement(App, Object.assign({}, props, initialProps));
      };

      return WrappedApp;
    }(Component), _a.getInitialProps = function (appCtx) {
      try {
        var _temp3 = function _temp3() {
          return {
            nextRouter_currentRoute: nextRouter_currentRoute,
            initialProps: initialProps
          };
        };

        var initialProps = {};
        var routerMatch = {
          route: '',
          params: {},
          query: {},
          path: '',
          page: '',
          hash: '',
          matched: false
        };

        if (getRouterMatchFunction) {
          routerMatch = getRouterMatchFunction(appCtx, router);
        }

        if (!routerMatch.matched) {
          if (appCtx.ctx.res) {
            appCtx.ctx.res.statusCode = 404;
          }
        }

        var _routerMatch = routerMatch,
            route = _routerMatch.route,
            page = _routerMatch.page,
            params = _routerMatch.params,
            query = _routerMatch.query,
            hash = _routerMatch.hash;
        var nextRouter_currentRoute = {
          route: route,
          page: page,
          params: params,
          query: query,
          hash: hash
        };
        router.setCurrentRoute(nextRouter_currentRoute);
        appCtx.ctx.query = _extends({}, query, params);

        var _temp4 = function () {
          if ('getInitialProps' in App) {
            return Promise.resolve(App.getInitialProps.call(App, appCtx)).then(function (_App$getInitialProps$) {
              initialProps = _App$getInitialProps$;
            });
          }
        }();

        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp3) : _temp3(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    }, _a;
  };
});

var router;
var link;
var withNextRouter;
var init = function init(routes, RouterClass, LinkFactory, getRouterMatchFunction) {
  router = RouterClass ? new RouterClass(routes) : new Router(routes);
  link = LinkFactory ? LinkFactory(router) : Link(router);
  withNextRouter = withNextRouterFactory(router, getRouterMatchFunction);
};

var useRouter = function useRouter() {
  if (!router) {
    throw new Error('next-router: Router is not set. You have to initialize next-router first.');
  }

  return router.getCurrentRoute();
};

export { link as Link, Link as LinkFactory, Route as RouteClass, router as Router, Router as RouterClass, init, useRouter, withNextRouter, withNextRouterFactory };
//# sourceMappingURL=next-router.esm.js.map
