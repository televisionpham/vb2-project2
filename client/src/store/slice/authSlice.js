import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { requestAuthenticate, requestRegister } from '../../api';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, thunkAPI) => {
        console.log(credentials);
        try {
            const response = await requestAuthenticate(credentials);
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue({ error });
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (data, thunkAPI) => {
        try {
            const response = await requestRegister(data);
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue({ error });
        }
    }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token')
    },
    reducers: {
        verifyOtpSuccess: (state, action) => {
            console.log('verifyOtpSuccess', action);
            return {
                ...state,
                otpVerified: true,
            }
        },
        updateUserInfo: (state, action) => {
            console.log('updateUserInfo', action);
            return {
                ...state,
                user: action.payload
            }
        },
        logout: (state) => {
            console.log('Log out');
            localStorage.clear();
            return {
                ...state,
                user: {},
                token: '',
                otpCode: '',
                otpVerified: false,
            };
        }
    },
    extraReducers: {
        [login.fulfilled]: (state, action) => {
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                error: ''
            }
        },
        [login.rejected]: (state, action) => {
            console.log('login.rejected', action);
            return {
                ...state,                
                error: action.error.message
            }
        },
        [register.fulfilled]: (state, action) => {
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                error: ''
            }
        },
        [register.rejected]: (state, action) => {
            console.log('register.rejected', action);
            return {
                ...state,
                error: action.error.message
            }
        }
    }
});

export const { logout, updateUserInfo, verifyOtpSuccess } = authSlice.actions;

export default authSlice.reducer;