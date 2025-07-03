import { useEffect, useState } from "react";
import {
  getDraftsPostId,
  patchDraftsPostId,
  patchPostApi,
  postPostApi,
} from "../../services/https/https";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import back from "../../assets/images/back.jpg";
import { CreatePost } from "../../components/CreatePost/CreatePost";
import css from "./EditDraftsPage.module.css";
import { ToastError } from "../../services/ToastError/ToastError";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { Modal } from "../../components/Modal/Modal";
import { MessagePostOnModeration } from "../../components/MessagePostOnModeration/MessagePostOnModeration";
import { ToastContainer } from "react-toastify";
import { nanoid } from "nanoid";
import axios from "axios";

const EditDraftsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [isModal, setIsModal] = useState(false);
  const [postSuccessfullyAdded, setPostSuccessfullyAdded] = useState(false);
  const [validForm, setValidForm] = useState(false);
  const [data, setData] = useState([]);
  const [dataApi, setDataApi] = useState(
    () => JSON.parse(localStorage.getItem("dataApi")) ?? false
  );
  const [links, setLinks] = useState(() => {
    return (
      // JSON.parse(localStorage.getItem("previewPost"))?.links ||
      location?.state?.links || [{ id: nanoid(), url: "", name: "" }]
    );
  });
  const [post, setPost] = useState(
    // data.length !== 0
    () => {
      return (
        // JSON.parse(localStorage.getItem("previewPost")) ??
        {
          id: nanoid(),
          description: "",
          title: "",
          category: "",
          subcategory: "",
          callToAction: "" || "Read more",
          callToActionLinks: "",
          banners: [],
        }
      );
    }
  );

  useEffect(() => {
    const getData = (async () => {
      try {
        // if (dataApi) {
        // const data = await JSON.parse(localStorage.getItem("previewPost"));
        if (location.state) {
          console.log("location.state", location.state);

          setData(location.state);
          setPost(location.state);
          setLinks(location.state.links);
          return;
        }

        const data = await getDraftsPostId(params.editDraftsId);
        console.log(data.links);

        setData(data);
        setPost(data);

        // return;
        // }
        // const data =await getDraftsPostId(params.editDraftsId);
        // const data = await JSON.parse(localStorage.getItem("backend"));

        // setPost(data);
        // setData(data);

        // setDataApi(localStorage.setItem("dataApi", true));

        data?.links?.map(({ href, action }) => {
          if (href?.length === 0 || action?.length === 0) {
            setLinks(data.links);
            return;
          } else {
            setLinks(data.links);
          }
        });
      } catch (error) {
        ToastError(error?.response?.statusText || error.message);
      }
    })();
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("previewPost", JSON.stringify(post));
  // }, [post]);

  // useEffect(() => {
  //   post.links = links;
  //   // localStorage.setItem("previewPost", JSON.stringify(post));
  // }, [links, post]);

  const handleToggleModal = () => {
    setIsModal((prev) => !prev);
  };

  const handleBack = () => {
    console.log(isModal);
    setIsModal((prev) => !prev);
  };

  const cancelAddPost = () => {
    // localStorage.removeItem("previewPost");
    localStorage.removeItem("filterCategory");
    localStorage.removeItem("dataApi");
    navigate("/main");
    setIsModal((prev) => !prev);
  };

  const createPostDrafts = async () => {
    try {
      setIsModal((prev) => !prev);
      const data = await patchPostApi(params.editDraftsId, {
        ...post,
        status: "draft",
      });
      // const data = await patchDraftsPostId(params.editDraftsId, post)
      // localStorage.setItem("backend", JSON.stringify(post));

      // localStorage.removeItem("previewPost");
      // localStorage.removeItem("filterCategory");
      // localStorage.removeItem("dataApi");
      navigate("/main");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      post?.title !== "" &&
      post?.category?.name !== "" &&
      post?.subcategory?.name !== ""
    ) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [post?.category, post?.subcategory, post?.title, data]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    console.log("EditDrafts", post);
    try {
      const data = await patchPostApi(params.editDraftsId, {
        ...post,
        status: "pending",
      });

      setPostSuccessfullyAdded(true);
      // localStorage.removeItem("previewPost");

      setTimeout(() => {
        navigate("/main");
      }, 3000);
    } catch (error) {
      ToastError(error?.response?.statusText || error.message);
    }
  };

  const handlePreview = () => {
    console.log("handlePreview");
    console.log(post);

     navigate("/main/addPost/previewAdvertisemet", {
      state: {
        post,
        from: location.pathname,
      },
    });
  };

  return (
    <>
      <ToastContainer />
      <p>EditDraftsPage</p>
      {!postSuccessfullyAdded && (
        <>
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
            {data?.length !== 0 && (
              <>
                {
                  <CreatePost
                    post={post}
                    setPost={setPost}
                    links={links}
                    setLinks={setLinks}
                  />
                }

                <div className={css.btn_container}>
                  {/* <NavLink to="/main/addPost/previewAdvertisemet"> */}
                  <button
                    type="button"
                    className={css.btn_preview_container}
                    onClick={handlePreview}
                  >
                    <span className={`${css.btn_preview} dark:text-white`}>
                      Preview
                    </span>
                  </button>
                  {/* </NavLink> */}

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
              </>
            )}
          </form>
        </>
      )}
      {isModal && (
        <Modal
          handleToggleModal={handleToggleModal}
          confirm={createPostDrafts}
          cancel={cancelAddPost}
          title="Save a draft?"
          description="You can come back to edit later."
        ></Modal>
      )}
      {postSuccessfullyAdded && (
        <MessagePostOnModeration>
          Advertisement is under moderation. <br />
          It will take about 15 minutes.
        </MessagePostOnModeration>
      )}
    </>
  );
};

export default EditDraftsPage;
