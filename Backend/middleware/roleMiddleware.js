// Middleware to check if user has "admin" role
export const checkAdmin = (req, res, next) => {
  try {
    // Auth0 puts roles in req.auth['https://your-domain/roles'] if configured
    const roles = req.auth[process.env.AUTH0_ROLES_NAMESPACE] || [];

    if (roles.includes("admin")) {
      return next();
    }

    return res.status(403).json({ message: "Access denied: Admins only." });
  } catch (err) {
    console.error("Role check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
