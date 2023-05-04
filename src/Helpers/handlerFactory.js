import cathAsync from "../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import APIFeatures from "./../utils/apiFeatures.js";
import fs from 'fs';

export const deleteOne = Model =>
    cathAsync(async (req, res, next) => {
        const model = await Model.findByIdAndDelete(req.params.id);
        if (!model) {
            return next(new AppError("No document found with that ID", 404));
        }
        const response = {
            status: 'success',
            // data: model,
            data: null,
        };
        res.status(204).send(response);
    });

export const updateOne = Model =>
    cathAsync(async (req, res, next) => {
        const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: false,
            returnDocument: "after",
            runValidators: true,
        });

        if (!model) {
            return next(new AppError("No document found with that ID", 404));
        }

        if (req.body.imageCover && model.imageCover) {
            if (fs.existsSync(`src/public/${model.imageCover}`)) {
                fs.unlink(`src/public/${model.imageCover}`, (err) => {
                    if (err) {
                        return next(new AppError('Filed to delete file', 400));
                    }
                });
            }
        }

        if (req.body.images && model.images) {
            model.images.forEach(image => {
                if (fs.existsSync(`src/public/${image}`)) {
                    fs.unlink(`src/public/${image}`, (err) => {
                        if (err) {
                            return next(new AppError('Filed to delete file', 400));
                        }
                    });
                }
            });
        }

        const response = {
            status: 'success',
            data: model,
        };
        res.status(200).send(response);
    });

export const createOne = Model =>
    cathAsync(async (req, res, body) => {
        const model = await Model.create(req.body);
        const response = {
            status: 'success',
            data: model,
        };
        res.status(201).send(response);
    });

export const getOne = (Model, popOptions) =>
    cathAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query.populate(popOptions);
        const model = await query;

        if (!model) {
            return next(new AppError("No document found with that ID", 404));
        }
        const response = {
            status: 'success',
            data: model,
        };
        res.status(200).send(response);
    });

export const getAll = Model =>
    cathAsync(async (req, res, next) => {

        // To allow for nested get reviews on tour
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        const features = new APIFeatures(Model.find(), req.query, filter)
            .filter()
            .sort()
            .limitedFields()
            .pagination();
        // .populate();

        // const model = await features.query.explain(); 
        const model = await features.query;
        if (model == null || model.length == 0) {
            return next(new AppError("No document found", 404));
        }
        const response = {
            status: 'success',
            results: model.length,
            data: model,
        };
        res.status(200).send(response);
    });
