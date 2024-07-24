import api from '../../utils/api'
import { setProfile } from '../../Features/profileReducer'
import store from '../../store/store'
import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000/'


const getProfile = async () => {
    try {
        const response = await api.get('/api/profile/');
        if (response.status === 200) {
            const data = response.data;
            localStorage.setItem('profile', JSON.stringify(data))

            store.dispatch(setProfile({
                username: data.username,
                fullname: data.fullname,
                email: data.email,
                image: data.image,
                bio: data.bio
            }));

            return true
        }
    } catch (error) {
        console.log('Error fetching Profile');
        throw error;
    }
};

const editProfile = async (email, username, fullname, bio, image, userId) => {
    
    const formDataToSend = new FormData();
    formDataToSend.append('fullname', fullname);
    formDataToSend.append('username', username);
    formDataToSend.append('email', email);
    formDataToSend.append('bio', bio);
    if (image) {
      formDataToSend.append('image', image);
    }
    
    try {
        const response = await api.patch(`/api/profiles/${userId}/`, formDataToSend, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

        if (response.status >= 200 && response.status < 300) {
            await getProfile();
            console.log('User updated successfully');
        } else {
            console.error('Error occurred while updating');
        }
    } catch (error) {
        if (error.response) {
            window.alert('Error response:', error.response.data);
        } else if (error.request) {
            window.alert('Error request:', error.request);
        } else {
            window.alert('Error:', error.message);
        }
        throw error;
    }
};


export {getProfile, editProfile};