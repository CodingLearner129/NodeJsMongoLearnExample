import axios from 'axios';
import { showAlert } from './alert.js';

// type is either 'password' or 'profile'
export const updateSettings = async (data, type) => {
    try {
        const url = type === 'password' ? `${process.env.BASE_URL}api/v1/auth/update-password` : `${process.env.BASE_URL}api/v1/users/update-profile`;
        const res = await axios({
            method: 'PATCH',
            url,
            data
        });
        
        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully`);
            window.setTimeout(location.reload(true), 5000);                
        }
    } catch (error) {
        if (error.response.data) {
            showAlert('error', error.response.data.message);
        } else if (error.response) {
            showAlert('error', error.response);
        } else {
            showAlert('error', error);
        }
    }
};