import FoodModel from "../model/Food.model.js";
import providerModel from "../model/Provider.model.js";
export const createFood = async (req, res) => {
  const { name, price, avlabilityTime, email, phone } = req.body;
  try {
    const provider = await providerModel.findOne({ email });
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    const food = new FoodModel({
      name,
      price,
      avlabilityTime,
      phone,
      userRef: provider._id,
    });
    await food.save();
    res.status(200).json({ message: "Food created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const getFood = async (req, res) => {
  try {
    const food = await FoodModel.find();
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: " Something went wrong" });
  }
};

export const rateFood = async (req, res) => {
  const { foodId, rate } = req.body;

  if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    return res.status(400).json({ message: "Rate must be a whole number between 1 and 5" });
  }

  try {
    const food = await FoodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Add the new rating
    food.ratings.push({ rate });

    // Calculate the average rating
    const totalRatings = food.ratings.length;
    const sumRatings = food.ratings.reduce((sum, rating) => sum + rating.rate, 0);
    food.averageRating = sumRatings / totalRatings;

    await food.save();

    res.status(201).json("Rating submitted successfully");
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export default { createFood, getFood,rateFood };
