import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { requestAccount } from "../../api";


export const getUserInfo = createAsyncThunk(
    'account/getUserInfo',
    async (token, thunkAPI) => {
        try {
            const response = await requestAccount(token);
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue({ error });
        }
    }
);

export const accountSlice = createSlice({
    name: 'account',
    initialState: {},
    reducers: {},
    extraReducers: {
        [getUserInfo.fulfilled]: (state, action) => {
            console.log('getUserInfo.fulfilled', action);
            return {
                ...state,
                
            }
        },
        [getUserInfo.rejected]: (state, action) => {
            console.log('getUserInfo.rejected', action);
            return {
                ...state,
                user: {}
            }
        },        
    }
})

export default accountSlice.reducer;
