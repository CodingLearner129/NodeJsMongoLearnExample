import express from "express";
import * as BookingController from "./../controllers/bookingController.js";
import * as AuthController from "./../controllers/authController.js";

const router = express.Router();

router.post('/webhook-checkout', [], BookingController.webhookCheckout);

router.use(AuthController.protect);

router.get('/checkout-session/:tourId', [], BookingController.getCheckoutSession);

router.post('/webhook-checkout', [], BookingController.createBookingCheckoutWithoutWebhook);

router.use(AuthController.restrictTo('admin'));

router.route("/").get([], BookingController.getAllBooking)
    .post([], BookingController.createBooking);

router.route("/:id").get([], BookingController.getBooking)
    .patch([], BookingController.updateBooking)
    .delete([], BookingController.deleteBooking);

export { router };