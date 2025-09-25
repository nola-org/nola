import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { ToastError } from "../../services/ToastError/ToastError";
import checked from "../../assets/icons/checked.svg";
import attention from "../../assets/icons/attention.svg";
import css from "./ConfirmEmailChangeEmailPage.module.css";
import { instance } from "../../services/axios";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

const ConfirmEmailChangeEmailPage = () => {
  const { token } = useParams();
  const [validUrl, setValidUrl] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const сhangeEmail = (async () => {
      try {
        const { data } = await instance.post(
          `/auth/email/verify?token=${token}`
        );
        console.log(data);
        
        if (!token) {
          throw new Error();
        }
        setValidUrl(true);
      } catch (error) {
        ToastError(
          error?.response?.data?.suggested_action ||
            error?.message ||
            "Try again later."
        );
        setValidUrl(false);
      } finally {
        setLoader(false);
      }
    })();
  }, [token]);

  return (
    <>
      {loader ? (
        <div className="loader">
          <LoaderSpiner />
        </div>
      ) : validUrl ? (
        <div className={css.container}>
          <img src={checked} alt="checked" />
          <div className={css.title_container}>
            <h1 className={`${css.hero_title} dark:text-white`}>
              Congratulations!
            </h1>
            <p className={`${css.title} dark:text-white`}>
              You are now with us!
            </p>
          </div>
          <p className={`${css.title} dark:text-white`}>Go ahead</p>
          <NavLink to="/main/authorization" className={css.link}>
            Login
          </NavLink>
        </div>
      ) : (
        <div className={css.container}>
          <img src={attention} alt="registrationCheck" />
          <div className={css.title_container}>
            <h1 className={`${css.hero_title} dark:text-white`}>
              Ouch! Something went wrong!
            </h1>
            <p className={`${css.title} dark:text-white`}>
              Please try verifying again a little later
            </p>
          </div>
          <Link to="/main/authorization/registration" className={css.link}>
            Registration
          </Link>
        </div>
      )}
    </>
  );
}

export default ConfirmEmailChangeEmailPage;