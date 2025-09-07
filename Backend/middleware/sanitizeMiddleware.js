// Prevent NoSQL Injection by stripping out Mongo operators
export function sanitizeRequest(req, res, next) {
  function clean(obj) {
    if (obj && typeof obj === "object") {
      // Prevent prototype pollution
      if (obj.constructor !== Object && !Array.isArray(obj)) return;

      for (const key in obj) {
        // Block Mongo operators and dangerous keys
        if (key.startsWith("$") || 
            key.includes(".") ||
            key === "__proto__" ||       // prototype pollution
            key === "constructor" ||
            key === "prototype"
          ){
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
