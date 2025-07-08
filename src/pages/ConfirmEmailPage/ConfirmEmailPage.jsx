import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { ToastError } from "../../services/ToastError/ToastError";
import checked from "../../assets/icons/checked.svg";
import attention from "../../assets/icons/attention.svg";
import css from "./ConfirmEmailPage.module.css";
import { instance } from "../../services/axios";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

const ConfirmEmailPage = () => {
  const { token } = useParams();
  const [validUrl, setValidUrl] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const verifyEmailUrl = (async () => {
      try {
        const { data } = await instance.post(
          `/auth/email/verify?token=${token}`
        );
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
};

export default ConfirmEmailPage;
// innadidenko29@gmail.com
// 44444Aa@ --- 44445Aa@ --- 44444Aa@
// inna
// +

// 60ef727a49@emaily.pro
// test-5
// 44444Aa@

//27263c8870@emaily.pro
// 44444Aa@
// test +

//5a75924153@emaily.pro
// 44444Aa@
// test-2

//46d0cf53c5@emaily.pro
// 44444Aa@
// inna-test

// 08221ba59a@emaily.pro
// 44444Aa@
// test2
// +

// f01040c6b7@emaily.pro
// 44444Aa@
// test3

//d94e2f13d2@emaily.pro
//test33
//12345Aa$

//advent
// dc8eba2579@emaily.pro
// f8fa00dd8e@emaily.pro
//f75dfe35c4@emaily.pro
//59804b75ff@emaily.pro  ++
//51206e49bd@emaily.pro ++
//12345Aa# ++
//12345Aa$
