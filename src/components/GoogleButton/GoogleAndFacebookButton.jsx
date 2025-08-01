import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import FacebookLogin from "@greatsumini/react-facebook-login";
import css from "./GoogleAndFacebookButton.module.css";
import { ToastError } from "../../services/ToastError/ToastError";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { googleLoginThunk } from "../../redux/auth/googleLoginThunk";
import { instance } from "../../services/axios";

const GoogleAndFacebookButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(false);


  const handleGoogleLogin = () => {
    window.location.href =
      "https://nola-spot-python-1.onrender.com/auth/login/google-oauth2/";
};
//   const googleLogin = useGoogleLogin({
//   flow: "auth-code",
//   onSuccess: async (tokenResponse) => {
//     try {
//       const authCode = tokenResponse.code;
//       console.log("Google login successful. Code:", authCode);

//       // const response = await fetch("https://nola-spot-python-1.onrender.com/auth/login/google-oauth2/", {
//       //   method: "GET",
//       //   headers: {
//       //     "Content-Type": "application/json",
//       //   },
//       //   body: JSON.stringify({ code: authCode, redirect_uri: "https://nola-org.github.io/nola/" }),
//       // });

//       const response = await fetch(
//         `https://nola-spot-python-1.onrender.com/auth/login/google-oauth2/?code=${authCode}`
//   // &redirect_uri=https://nola-org.github.io/nola/profile
  
// );

//       if (!response.ok) throw new Error("Failed to exchange code");

//       const data = await response.json();
//       console.log("Backend login success:", data);
//       // сохранить токены, авторизовать, редирект на /main
//     } catch (error) {
//       ToastError("Google auth failed. Try again later.");
//       console.error("Google auth failed:", error);
//     }
//   },
//   onError: (error) => {
//     ToastError("Google auth failed. Try again later.");
//     console.error("Google login failed.", error);
//   },
//       redirect_uri: "https://nola-org.github.io/nola/profile",
//     // redirect_uri: "http://localhost:3000//nola/profile",
// });


//   const googleLogin = useGoogleLogin({
//   onSuccess: async (tokenResponse) => {
//     try {
//       console.log("Google login successful", tokenResponse);
//       window.location.href =
//         "https://nola-spot-python-1.onrender.com/auth/login/google-oauth2/";
//     } catch (error) {
//       ToastError("Google auth failed. Try again later.");
//       console.error("Google auth failed:", error);
//     }
//   },
//   onError: (error) => {
//     ToastError("Google auth failed. Try again later.");
//     console.error("Google login failed.", error);
//   },
//   flow: 'auth-code', // если вы используете backend flow (Django), то нужен auth-code
//   redirect_uri: "https://nola-org.github.io/nola/", // Указать явно
// });

  // const googleLogin = useGoogleLogin({
  //   onSuccess: async (tokenResponse) => {
  //     try {
  //       console.log("Google login successful", tokenResponse);
  //         const GOOGLE_AUTH_URL = "https://nola-spot-python-1.onrender.com/auth/login/google-oauth2/";
  // window.location.href = GOOGLE_AUTH_URL;
  //       // window.location.href =
  //       //   "https://nola-spot-python-1.onrender.com/auth/login/google-oauth2/";

  //       // Отправляем код на бэкенд для верификации - redax

  //       // Сохраняем токен и перенаправляем
  //       // localStorage.setItem("authToken", res.data.token);
  //       // await dispatch(googleLoginThunk(tokenResponse.access_token)).unwrap();
  //       // setRedirect(true);
  //       // navigate("/main/accountAdverticer");
  //     } catch (error) {
  //       ToastError("Google auth failed. Try again later.");
  //       console.error("Google auth failed:", error);
  //     }
  //   },
  //   onError: (error) => {
  //     ToastError("Google auth failed. Try again later.");
  //     console.error("Google login failed.", error);
  //   },
  // });

  const handleFacebookSuccess = (response) => {
    console.log("Facebook login successful", response);
    setRedirect(true);
    navigate("/main/accountAdverticer");
  };

  const handleFacebookFailure = (error) => {
    console.error("Facebook login failed. Try again later.");
  };

  return (
    <div className={css.buttonContainer}>
      <ToastContainer />
      <div className={css.separatorLine}></div>
      <div className={`${css.orText} dark:bg-black`}>or</div>

      <button
        // onClick={() => googleLogin()}
        onClick={handleGoogleLogin}
        className={`${css.buttonForm} dark:bg-black dark:border-white dark:text-white`}
      >
        <FcGoogle className={css.icon} />
        Continue with Google
      </button>

      {/* <FacebookLogin
        appId="366622046395430"
        autoLoad={false}
        fields="name,email,picture"
        callback={handleFacebookSuccess}
        onFailure={handleFacebookFailure}
        render={({ onClick }) => (
          <button
            onClick={onClick}
            className={`${css.buttonForm} dark:bg-black dark:border-white dark:text-white`}
          >
            <FaFacebook className={css.icon} />
            Continue with Facebook
          </button>
        )}
      /> */}
    </div>
  );
};

export default GoogleAndFacebookButton;
