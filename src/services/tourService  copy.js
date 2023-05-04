import { Tour as tourModel } from "./../models/tourModel.js";
import APIFeatures from "./../utils/apiFeatures.js";

export const getAllTour = async (data = null) => {
  try {

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

    const features = new APIFeatures(tourModel.find(), data).filter().sort().limitedFields().pagination();
    return await features.query;

  } catch (error) {
    throw new Error(error.message);
  }
};

export const createTour = async (data) => {
  try {
    // return await new tourModel(data).save();
    return await tourModel.create(data);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTour = async (id) => {
  try {
    // return await tourModel.findOne({_id: id});
    return await tourModel.findById(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateTour = async (id, data) => {
  try {
    return await tourModel.findByIdAndUpdate(id, data, {
      new: true,
      returnDocument: "after",
      runValidators: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteTour = async (id) => {
  try {
    return await tourModel.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTourStats = async (data) => {
  try {
    return await tourModel.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4} }
      }, 
      {
        $group: {
          // _id: '$ratingsAverage',
          // _id: '$difficulty',
          _id: { $toUpper: '$difficulty'},
          numTours: { $sum: 1},
          numRating: { $sum: '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage'},
          avgPrice: { $avg: '$price'},
          minPrice: { $min: '$price'},
          maxPrice: { $max: '$price'}
        }
      },
      {
        $sort: { avgPrice: 1}
      },
      // {
      //   $match: { _id: { $ne: 'HARD'} }
      // }, 
    ]);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getMonthlyPlan = async (data) => {
  try {
    const year = data.year * 1;
    return await tourModel.aggregate([
      {
        $unwind: '$startDates'
      }, 
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates'},
          numTourStarts: { $sum: 1},
          tours: { $push: '$name'}
        }
      },
      {
        $addFields: { month: '$_id'}
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort:{
          numTourStarts: -1
        }
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

  } catch (error) {
    throw new Error(error.message);
  }
};
