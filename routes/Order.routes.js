import express from "express";
const router = express.Router();
import OrderController from "../controllers/Order.controller.js";
router.post("/createorder", OrderController.createOrder);
router.post("/geteaterorder", OrderController.geteaterOrders);
router.post("/getproviderorder", OrderController.getProviderOrders);
router.post("/updateorder", OrderController.updateOrder);
export default router;
