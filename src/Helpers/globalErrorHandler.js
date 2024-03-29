import AppError from "../utils/appErrors.js";

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
    // const value = err.errmsg.match(/(["'])(\\?.)+?\1/)[0];
    // const message = `Duplicate field value: ${value}. Please use another value!`;
    const message = `Duplicate field value: '${err.keyValue.name}'. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    // console.log(errors);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJsonWebTokenError = () => new AppError('Invalid token. Please log in again!', 401);

const handleTokenExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        // A) API
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // B) RENDERED WEBSITE
        // 1) Log error
        console.error('Error 💥 ', err);
        // 2) Send generic message
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
};

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // a) Operational , trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        // b) programming and other unknown error: don't leak error details
        // 1) Log error
        console.error('Error 💥 ', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
    // B) RENDERED WEBSITE
    // a)Operational , trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message
        });
    }
    // b) programming and other unknown error: don't leak error details
    // 1) Log error
    console.error('Error 💥 ', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.'
    });
};

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // console.log(err);
    // if (process.env.NODE_ENV.trim() === "development") {
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV.trim() === "production") {
        // let error = err;
        let error = {...err};
        error.message = err.message;

        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();

        sendErrorProd(error, req, res);
    }

};