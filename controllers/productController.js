const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  try {
    // Extract page, limit, and category from query parameters
    const { page = 1, limit = 10, category, currentProductId } = req.query;

    // Convert page and limit to numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    // Calculate the number of documents to skip
    const skip = (pageNumber - 1) * limitNumber;

    // Build query object conditionally
    const query = {};
    if (category) {
      query.category = category; // Add category filter if provided
    }

    if (currentProductId) {
      query._id = { $ne: currentProductId };
    }

    // Fetch total product count for pagination metadata with optional category filtering
    const totalCount = await Product.countDocuments(query);

    // Fetch paginated products with the optional category filter
    const products = await Product.find(query)
      .populate("category") // Populates category
      .populate("style") // Populates style

      .skip(skip) // Skip documents for previous pages
      .limit(limitNumber); // Limit the number of documents for the current page

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Return the response with products and pagination metadata
     
    return res.status(200).json({
      products,
      totalPages,
      currentPage: pageNumber,
      totalProducts: totalCount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      error: err,
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.status(201).json({ message: "product created successfully" });
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.find({ _id: req.params.id })
    .populate("category")
    .populate("style")
    .populate({
      path: "review.user",
      select: "name", // Only fetch the 'name' field
    }); // Populates review
    

    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const review = req.body;
    review.user = req.user.id;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { $push: { review: review } }
    );

    return res.status(200).send(product);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = { addProduct, getAllProducts, getProductById, addReview };
