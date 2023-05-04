import express from 'express';
import * as UserController from "../controllers/userController.js";
import * as AuthController from "./../controllers/authController.js";

const router = express.Router();


// router.route('/profile').get(AuthController.protect, UserController.getProfile, UserController.getUser);
// router.route('/details').get(AuthController.protect, UserController.userDetails);
// router.route('/update-profile').patch(AuthController.protect, UserController.updateProfile);
// router.route('/deactivate-account').delete(AuthController.protect, UserController.deactivateAccount);
// router.route('/:id').get(AuthController.protect, UserController.getUser)
//     .patch(AuthController.protect, UserController.updateUser)
//     .delete(
//         AuthController.protect,
//         AuthController.restrictTo("admin", 'lead-guide'),
//         UserController.deleteUser
//     );

// Protect all routes after this middleware
router.use(AuthController.protect);

router.route('/profile').get([UserController.getProfile], UserController.getUser);
router.route('/details').get([], UserController.userDetails);
router.route('/update-profile').patch([UserController.uploadUserPhoto, UserController.resizeUserPhoto], UserController.updateProfile);
router.route('/deactivate-account').delete([], UserController.deactivateAccount);

router.use(AuthController.restrictTo("admin"));

router.route('/').get([], UserController.getAllUser).post([], UserController.createUser);
router.route('/:id').get([], UserController.getUser)
    .patch([], UserController.updateUser)
    .delete([], UserController.deleteUser);

export { router };