// Prevent NoSQL Injection by stripping out Mongo operators
export function sanitizeRequest(req, res, next) {
  function clean(obj) {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key]; // dangerous keys removed
        } else if (typeof obj[key] === "object") {
          clean(obj[key]); // recursive clean
        }
      }
    }
  }

  clean(req.body);
  clean(req.query);
  clean(req.params);

  next();
}
