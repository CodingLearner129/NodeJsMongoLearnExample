import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";

// create schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    minlength: [5, "The product must have at least 5 characters"],
    maxlength: [50, "The product must have less or equal then 50 characters"],
    // validate: [validator.isAlpha, "product name must be contain characters"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // this only points to the current document on new document creation
        // it doesn't work with update queries
        return val < this.price;
      },
      messages: "The price discount ({VALUE}) must be less than the price of the product",
    },
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    select: false // to hide the createdAt from the response like passwords
  },
});

// create model
const product = mongoose.model("product", productSchema);

export { product };
