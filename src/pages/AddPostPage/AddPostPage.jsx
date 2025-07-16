import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { getAccountApi, postPostApi } from "../../services/https/https";
import { ToastContainer } from "react-toastify";
import { nanoid } from "nanoid";
import css from "./AddPostPage.module.css";
import { ToastError } from "../../services/ToastError/ToastError";
import { MessagePostOnModeration } from "../../components/MessagePostOnModeration/MessagePostOnModeration";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { Modal } from "../../components/Modal/Modal";
import { CreatePost } from "../../components/CreatePost/CreatePost";

const AddPostPage = ({ postEdit, setPostEdit, draftsEdit, setDraftsEdit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModal, setIsModal] = useState(false);
  const [formConfig, setFormConfig] = useState(false);
  const [postSuccessfullyAdded, setPostSuccessfullyAdded] = useState(false);
  const [validForm, setValidForm] = useState(false);
  // const [sendPost, setSendPost] = useState({});
  const [profile, setProfile] = useState({});
  const [links, setLinks] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("createPost"))?.links ??
      location?.state?.links ?? [{ id: nanoid(), href: "", action: "" }]
    );
  });
  //   const [data, setData] = useState(() => {
  //  return (
  //       location.state ?? {
  //         title: "",
  //         description: "",
  //         category: {
  //           id: "",
  //           name: "",
  //         },
  //         subcategory: {
  //           id: "",
  //           name: "",
  //         },
  //         callToAction: "" || "Read more",
  //         callToActionLinks: "",
  //         banners: [],
  //         // links: [{ id: nanoid(), href: "", action: "" }],
  //         status: "draft",
  //       }
  //     );
  //   });
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("createPost");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Ошибка при чтении localStorage:", e);
    }

    return (
      location.state ?? {
        title: "",
        description: "",
        category: {
          id: "",
          name: "",
        },
        subcategory: {
          id: "",
          name: "",
        },
        callToAction: "Read more",
        callToActionLinks: "",
        banners: [],
        status: "draft",
      }
    );
  });

  useEffect(() => {
    (async () => {
      const { data } = await getAccountApi();

      setProfile(data.profile_picture?.replace("image/upload/", ""));
    })();
  }, []);

  const handleToggleModal = () => {
    setIsModal((prev) => !prev);
  };

  const cancelAddPost = () => {
    navigate("/main");
    setIsModal((prev) => !prev);
    localStorage.removeItem("createPost");
  };

  const createPostDrafts = async () => {
    try {
      setIsModal((prev) => !prev);
      const dataRes = await postPostApi({ ...data, status: "draft" });
      console.log("drafts", dataRes);
      localStorage.removeItem("createPost");
      navigate("/main");
    } catch (error) {
      ToastError(error.message || "Try again later.");
    }
  };

  useEffect(() => {
    if (
      data.title !== "" &&
      data.category !== "" &&
      data.subcategory !== "" &&
      data.banners.length !== 0
    ) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [data.category, data.subcategory, data.title, data.banners]);

  const handleBack = () => {
    setIsModal((prev) => !prev);
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();

    try {
      const dataRes = await postPostApi({ ...data, status: "pending" });

      // setSendPost(data);
      setPostSuccessfullyAdded(true);

      setTimeout(() => {
        navigate("/main");
      }, 3000);
      localStorage.removeItem("createPost");
    } catch (error) {
      ToastError(error.message || "Try again later.");
    }
  };

  const handlePreview = () => {
    navigate("/main/addPost/previewAdvertisemet", {
      state: {
        data,
        profile,
        from: location.pathname,
      },
    });
  };

  return (
    <div>
      {!postSuccessfullyAdded && (
        <>
          <ToastContainer />
          <div className={css.top_container} onClick={handleBack}>
            <GoBackButton
              to=""
              imgWidth="50px"
              imgHeight="50px"
              imgAlt="Go back"
            />
            <p className={`${css.title_back} dark:text-white`}>
              New advertisement
            </p>
          </div>

          <form onSubmit={handleSubmitPost}>
            <CreatePost
              setPost={setData}
              post={data}
              links={links}
              setLinks={setLinks}
            />

            <div className={css.btn_container}>
              <button
                type="button"
                className={css.btn_preview_container}
                onClick={handlePreview}
              >
                <span className={`${css.btn_preview} dark:text-white`}>
                  Preview
                </span>
              </button>

              <button
                type="submit"
                className={`${css.btn} ${
                  validForm ? css.btn_active : css.btn_disabled
                }`}
                disabled={validForm ? false : true}
              >
                <span className={css.btn_back_active}>Publish</span>
              </button>
            </div>
          </form>
        </>
      )}
      {isModal && (
        <Modal
          handleToggleModal={handleToggleModal}
          confirm={createPostDrafts}
          cancel={cancelAddPost}
          title="Add post to draft?"
          description="You can come back to edit later."
        >
          <h2 className={css.modal_title}>Add post to draft?</h2>
          <p className={css.modal_descr}>You can come back to edit later.</p>
        </Modal>
      )}
      {postSuccessfullyAdded && (
        <MessagePostOnModeration>
          Advertisement is under moderation. <br />
          It will take about 15 minutes.
        </MessagePostOnModeration>
      )}
    </div>
  );
};

export default AddPostPage;

AddPostPage.propTypes = {
  postEdit: PropTypes.object,
  setPostEdit: PropTypes.func,
  draftsEdit: PropTypes.object,
  setDraftsEdit: PropTypes.func,
};
