import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import foodRoutes from "./routes/Food.routes.js";
import OrderRoutes from "./routes/Order.routes.js";
const app = express();
app.use(express.json());
app.use(cors());
mongoose
  .connect("mongodb://localhost:27017/FYP_Afhan")
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));
app.use("/api/user", userRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/order", OrderRoutes);
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
