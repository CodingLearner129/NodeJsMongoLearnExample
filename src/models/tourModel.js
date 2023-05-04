import mongoose from "mongoose";
import slugify from "slugify";
import validator from "validator";
// import { user as userModel } from "./userModel.js"

// create schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
    minlength: [5, "The tour must have at least 5 characters"],
    maxlength: [50, "The tour must have less or equal then 50 characters"],
    // validate: [validator.isAlpha, "Tour name must be contain characters"],
  },
  slug: String,
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
    enum: {
      values: ["easy", "medium", "hard"],
      messages: "The difficulty must be either easy, medium or hard",
    },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, "The rating must be above or equal to 1.0"],
    max: [5, "The rating must be below or equal to 5.0"],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        // this only points to the current document on new document creation
        // it doesn't work with update queries
        return val < this.price;
      },
      messages: "The price discount ({VALUE}) must be less than the price of the tour",
    },
  },
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"],
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have an image cover"],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    select: false // to hide the createdAt from the response like passwords
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation:{
    // GoeJSON
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [
    {
      type:{
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      day: Number
    }
  ],
  // guides: Array
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "user" 
    }
  ],
  // reviews: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "review"
  //   }
  // ]
}, {
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      // ret.id = ret._id;
      // delete ret._id;
      delete ret.id;
    }
  },
  toObject: { virtuals: true }
});

// tourSchema.index({ price: 1 }); //index price by ascending order
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1});
tourSchema.index({ startLocation: '2dsphere'});

// virtual property which not in database but get it on only get because we set it for get method and we can't apply any operation as we perform on database fields 
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
  ref: "review",
  foreignField: "tour",
  localField: "_id"
});

// Model middleware which is run before .save() and .create() but not on insertMany()
// In model middleware, inside the function this keyword represents the document. 
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next){
//   const guidesPromises = this.guides.map(async id => await userModel.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next){
//   console.log("Will save document...");
//   next();
// });

// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// });

// Query middleware
// In query middleware, inside the function this keyword represents the query. 
// So we can apply the query to this 
// tourSchema.pre('find', function(next){
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// tourSchema.pre('findOne', function(next){
//   this.find({ secretTour: { $ne: true } });
//   next();
// });

// Or instead of apply it two times like above
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.updateOne({secretTour: false});
  // this.start = Date.now();
  next();
});
// tourSchema.post(/^find/, function(docs, next){
//     console.log(`Query took ${Date.now() - this.start} milliseconds...`);
//     // console.log(docs);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: "-__v -passwordChangedAt -role -secretuser"
  }).populate("reviews").lean();
  
  next();
});
// Aggregation middleware
// this point to current aggregation object
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });

// create model
const tour = mongoose.model("tour", tourSchema);

export { tour };
