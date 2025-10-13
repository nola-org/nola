import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAccountApi } from '../services/https/https'; 
import { logOutThunk } from './auth/authThunk';

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

const initialState = {
  data: null,
  status: "idle",
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    data: null,
    status: "idle", // 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    clearProfile: (state) => () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logOutThunk.fulfilled, () => initialState);
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;