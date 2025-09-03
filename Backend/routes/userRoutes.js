import express from "express";
import User from "../models/User.js";
import { checkJwt } from "../middleware/authMiddleware.js";
import { validateProfile } from "../middleware/validateMiddleware.js";

const router = express.Router();
const namespace = process.env.AUTH0_ROLES_NAMESPACE;

// GET /api/users/profile → fetch or create user profile
router.get("/profile", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth.sub; // consistent with orderRoutes
    let user = await User.findOne({ auth0Id });

    if (!user) {
      user = await User.create({
        auth0Id,
        name: req.auth.name || "",
        email: req.auth.email,
        phone: req.auth[`${namespace}phone`] || "",
        address: req.auth.address || "",
        country: req.auth[`${namespace}country`] || "",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/users/profile → update user profile
router.put("/profile", checkJwt, validateProfile, async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const updated = await User.findOneAndUpdate(
      { auth0Id },
      {
        name: req.body.name,
        email: req.auth.email || req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        country: req.body.country,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Unexpected error", details: err.message });
  }
});

// DELETE /api/users/profile → delete user profile data
router.delete("/profile", checkJwt, async (req, res) => {
  try {
    const auth0Id = req.auth.sub;
    const deleted = await User.findOneAndDelete({ auth0Id });

    if (!deleted) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    console.error("Profile delete error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;