const app = require("../app");

function listRoutes(app) {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // routes registered directly on the app
      const methods = Object.keys(middleware.route.methods)
        .join(",")
        .toUpperCase();
      routes.push({ path: middleware.route.path, methods });
    } else if (
      middleware.name === "router" &&
      middleware.handle &&
      middleware.handle.stack
    ) {
      // router middleware
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .join(",")
            .toUpperCase();
          routes.push({
            path:
              middleware.regexp && middleware.regexp.source
                ? middleware.regexp
                : middleware,
            nested: handler.route.path,
            methods,
          });
        }
      });
    }
  });

  return routes;
}

const routes = listRoutes(app);
console.log("Discovered routes:");
routes.forEach((r) => console.log(JSON.stringify(r)));
