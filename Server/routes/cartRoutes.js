const express = require("express");
const {
  addToCart,
  getCart,
  removeCartItem,
} = require("../controllers/cartController");
const router = express.Router();

router.post("/", addToCart);
router.get("/:userId", getCart);
router.delete("/:cartId", removeCartItem);
module.exports = router;