import AppError from "../utils/appErrors.js";
import * as tourService from "./../services/tourService.js";
import cathAsync from "./../utils/catchAsync.js";
import { uploadFile } from "./../Helpers/multerHelper.js";
import sharp from 'sharp';
import fs from 'fs';

// uploadFile.single('image') req.file
// uploadFile.array('image', 5) req.files
export const uploadTourImages = uploadFile().fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

export const resizeTourPhoto = cathAsync(async (req, res, next) => {
  if (!req.files.imageCover && !req.files.images) return next();

  // 1) Cover image
  const destination = 'src/public/img/tours/image-cover';
  if (!fs.existsSync(destination.replace('/image-cover', ''))) {
    fs.mkdirSync(destination.replace('/image-cover', ''));
  }
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination);
  }

  if (!req.files.imageCover == false) {
    const uniqueSuffix = `tour-${req.user.id}-${Date.now()}-${Math.round(Math.random() * 1E9)}-cover`;
    const extension = req.files.imageCover[0].mimetype.split('/')[1];
    // console.log(extension);
    const filename = `${uniqueSuffix}.${extension}`;
    await sharp(req.files.imageCover[0].buffer).resize(2000, 1500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`${destination}/${filename}`);
    req.body.imageCover = `${destination.replace('src/public/', '')}/${filename}`;
  }

  if (!req.files.images == false) {
    // 2) Images
    req.body.images = [];
    await Promise.all(req.files.images.map(async (file, index) => {
      const destination = 'src/public/img/tours/images';
      const uniqueSuffix = `tour-${req.user.id}-${Date.now()}-${Math.round(Math.random() * 1E9)}-${index}`;
      const extension = file.mimetype.split('/')[1];
      const filename = `${uniqueSuffix}.${extension}`;
      await sharp(file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`${destination}/${filename}`);
      req.body.images.push(`${destination.replace('src/public/', '')}/${filename}`);
    }));
  }
  next();
});

export const aliasTopTour = async (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, description, price, duration, ratingsAverage, difficulty';
  next();
}

// const cathAsync = fn => {
//   return (req, res, next) => {
//     // fn(req, res, next).catch(err => next(err));
//     fn(req, res, next).catch(next);
//   }
// };


// export const getAllTour = cathAsync(async (req, res, next) => {
export const getAllTour = async (req, res, next) => {
  // try {
  // const tour = await tourService.getAllTour(req.query);
  tourService.getAllTour(req, res, next);
  // if (tour == null || tour.length == 0) {
  //   // throw new Error("Tour Not Found");
  //   return next(new AppError("Tour Not Found", 404));
  // }
  // const response = {
  //   status: true,
  //   data: tour,
  // };
  // res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   const response = {
  //     status: false,
  //     message: error.message,
  //   };
  //   res.status(500).send(response);
  // }
};
// });

// export const createTour = cathAsync(async (req, res, next) => {
export const createTour = async (req, res, next) => {
  // try {
  // const tour = await tourService.createTour(req.body);
  tourService.createTour(req, res, next);
  // if (!tour) {
  //   // if (tour == null || tour.length == 0) {
  //     // throw new Error("Tour can not created successfully");
  //     return next(new AppError("Tour can't be created successfully...", 500));
  // }
  // const response = {
  //   status: true,
  //   data: tour,
  // };
  // res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);
  // }
};
// });

// export const getTour = cathAsync(async (req, res, next) => {
export const getTour = async (req, res, next) => {
  // try {
  // const tour = await tourService.getTour(req.params.id);
  tourService.getTour(req, res, next);
  // if (!tour) {
  // // if (tour == null || tour.length == 0) {
  //   // throw new Error("Tour Not Found");
  //   return next(new AppError("Tour Not Found for that ID", 404));
  // }
  // const response = {
  //   status: true,
  //   data: tour,
  // };
  // res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);
  // }
};
// });

// export const updateTour = cathAsync(async (req, res, next) => {
export const updateTour = async (req, res, next) => {
  // try {
  // const tour = await tourService.updateTour(req.params.id, req.body);
  tourService.updateTour(req, res, next);
  //   if (!tour) {
  //   // if (tour == null || tour.length == 0) {
  //     // throw new Error("Tour can not updated successfully");
  //     return next(new AppError("Tour Not Found for that ID", 404));
  //   }
  //   const response = {
  //   status: true,
  //   data: tour,
  // };
  // res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);
  // }
};
// });

// export const deleteTour = cathAsync(async (req, res, next) => {
export const deleteTour = async (req, res, next) => {
  // try {
  // const tour = await tourService.deleteTour(req.params.id);
  tourService.deleteTour(req, res, next);
  //   if (!tour) {
  //   // if (tour == null || tour.length == 0) {
  //     // throw new Error("Tour cannot be deleted successfully");
  //     return next(new AppError("Tour Not Found for that ID", 404));
  // }
  // const response = {
  //   status: true,
  //   data: tour,
  // };
  // res.status(200).send(response);
  // } catch (error) {
  //   next(error);  
  //   // const response = {
  //   //     status: false,
  //   //     message: error.message,
  //   //   };
  //   //   res.status(500).send(response);
  // }
};
// });

// export const getTourStats = cathAsync(async (req, res, next) => {
export const getTourStats = async (req, res, next) => {
  // try {
  // const tour = await tourService.getTourStats(req.params);
  tourService.getTourStats(req, res, next);
  // if (tour == null || tour.length == 0) {
  //   throw new Error("Tour cannot be deleted successfully");
  // }
  // const response = {
  //   status: true,
  //   data: tour,
  // };
  // res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);    
  // }
};
// });

// export const getMonthlyPlan = cathAsync(async (req, res, next) => {
export const getMonthlyPlan = async (req, res, next) => {
  // try {
  // const tour = await tourService.getMonthlyPlan(req.params);
  tourService.getMonthlyPlan(req, res, next);
  // if (tour == null || tour.length == 0) {
  //   throw new Error("Tour cannot be deleted successfully");
  // }
  // const response = {
  //   status: true,
  //   data: tour,
  // };
  // res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);    
  // }
};
// });

export const getToursWithin = async (req, res, next) => {
  tourService.getToursWithin(req, res, next);
}

export const getDistances = async (req, res, next) => {
  tourService.getDistances(req, res, next);
}

export const getDistanceFromTour = async (req, res, next) => {
  tourService.getDistanceFromTour(req, res, next);
}