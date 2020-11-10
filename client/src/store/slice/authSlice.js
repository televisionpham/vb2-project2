import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {}
    },
    reducers: {
        signin: (state, action) => {
            console.log('Sign in action', action);
            const user = Object.assign({}, action.payload);
            console.log('user', user);
            return {
                ...state,
                user
            };
        },
        signup: (state, action) => {
            console.log('Sign up action', action);
            const user = Object.assign({}, action.payload);
            console.log('user', user);
            return {
                ...state,
                user
            };            
        },
        signout: (state) => {
            console.log('Sign out');            
            return {
                ...state,
                user: {}
            };            
        }
    }
});

export const {signin, signup, signout} = authSlice.actions;

export default authSlice.reducer;