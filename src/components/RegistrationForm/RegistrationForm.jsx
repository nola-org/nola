import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import css from "./RegistrationForm.module.css";
import Button from "../Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import { ToastContainer } from "react-toastify";
import { ToastError } from "../../services/ToastError/ToastError";
import { useDispatch } from "react-redux";
import { registerThunk } from "../../redux/auth/authThunk";
import { Toastify } from "../../services/Toastify/Toastify";
import error from "../../assets/icons/circle-exclamation-mark.svg";
import { Modal } from "../Modal/Modal";

const schema = yup.object().shape({
  email: yup
    .string()
    // .matches(
    //   /^[a-zA-Z0-9._%+-]+@(gmail\.com|ukr\.net|meta\.ua)$/,
    //   "Please enter valid characters"
    // )
    .matches(/^[^\s]*$/, "Please enter valid characters")
    .matches(/^[^а-яА-ЯіІїЇєЄ]*$/, "Please enter valid characters")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(RegExp('[!@#$%^&*(),.?":{}|<>+=-]'), "Special symbols is required")
    .matches(/^(?=.*[a-z])/, " Must Contain One Lowercase Character")
    .matches(/^(?=.*[A-Z])/, "  Must Contain One Uppercase Character")
    .min(8, "Password must be at least 8 characters")
    .max(16, "The password must be no more than 16 characters."),
  password_confirm: yup
    .string()
    .required("Confirm Password is required")
    .matches(RegExp('[!@#$%^&*(),.?":{}|<>+=-]'), "Special symbols is required")
    .matches(/^(?=.*[a-z])/, " Must Contain One Lowercase Character")
    .matches(/^(?=.*[A-Z])/, "  Must Contain One Uppercase Character")
    .min(8, "Confirm Password must be at least 8 characters")
    .max(16, "The password must be no more than 16 characters.")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  username: yup.string().required("Name is required"),
});

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    username: "",
    "user_type": "advertiser"
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [validForm, setValidForm] = useState(false);

  useEffect(() => {}, [errors]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  useEffect(() => {
    if (
      formData.password_confirm === formData.password &&
      errors?.email?.length === 0 &&
      errors?.password?.length === 0 &&
      errors?.password_confirm?.length === 0 &&
      errors?.username?.length === 0
    ) {
      setValidForm(true);
      return;
    } else {
      setValidForm(false);
    }
  }, [
    errors?.password_confirm?.length,
    errors?.email?.length,
    errors?.username?.length,
    errors?.password?.length,
    formData.password_confirm,
    formData.password,
  ]);

  const handleTogglePassword = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "password_confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleBlur = async (field) => {
    try {
      await schema.validateAt(field, formData);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    } catch (validationError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: validationError.message,
      }));
      setValidForm(false);
    }
  };

  const getBorderColor = (field) => {
    return errors[field] && "#da2e2e";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    schema
      .validate(formData, { abortEarly: false })
      .then(async () => {
        console.log("Form submitted with data:", formData);

        try {
          await dispatch(registerThunk(formData)).unwrap();
          setIsModal(true);
          // Toastify("Registration sucsessfull");
          // navigate("/main/accountAdverticer/adverticerEdit");
          // navigate("/main/authorization");
        } catch (error) {
          ToastError(error);
        }
        setFormData({
          email: "",
          password: "",
          password_confirm: "",
          username: "",
        });
        setErrors({});
        setValidForm(false);
      })
      .catch((validationErrors) => {
        const errorsMap = {};
        validationErrors.inner.forEach((error) => {
          errorsMap[error.path] = error.message;
        });
        setErrors(errorsMap);
      });
  };

  const handleToggleModal = () => {
    setIsModal((prev) => !prev);
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className={css.inputContainer}>
          {errors.email && <div className={css.errorText}>{errors.email}</div>}
          <input
            className={`${css.inputForm}  ${
              errors?.email?.length === 0 ? css.active : ""
            }
            ${errors?.email?.length > 0 ? css.errorPlaceholder : ""}
             dark:bg-black dark:border-white dark:text-white`}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={() => handleBlur("email")}
            style={{
              borderColor: getBorderColor("email"),
              color: getBorderColor("email"),
            }}
          />

          {errors?.email?.length > 1 ? (
            <img src={error} alt="" className={css.img_error} />
          ) : (
            ""
          )}
        </div>

        <div className={css.inputContainer}>
          {errors.password && (
            <div className={css.errorText}>{errors.password}</div>
          )}
          <div className={css.passwordInputContainer}>
            <input
              className={`${css.inputForm} ${css.passwordInput}  ${
                errors?.password?.length === 0 ? css.active : ""
              }
              ${errors?.password?.length > 0 ? css.errorPlaceholder : ""}
               dark:bg-black dark:border-white dark:text-white`}
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={() => handleBlur("password")}
              style={{
                borderColor: getBorderColor("password"),
                color: getBorderColor("password"),
              }}
            />

            <div
              className={`${css.eyeIcon} ${
                errors?.password?.length > 1 ? css.error : ""
              }`}
              onClick={() => handleTogglePassword("password")}
            >
              {!showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        <div className={css.inputContainer}>
          {errors.password_confirm && (
            <div className={css.errorText}>{errors.password_confirm}</div>
          )}
          <div className={css.passwordInputContainer}>
            <input
              className={`${css.inputForm} ${css.passwordInput}  ${
                errors?.password_confirm?.length === 0 ? css.active : ""
              }
              ${errors?.password_confirm?.length > 0 ? css.errorPlaceholder : ""}
              dark:bg-black dark:border-white dark:text-white`}
              type={showConfirmPassword ? "text" : "password"}
              name="password_confirm"
              placeholder="Confirm Password"
              value={formData.password_confirm}
              onChange={handleInputChange}
              onBlur={() => handleBlur("password_confirm")}
              style={{
                borderColor: getBorderColor("password_confirm"),
                color: getBorderColor("password_confirm"),
              }}
            />

            <div
              className={`${css.eyeIcon} ${
                errors?.password_confirm?.length > 1 ? css.error : ""
              }`}
              onClick={() => handleTogglePassword("password_confirm")}
            >
              {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
        </div>

        <div className={css.inputContainer}>
          {errors.username && (
            <div className={css.errorText}>{errors.username}</div>
          )}
          <input
            className={`${css.inputForm}  ${
              errors?.username?.length === 0 ? css.active : ""
            }
              ${
                errors?.username?.length > 0 ? css.errorPlaceholder : ""
              }           
              dark:bg-black dark:border-white dark:text-white`}
            type="text"
            name="username"
            placeholder="Name"
            value={formData.username}
            onChange={handleInputChange}
            onBlur={() => handleBlur("username")}
            style={{
              borderColor: getBorderColor("username"),
              color: getBorderColor("username"),
            }}
          />

          {errors?.username?.length > 1 ? (
            <img src={error} alt="" className={css.img_error} />
          ) : (
            ""
          )}
        </div>

        <p className={css.textInfo}>
          *By clicking the Register button, I agree to the
          <NavLink to="/main/setting/policyAndPrivecy">
            <span className={css.spanPolicy}>Privacy Policy</span>
          </NavLink>
          and give my consent to data processing
        </p>
        <div className={`${css.btn_text} ${validForm ? css.btn_valid : ""}`}>
          <Button
            label="Register"
            type="submit"
            disabled={validForm ? false : true}
          />
        </div>
      </form>

      {isModal && (
        <Modal childrenEl="true" handleToggleModal={handleToggleModal}>
          <p>
            Registration is complete!
            <br /> Check your e-mail
          </p>
        </Modal>
      )}
    </>
  );
};

export default RegistrationForm;
