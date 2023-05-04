import mongoose from "mongoose";
import {tour as tourModel} from "./tourModel.js";

// create schema
const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        require: [true, "Please enter review"],
    },
    rating: {
        type: Number,
        require: [true, "Please enter rating"],
        min: [1, "The rating must be above or equal to 1.0"],
        max: [5, "The rating must be below or equal to 5.0"],
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: "tour",
        require: [true, "Review must be belong to a tour"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        require: [true, "Review must be belong to a user"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false // to hide the createdAt from the response like passwords
    },
}, {
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.id;
        }
    },
    toObject: { virtuals: true }
});

// for unique combination of tour and user; so, the user can write one review for each tour 
reviewSchema.index({ tour: 1, user: 1}, { unique: true }); 

reviewSchema.pre(/^find/, function (next) {
    // this.populate([
    //     {
    //         path: "tour",
    //         select: "name" 
    //     }, {
    //         path: "user",
    //         select: "name"
    //     }
    // ]);
    // this.populate({
    //         path: "tour",
    //         select: "name" 
    //     }).populate({
    //     path: "user",
    //     select: "name"
    // });
    this.populate({
        path: "user",
        select: "name photo"
    });
    next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {
            $group:{
                _id: '$tour',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);

    if (stats.length > 0) {
        await tourModel.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await tourModel.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5,
        });
    }
}

// document middleware
reviewSchema.post('save', async function(){
    // This points to current review
    await this.constructor.calcAverageRatings(this.tour); 
    // this points to current document and constructor is basically a model who created that document
});

//findByIdAndUpdate is the shorthand of findOneAndUpdate with current Id
//findByIdAndDelete is the shorthand of findOneAndDelete with current Id
// query middleware
reviewSchema.pre(/^findOneAnd/, async function(next){
    // this.reviewDocument = await this.findOne(); 
    // to get get document from database before update and delete because after update and delete we can't able get document from database
    this.reviewDocument = await this.findOne().clone(); 
    // If you're absolutely sure you want to execute the exact same query twice, you can use clone()
    // console.log(this.reviewDocument);
    next();
});

reviewSchema.post(/^findOneAnd/, async function(){
    // await this.findOne(); does not work here, query has already executed
    await this.reviewDocument.constructor.calcAverageRatings(this.reviewDocument.tour);
});

const review = mongoose.model("review", reviewSchema);

export { review };