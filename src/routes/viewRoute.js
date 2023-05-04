import express from "express";
import * as ViewController from "../controllers/viewController.js";
import * as AuthController from "./../controllers/authController.js";
import * as BookingController from "./../controllers/bookingController.js";

const router = express.Router();

// router.get('/',  (req, res) => {
//     res.status(200).render('base', {
//         title: 'Exiting tours for adventurous people',
//         tour: 'The Forest Hiker',
//         user: 'Dhruv'
//     });
// });

router.get('/', [BookingController.createBookingCheckoutWithoutWebhook ,AuthController.isLoggedIn], ViewController.getOverview);
router.get('/tour/:slug', [AuthController.isLoggedIn], ViewController.getTour);
router.get('/login', [AuthController.isLoggedIn], ViewController.getLoginForm);
router.get('/my-profile', [AuthController.protect], ViewController.getAccount);
router.post('/submit-profile', [AuthController.protect], ViewController.updateUserProfile);
router.get('/my-tours', [AuthController.protect], ViewController.getMyTours);

export {router};