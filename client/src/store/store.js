import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";

const store = configureStore({
    reducer: {
        authReducer
    },
    middleware: [...getDefaultMiddleware()]
});

export default store;