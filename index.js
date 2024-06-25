import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import providerRoutes from "./routes/provider.routes.js";
import foodRoutes from "./routes/Food.routes.js";
import OrderRoutes from "./routes/Order.routes.js";

const uri = "mongodb+srv://aafhanjaved:4LsJO7drLqQbzHBn@fyp.zp6y3wm.mongodb.net/fyp?retryWrites=true&w=majority&appName=fyp";
const app = express();
app.use(express.json());
app.use(cors());
mongoose
  .connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 300000, // Increase timeout to 30 seconds
    socketTimeoutMS: 450000, // Increase socket timeout to 45 seconds
    poolSize: 20, // Increase connection pool size
  }
    
  )         //mongodb://localhost:27017/FYP  password//4LsJO7drLqQbzHBn name//aafhanjaved
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err));
app.use("/api/user", userRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/order", OrderRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});