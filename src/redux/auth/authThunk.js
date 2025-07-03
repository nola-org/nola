import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { instance, token } from "../../services/axios";
import { postlogOut, postRefreshToken } from "../../services/https/https";

export const loginThunk = createAsyncThunk(
  "login",
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await instance.post("/auth/token/", user);
      token.set(data.access);
      return data;
    } catch (error) {
      if (error?.response?.status === 401) {
        return rejectWithValue("The password or email was entered incorrectly");
      } else {
        return rejectWithValue(
          error?.response?.statusText || error.message || "Try again later."
        );
      }
    }
  }
);
export const registerThunk = createAsyncThunk(
  "register",
  async (user, { rejectWithValue }) => {
    try {
      const { data } = await instance.post(
        // "/admin/register/", user
        "/users/",
        user
      );
      token.set(data?.access);
      console.log(data);

      return data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(
        error?.response?.data.username[0] || error.message || "Try again later."
        //   error?.response?.data?.errors?.Password ||
        //   error?.response?.data?.errors?.email ||
        //   error?.response?.statusText ||
        // error.message ||
        // error ||
      );
    }
  }
);

export const refreshUserThunk = createAsyncThunk(
  "refresh",
  async (_, thunkAPI) => {
    const stateToken = thunkAPI.getState().auth.token;
    const refresh = thunkAPI.getState().auth.refresh;

    if (!stateToken) {
      return isRejectedWithValue("No valid token");
    }
    token.set(stateToken);

    try {
      // const { data } = await getAccountApi();
      const { data } = await postRefreshToken({
        access: stateToken,
        refresh: refresh,
      });
      token.set(data.access);
      return data;
    } catch (error) {
      return isRejectedWithValue("No valid token");
    }
  }
);

export const logOutThunk = createAsyncThunk("logOut", async (_, thunkAPI) => {
  try {
    await postlogOut();
    token.unset();
  } catch (error) {
    return isRejectedWithValue(error.message || "Try again later.");
  }
});
