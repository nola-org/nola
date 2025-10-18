import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAccountApi } from '../../services/https/https';
import { token } from '../../services/axios';


export const googleLoginThunk = createAsyncThunk( 
  'auth/googleLogin',
  async (accessToken, { rejectWithValue }) => {
    try {

      token.set(accessToken);
      const res = await getAccountApi(); 

      return {
        user: res.data,        
        access: accessToken,
        refresh: null,
      };
    } catch (err) {
      return rejectWithValue('Ошибка логина');
    }
  }
);