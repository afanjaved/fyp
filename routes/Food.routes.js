import express from "express";
const router = express.Router();
import foodController from "../controllers/Food.controller.js";
router.post("/createfood", foodController.createFood);
router.post("/ratefood", foodController.rateFood);
router.get("/getfood", foodController.getFood);
export default router;
