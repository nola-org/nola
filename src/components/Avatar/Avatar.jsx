import css from "./Avatar.module.css";
import PropTypes from "prop-types";
// import { Cloudinary } from "@cloudinary/url-gen";
// import { AdvancedImage } from "@cloudinary/react";
// import { thumbnail } from "@cloudinary/url-gen/actions/resize";
// import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
// import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { ReactComponent as Icon_Image } from "../../assets/icons/image.svg";
import { useEffect, useState } from "react";
import { ToastError } from "../../services/ToastError/ToastError";
import Avatar from "react-avatar-edit";
import { postImg } from "../../services/cloudinary/cloudinary";
import { useCustomContext } from "../../services/Context/Context";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";
import { getAccountApi } from "../../services/https/https";

export const AvatarUser = ({ setData, avatar, data }) => {
  const { theme, setTheme } = useCustomContext();
  const [photo, setPhoto] = useState(avatar?.replace("image/upload/", ""));
  // const [photo, setPhoto] = useState(() => {
  //   return JSON.parse(localStorage.getItem("account"))?.profile_picture ?? "";
  // });

  const [update, setUpdate] = useState(false);
  const [src, setSrc] = useState(null);
  const [modal, setModal] = useState(false);
  // const [image, setImage] = useState(() => {
  //   return JSON.parse(localStorage.getItem("account"))?.image ?? "";
  // });

  // const cld = new Cloudinary({
  //   cloud: {
  //     cloudName: "dpsjhatpy",
  //   },
  // });

  // eslint-disable-next-line no-undef
  const upload_presets = process.env.REACT_APP_UPLOAD_PRESETS;
  // eslint-disable-next-line no-undef
  const api_key = process.env.REACT_APP_API_KEY;

  // useEffect(() => {
  //   setData((prev) => ({
  //     ...data,
  //     profile_picture: photo,
  //     // image: image,
  //   }));
  //   // eslint-disable-next-line
  // }, [photo]);

  // const handleAddPhoto = async (e) => {
  //   const filesOne = e.target.files[0];

  //   const formData = new FormData();
  //   formData.append("file", filesOne);
  //   formData.append("api_key", api_key);
  //   formData.append("upload_preset", upload_presets);

  //   if (filesOne) {
  //     try {
  //       setUpdate(true);
  //       const response = await fetch(
  //         `https://api.cloudinary.com/v1_1/dpsjhatpy/image/upload`,
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );
  //       const data = await response.json();

  //       setPhoto(data?.public_id);
  //     } catch (error) {
  //       ToastError(error.message);
  //     } finally {
  //       setUpdate(false);
  //     }
  //   }
  // };

  // const imgRes = photo
  //   ? cld
  //       .image(photo)
  //       .resize(
  //         thumbnail().width(100).height(100).gravity(focusOn(FocusOn.face()))
  //       )
  //   : null;

  const onClose = async () => {
    setModal(false);

    const formData = new FormData();
    formData.append("file", src);
    formData.append("api_key", api_key);
    formData.append("upload_preset", upload_presets);

    try {
      setUpdate(true);
      const avatar = await postImg(formData);
      const res = await getAccountApi();
      console.log(res.data);

      console.log("111111111", data);

      setData({
        ...data,
        profile_picture: avatar?.data?.url,
      });
      setPhoto(avatar?.data?.url);
      // setImage(data?.data?.url);
    } catch (error) {
      ToastError(error.message);
    } finally {
      setUpdate(false);
    }
  };

  const onCrop = async (i) => {
    // setImage(true);
    setSrc(i);
  };

  const handleAvatar = (e) => {
    const { target, currentTarget } = e;
    if (target === currentTarget) {
      setSrc(photo ? photo : null);
      // setImage(false);
      setModal((prev) => !prev);
    }
  };

  return (
    <>
      {update && (
        <div className={css.loader}>
          <LoaderSpiner />
        </div>
      )}
      <div className={css.photo_container}>
        {modal && (
          <div className={css.backdrop} onClick={handleAvatar}>
            <div
              className={`${css.modal} ${
                theme === "dark" ? css.modal_dark : ""
              }`}
            >
              <div
                className={`${css.avatar} ${
                  theme === "dark" ? css.avatar_dark : ""
                }`}
              >
                <Avatar
                  width={300}
                  height={210}
                  onCrop={onCrop}
                  onClose={onClose}
                />
              </div>
            </div>
          </div>
        )}

        <img
          // src={!src ? data?.image : src}
          src={src || avatar?.replace("image/upload/", "")}
          alt=""
          className={`${css.src_container} dark:border-white `}
          onClick={handleAvatar}
        />
        {!photo ? (
          <div
            // className={`${css.icon} ${image ? css.invisible : ""}`}
            className={`${css.icon}`}
            onClick={handleAvatar}
          >
            <Icon_Image />
          </div>
        ) : (
          ""
        )}

        {/* <label>
          <div className={css.photo_containner}>
            {imgRes && <AdvancedImage cldImg={imgRes} />}
          </div>

          <input
            className={css.addPhoto}
            type="file"
            onChange={handleAddPhoto}
          />
        </label> */}

        <p className={`${css.photo_title} dark:text-white`}>Add photo</p>
      </div>
    </>
  );
};

AvatarUser.propTypes = {
  setData: PropTypes.func.isRequired,
  avatar: PropTypes.string,
  data: PropTypes.any,
};
