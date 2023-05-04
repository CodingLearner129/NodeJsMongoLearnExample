import AppError from "../utils/appErrors.js";
import * as viewService from "./../services/viewService.js";

// export const signup = async (req, res, next) => {
//     viewService.signup(req, res, next);
// };

export const getOverview = async (req, res, next) => {
    viewService.getOverview(req, res, next);
};

export const getTour = async (req, res, next) => {
    viewService.getTour(req, res, next);
};

export const getLoginForm = async (req, res, next) => {
    viewService.getLoginForm(req, res, next);
};

export const getAccount = async (req, res, next) => {
    viewService.getAccount(req, res, next);
};

export const updateUserProfile = async (req, res, next) => {
    viewService.updateUserProfile(req, res, next);
};

export const getMyTours = async (req, res, next) => {
    viewService.getMyTours(req, res, next);
};