import mongoose from "mongoose";

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "eaters", required: true },
  provider: { type: Schema.Types.ObjectId, ref: "providers", required: true },
  title: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: "Pending" }, // New field for order status
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
