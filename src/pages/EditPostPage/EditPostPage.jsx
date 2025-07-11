import css from "./EditPostPage.module.css";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getAccountApi,
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
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

const EditPostPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [formConfig, setFormConfig] = useState(false);
  const [postSuccessfullyAdded, setPostSuccessfullyAdded] = useState(false);
  const [data, setData] = useState([]);
  const [profile, setProfile] = useState({});
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
      category: { name: "" },
      subcategory: { name: "" },
      callToAction: "" || "Read more",
      callToActionLinks: "",
      banners: [],
    }
  );

  useEffect(() => {
    (async () => {
      const { data } = await getAccountApi();

      setProfile(data.profile_picture?.replace("image/upload/", ""));
    })();
  }, []);

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
  }, [params, post, location.state]);

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
        category: { name: data.category.name },
        subcategory: { name: data.subcategory.name },
        status: "pending",
      });

      setPostSuccessfullyAdded(true);

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
        profile,
        from: location.pathname,
      },
    });
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
          {data && Object.keys(data)?.length > 0 ? (
            <form onSubmit={handleSubmitPost}>
              <CreatePost
                post={data}
                setPost={setData}
                links={links}
                setLinks={setLinks}
              />

              <div className={css.btn_container}>
                {/* <NavLink to="/main/addPost/previewAdvertisemet"> */}
                <button
                  type="button"
                  className={css.btn}
                  onClick={handlePreview}
                >
                  <span className={css.btn_back}> Preview</span>
                </button>
                {/* </NavLink> */}

                <button
                  type="submit"
                  className={`${css.btn} ${css.btn_active}`}
                >
                  <span className={css.btn_back_active}>Publish</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="loader">
              <LoaderSpiner />
            </div>
          )}
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
