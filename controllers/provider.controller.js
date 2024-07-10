import ProviderModel from "../model/Provider.model.js";
export const getProviders = async (req, res) => {
  try {
    const provider = await ProviderModel.find();
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: " Something went wrong" });
  }
};
export const rate = async (req, res) => {
  const { email, rate } = req.body;

  if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    return res.status(400).json({ message: "Rate must be a whole number between 1 and 5" });
  }

  try {
    const provider = await ProviderModel.findOne({ email });

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Add the new rating
    provider.ratings.push({ rate });

    // Calculate the average rating
    const totalRatings = provider.ratings.length;
    const sumRatings = provider.ratings.reduce((sum, rating) => sum + rating.rate, 0);
    provider.averageRating = Math.round(sumRatings / totalRatings);

    await provider.save();

    res.status(201).json("Rating submitted successfully");
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};



export default { getProviders, rate };
