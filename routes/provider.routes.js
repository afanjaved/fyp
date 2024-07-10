import express from "express";
const router = express.Router();
import userController from "../controllers/provider.controller.js";
router.get("/getproviders", userController.getProviders);
router.post("/rate",userController.rate)
export default router;
