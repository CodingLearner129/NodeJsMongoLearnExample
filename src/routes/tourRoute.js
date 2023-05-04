import express from "express";
import * as TourController from "../controllers/tourController.js";
import * as AuthController from "./../controllers/authController.js";
import * as ReviewController from "./../controllers/reviewController.js";
import { router as ReviewRouter } from "./../routes/reviewRoute.js";

const router = express.Router();

router.use("/:tourId/reviews", ReviewRouter);

router
  .route("/")
  // .get(AuthController.protect, TourController.getAllTour)
  .get(TourController.getAllTour)
  .post(
    [AuthController.protect, AuthController.restrictTo("admin", "lead-guide")],
    TourController.createTour
  );
router.route("/tour-stats").get([], TourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    [AuthController.protect, AuthController.restrictTo("admin", "lead-guide", "guide")],
    TourController.getMonthlyPlan
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get([], TourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// tours-within/233/center/34.111745,-118.113491/unit/mi
// {{url}}/api/v1/tours/tours-within/2332/center/34.111745,-118.113491/unit/mi

router.route("/distances/:latlng/unit/:unit").get([], TourController.getDistances);
// {{url}}/api/v1/tours/distances/34.111745,-118.113491/unit/mi

router.route("/distances/:latlng/unit/:unit/tour/:tourId").get([], TourController.getDistanceFromTour);
// {{url}}/api/v1/tours/distances/34.111745,-118.113491/unit/mi/tour/642aa01a8b74a4187d8ded7a

router
  .route("/top-5-cheap")
  .get([TourController.aliasTopTour], TourController.getAllTour);
router
  .route("/:id")
  .get([AuthController.protect], TourController.getTour)
  .patch(
    [AuthController.protect, AuthController.restrictTo("admin", "lead-guide"), TourController.uploadTourImages, TourController.resizeTourPhoto],
    TourController.updateTour
  )
  .delete(
    [AuthController.protect, AuthController.restrictTo("admin", "lead-guide")],
    TourController.deleteTour
  );

// POST /tour/5416354/reviews
// GET /tour/5416354/reviews
// GET /tour/5416354/reviews/54654646

// router.route("/:tourId/reviews").post(
//   AuthController.protect,
//   AuthController.restrictTo('user'),
//   ReviewController.createReview
// );

export { router };
