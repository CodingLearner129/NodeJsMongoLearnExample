import axios from 'axios';
import { showAlert } from './alert.js';

const stripe = Stripe(`${process.env.STRIPE_PUBLIC_KEY}`);

export const bookTour = async tourId => {
    try {

        console.log(tourId);

        // 1) Get checkout session from API
        const getSession = await axios(`${process.env.BASE_URL}api/v1/bookings/checkout-session/${tourId}`);
        // window.open(getSession.data.session.url,"_blank");

        // 2) Create checkout form + charge card
        location.assign(getSession.data.session.url);
        // await stripe.redirectToCheckout({sessionId: getSession.data.session.id})

    } catch (error) {
        console.log(error);
        showAlert('error', error);
    }
}