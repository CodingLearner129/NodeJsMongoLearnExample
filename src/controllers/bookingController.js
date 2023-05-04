import * as bookingService from "./../services/bookingService.js";
import cathAsync from "./../utils/catchAsync.js";

export const getCheckoutSession = async (req, res, next) => {
    bookingService.getCheckoutSession(req, res, next);
};

export const webhookCheckout = async (req, res, next) => {
    bookingService.webhookCheckout(req, res, next);
};

export const createBookingCheckoutWithoutWebhook = async (req, res, next) => {
    bookingService.createBookingCheckoutWithoutWebhook(req, res, next);
};

export const getAllBooking = async (req, res, next) => {
    bookingService.getAllBooking(req, res, next);
};

export const getBooking = async (req, res, next) => {
    bookingService.getBooking(req, res, next);
};

export const createBooking = async (req, res, next) => {
    bookingService.createBooking(req, res, next);
};

export const updateBooking = async (req, res, next) => {
    bookingService.updateBooking(req, res, next);
};

export const deleteBooking = async (req, res, next) => {
    bookingService.deleteBooking(req, res, next);
};