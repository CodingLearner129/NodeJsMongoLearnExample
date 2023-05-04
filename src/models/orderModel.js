import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";

// create schema
const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    minlength: [5, "The order must have at least 5 characters"],
    maxlength: [50, "The order must have less or equal then 50 characters"],
  },
  orderItem_id: [String],
  duration: {
    type: Number,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "The rating must be above or equal to 1.0"],
    max: [5, "The rating must be below or equal to 5.0"],
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
      messages: "The price discount ({VALUE}) must be less than the price of the order",
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
const order = mongoose.model("order", orderSchema);

export { order };
