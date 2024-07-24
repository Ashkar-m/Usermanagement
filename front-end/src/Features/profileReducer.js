import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).username : null,
    fullname: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).fullname : null,
    email: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).email : null,
    image: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).image : null,
    bio: localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).bio : null,
};


const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfile : (state, action) => {
            state.username = action.payload.username,
            state.fullname = action.payload.fullname,
            state.email = action.payload.email,
            state.bio = action.payload.bio,
            state.is_admin = action.payload.is_admin
        }
    }
})

export const {setProfile} = profileSlice.actions
export default profileSlice.reducer