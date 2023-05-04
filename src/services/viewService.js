import cathAsync from "./../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import { tour as tourModel } from "./../models/tourModel.js";
import { user as userModel } from "./../models/userModel.js";
import { booking as bookingModel } from "./../models/bookingModel.js";
import mongoose from "mongoose";

export const getOverview = cathAsync(async (req, res, next) => {
  // 1) get tour data from collection
  const model = await tourModel.aggregate([
    {
      $match: { secretTour: false }
    },
    {
      $project: {
        _id: -1,
        name: 1,
        imageCover: 1,
        imageCover: 1,
        difficulty: 1,
        duration: 1,
        summary: 1,
        startLocation: 1,
        startDates: 1,
        locations: 1,
        maxGroupSize: 1,
        price: 1,
        ratingsAverage: 1,
        ratingsQuantity: 1,
        slug: 1,
      }
    }
  ]);
  // const model = await tourModel.find();

  // 2) build template

  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours: model
  });
});

export const getTour = cathAsync(async (req, res, next) => {
  // 1) get the data, for the requested tour (including reviews and guides)
  const model = await tourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!model) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  console.log(`${process.env.STRIPE_PUBLIC_KEY}`);
  // 2) build template
  // 3) Render that template using tour data from 1)
  res.setHeader('Content-Security-Policy', "script-src 'self' https://api.mapbox.com - https://api.mapbox.com");
  res.setHeader('Content-Security-Policy', "script-src-elem 'self' https://js.stripe.com - https://api.mapbox.com");
  // res.setHeader('Content-Security-Policy', "script-src-elem 'self' api.mapbox.com");
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');

  res.status(200).render('tour', {
    title: `${model.name} tour`,
    tour: model
  });
});

export const getLoginForm = cathAsync(async (req, res, next) => {
  // 1) get the data, for the requested tour (including reviews and guides)
  const model = await tourModel.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 2) build template
  // 3) Render that template using tour data from 1)
  // res.setHeader( 'Content-Security-Policy', "script-src 'self' https://cdnjs.cloudflare.com" ); 
  res.setHeader('Content-Security-Policy', "script-src 'self' https://cdn.jsdelivr.net");
  res.status(200).render('login', {
    title: 'Login into your account',
    // url: `${req.protocol}://${req.get('host')}/api/v1/auth/login`
  });
});

export const getAccount = cathAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
    // urlUpdateProfile: `${req.protocol}://${req.get('host')}/api/v1/auth/update-profile`
  });
});

export const updateUserProfile = cathAsync(async (req, res, next) => {
  const model = await userModel.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  },
    {
      new: true,
      runValidators: true
    });

  res.status(200).render('account', {
    title: 'Your account',
    user: model
  });
});

export const getMyTours = cathAsync(async (req, res, next) => {
  // 1) find all bookings
  // const bookings = await bookingModel.find({ user: req.user.id });
  const bookings = await bookingModel.aggregate([
    {
      $match:{ 
        user: new mongoose.Types.ObjectId(req.user.id) 
      }
    },
    {
      $group: {
        _id: "$tour",  
        count: { $sum: 1 },
        // tour: {$first: "$tour"} // returns first tour form multi tour when apply group by
        // tour: {$addToSet: "$tour"} // returns all tour tour comma separated form multi tour when apply group by
      }
    },
    {
      $project: {
        _id: 0,
        tourId: "$_id",
        count: 1
      }
    }
  ]);
  console.log(bookings);
  // 2) find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tourId);
  // console.log(tourIDs);
  // const tours = await tourModel.find({ _id: { $in: tourIDs } });

  const tours = await tourModel.aggregate([
    {
      $match: { 
        secretTour: false,
        _id: { $in: tourIDs }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        imageCover: 1,
        imageCover: 1,
        difficulty: 1,
        duration: 1,
        summary: 1,
        startLocation: 1,
        startDates: 1,
        locations: 1,
        maxGroupSize: 1,
        price: 1,
        ratingsAverage: 1,
        ratingsQuantity: 1,
        slug: 1,
      }
    }
  ]);

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
    bookings
  });
});
