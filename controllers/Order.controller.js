import OrderModel from "../model/Order.model.js";
import EaterModel from "../model/Eater.model.js";
import Provider from "../model/Provider.model.js";
import mongoose from "mongoose";

export const createOrder = async (req, res) => {
  const { email, title, price, quantity, providerId } = req.body;

  try {
    // Find the user by email
    const user = await EaterModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const totalAmount = price * quantity;

    const newOrder = new OrderModel({
      user: user._id,
      provider: providerId,
      title,
      totalAmount,
      quantity,
      price,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};
export const geteaterOrders = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await EaterModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const orders = await OrderModel.find({ user: user._id});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getProviderOrders = async (req, res) => {
  const { email } = req.body;
  console.log("hi");
  try {
    const user = await Provider.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const orders = await OrderModel.find({
      provider: user._id,
      status: "Pending",
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getProviderOrdersHistory = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Provider.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const orders = await OrderModel.find({
      provider: user._id,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const updateOrder = async (req, res) => {
  const { status, orderId } = req.body;

  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
  }
};

export const getProviderOrdersSummary = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the provider by email
    const provider = await Provider.findOne({ email });
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Aggregate orders for the provider and include eater's name
    const ordersSummary = await OrderModel.aggregate([
      { $match: { provider: new mongoose.Types.ObjectId(provider._id) } },
      {
        $lookup: {
          from: "eaters", // The collection name for Eater
          localField: "user",
          foreignField: "_id",
          as: "eaterDetails"
        }
      },
      {
        $unwind: "$eaterDetails" // Unwind to deconstruct the array
      },
      {
        $group: {
          _id: "$title", // Group by order title
          totalQuantity: { $sum: "$quantity" },
          totalAmount: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 }, // Count number of orders
          eaterNames: { $addToSet: "$eaterDetails.email" } // Collect eater names in a set
        }
      },
      {
        $project: {
          _id: 0,
          title: "$_id",
          totalQuantity: 1,
          totalAmount: 1,
          orderCount: 1,
          eaterNames: 1 // Include the eater names in the output
        }
      }
    ]);

    res.status(200).json(ordersSummary);
  } catch (error) {
    console.error("Error fetching provider orders summary:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export default { createOrder, geteaterOrders, updateOrder, getProviderOrders, getProviderOrdersHistory,getProviderOrdersSummary };
