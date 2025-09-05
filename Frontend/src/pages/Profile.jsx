import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { getProfile, updateProfile } = useApi();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [messages, setMessages] = useState([]);

  // Fetch profile from DB; if first visit, merge Auth0 claims
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const data = await getProfile();

        // Merge custom claims only if DB doesn't already have values
        const namespace = "https://ecommerce-api.com/";
        const customClaims = user || {};

        setProfile({
          name: data.name || customClaims[`${namespace}username`] || user?.name || "",
          email: data.email || user?.email || "",
          phone: data.phone || customClaims[`${namespace}phone`] || "",
          address: data.address || "",
          country: data.country || customClaims[`${namespace}country`] || "",
        });
      } catch (err) {
        console.error("Profile fetch error:", err);
        setMessages([err.message]);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);

    const errors = [];

    if (!profile.name.trim()) errors.push("Name is required.");
    if (!profile.email.trim()) errors.push("Email is required.");
    if (profile.phone && !/^\d{10,15}$/.test(profile.phone)) errors.push("Phone number must be 10–15 digits.");
    if (profile.address && profile.address.length > 200) errors.push("Address is too long.");
    if (!profile.country.trim()) errors.push("Country is required.");

    if (errors.length > 0) {
      setMessages(errors);
      return;
    }

    try {
      const updated = await updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        country: profile.country,
      });
      // Keep email read-only from backend/auth0
      setProfile({ ...updated, email: updated.email || profile.email });
      setMessages(["Profile updated successfully!"]);
    } catch (err) {
      setMessages([err.message]);
    }
  };

  // Clear messages after 4 seconds
  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => setMessages([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [messages]);

  if (isLoading || loadingProfile) return <p>Loading...</p>;
  if (!isAuthenticated) return <p>Please log in</p>;

  const isSuccess = messages[0]?.includes("successfully");

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h3>Profile</h3>

      {messages.length > 0 && (
        <ul
          style={{
            backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
            color: isSuccess ? "#155724" : "#721c24",
            padding: "1rem",
            borderRadius: "4px",
            marginBottom: "1rem",
            border: `1px solid ${isSuccess ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Name:</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Email:</label>
          <input
            name="email"
            value={profile.email}
            readOnly
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", backgroundColor: "#f0f0f0" }}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Phone:</label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Address:</label>
          <input
            name="address"
            value={profile.address}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.5rem" }}>
          <label>Country:</label>
          <input
            name="country"
            value={profile.country}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>

        <button type="submit" style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
