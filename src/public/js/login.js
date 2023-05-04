import axios from "axios";
import { showAlert } from './alert.js';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: `${process.env.BASE_URL}api/v1/auth/login`,
            data:{
                email,
                password
            }
        });
        
        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
    } catch (error) {
        if (error.response) {
            if (error.response.length > 0) {
                showAlert('error', error.response.data.message);
            } else {
                showAlert('error', error.response);
            }
        } else {
            showAlert('error', error);
        }
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: `${process.env.BASE_URL}api/v1/auth/logout`
        });

        if (res.data.status === 'success') location.reload(true);
    } catch (error) {
        showAlert('error', 'Error Logging out! Please try again.');
    }
};