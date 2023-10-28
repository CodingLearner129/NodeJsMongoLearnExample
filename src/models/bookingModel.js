import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'tour', //name of the model
        required: [true, 'Booking must be belong to a Tour!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user', //name of the model
        required: [true, 'Booking must be belong to a User!']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a Price.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
});

bookingSchema.pre(/^find/, function(next){
    this.populate('user').populate({
        path: "tour",
        select: "name"
    }).lean();

    next();
});

const booking = mongoose.model('booking', bookingSchema); //where "booking" is model name which is used for relationship

export { booking };