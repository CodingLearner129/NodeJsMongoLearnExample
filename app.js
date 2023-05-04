import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import './src/config/config.js';
import AppError from './src/utils/appErrors.js';
import globalErrorHandler from './src/Helpers/globalErrorHandler.js';
import { router as TourRoute } from "./src/routes/tourRoute.js";
import { router as AuthRoute } from "./src/routes/authRoute.js";
import { router as UserRoute } from "./src/routes/userRoute.js";
import { router as OrderRoute } from "./src/routes/orderRoute.js";
import { router as OrderItemRoute } from "./src/routes/orderItemRoute.js";
import { router as ProductRoute } from "./src/routes/productRoute.js";
import { router as ReviewRoute } from "./src/routes/reviewRoute.js";
import { router as BookingRoute } from "./src/routes/bookingRoute.js";
import { router as ViewRoute } from "./src/routes/viewRoute.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import mongooseSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// set view engine 
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './src/views'));
// app.set('views', './src/views');

// Global middlewares
// Set security HTTP headers
app.use(helmet());

// Development logging
app.use(morgan('dev'));

// Body parser, reading data from body into req.body
// app.use(express.json());
app.use(express.json({ limit: '10kb' })); // limit to 10kb for requests body so more then 10k data in request body is not allowed

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(cookieParser())

// Data sanitization against request NoSql query injection
app.use(mongooseSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
    ]
}));
// whitelisted parameters those can be repeated

// serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, './src/public')));

// Limit requests from same API
const limiter = rateLimit({
    max: 100, // maximum rate limit for requests is 100
    windowMs: 60 * 60 * 1000, // number of milliseconds
    message: "Too many requests from this IP address, please try again in an hour!"
});
// means in 1h window max 100 requests are allowed

app.use('/api', limiter);

//route middlewares
app.use('/', ViewRoute);
app.use('/api/v1/tours', TourRoute);
app.use('/api/v1/auth', AuthRoute);
app.use('/api/v1/users', UserRoute);
app.use('/api/v1/orders', OrderRoute);
app.use('/api/v1/orderItems', OrderItemRoute);
app.use('/api/v1/products', ProductRoute);
app.use('/api/v1/reviews', ReviewRoute);
app.use('/api/v1/bookings', BookingRoute);
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server!`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.status = 'fail';
    // err.statusCode = 404;

    // next(err);
});

app.use(globalErrorHandler);

export default app;
