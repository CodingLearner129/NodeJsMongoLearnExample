import { user as userModel } from "./../models/userModel.js";
import cathAsync from "./../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import * as handlerFactory from "../Helpers/handlerFactory.js";
import fs from 'fs';

const filterObj = (obj, ...allAllowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allAllowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// export const getAllUser = cathAsync(async (req, res, next) => {
//   const model = await userModel.aggregate([
//     {
//       $project: {
//         _id: 1,
//         name: 1,
//         email: 1,
//       }
//     }
//   ]);
//   const response = {
//     status: 'success',
//     results: model.length,
//     data: model,
//   };
//   res.status(200).send(response);
// });

export const getAllUser = handlerFactory.getAll(userModel);

// export const createUser = cathAsync(async (req, res, body) => {
//   const model = await userModel.create(req.body);
//   const response = {
//     status: 'success',
//     data: model,
//   };
//   res.status(200).send(response);
// });

export const userDetails = cathAsync(async (req, res, next) => {
  const model = await userModel.aggregate([
    {
      $lookup: {
        from: "orders",
        let: {
          ids: "$order_id"
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$ids"] }
                ]
              }
            }
          }
        ],
        as: "orders"
      }
    }
  ]);

  const response = {
    status: 'success',
    data: model,
  };
  res.status(200).send(response);
});

export const updateProfile = cathAsync(async (req, res, next) => {
  // 1) Create error if user posts password data
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for update password', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated 
  const filteredBody = filterObj(req.body, 'name', 'email');

  // if (req.file) filteredBody.photo = req.file.filename;
  if (req.file) filteredBody.photo = `${req.file.destination.replace('src/public/', '')}/${req.file.filename}`;

  // 3) Update user document
  const model = await userModel.findByIdAndUpdate(req.user.id, filteredBody,
    {
      // new: true,
      runValidators: true,
    });

  if (req.file) {
    if (fs.existsSync(`src/public/${model.photo}`)) {
      fs.unlink(`src/public/${model.photo}`, (err) => {
        if (err) {
          return next(new AppError('Filed to delete file', 400));
        }
      });
    }
  }  

  const response = {
    status: 'success',
    data: model,
  };
  res.status(200).json(response);
});

export const deactivateAccount = cathAsync(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });

  const response = {
    status: 'success',
    data: null,
  };
  res.status(204).json(response);
});

export const getUser = handlerFactory.getOne(userModel);

export const createUser = cathAsync(async (req, res, next) => {
  return next(new AppError('This route is not defined! Please use /signup instead', 400));
});

// don't update passwords with this!
export const updateUser = handlerFactory.updateOne(userModel);

export const deleteUser = handlerFactory.deleteOne(userModel);
