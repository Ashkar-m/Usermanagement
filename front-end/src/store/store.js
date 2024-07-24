import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/authReducer";
import profileReducer from "../Features/profileReducer";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
    }
})

export default store;