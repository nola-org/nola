import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_URL,
  withCredentials: true,
});

export const token = {
  set(access) {
    instance.defaults.headers.common.Authorization = `Bearer ${access}`;
  },

  unset() {
    instance.defaults.headers.common.Authorization = "";
  },
};
