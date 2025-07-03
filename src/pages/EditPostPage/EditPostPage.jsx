import css from "./EditPostPage.module.css";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getPostApi,
  getPostIdApi,
  getPostIdModerationApi,
  patchPostApi,
  postPostApi,
} from "../../services/https/https";
import { ToastContainer } from "react-toastify";
import { ToastError } from "../../services/ToastError/ToastError";
import { CreatePost } from "../../components/CreatePost/CreatePost";
import { Toastify } from "../../services/Toastify/Toastify";
import { MessagePostOnModeration } from "../../components/MessagePostOnModeration/MessagePostOnModeration";
import { nanoid } from "nanoid";

const EditPostPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [formConfig, setFormConfig] = useState(false);
  const [postSuccessfullyAdded, setPostSuccessfullyAdded] = useState(false);
  const [data, setData] = useState([]);
  const [links, setLinks] = useState(() => {
    return (
      // JSON.parse(localStorage.getItem("previewPost"))?.links ||
      [{ id: nanoid(), url: "", name: "" }]
    );
  });
  const [post, setPost] = useState(
    data.length !== 0 || {
      description: "",
      title: "",
      category: { index: null, title: "" },
      subcategory: { index: null, title: "" },
      callToAction: "" || "Read more",
      callToActionLinks: "",
      banners: [],
    }
  );

  useEffect(() => {
    const getData = (async () => {
      try {
        if (location.state) {
          setData(location.state);
          setPost(location.state);
          setLinks(location.state.links);
          return;
        }

        const { data } = await getPostIdApi(params.editPostId);

        setData(data);
        setLinks(data.links);
      } catch (error) {
        console.log(error);
      }
    })();

    // localStorage.setItem("previewPost", JSON.stringify(post));
  }, [params, post]);

  const handleChangePost = ({ target }) => {
    const { name, value } = target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    setFormConfig(true); // delete later

    try {
      const res = await patchPostApi(params.editPostId, {
        ...data,
        status: "pending",
      });

      setPostSuccessfullyAdded(true);
      localStorage.removeItem("previewPost");

      setTimeout(() => {
        navigate("/main");
      }, 3000);
    } catch (error) {
      ToastError(error.message || "Try again later.");
    }
  };

  const handlePreview = () => {
    console.log(post);
    navigate("/main/addPost/previewAdvertisemet", {
      state: {
        data,
        from: location.pathname,
      },
    });
    // navigate("/main/addPost/previewAdvertisemet", { state: data });
  };

  return (
    <div>
      EditPostPage
      <ToastContainer />
      {/* {formConfig && (
        <HandleFormConfig
          message={"Current post has been edited"}
          navigatePage={"/main/accountAdverticer"}
        />
      )} */}
      {!postSuccessfullyAdded && (
        <div>
          <form onSubmit={handleSubmitPost}>
            {/* post={data} setPost={setData} */}
            <CreatePost
              post={data}
              setPost={setData}
              links={links}
              setLinks={setLinks}
            />

            <div className={css.btn_container} onClick={handlePreview}>
              {/* <NavLink to="/main/addPost/previewAdvertisemet"> */}
              <button type="button" className={css.btn}>
                <span className={css.btn_back}> Preview</span>
              </button>
              {/* </NavLink> */}

              <button type="submit" className={`${css.btn} ${css.btn_active}`}>
                <span className={css.btn_back_active}>Publish</span>
              </button>
            </div>
          </form>
        </div>
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

export default EditPostPage;
