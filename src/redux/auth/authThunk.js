import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { instance, token } from "../../services/axios";
import { postlogOut, postRefreshToken } from "../../services/https/https";
import axios from "axios";

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
      console.log(data);

      return data;
    } catch (error) {
      console.log(error);

      return rejectWithValue(
         error?.response?.data?.username?.[0] || "Error. Try again later!"
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
//   "refresh",
//   async (_, thunkAPI) => {
//     const stateToken = thunkAPI.getState().auth.token;
//     const refresh = thunkAPI.getState().auth.refresh;

//     if (!stateToken) {
//       return isRejectedWithValue("No valid token");
//     }
//     token.set(stateToken);

//     try {
//       // const { data } = await getAccountApi();
//       const { data } = await postRefreshToken({
//         access: stateToken,
//         refresh: refresh,
//       });
//       token.set(data.access);
//       return data;
//     } catch (error) {
//       return isRejectedWithValue("No valid token");
//     }
//   }
// );

// export const refreshUserThunk = createAsyncThunk(
//   "auth/refresh",
//   async (_, thunkAPI) => {
//     try {
//       // Просто делаем POST без тела, cookie придёт автоматически
//       const { data } = await axios.post(
//         "https://nola-spot-python-1.onrender.com/api/auth/token/refresh/",
//         {},
//         {
//           withCredentials: true, // 🔥 нужно для куки
//         }
//       );
// console.log("data", data);

//       // Устанавливаем новый access token
//       token.set(data.access);

//       return {
//         access: data.access,
//         // refresh: null, // refresh теперь не нужен в redux
//       };
//     } catch (error) {
//       console.error("❌ Refresh failed:", error);
//       return thunkAPI.rejectWithValue("Refresh failed");
//     }
//   }
// );


export const refreshUserThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      // Получаем refreshToken из localStorage (если он есть)
      const refreshToken = localStorage.getItem("refresh");

      // Вызываем универсальную функцию
      const { data } = await postRefreshToken(
        refreshToken ? { refresh: refreshToken } : null
      );

      console.log("✅ Новый access token:", data);

      // Устанавливаем новый access токен в axios
      token.set(data.access);

      // Можно при желании обновить refresh (если пришёл новый)
      if (data.refresh) {
        localStorage.setItem("refresh", data.refresh);
      }

      return {
        access: data.access,
        refresh: data.refresh ?? null,
      };
    } catch (error) {
      console.error("❌ Refresh failed:", error);
      return thunkAPI.rejectWithValue("Refresh failed");
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
