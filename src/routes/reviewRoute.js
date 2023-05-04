import express from "express";
import * as ReviewController from "./../controllers/reviewController.js";
import * as AuthController from "./../controllers/authController.js";

const router = express.Router({ mergeParams: true });

// POST /tour/5416354/reviews
// /reviews

router.use(AuthController.protect);

router
    .route("/")
    .get(
        // AuthController.protect,
        [], ReviewController.getAllReview
    )
    .post(
        // AuthController.protect,
        [AuthController.restrictTo('user'), ReviewController.setTourUserIds],
        ReviewController.createReview
    );
// router.route("/:id").get(AuthController.protect, ReviewController.getReview)
//     .patch(AuthController.protect, ReviewController.updateReview)
//     .delete(AuthController.protect, ReviewController.deleteReview);
router.route("/:id").get(ReviewController.getReview)
    .patch([AuthController.restrictTo('user', 'admin')], ReviewController.updateReview)
    .delete([AuthController.restrictTo('user', 'admin')], ReviewController.deleteReview);

export { router };