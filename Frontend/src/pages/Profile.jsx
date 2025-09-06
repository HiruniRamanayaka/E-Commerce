import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../services/api.js";
// import { useAuthToken } from "../hooks/useAuthToken";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  // const { accessToken, idToken } = useAuthToken();

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
  
  
  // if (process.env.NODE_ENV === "development") {
  //   console.log("Access Token:", accessToken);
  // }

  // Fetch profile from DB; if first visit, merge Auth0 claims
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const data = await getProfile();

        // Only set profile if it's still loading
        setProfile((prev) => {
          if (!loadingProfile) return prev;

          const namespace = "https://ecommerce-api.com/";
          const customClaims = user || {};

          return {
            name: data.name || customClaims[`${namespace}username`] || user?.name || "",
            email: data.email || user?.email || "",
            phone: data.phone || customClaims[`${namespace}phone`] || "",
            address: data.address || "",
            country: data.country || customClaims[`${namespace}country`] || "",
          };
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

  if (isLoading || loadingProfile) 
    return <div className="text-center py-12 text-gray-600">Loading...</div>;

  if (!isAuthenticated) 
    return <div className="text-center py-12 text-gray-600">Please log in</div>;

  const isSuccess = messages[0]?.includes("successfully");

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-gray-50 rounded-lg shadow-md p-8">
      <h3 className="text-2xl font-bold text-[#0a1f44] mb-6 text-center">Profile</h3>

      {messages.length > 0 && (
        <ul
          className={`mb-6 px-4 py-3 rounded-md text-sm ${
              isSuccess
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
        >
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div style={{ marginBottom: "0.5rem" }}>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            name="email"
            value={profile.email}
            readOnly
            className="mt-1 w-full p-3 border border-gray-200 bg-gray-100 rounded-md text-gray-500"
          />
        </div>

        <div>
          <label>Phone:</label>
          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address:</label>
          <input
            name="address"
            value={profile.address}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Country:</label>
          <input
            name="country"
            value={profile.country}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 bg-[#0a1f44] text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Save Profile
        </button>
      </form>
    </div>
  </div>
  );
};

export default Profile;
