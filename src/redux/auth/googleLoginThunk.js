import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const googleLoginThunk = createAsyncThunk(
  'auth/googleLogin',
  async (access_token, { rejectWithValue }) => {
    try {


      
//       const res = await axios.post(
//         `${process.env.REACT_APP_URL}/auth/login/google-oauth2/`,
//         { access_token }
//       );
// console.log(res.data);

        //       return res.data;
        console.log(access_token);
        

    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);