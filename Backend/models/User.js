import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true }, // from Auth0 "sub"
    // username: { type: String }, // from IDP if available
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    country: { type: String }, // new field
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
