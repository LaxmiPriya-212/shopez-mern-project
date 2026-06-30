const Cart = require("../models/Cart");

// Get Cart (Auto-creates if not exists)
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add Product To Cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity) || 1;

    let cart = await Cart.findOne({ user: req.user._id });

    // If cart doesn't exist, create it
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity: qty,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Product already exists → increase quantity
        cart.items[itemIndex].quantity += qty;
      } else {
        // New product
        cart.items.push({
          product: productId,
          quantity: qty,
        });
      }

      await cart.save();
    }

    // Return populated cart
    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Cart Item Quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const qty = Number(quantity);

    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    cart.items[itemIndex].quantity = qty;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Product from Cart (Fixes the bug that deleted the entire cart document!)
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};