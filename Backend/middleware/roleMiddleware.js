import dotenv from "dotenv";
dotenv.config();

/**
 * Check if user has at least one of the allowed roles
 * @param {Array} allowedRoles - e.g., ["admin", "user", "manager"]
 */

export const checkRole = (allowedRoles = []) => (req, res, next) => {

  // console.log("Namespace:", process.env.AUTH0_ROLES_NAMESPACE);
  // console.log("Roles from token:", req.auth[process.env.AUTH0_ROLES_NAMESPACE]);
  // console.log("Allowed roles:", allowedRoles);

    try {
    const roles = req.auth[process.env.AUTH0_ROLES_NAMESPACE] || [];

    if (!roles || !Array.isArray(roles) || !allowedRoles.some(r => roles.includes(r))) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    next();
  } catch (err) {
    console.error("Role check error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
