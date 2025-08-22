import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAccountApi } from '../../services/https/https';
import { token } from '../../services/axios';


export const googleLoginThunk = createAsyncThunk( 
  'auth/googleLogin',
  async (accessToken, { rejectWithValue }) => {
    try {
      console.log("✅ googleLoginThunk получен token:", accessToken);

      token.set(accessToken);
      const res = await getAccountApi(); 

      console.log(res);

      return {
        user: res.data,        
        access: accessToken,
        refresh: null,
      };
    } catch (err) {
      console.error("Ошибка при получении аккаунта:", err);
      return rejectWithValue('Ошибка логина');
    }
  }
);