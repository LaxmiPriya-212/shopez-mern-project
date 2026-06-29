const Product = require("../models/Product");

// Create Product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, image, stock, specifications, isFeatured } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      specifications: specifications || [],
      isFeatured: isFeatured || false,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products (with Search, Filtering, Sorting, Pagination)
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 9;
    const page = Number(req.query.page) || 1;

    // Build Query
    const query = {};

    // Fuzzy Search
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } }
      ];
    }

    // Filters
    if (req.query.category && req.query.category !== "All") {
      query.category = req.query.category;
    }

    if (req.query.brand && req.query.brand !== "All") {
      query.brand = req.query.brand;
    }

    if (req.query.rating) {
      query.rating = { $gte: Number(req.query.rating) };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // default newest
    if (req.query.sortBy) {
      if (req.query.sortBy === "price-asc") {
        sortQuery = { price: 1 };
      } else if (req.query.sortBy === "price-desc") {
        sortQuery = { price: -1 };
      } else if (req.query.sortBy === "rating") {
        sortQuery = { rating: -1 };
      } else if (req.query.sortBy === "newest") {
        sortQuery = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Get unique categories and brands for filter options in frontend
    const categories = await Product.distinct("category");
    const brands = await Product.distinct("brand");

    res.status(200).json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      count,
      categories,
      brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Product By ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get similar products in the same category
    const similarProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      similarProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create Product Review
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    
    // Calculate new average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
};