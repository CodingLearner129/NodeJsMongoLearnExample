import * as reviewService from "./../services/reviewService.js";
import cathAsync from "./../utils/catchAsync.js";

export const getAllReview = async (req, res, next) => {
    reviewService.getAllReview(req, res, next);
};
export const getReview = async (req, res, next) => {
    reviewService.getReview(req, res, next);
};
export const createReview = async (req, res, next) => {
    reviewService.createReview(req, res, next);
};
export const updateReview = async (req, res, next) => {
    reviewService.updateReview(req, res, next);
};
export const deleteReview = async (req, res, next) => {
    reviewService.deleteReview(req, res, next);
};
export const setTourUserIds = (req, res, next) => {
    // nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;
    next();
};