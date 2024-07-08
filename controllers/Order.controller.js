import OrderModel from "../model/Order.model.js";
import EaterModel from "../model/Eater.model.js";
import Provider from "../model/Provider.model.js";

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
export default { createOrder, geteaterOrders, updateOrder, getProviderOrders };
