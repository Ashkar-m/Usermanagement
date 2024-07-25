import axios from "axios";
import { setCredentials } from '../../Features/authReducer';
import store from '../../store/store'
import { setProfile } from "../../Features/profileReducer";

const baseURL='http://127.0.0.1:8000/';

const login = async (email, password) => {

    try {
        const response = await axios.post(`${baseURL}/api/token/`, {email, password})
        
        if (response.status === 200) {
            const data = response.data
            const { access, refresh } = data;

            // Decode the token to get the user info
            const tokenData = JSON.parse(atob(access.split('.')[1]));   
            
            localStorage.setItem('ACCESS_TOKEN' , JSON.stringify(data.access))
            localStorage.setItem('REFRESH_TOKEN' , JSON.stringify(data.refresh))
            localStorage.setItem('user', JSON.stringify({
                username: tokenData.username,
                fullname: tokenData.fullname,
                is_superuser: tokenData.is_superuser,
            }));

            store.dispatch(setCredentials({
                user: {
                    username: tokenData.username,
                    fullname: tokenData.fullname,
                    is_superuser: tokenData.is_superuser,
                },
                accessToken: access,
                refreshToken: refresh,
            }));

            console.log("Login success")
            
            return tokenData
        }

    } catch (error) {
        console.log('Invalid user credential')
        throw new Error("Invalid user credential");
    }
}



const signUp = async (email, username, fullname, password, password2) => {
    try {
        const response = await axios.post(`${baseURL}/api/register/`, {email, username, fullname, password, password2});
        
        if (response.status >= 200 && response.status < 300) {
            window.alert('User registered successfully');
        } else {
            console.error('Error occurred while registering');
        }
    } catch (error) {
        if (error.response) {
            
            const errorData = error.response.data;
            if (errorData.email) {
                window.alert(errorData.email.join(', ')); 
            } else if (errorData.username) {
                window.alert(errorData.username.join(', '));
            } else if (errorData.password) {
                window.alert(errorData.password.join(', '));
            } else {
                window.alert('Error response: ' + JSON.stringify(errorData));
            }
        } else if (error.request) {
            window.alert('Error request: ' + error.request);
        } else {
            window.alert('Error: ' + error.message);
        }
        throw error;
    }
};


export {login, signUp};