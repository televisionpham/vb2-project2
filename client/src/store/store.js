import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import  accountReducer from "./slice/accountSlice";

const store = configureStore({
    reducer: {
        authReducer,
        accountReducer
    },
    middleware: [...getDefaultMiddleware()]
});

export default store;