import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setProfile({
            name: user?.name || "",
            email: user?.email || "",
            phone: "",
            address: "",
            country: "",
          });
          return;
        }

        const data = await res.json();
        setProfile({
          name: data.name ?? user?.name ?? "",
          email: data.email ?? user?.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          country: data.country ?? "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, getAccessTokenSilently, user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const token = await getAccessTokenSilently();
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      setProfile(updated);
      setMessages(["Profile updated successfully!"]);
    } catch (err) {
      setMessages([err.message]);
    }
  };

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
    <div>
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
        <div>
          <label>Name:</label>
          <input name="name" value={profile.name ?? ""} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={profile.email ?? ""} onChange={handleChange} required readOnly />
        </div>
        <div>
          <label>Phone:</label>
          <input name="phone" value={profile.phone ?? ""} onChange={handleChange} />
        </div>
        <div>
          <label>Address:</label>
          <input name="address" value={profile.address ?? ""} onChange={handleChange} />
        </div>
        <div>
          <label>Country:</label>
          <input name="country" value={profile.country ?? ""} onChange={handleChange} />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;