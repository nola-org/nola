import authSlice from "./auth/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import  profileReducer  from "./profileSlice";

import {
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import addPostSlice from "./addPostLink/addPostSlice";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "refresh"],
};


export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authSlice),
    profile: profileReducer,
    // addLink: addPostSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
