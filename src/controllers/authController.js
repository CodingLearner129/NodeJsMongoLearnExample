import AppError from "../utils/appErrors.js";
import * as authService from "./../services/authService.js";

export const signup = async (req, res, next) => {
    authService.signup(req, res, next);
};

export const login = async (req, res, next) => {
    authService.login(req, res, next);
};
export const logout = async (req, res, next) => {
    authService.logout(req, res, next);
};

export const protect = async (req, res, next) => {
    authService.protect(req, res, next);
};

export const isLoggedIn = async (req, res, next) => {
    authService.isLoggedIn(req, res, next);
};

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles in array ['admin', 'lead-guide']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You don\'t have permission to perform this action', 403));
        }
        next();
    }
};

export const forgotPassword = async (req, res, next) => {
    authService.forgotPassword(req, res, next);
};

export const resetPassword = async (req, res, next) => {
    authService.resetPassword(req, res, next);
};
export const updatePassword = async (req, res, next) => {
    authService.updatePassword(req, res, next);
};