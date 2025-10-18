import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { instance, token } from "../../services/axios";
import { postlogOut, postRefreshCookie, postRefreshToken } from "../../services/https/https";
import axios from "axios";
import { logoutAction } from "./authSlice";
import { clearProfile } from "../profileSlice";

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
          error?.response?.statusText || "Error. Try again later!"
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

      return data;
    } catch (error) {

      return rejectWithValue(
        error.status === 500
          ? "Registration error. You may already be registered with Google. Please try again later or sign in with Google"
          : error?.response?.data?.username?.[0] || "Error. Try again later!"
        //   error?.response?.data?.errors?.Password ||
        //   error?.response?.data?.errors?.email ||
        //   error?.response?.statusText ||
        // error.message ||
        // error ||
      );
    }
  }
);

// export const refreshUserThunk = createAsyncThunk(
//   "auth/refresh",
//   async (_, thunkAPI) => {
//     const state = thunkAPI.getState();
//     const stateToken = state.auth.token;
//     const refresh = state.auth.refresh;

//     if (!stateToken || !refresh) {
//       return thunkAPI.rejectWithValue("No valid token"); // ✅ исправлено
//     }

//     token.set(stateToken);
//     console.log("🔄 refreshUserThunk start");

//     try {
//       const { data } = await postRefreshToken({
//         access: stateToken,
//         refresh: refresh,
//       });

//       console.log("✅ refreshUserThunk response:", data);

//       token.set(data.access);

//       return {
//         access: data.access,
//         refresh: data.refresh || refresh,
//       };
//     } catch (error) {
//       console.error("❌ Refresh failed:", error);
//       return thunkAPI.rejectWithValue(error.response?.data);
//     }
//   }
// );

export const refreshUserThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const stateToken = thunkAPI?.getState()?.auth?.token;
    const refresh = thunkAPI?.getState()?.auth?.refresh;

    if (!stateToken) {
      return isRejectedWithValue("No valid token");
    }

    token?.set(stateToken);

    try {
      let data;

      if (refresh) {
        data = await postRefreshToken({
          access: stateToken,
          refresh: refresh,
        });
      } else {
        //  Google OAuth
        data = await postRefreshCookie();
        console.log("data RefreshCookie", data?.access);
      }
      console.log("data", data?.data ?? data?.access);

      const accessToken = data?.access ?? data?.data?.access;
      token.set(accessToken);

      return data?.data ?? data;
    } catch (error) {
      console.error("❌ Refresh failed:", error);
      return isRejectedWithValue("No valid token");
    }
  }
);


// export const refreshUserThunk = createAsyncThunk(
//   "auth/refresh",
//   async (_, thunkAPI) => {
//     try {
//       const state = thunkAPI.getState();
//       const stateToken = state?.auth?.token;
//       const refresh = state?.auth?.refresh;

//       if (!stateToken && !refresh) {
//         return thunkAPI.rejectWithValue("No valid token");
//       }

//       token.set(stateToken);

//       let data;

//       // Если есть refresh
//       if (refresh) {
//         const response = await postRefreshToken({
//           access: stateToken,
//           refresh: refresh,
//         });
//         data = response.data;
//       }
//       // Если refresh нет — пробуем через cookie (OAuth)
//       else {
//         const response = await postRefreshCookie();
//         data = response?.data ?? response;
//       }


//       const accessToken = data?.access ?? data?.data?.access;
//       const refreshToken = data?.refresh ?? data?.data?.refresh ?? refresh;
//       token.set(accessToken);

//       return {
//         access: accessToken,
//         refresh: refreshToken,
//       };
//     } catch (error) {
//       return thunkAPI.rejectWithValue("Refresh failed");
//     }
//   }
// );

export const logOutThunk = createAsyncThunk(
  "logOut",
  async (_, { dispatch, thunkAPI }) => {
    try {
      await postlogOut();
      token.unset();

      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }

      dispatch(logoutAction());
      dispatch(clearProfile());
    } catch (error) {
      return isRejectedWithValue(error.message || "Try again later.");
    }
  }
);
