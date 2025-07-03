import css from "./AdverticerEditPage.module.css";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import back from "../../assets/images/back.jpg";
import add from "../../assets/icons/addBaner.svg";
import deleteLink from "../../assets/icons/deleteLink.svg";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { getAccountApi, putAccountApi } from "../../services/https/https";
import * as yup from "yup";
import attention from "../../assets/icons/circle-exclamation-mark.svg";
import { useCustomContext } from "../../services/Context/Context";
import { Modal } from "../../components/Modal/Modal";
import { ToastError } from "../../services/ToastError/ToastError";
import { nanoid } from "nanoid";
import { ToastContainer } from "react-toastify";
import { AvatarUser } from "../../components/Avatar/Avatar";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";
import { Toastify } from "../../services/Toastify/Toastify";

const schema = yup.object().shape({
  first_name: yup.string().min(1).required("Name is required"),
  bio: yup.string().min(50).required("Description is required"),
});

const AdverticerEditPage = () => {
  const navigation = useNavigate();
  const { theme, setTheme } = useCustomContext();
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState("");
  const [errors, setErrors] = useState({});
  const [validForm, setValidForm] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [loader, setLoader] = useState(true);
  // const [isAvatar, setIsAvatar] = useState(true);
  const [links, setLinks] = useState([{ id: nanoid(), url: "", name: "" }]);
  const [symbolspostDescriptionCount, setSymbolspostDescriptionCount] =
    useState(data?.bio?.length || 0);

  useEffect(() => {
    const getData = (async () => {
      try {
        const data = await getAccountApi();
        setData(data.data);
        setUserId(data.data.id);

        if (data.data.links.length <= 0) return;
        setLinks(data.data.links);
      } catch (error) {
        ToastError("Try again later.");
        console.log(error);
      }
    })();
  }, []);

  // const [links, setLinks] = useState(() => {
  //   return (
  //     data.links ?? [
  //        { id: nanoid(), url: "", name: "" },
  //    ]
  //     // JSON.parse(localStorage.getItem("account"))?.links ?? [
  //     //   { id: nanoid(), url: "", name: "" },
  //     // ]
  //   );
  // });

  useEffect(() => {
    errors;

    links?.map(({ url, name }) => {
      if (
        url.length === 0 ||
        name.length === 0 ||
        errors?.bio?.length > 0 ||
        errors?.first_name?.length > 0
      ) {
        setValidForm(false);
        return;
      } else {
        setValidForm(true);
      }
    });
  }, [links, errors]);

  // useEffect(() => {
  //   localStorage.setItem("data", JSON.stringify(data));
  // }, [data]);

  const handleLinkAdd = () => {
    if (
      links[links.length - 1]?.name === "" ||
      links[links.length - 1]?.url === ""
    ) {
      return;
    }

    setData((prev) => ({
      ...data,
      links: [...prev.links, { id: nanoid(), url: "", name: "" }],
    }));
    setLinks((prev) => [...prev, { id: nanoid(), url: "", name: "" }]);
  };

  const handleLinkDelete = (deleteId) => {
    const newLinks = data.links.filter(({ id }) => id !== deleteId);

    setData({
      ...data,
      links: newLinks,
    });

    setLinks(newLinks);
  };

  const handleLinkChange = (id, url, name) => {
    setLinks((prev) => {
      const linkIndex = prev.findIndex((link) => link.id === id);

      const newLinks = [...prev];
      newLinks.splice(linkIndex, 1, { id, url, name });

      setData({
        ...data,
        links: newLinks,
      });

      return newLinks;
    });
  };

  const handleForm = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors({
      ...errors,
      [name]: "",
    });

    if (name === "bio") {
      setSymbolspostDescriptionCount(value.length);
    }
  };

  const handleBlur = async (field) => {
    try {
      await schema.validateAt(field, data);
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
    return errors[field] && "#DA2E2E";
  };

  const handleToggleModal = () => {
    setIsModal((prev) => !prev);
  };

  const handlerBackBtn = () => {
    // if (data?.bio?.length > 50 && data?.first_name?.length > 0) {
    //   navigation("/main/accountAdverticer");
    // } else {
    //   setIsModal((prev) => !prev);
    // }
    setIsModal((prev) => !prev);
  };

  const handlerContinue = () => {
    setIsModal((prev) => !prev);
  };

  const handlerLater = () => {
    navigation("/main/accountAdverticer");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    schema
      .validate(data, { abortEarly: false })
      .then(async () => {
        console.log("Form submitted with data:", data);
        try {
          const dataAccount = await putAccountApi(data);
          Toastify("Profile updated successfully");
          // navigation("/main/accountAdverticer");
          // localStorage.removeItem("data");
        } catch (error) {
          ToastError(error.response.data.links[0] || error.message);
          console.log(error);
        }
      })

      .catch((validationErrors) => {
        const errorsMap = {};
        validationErrors.inner.forEach((error) => {
          errorsMap[error.path] = error.message;
        });
        setErrors(errorsMap);
      });
  };

  const el = data.links?.find((item) => item.id === links[links.length - 1].id);

  return (
    <>
      <ToastContainer />

      {!data ||
      Array.isArray(data) ||
      typeof data !== "object" ||
      !data.email ? (
        <div className="loader">
          <LoaderSpiner />
        </div>
      ) : (
        <div className={css.adverticerEdit_container}>
          <div onClick={handlerBackBtn}>
            <GoBackButton
              imgSrc={back}
              imgAlt="Go back"
              imgWidth="50px"
              imgHeight="50px"
              title="Account"
            />
          </div>

          <form className={css.form_container} onSubmit={handleSubmit}>
            <AvatarUser
              setData={setData}
              avatar={data?.profile_picture}
              // image={data?.image}
              data={data}
            />

            <div className={css.form}>
              <label className={`${css.post_description} dark:text-white`}>
                Name*
                <input
                  name="first_name"
                  type="text"
                  placeholder="Agency \ Brand \ Service"
                  defaultValue={data?.first_name}
                  onBlur={() => handleBlur("first_name")}
                  style={{
                    borderColor: getBorderColor("first_name"),
                  }}
                  className={`primary_text_style ${
                    css.input
                  } dark:text-white dark:bg-black dark:border-white
                ${errors?.first_name?.length > 0 ? css.error_placeholder : ""}`}
                  onChange={handleForm}
                />
              </label>
              <p className={`${css.post_description} dark:text-white`}>
                Links*
              </p>
              {links &&
                // console.log('data?.links', data?.links.length)

                links?.map(({ id, url, name }) => (
                  <div key={id} className={css.links_container}>
                    <input
                      value={url}
                      name="links"
                      placeholder="url"
                      className={`secondary_text_style ${
                        css.post_container
                      }   dark:bg-black dark:text-white 
                   ${
                     data?.links?.length > 0 && url.length === 0
                       ? ` ${css.error_placeholder} ${css.error_links} dark:border-red`
                       : `dark:border-white`
                   }

                 
                `}
                      onChange={(e) =>
                        handleLinkChange(id, e.target.value, name)
                      }
                    />
                    <input
                      value={name}
                      name="links"
                      onChange={(e) =>
                        handleLinkChange(id, url, e.target.value)
                      }
                      placeholder="name"
                      onBlur={() => handleBlur("links")}
                      className={`secondary_text_style dark:bg-black 
                       dark:text-white 
                    ${css.post_container}   
                    ${
                      data?.links?.length > 0 && name.length === 0
                        ? `${css.error_placeholder} ${css.error_links} 
             
                      dark:border-red`
                        : `dark:border-white`
                    }
                `}
                    />

                    {el?.id === id || data?.links?.length <= 1 ? (
                      <img
                        src={add}
                        alt="add link"
                        className={css.img}
                        onClick={handleLinkAdd}
                      />
                    ) : (
                      <img
                        src={deleteLink}
                        alt="delete link"
                        className={css.img}
                        onClick={() => handleLinkDelete(id)}
                      />
                    )}
                  </div>
                ))}

              <label className={`${css.post_description} dark:text-white`}>
                Description*
                <textarea
                  name="bio"
                  type="text"
                  placeholder="Minimum 50 characters*"
                  maxLength="500"
                  id=""
                  cols="30"
                  rows="10"
                  value={data?.bio}
                  onBlur={() => handleBlur("bio")}
                  style={{
                    borderColor: getBorderColor("bio"),
                  }}
                  className={`primary_text_style ${
                    css.textarea
                  } dark:text-white dark:bg-black dark:border-white
                 ${errors?.bio?.length > 0 ? css.error_placeholder : ""}
                `}
                  onChange={handleForm}
                ></textarea>
                <p className={`${css.symbols} dark:text-white`}>
                  Symbols
                  <span>
                    {symbolspostDescriptionCount || data?.bio?.length}/500
                  </span>
                </p>
              </label>
            </div>

            <div className={css.btn_container}>
              {errors?.bio?.length > 0 ||
              errors?.first_name?.length > 0 ||
              !validForm ? (
                <div className={css.attention_container}>
                  <img src={attention} alt="attention" />
                  <p className={`secondary_text_style ${css.attention_descr}`}>
                    Fill in all required fields for input
                  </p>
                </div>
              ) : (
                ""
              )}
              <Button
                label="Save"
                type="submit"
                disabled={
                  data?.bio?.length > 49 &&
                  //data?.first_name?.length > 0 &&
                  validForm
                    ? false
                    : true
                }
              />
            </div>
          </form>
          {isModal && (
            <Modal
              handleToggleModal={handleToggleModal}
              confirm={handlerContinue}
              cancel={handlerLater}
              title="Your profile is incomplete!"
              description="You won’t be able to publish announcements until you complete the profile"
              btn_text_confirm="Continue entering data"
              btn_text_cancel="Continue later"
            ></Modal>
          )}
        </div>
      )}
    </>
  );
};

export default AdverticerEditPage;
