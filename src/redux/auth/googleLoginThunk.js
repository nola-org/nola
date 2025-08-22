import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAccountApi } from '../../services/https/https';


export const googleLoginThunk = createAsyncThunk(
  "auth/googleLogin",
  async (access, { rejectWithValue }) => {
    try {
                  console.log("access", access);
      
            // localStorage.setItem('access', access);
      // localStorage.setItem('refresh', refresh);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
      const res = await getAccountApi(); // Получаем данные пользователя

      return {
        user: res.data,
        access,
        refresh: null,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Ошибка авторизации");
    }
  }
);