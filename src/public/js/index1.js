import { bookTour } from './stripe.js';

// DOM ELEMENTS
const bookTourBtn = document.querySelector('#book-tour');

if (bookTourBtn) {
    bookTourBtn.addEventListener('click', e => {
        // const tourId = e.target.dataset.tourId; //where tourId means data-tour-id 
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
    });
}