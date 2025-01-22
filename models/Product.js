const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 255 },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  style: { type: mongoose.Schema.Types.ObjectId, ref: "Style" },
  rating: { type: Number },
  images: { type: [String] },
  size: { type: [String] },
  colors: [
    {
      name: {
        type: String,
      },
      code: {
        type: String,
      },
    },
  ],

  discount: {
    discount: Number,
    discountPrice: Number,
  },
  review: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Products", ProductsSchema);

// {
//   "_id": {
//     "$oid": "67594411f2bd545f4cba04ef"
//   },
//   "name": "t-shirt"
// }

// {
//   "_id": {
//     "$oid": "6759448ff2bd545f4cba04f4"
//   },
//   "name": "jeans"
// }

// "name": "T-SHIRT WITH TAPE DETAILS",
// "description": "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style",
// "price": "120.00",
// "stock": 10,
// "rating": "4.50",
// "category": "T-shirt",
// "style": ,

// "images": [
//   "/images/product/image 7.png",
//   "/images/product/image_1.png",
//   "/images/product/image_2.png"
// ]

// {
//   "_id": {
//     "$oid": "67594460f2bd545f4cba04f2"
//   },
//   "name": "casual"
// }
