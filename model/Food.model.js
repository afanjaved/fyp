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
  averageRating: {
    type: Number,
    default: 0,
    },
  ratings: [
    {
      rate: {
        type: Number,
        required: true,
      },
    },
  ],
  userRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "providers",
  },
});

export default mongoose.model("Food", Food);
