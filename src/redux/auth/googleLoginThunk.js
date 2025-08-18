import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAccountApi } from '../../services/https/https';

export const googleLoginThunk = createAsyncThunk(
  'auth/googleLogin',
  async ({ access, refresh }, { rejectWithValue }) => {
    try {
      // localStorage.setItem('access', access);
      // localStorage.setItem('refresh', refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      const res = await getAccountApi();
      console.log("googleLoginThunk", res);
      
      return {
        user: res.data,
        access,
        refresh,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Ошибка логина');
    }
  }
);