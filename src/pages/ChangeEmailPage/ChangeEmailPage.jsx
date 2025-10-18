import css from "../../components/ChangeSettingAccount/ChangeSettingAccount.module.css";
import sendEmail from "../../assets/images/sendEmail.png";
import * as yup from "yup";

import { useEffect, useState } from "react";
import { useCustomContext } from "../../services/Context/Context";
import Button from "../../components/Button";
import { Modal } from "../../components/Modal/Modal";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { useNavigate } from "react-router-dom";
import { MessagePostOnModeration } from "../../components/MessagePostOnModeration/MessagePostOnModeration";
import { postEmailChange } from "../../services/https/https";
import { ToastError } from "../../services/ToastError/ToastError";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { logOutThunk } from "../../redux/auth/authThunk";
import { getAccountApi } from "../../services/https/https";

const schema = (dataEmail) => yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|ukr\.net|meta\.ua)$/,
      "Please enter valid characters"
    )

    .matches(/^[^\s]*$/, "Please enter valid characters")
    .matches(/^[^а-яА-ЯіІїЇєЄ]*$/, "Please enter valid characters")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
      "Please enter valid characters"
  )
    .test("email-match", "Email doesn’t match", function (value) {
      if (!dataEmail) return true; 
      if (!value) return true; 
      return value.trim().toLowerCase() === dataEmail.trim().toLowerCase();
    }),
  
  newEmail: yup
    .string()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@(gmail\.com|ukr\.net|meta\.ua)$/,
      "Please enter valid characters"
    )
    .matches(/^[^\s]*$/, "Please enter valid characters")
    .matches(/^[^а-яА-ЯіІїЇєЄ]*$/, "Please enter valid characters")
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
      "Mail is not registered in the system. Please try again."
    )
    .test("newEmail-diff", "Emails must differ", (value, ctx) => {
      return (
        value?.trim().toLowerCase() !==
        ctx.parent.email?.trim().toLowerCase()
        );
    }),
});

export const ChangeEmailPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useCustomContext();
  const dispatch = useDispatch();
  const [isModal, setIsModal] = useState(false);
  const [messageChangePassword, setMessageChangePassword] = useState(false);
  const [validForm, setValidForm] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    newEmail: "",
  });
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});

    useEffect(() => {
    const getData = (async () => {
      const { data } = await getAccountApi();

      setData(data);
    })();
  }, []);

  // useEffect(() => { }, [errors]);

  useEffect(() => {
    if (errors?.email?.length === 0 && errors?.newEmail?.length === 0) {
      setValidForm(true);
      return;
    } else {
      setValidForm(false);
    }
  }, [errors?.newEmail?.length, errors?.email?.length]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleToggleModal = () => {
    setIsModal((prev) => !prev);
  };

  const confirmMessage = async () => {

    try {
      handleToggleModal();
      const data = await postEmailChange({newEmail: formData.newEmail});

      setFormData({ email: "", newEmail: "" });
      setErrors({});
      setValidForm(false);
      
      setMessageChangePassword(true);

      setTimeout(() => {
        dispatch(logOutThunk());
        navigate("/main/authorization");
        window.location.reload();
      }, 3500);

    } catch (error) {
      ToastError(error.message);
    }
  };

  const handleBlur = async (field) => {
    try {
      await schema(data?.email).validateAt(field, formData);
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [field]: err.message }));
    }
  };

  const getBorderColor = (field) => {
    return errors[field] && "#da2e2e";
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await schema(data?.email).validate(formData, { abortEarly: false });
      setIsModal(true);
      setValidForm(true);
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      setValidForm(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {!messageChangePassword && (
        <>
          <GoBackButton
            imgAlt="Go back"
            imgWidth="50px"
            imgHeight="50px"
            title="Changing email"
            onClick={handleBack}
          />

          <img
            src={sendEmail}
            alt="sendEmail"
            className={css.img}
            style={{ transform: "translate(20px, 0px)", marginBottom: "32px" }}
          />

          <div className={css.change_info_container}>
            <h2 className={css.change_title}>Change your email</h2>
            <p className={`${css.change_info} dark:text-white`}>
              A request to confirm your email change <br />
              will be sent to your
              {/* primary */}
              email address
            </p>
          </div>
          <form onSubmit={handleSubmit} className={css.formContainer}>
            <div className={css.inputContainer}>
              <div>
                <div className={css.fieldContainer}>
                  <input
                    type="text"
                    name="email"
                    placeholder="Current email address"
                    value={formData.email}
                    onBlur={() => handleBlur("email")}
                    onChange={handleInputChange}
                    style={{
                      borderColor: getBorderColor("email"),
                      color: getBorderColor("email"),
                    }}
                    className={`${css.inputForm}  ${
                      errors?.email?.length === 0 ? css.active : ""
                    }   ${errors?.email?.length > 0 ? css.errorPlaceholder : ""}
                                 dark:bg-black dark:border-white dark:text-white
                      `}
                  />
                </div>
                {errors.email && (
                  <div className={css.errorText}>{errors.email}</div>
                )}
              </div>

              <div>
                <div className={css.fieldContainer}>
                  <input
                    type="text"
                    name="newEmail"
                    placeholder="New email address"
                    value={formData.newEmail}
                    onBlur={() => handleBlur("newEmail")}
                    style={{
                      borderColor: getBorderColor("newEmail"),
                      color: getBorderColor("newEmail"),
                    }}
                    onChange={handleInputChange}
                    className={`${css.inputForm}    ${
                      errors?.newEmail?.length === 0 ? css.active : ""
                    }            ${
                      errors?.newEmail?.length > 0 ? css.errorPlaceholder : ""
                    }
                                 dark:bg-black dark:border-white dark:text-white
                      `}
                  />
                </div>
                {errors.newEmail && (
                  <div className={css.errorText}>{errors.newEmail}</div>
                )}
              </div>
            </div>
            <div className={css.btn_container}>
              <Button
                label="Send a request"
                disabled={
                  // (formData?.email?.includes("gmail.com") ||
                  //   formData?.email?.includes("ukr.net") ||
                  //   formData?.email?.includes("meta.ua")) &&
                  // (formData?.newEmail?.includes("gmail.com") ||
                  //   formData?.newEmail?.includes("ukr.net") ||
                  //   formData?.newEmail?.includes("meta.ua"))
                  //   ? false
                  //   : true
                  !validForm
                }
              />
            </div>
          </form>
        </>
      )}

      {isModal && (
        <Modal
          cancel={handleToggleModal}
          handleToggleModal={handleToggleModal}
          title="Warning!"
          description="For account security purpose, once the email address has been changed, transactions will be disabled for 24 hours."
          info="Please note that once changes have been made, the email address cannot be changed or deleted for the next seven days."
          confirm={confirmMessage}
        />
      )}

      {messageChangePassword && (
        <Modal childrenEl="true" handleToggleModal={handleToggleModal}>
          <p>
            Confirmation email is complete!
            <br /> Check your e-mail
          {/* The request has been sent to your primary email */}
          </p>
        </Modal>
      )}
    </>
  );
};

export default ChangeEmailPage;
