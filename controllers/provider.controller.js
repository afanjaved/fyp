import ProviderModel from "../model/Provider.model.js";
export const getProviders = async (req, res) => {
  try {
    const provider = await ProviderModel.find();
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: " Something went wrong" });
  }
};
export default { getProviders };
