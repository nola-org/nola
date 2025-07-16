import css from "./DraftsPage.module.css";
import addDrafts from "../../assets/icons/add_drafts.svg";
import edit from "../../assets/icons/edit.svg";
import deletePost from "../../assets/icons/deletePost.svg";
import { NavLink, useNavigate, useNavigationType } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deletePostApi,
  getDraftsApi,
  getPostUserApi,
} from "../../services/https/https";
import { ToastError } from "../../services/ToastError/ToastError";
import { Toastify } from "../../services/Toastify/Toastify";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";
import { ToastContainer } from "react-toastify";

const DraftsPage = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getData = (async () => {
      try {
        const dataPublication = await getPostUserApi();

        const res = dataPublication?.data.filter((el) => el.status === "draft");
        setData(res);
      } catch (error) {
        ToastError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (navigationType === "POP") {
      localStorage.removeItem("createPost");
    }
  }, [navigationType]);

  const handleAddPost = () => {
    navigate("/main/addPost");
  };

  const handleEditPost = (idPost) => {
    navigate(`/main/drafts/${idPost}`);
  };

  const handleDeletePost = async (idPost) => {
    try {
      const dataRes = await deletePostApi(idPost);
      setData(data.filter((post) => post.id !== idPost));
      Toastify("Post has been deleted");
    } catch (error) {
      ToastError("Error! Try later");
    }
  };

  return (
    <>
      <ToastContainer />
      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}
      {!loading && (
        <div className={css.drafts_container}>
          <p className={`${css.title} dark:text-white `}>
            Add an advertisement
          </p>
          <div className={css.draftsList_container}>
            <ul className={css.drafts_list}>
              <li
                className={`${css.drafts_item} ${css.drafts_add}`}
                onClick={handleAddPost}
              >
                <img
                  src={addDrafts ?? ""}
                  alt="addDrafts"
                  className={css.drafts_add_img}
                />
              </li>

              {data &&
                data?.map(({ id, banners }) => (
                  <>
                    <div key={id} className={css.drafts_item}>
                      <img
                        src={banners[0] || banners[1] || banners[2]}
                        alt=""
                        className={`${css.drafts_img} ${css.img_back}`}
                      />

                      <p className={css.count}>12 days</p>

                      <div className={css.settingPost_container}>
                        <img
                          src={edit}
                          alt="edit post"
                          className={css.edit}
                          onClick={() => handleEditPost(id)}
                        />
                        <img
                          src={deletePost}
                          alt="delete post"
                          // className={css.edit}
                          onClick={() => handleDeletePost(id)}
                        />
                      </div>
                    </div>
                  </>
                ))}
            </ul>
          </div>

          <p className={`${css.attention} dark:text-white `}>
            Drafts are stored for 14 days. After that, they are permanently
            deleted.
          </p>
        </div>
      )}
    </>
  );
};

export default DraftsPage;
