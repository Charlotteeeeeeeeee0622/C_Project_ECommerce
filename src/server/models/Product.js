const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  imageLink: { type: String, required: false },
  price: { type: Number, required: true, min: 0 },
  inStockQuantity: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
