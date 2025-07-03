import React, { useState } from "react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useNavigate } from "react-router-dom";
import css from "./GoogleAndFacebookButton.module.css";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleAndFacebookButton = () => {
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Google login successful", tokenResponse);
      setRedirect(true);
      navigate("/main/accountAdverticer");
    },
    onError: (error) => {
      console.error("Google login failed", error);
    },
  });

  const handleFacebookSuccess = (response) => {
    console.log("Facebook login successful", response);
    setRedirect(true);
    navigate("/main/accountAdverticer");
  };

  const handleFacebookFailure = (error) => {
    console.error("Facebook login failed", error);
  };

  return (
    <div className={css.buttonContainer}>
      <div className={css.separatorLine}></div>
      <div className={`${css.orText} dark:bg-black`}>or</div>

      <button
        onClick={() => googleLogin()}
        className={`${css.buttonForm} dark:bg-black dark:border-white dark:text-white`}
      >
        <FcGoogle className={css.icon} />
        Continue with Google
      </button>

      <FacebookLogin
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
      />
    </div>
  );
};

export default GoogleAndFacebookButton;
