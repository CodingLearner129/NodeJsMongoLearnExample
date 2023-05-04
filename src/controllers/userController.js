import * as userService from "./../services/userService.js";
import { uploadFile } from "./../Helpers/multerHelper.js";
import sharp from 'sharp';
import cathAsync from "./../utils/catchAsync.js";
import fs from 'fs';

// export const uploadUserPhoto = uploadFile('src/public/img/users', 'user').single('photo');
export const uploadUserPhoto = uploadFile().single('photo');
export const resizeUserPhoto = cathAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.destination = 'src/public/img/users';
    if (!fs.existsSync(req.file.destination)) {
        fs.mkdirSync(req.file.destination);
    }
    const uniqueSuffix = `user-${req.user.id}-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = req.file.mimetype.split('/')[1];
    // console.log(extension);
    req.file.filename = `${uniqueSuffix}.${extension}`;
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`${req.file.destination}/${req.file.filename}`);

    next();
});

export const getAllUser = async (req, res, next) => {
    userService.getAllUser(req, res, next);
};

// export const createUser = async (req, res, next) => {
//     userService.createUser(req, res, next);
// };

export const userDetails = async (req, res, next) => {
    userService.userDetails(req, res, next);
};

export const getProfile = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

export const updateProfile = async (req, res, next) => {
    userService.updateProfile(req, res, next);
};

export const deactivateAccount = async (req, res, next) => {
    userService.deactivateAccount(req, res, next);
};

export const getUser = async (req, res, next) => {
    userService.getUser(req, res, next);
};

export const createUser = async (req, res, next) => {
    userService.createUser(req, res, next);
};

export const updateUser = async (req, res, next) => {
    userService.updateUser(req, res, next);
};

export const deleteUser = async (req, res, next) => {
    userService.deleteUser(req, res, next);
};