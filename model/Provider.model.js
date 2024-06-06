import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Provider = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "provider",
  },
  brand: { type: String },
  address: { type: String },
  phone: { type: String },
  image: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
});
export default mongoose.model("Provider", Provider);
