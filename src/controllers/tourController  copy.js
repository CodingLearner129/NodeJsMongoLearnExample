import AppError from "../utils/appErrors.js";
import * as tourService from "./../services/tourService.js";
import cathAsync from "./../utils/catchAsync.js";

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


export const getAllTour = cathAsync(async (req, res, next) => {
// export const getAllTour = async (req, res, next) => {
  // try {
    const tour = await tourService.getAllTour(req.query);
    if (tour == null || tour.length == 0) {
      // throw new Error("Tour Not Found");
      return next(new AppError("Tour Not Found", 404));
    }
    const response = {
      status: true,
      data: tour,
    };
    res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   const response = {
  //     status: false,
  //     message: error.message,
  //   };
  //   res.status(500).send(response);
  // }
// };
});

export const createTour = cathAsync(async (req, res, next) => {
// export const createTour = async (req, res, next) => {
  // try {
    const tour = await tourService.createTour(req.body);
    if (!tour) {
      // if (tour == null || tour.length == 0) {
        // throw new Error("Tour can not created successfully");
        return next(new AppError("Tour can't be created successfully...", 500));
    }
    const response = {
      status: true,
      data: tour,
    };
    res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);
  // }
// };
});

export const getTour = cathAsync(async (req, res, next) => {
// export const getTour = async (req, res, next) => {
  // try {
    const tour = await tourService.getTour(req.params.id);
    if (!tour) {
    // if (tour == null || tour.length == 0) {
      // throw new Error("Tour Not Found");
      return next(new AppError("Tour Not Found for that ID", 404));
    }
    const response = {
      status: true,
      data: tour,
    };
    res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);
  // }
// };
});

export const updateTour = cathAsync(async (req, res, next) => {
  // export const updateTour = async (req, res, next) => {
    // try {
      const tour = await tourService.updateTour(req.params.id, req.body);
      if (!tour) {
      // if (tour == null || tour.length == 0) {
        // throw new Error("Tour can not updated successfully");
        return next(new AppError("Tour Not Found for that ID", 404));
      }
      const response = {
      status: true,
      data: tour,
    };
    res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);
  // }
  // };
});

export const deleteTour = cathAsync(async (req, res, next) => {
  // export const deleteTour = async (req, res, next) => {
    // try {
      const tour = await tourService.deleteTour(req.params.id);
      if (!tour) {
      // if (tour == null || tour.length == 0) {
        // throw new Error("Tour cannot be deleted successfully");
        return next(new AppError("Tour Not Found for that ID", 404));
    }
    const response = {
      status: true,
      data: tour,
    };
    res.status(200).send(response);
  // } catch (error) {
  //   next(error);  
  //   // const response = {
  //   //     status: false,
  //   //     message: error.message,
  //   //   };
  //   //   res.status(500).send(response);
  // }
// };
});

export const getTourStats = cathAsync(async (req, res, next) => {
// export const getTourStats = async (req, res, next) => {
  // try {
    const tour = await tourService.getTourStats(req.params);
    if (tour == null || tour.length == 0) {
      throw new Error("Tour cannot be deleted successfully");
    }
    const response = {
      status: true,
      data: tour,
    };
    res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);    
  // }
// };
});

export const getMonthlyPlan = cathAsync(async (req, res, next) => {
// export const getMonthlyPlan = async (req, res, next) => {
  // try {
    const tour = await tourService.getMonthlyPlan(req.params);
    if (tour == null || tour.length == 0) {
      throw new Error("Tour cannot be deleted successfully");
    }
    const response = {
      status: true,
      data: tour,
    };
    res.status(200).send(response);
  // } catch (error) {
  //   next(error);
  //   // const response = {
  //   //   status: false,
  //   //   message: error.message,
  //   // };
  //   // res.status(500).send(response);    
  // }
// };
});
