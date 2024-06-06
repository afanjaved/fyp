import mongoose from "mongoose";

const Schema = mongoose.Schema;
const EaterSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "eater",
  },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
});
export default mongoose.model("Eater", EaterSchema);
