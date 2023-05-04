import { review as reviewModel } from './../models/reviewModel.js';
import cathAsync from "./../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import * as handlerFactory from "../Helpers/handlerFactory.js";

// export const getAllReview = cathAsync(async (req, res, next) => {
//     let filter  = {};
//     if(req.params.tourId) filter = { tour: req.params.tourId };
    
//     const model = await reviewModel.find(filter);
//     if (model == null || model.length == 0) {
//         return next(new AppError("Review Not Found", 404));
//     }
//     const response = {
//         status: 'success',
//         results: model.length,
//         data: model,
//     };
//     res.status(200).send(response);
// }); 

export const getAllReview = handlerFactory.getAll(reviewModel); 

// export const createReview = cathAsync(async (req, res, next) => {
//     // // nested routes
//     // if (!req.body.tour) req.body.tour = req.params.tourId;
//     // if (!req.body.user) req.body.user = req.user.id;
//     // managed by setTourUserIds

//     const model = await reviewModel.create(req.body);
//     if (model == null || model.length == 0) {
//         return next(new AppError("Review Not Found", 404));
//     }
//     const response = {
//         status: 'success',
//         data: model,
//     };
//     res.status(201).send(response);
// }); 

export const getReview = handlerFactory.getOne(reviewModel); 

export const createReview = handlerFactory.createOne(reviewModel); 

export const updateReview = handlerFactory.updateOne(reviewModel); 

export const deleteReview = handlerFactory.deleteOne(reviewModel); 