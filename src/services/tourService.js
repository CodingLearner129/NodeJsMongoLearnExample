import { tour as tourModel } from "./../models/tourModel.js";
import APIFeatures from "./../utils/apiFeatures.js";
import cathAsync from "./../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import * as handlerFactory from "../Helpers/handlerFactory.js";
import mongoose from "mongoose";

// export const getAllTour = async (data) => {
// try {

// // filter
// const queryObj = { ...data };
// const excludedFields = ["page", "sort", "limit", "fields"];
// excludedFields.forEach((el) => delete queryObj[el]);
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
// let where = JSON.parse(queryStr);
// where = Object.keys(where).length == 0 ? null : where;

// // sorting
// const sort = data.sort == null ? null : data.sort.split(",").join(" ");

// // limited fields
// const fields =
//   data.fields == null ? null : data.fields.split(",").join(" ");

// // pagination and limit
// const page = data.page == null ? null : data.page * 1 || 1;
// const limit = data.limit == null ? null : data.limit * 1 || 10;
// const skip = limit * (page - 1);

// let query;
// // where clause
// if (where == null) {
//   query = tourModel.find();
// } else {
//   query = tourModel.find(where);
// }

// if (sort != null) {
//   query = query.sort(sort);
// }
// if (fields == null) {
//   query = query.select("-__v");
// } else {
//   query = query.select(fields);
// }
// if (limit != null) {
//   if (page == null) {
//     query = query.limit(limit);
//   } else {
//     const tours = await tourModel.countDocuments();
//     if (skip >= tours) {
//       throw new Error('This page does\'nt exists.');
//     }
//     query = query.skip(skip).limit(limit);
//   }
// }
// return await query;

// const features = new APIFeatures(tourModel.find(), data).filter().sort().limitedFields().pagination();
// return await features.query;
// } catch (error) {
//   throw new Error(error.message);
// }
// };
// export const getAllTour = cathAsync(async (req, res, next) => {
//   const features = new APIFeatures(tourModel, req.query)
//     .filter()
//     .sort()
//     .limitedFields()
//     .pagination()
//     .populate();
//   const model = await features.query;
//   // const model = await tourModel.find({ priceDiscount: '60', duration: { '$gte': '50' } });
//   if (model == null || model.length == 0) {
//       return next(new AppError("Tour Not Found", 404));
//     }
//   const response = {
//     // status: true,
//     status: 'success',
//     results: model.length,
//     data: model,
//   };
//   res.status(200).send(response);
// });

export const getAllTour = handlerFactory.getAll(tourModel);

// export const createTour = async (data) => {
//   try {
//     // return await new tourModel(data).save();
//     return await tourModel.create(data);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
// export const createTour = cathAsync(async (req, res, body) => {
//     const model = await tourModel.create(req.body);
//     const response = {
//       // status: true,
//       status: 'success',
//       data: model,
//     };
//     res.status(201).send(response);
// });
export const createTour = handlerFactory.createOne(tourModel);

// export const getTour = async (id) => {
//   try {
//     // return await tourModel.findOne({_id: id});
//     return await tourModel.findById(id);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
// export const getTour = cathAsync(async (req, res, next) => {
//   const model = await tourModel.findById(req.params.id).populate("reviews");
//   if (!model) {
//     return next(new AppError("Tour Not Found for that ID", 404));
//   }
//   const response = {
//     // status: true,
//     status: 'success',
//     data: model,
//   };
//   res.status(200).send(response);
// });

export const getTour = handlerFactory.getOne(tourModel, { path: "reviews" });

// export const updateTour = async (id, data) => {
//   try {
//     return await tourModel.findByIdAndUpdate(id, data, {
//       new: true,
//       returnDocument: "after",
//       runValidators: true,
//     });
//    if (!model) {
//      return next(new AppError("Tour Not Found for that ID", 404));
//    }
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// export const updateTour = cathAsync(async (req, res, next) => {
//   const model = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       returnDocument: "after",
//       runValidators: true,
//     });

//     if (!model) {
//       return next(new AppError("Tour Not Found for that ID", 404));
//     }

//     const response = {
//       // status: true,
//       status: 'success',
//       data: model,
//     };
//     res.status(200).send(response);
// });

export const updateTour = handlerFactory.updateOne(tourModel);

// export const deleteTour = async (id) => {
//   try {
//     return await tourModel.findByIdAndDelete(id);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };
// export const deleteTour = cathAsync(async (req, res, next) => {
//     const model = await tourModel.findByIdAndDelete(req.params.id);
//     if (!model) {
//       return next(new AppError("Tour Not Found for that ID", 404));
//     }
//     const response = {
//       // status: true,
//       status: 'success',
//       data: model,
//     };
//     res.status(200).send(response);
// });
export const deleteTour = handlerFactory.deleteOne(tourModel);
// export const getTourStats = async (data) => {
//   try {
//     return await tourModel.aggregate([
//       {
//         $match: { ratingsAverage: { $gte: 4 } },
//       },
//       {
//         $group: {
//           // _id: '$ratingsAverage',
//           // _id: '$difficulty',
//           _id: { $toUpper: "$difficulty" },
//           numTours: { $sum: 1 },
//           numRating: { $sum: "$ratingsQuantity" },
//           avgRating: { $avg: "$ratingsAverage" },
//           avgPrice: { $avg: "$price" },
//           minPrice: { $min: "$price" },
//           maxPrice: { $max: "$price" },
//         },
//       },
//       {
//         $sort: { avgPrice: 1 },
//       },
//       // {
//       //   $match: { _id: { $ne: 'HARD'} }
//       // },
//     ]);
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

export const getTourStats = cathAsync(async (req, res, next) => {
  const model = await tourModel.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4 } },
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        // _id: '$difficulty',
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRating: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'HARD'} }
    // },
  ]);
  const response = {
    // status: true,
    status: "success",
    data: model,
  };
  res.status(200).send(response);
});

// export const getMonthlyPlan = async (data) => {
//   try {
//     const year = data.year * 1;
//     return await tourModel.aggregate([
//       {
//         $unwind: "$startDates",
//       },
//       {
//         $match: {
//           startDates: {
//             $gte: new Date(`${year}-01-01`),
//             $lte: new Date(`${year}-12-31`),
//           },
//         },
//       },
//       {
//         $group: {
//           _id: { $month: "$startDates" },
//           numTourStarts: { $sum: 1 },
//           tours: { $push: "$name" },
//         },
//       },
//       {
//         $addFields: { month: "$_id" },
//       },
//       {
//         $project: {
//           _id: 0,
//         },
//       },
//       {
//         $sort: {
//           numTourStarts: -1,
//         },
//       },
//       // {
//       //   $limit: 4
//       // }
//     ]);

//     // if you set _id equals to null then $group works as db raw in sql
//     // if you assign value to _id then $group works as groupBy in sql
//     // $group with $match its like groupBy with where condition or groupBy having in sql
//     // $match is abolve $group then it's like groupBy with where condition in sql
//     // $match is below $group then it's like groupBy having in sql
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

export const getMonthlyPlan = cathAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const model = await tourModel.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    // {
    //   $limit: 4
    // }
  ]);

  // if you set _id equals to null then $group works as db raw in sql
  // if you assign value to _id then $group works as groupBy in sql
  // $group with $match its like groupBy with where condition or groupBy having in sql
  // $match is abolve $group then it's like groupBy with where condition in sql
  // $match is below $group then it's like groupBy having in sql
  const response = {
    // status: true,
    status: "success",
    data: model,
  };
  res.status(200).send(response);
});

// /tours-within/:distance/center/:latlng/unit/:unit
// tours-within/233/center/34.111745,-118.113491/unit/mi
export const getToursWithin = cathAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format like lat,lng",
        400
      )
    );
  }

  const model = await tourModel.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  // console.log(model);
  const response = {
    status: "success",
    results: model.length,
    data: model,
  };
  res.status(200).json(response);
});

export const getDistances = cathAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001; // convert meters to miles or kms 

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format like lat,lng",
        400
      )
    );
  }

  const model = await tourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance', // in meters
        distanceMultiplier: multiplier // to get distance in km or mile
      }
    }, {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  const response = {
    status: "success",
    data: model,
  };
  res.status(200).json(response);
});

export const getDistanceFromTour = cathAsync(async (req, res, next) => {
  const { latlng, unit, tourId } = req.params;
  const [lat, lng] = latlng.split(",");

  const multiplier = unit === "mi" ? 0.000621371 : 0.001; // convert meters to miles or kms  

  if (!lat || !lng) {
    next(
      new AppError(
        "Please provide latitude and longitude in the format like lat,lng",
        400
      )
    );
  }

  const model = await tourModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance', // in meters
        distanceMultiplier: multiplier, // to get distance in km or mile
        query: { _id: new mongoose.Types.ObjectId(tourId) }
      }
    }, {
      $project: {
        distance: 1,
        name: 1,
      }
    }
  ]);

  const response = {
    status: "success",
    data: model,
  };
  res.status(200).json(response);
});
