import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true }, // from Auth0 "sub"
  name: { type: String },
  email: { type: String },
  address: { type: String },
  phone: { type: String },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
