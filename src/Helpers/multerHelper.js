import AppError from "../utils/appErrors.js";
import multer from "multer";
import fs from "fs";

export const uploadFile = (path, modelName) => {

    // const multerStorage = multer.diskStorage({
    //     destination: (req, file, cb) => { //cb is callback function
    //         // const path = 'src/public/img/users';
    //         if (!fs.existsSync(path)) {
    //             fs.mkdirSync(path);
    //         }
    //         cb(null, path); //cb(error, destination)
    //     },
    //     filename: function (req, file, cb) {
    //         // user-userId-Date-51545131.extension
    //         const uniqueSuffix = `${modelName}-${req.user.id}-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    //         const extension = file.mimetype.split('/')[1];
    //         cb(null, `${uniqueSuffix}.${extension}`); //cb(error, filename)
    //     }
    // });
    const multerStorage = multer.memoryStorage();
    
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true); // cb(error, true/false); // To accept the file pass `true`
        } else {
            cb(new AppError('Not an image! Please upload only images', 404), false); // cb(error, true/false); // To reject this file pass `false`
        }
    }

    // const upload = multer({ dest: 'src/public/img/users' });
    // const upload = multer({
    //     storage: multerStorage,
    //     fileFilter: multerFilter
    // });
    return multer({
        storage: multerStorage,
        fileFilter: multerFilter
    });

    // return upload.single(fieldName);
} 