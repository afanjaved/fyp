import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Food = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  avlabilityTime: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  rating: {
    type: Number,
    default: 3.6,
  },
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "providers",
  },
});
export default mongoose.model("Food", Food);
