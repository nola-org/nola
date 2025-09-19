import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAccountApi } from '../services/https/https'; 

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAccountApi();
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// http://localhost:3000/nola/google-auth#token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2MDI4NTg0LCJpYXQiOjE3NTU5NDIxODQsImp0aSI6IjY5N2IzZWY2NmI4MjRiM2M5OGQ5OGU0ODIzNWRiNDM4IiwidXNlcl9pZCI6Mn0.-XAG08Z0Fxj5cZ5kkk9_Oyldn2Th_uwm8kdlKc9HoNg

// http://localhost:3000/nola/main/accountAdverticer/adverticerEdit#token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU2MDI4NTg0LCJpYXQiOjE3NTU5NDIxODQsImp0aSI6IjY5N2IzZWY2NmI4MjRiM2M5OGQ5OGU0ODIzNWRiNDM4IiwidXNlcl9pZCI6Mn0.-XAG08Z0Fxj5cZ5kkk9_Oyldn2Th_uwm8kdlKc9HoNg


const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    status: 'idle', // 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;