import '@babel/polyfill';
import { login, logout } from './login.js';
import { updateSettings } from './updateSettings.js';
import { displayMap } from './mapbox.js';
// import { bookTour } from './stripe.js';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const updateProfileForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-password');
const bookTourBtn = document.querySelector('#book-tour');

// DELEGATION
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout)

if (updateProfileForm) {
    updateProfileForm.addEventListener('submit', e => {
        e.preventDefault();
        // console.log(document.getElementById('photo').files.length > 0);
        // process.exit();
        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        const form  = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        if (document.getElementById('photo').files.length > 0) {
            form.append('photo', document.getElementById('photo').files[0]);
        }
        updateSettings(form, 'profile');
    });
}

if (updatePasswordForm) {
    updatePasswordForm.addEventListener('submit', e => {
        e.preventDefault();
        const currentPassword = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password-confirm').value;
        updateSettings({currentPassword, newPassword, confirmPassword}, 'password');
    });
}

// if (bookTourBtn) {
//     bookTourBtn.addEventListener('click', e => {
//         // const tourId = e.target.dataset.tourId; //where tourId means data-tour-id 
//         e.target.textContent = 'Processing...';
//         const { tourId } = e.target.dataset;
//         bookTour(tourId);
//     });
// }