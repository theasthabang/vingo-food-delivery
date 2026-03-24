import Shop from "../models/ShopModel.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    let image;
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      if (!result || !result.secure_url) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      image = result.secure_url;
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      // NEW SHOP — image is required
      if (!image) {
        return res.status(400).json({ message: "Shop image is required" });
      }
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      // EDIT SHOP — keep existing image if no new one uploaded
      const updateData = { name, city, state, address };
      if (image) {
        updateData.image = image; // only update if new image uploaded
      }
      // ✅ existing image in DB stays untouched, required: true won't complain
      shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true });
    }

    await shop.populate("owner items");
    return res.status(201).json(shop);
  } catch (error) {
    console.error("createEditShop error:", error);
    return res
      .status(500)
      .json({ message: `create shop error: ${error.message}` });
  }
};

export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId })
      .populate("owner")
      .populate({
        path: "items",
        options: { sort: { updatedAt: -1 } },
      });
    if (!shop) {
      return null;
    }
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `get my shop error ${error}` });
  }
};

export const getShopByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");
    if (!shops) {
      return res.status(400).json({ message: "shops not found" });
    }
    return res.status(200).json(shops);
  } catch (error) {
    return res.status(500).json({ message: `get shop by city error ${error}` });
  }
};
