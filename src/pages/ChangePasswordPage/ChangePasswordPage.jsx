import css from "../../components/ChangeSettingAccount/ChangeSettingAccount.module.css";
import * as yup from "yup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomContext } from "../../services/Context/Context";
import GoBackButton from "../../components/GoBackButton/GoBackButton";

import changePassword from "../../assets/images/changePassword.png";

import Button from "../../components/Button";
import { MessagePostOnModeration } from "../../components/MessagePostOnModeration/MessagePostOnModeration";
import { postPasswordChange } from "../../services/https/https";
import { logOutThunk } from "../../redux/auth/authThunk";
import { Toastify } from "../../services/Toastify/Toastify";
import { useDispatch } from "react-redux";
import { ToastError } from "../../services/ToastError/ToastError";
import { ToastContainer } from "react-toastify";

const schema = yup.object().shape({
  old_password: yup
    .string()
    .required("Password is required")
    .matches(/[!@#$%^&*(),.?":{}|<>+=-]/, "Special symbol is required")
    .min(8, "Password must be at least 8 characters"),
  new_password: yup
    .string()
    .required("Password is required")
    .matches(/[!@#$%^&*(),.?":{}|<>+=-]/, "Special symbol is required")
    .min(8, "Password must be at least 8 characters"),
  new_password_confirm: yup
    .string()
    .required("Confirm Password is required")
    .min(8, "Confirm Password must be at least 8 characters")
    .oneOf([yup.ref("new_password"), null], "Passwords must match"),
});

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useCustomContext();
  const [messageChangePassword, setMessageChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validForm, setValidForm] = useState(false);
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    new_password_confirm: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (
      errors?.new_password?.length === 0 &&
      errors?.new_password_confirm?.length === 0
    ) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [errors?.new_password?.length, errors?.new_password_confirm?.length]);

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

  const handleTogglePassword = (field) => {
    if (field === "new_password") {
      setShowPassword(!showPassword);
    } else if (field === "new_password_confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    } else if (field === "old_password") {
      setShowOldPassword(!showOldPassword);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    schema
      .validate(formData, { abortEarly: false })
      .then(async () => {
        try {
          const data = await postPasswordChange(formData);

          setMessageChangePassword(true);

          setTimeout(() => {
            dispatch(logOutThunk());
            navigate("/main/authorization");
          }, 3000);

          setFormData({
            old_password: "",
            new_password: "",
            new_password_confirm: "",
          });
          setErrors({});
          setValidForm(false);
        } catch (error) {
          ToastError(error.message);
        }
      })
      .catch((validationErrors) => {
        const newErrors = {};
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <ToastContainer />
      {!messageChangePassword ? (
        <>
          <GoBackButton
            imgAlt="Go back"
            imgWidth="50px"
            imgHeight="50px"
            title="Changing password"
            onClick={handleBack}
          />
          <img src={changePassword} alt="changePassword" className={css.img} />

          <div className={css.change_info_container}>
            <h2 className={css.change_title}>Change your password</h2>
            <p className={`${css.change_info} dark:text-white`}>
              Enter your new password and click <br />
              “Confirm the change” button
            </p>
          </div>

          <form onSubmit={handleSubmit} className={css.formContainer}>
            <div className={css.inputContainer}>
              <div className={css.fieldContainer}>
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  placeholder="Old password"
                  value={formData.old_password}
                  onBlur={() => handleBlur("old_password")}
                  onChange={handleInputChange}
                  style={{
                    borderColor: getBorderColor("old_password"),
                    color: getBorderColor("old_password"),
                  }}
                  className={`${css.inputForm} ${
                    errors?.old_password?.length === 0 ? css.active : ""
                  } ${
                    errors?.old_password?.length > 0 ? css.errorPlaceholder : ""
                  } dark:bg-black dark:border-white dark:text-white`}
                />
                <div
                  className={`${css.eyeIcon} ${
                    errors?.old_password?.length > 1 ? css.error : ""
                  }`}
                  onClick={() => handleTogglePassword("old_password")}
                >
                  {!showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <div className={css.fieldContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="new_password"
                  placeholder="New password"
                  value={formData.new_password}
                  onBlur={() => handleBlur("new_password")}
                  onChange={handleInputChange}
                  style={{
                    borderColor: getBorderColor("new_password"),
                    color: getBorderColor("new_password"),
                  }}
                  className={`${css.inputForm} ${
                    errors?.new_password?.length === 0 ? css.active : ""
                  } ${
                    errors?.new_password?.length > 0 ? css.errorPlaceholder : ""
                  } dark:bg-black dark:border-white dark:text-white`}
                />
                <div
                  className={`${css.eyeIcon} ${
                    errors?.new_password?.length > 1 ? css.error : ""
                  }`}
                  onClick={() => handleTogglePassword("new_password")}
                >
                  {!showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.new_password && (
                <div className={css.errorText}>{errors.new_password}</div>
              )}

              <div className={css.fieldContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="new_password_confirm"
                  placeholder="Confirm password"
                  value={formData.new_password_confirm}
                  onBlur={() => handleBlur("new_password_confirm")}
                  onChange={handleInputChange}
                  style={{
                    borderColor: getBorderColor("new_password_confirm"),
                    color: getBorderColor("new_password_confirm"),
                  }}
                  className={`${css.inputForm} ${
                    errors?.new_password_confirm?.length === 0 ? css.active : ""
                  } ${
                    errors?.new_password_confirm?.length > 0
                      ? css.errorPlaceholder
                      : ""
                  } dark:bg-black dark:border-white dark:text-white`}
                />
                <div
                  className={`${css.eyeIcon} ${
                    errors?.new_password_confirm?.length > 1 ? css.error : ""
                  }`}
                  onClick={() => handleTogglePassword("new_password_confirm")}
                >
                  {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
              {errors.new_password_confirm && (
                <div className={css.errorText}>
                  {errors.new_password_confirm}
                </div>
              )}
            </div>

            <div className={css.btn_container}>
              <Button
                label="Confirm the change"
                disabled={
                  formData.new_password_confirm === formData.new_password &&
                  validForm
                    ? false
                    : true
                }
              />
            </div>
          </form>
        </>
      ) : (
        <MessagePostOnModeration>
          The password has been successfully changed.
        </MessagePostOnModeration>
      )}
    </div>
  );
};

export default ChangePasswordPage;
