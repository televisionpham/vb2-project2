import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { UrlConstants } from '../../constants';

export const userSignIn = createAsyncThunk(
    'auth/userSignIn',
    async (user, thunkAPI) => {
        try {
            const response = await axios.post(UrlConstants.API_BASE_URL + "/api/authenticate", user);
            return response.data            
        } catch (error) {
            return thunkAPI.rejectWithValue({error});
        }      
    }
  )

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: '',
        otpCode: '',
        error: ''
    },
    reducers: {
        signin: async (state, action) => {                        
            try {
                          
            } catch (error) {
                console.log(error)
            }            
            return {
                ...state
            };
        },
        signup: (state, action) => {
            console.log('Sign up action', action);
            const user = Object.assign({}, action.payload);
            console.log('user', user);
            return {
                ...state,                
            };            
        },
        signout: (state) => {
            console.log('Sign out');            
            return {
                ...state,
                token: '',               
                otpCode: ''
            };            
        }
    },
    extraReducers: {
        [userSignIn.fulfilled]: (state, action) => {
            state.token = action.payload.token;
        }
    }
});

export const {signin, signup, signout} = authSlice.actions;

export default authSlice.reducer;