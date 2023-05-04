import { tour as tourModel } from './../models/tourModel.js';
import { user as userModel } from './../models/userModel.js';
import { booking as bookingModel } from './../models/bookingModel.js';
import cathAsync from "./../utils/catchAsync.js";
import AppError from "../utils/appErrors.js";
import * as handlerFactory from "../Helpers/handlerFactory.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = cathAsync(async (req, res, next) => {
    // 1) Get current booked tour

    const tour = await tourModel.findById(req.params.tourId);
    console.log(`${req.protocol}://${req.get('host')}/${tour.images[0]}`);
    // 2) Create checkout session
    const createCheckoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        // success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
        success_url: `${req.protocol}://${req.get('host')}/?tour=${tour._id}&user=${req.user._id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email.trim(),
        client_reference_id: tour._id,
        metadata: {
            "user_id": req.user._id,
            "tour_id": tour._id,
        },
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `${req.protocol}://${req.get('host')}/${tour.images[0]}` //images url are live otherwise it can't be shown in checkout page
                        ],
                    },
                    unit_amount: tour.price * 100,
                },
                quantity: 1
            }
        ],
        mode: "payment",
    })
    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session: createCheckoutSession
    });
});

const createBookingCheckout = async session => {
    const tour = session.client_reference_id;
    const user = (await userModel.findOne({ email: session.customer_email })).id;
    const price = session.display_items[0].amount / 100;
    await Booking.create({ tour, user, price });
};

export const createBookingCheckoutWithoutWebhook = cathAsync(async (req, res, next) => {
    // This is only temporary, because it's unsecure: everyone can make bookings without paying
    const { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    await bookingModel.create({ tour, user, price });

    res.redirect(req.originalUrl.split('?')[0]);
});

export const webhookCheckout = cathAsync(async (req, res, next) => {
    const signature = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_ENDPOINT_SECRET_KEY);
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    // if (event.type === 'checkout.session.completed') createBookingCheckout(event.data.object);

    // Handle the event
    switch (event.type) {
        case 'checkout.session.async_payment_failed':
            const checkoutSessionAsyncPaymentFailed = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_failed
            break;
        case 'checkout.session.async_payment_succeeded':
            const checkoutSessionAsyncPaymentSucceeded = event.data.object;
            createBookingCheckout(checkoutSessionAsyncPaymentSucceeded)
            // Then define and call a function to handle the event checkout.session.async_payment_succeeded
            break;
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            createBookingCheckout(checkoutSessionCompleted)
            // Then define and call a function to handle the event checkout.session.completed
            break;
        case 'checkout.session.expired':
            const checkoutSessionExpired = event.data.object;
            // Then define and call a function to handle the event checkout.session.expired
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).json({ received: true });
});

export const getAllBooking = handlerFactory.getAll(bookingModel); 

export const getBooking = handlerFactory.getOne(bookingModel); 

export const createBooking = handlerFactory.createOne(bookingModel); 

export const updateBooking = handlerFactory.updateOne(bookingModel); 

export const deleteBooking = handlerFactory.deleteOne(bookingModel); 