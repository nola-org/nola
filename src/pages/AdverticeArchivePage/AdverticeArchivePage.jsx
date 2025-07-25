import { useEffect, useState } from "react";
import { Modal } from "../../components/Modal/Modal";
import { Toastify } from "../../services/Toastify/Toastify";
import { ToastContainer } from "react-toastify";
import { PostsAdverticer } from "../../components/PostsAdverticer/PostsAdverticer";

import css from "./AdverticeArchivePage.module.css";
import { PostsAdverticerMenu } from "../../components/PostsAdverticerMenu/PostsAdverticerMenu";
import {
  deletePostApi,
  getAccountApi,
  getAllPostApi,
  getPostUserApi,
  patchPostApi,
} from "../../services/https/https";
import { ToastError } from "../../services/ToastError/ToastError";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import back from "../../assets/images/back.jpg";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";
import { Link, NavLink } from "react-router-dom";
import { useCustomContext } from "../../services/Context/Context";

import { ReactComponent as Icon_Edit_Post } from "../../assets/icons/edit_post.svg";
import relaunchPost from "../../assets/icons/relaunch_post.svg";
import deletePost from "../../assets/icons/delete_post.svg";
import { Banners } from "../../components/Banners/Banners";

const AdverticeArchivePage = () => {
  const { theme, setTheme } = useCustomContext();
  const [post, setPost] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [menuList, setMenuList] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [isActive, setIsActive] = useState({
    recovere: false,
    deleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [postActiveId, setPostActiveId] = useState("");
  const [isPostActive, setIsPostActive] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getData = (async () => {
      try {
        const dataPublication = await getPostUserApi();

        const res = dataPublication?.data.filter(
          (el) => el.status === "archived"
        );
        setPost(res);
      } catch (error) {
        ToastError(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBack = () => {
    setShowPost(false);
  };

  const handleToggleModal = (message) => {
    setIsModal((prev) => !prev);
    setMenuList(false);
    setIsMessage(message);
    setIsActive({
      recovere: false,
      deleted: false,
    });
  };

  const handleDeletePostMessage = () => {
    handleToggleModal("Are you sure you want to delete?");
    setIsActive({ recovere: false, deleted: true });
  };

  const handleRecoverePostMessage = () => {
    handleToggleModal("Are you sure you want to relaunch the post?");
    setIsActive({ recovere: true, deleted: false });
  };

  const handleDeletePost = async (id) => {
    console.log("handleDeletePost", id);

    try {
      handleToggleModal();
      const data = await deletePostApi(id);

      Toastify("Archived post has been deleted");
      setPost(post.filter((post) => post.id !== id));
    } catch (error) {
      ToastError("Error! Try later");
    }
  };

  const handleRecoverePost = async (id) => {
    const [recoverePost] = post.filter((item) => item.id === id);

    try {
      handleToggleModal();
      const data = await patchPostApi(id, {
        ...recoverePost,
        status: "pending",
      });
      setIsPostActive((prev) => [...prev, id]);
      Toastify("Archived post has been recovered");
    } catch (error) {
      ToastError(error.message || "Try again later.");
    }
  };

  const postMenuActive = (id) => {
    setMenuActive((prev) => !prev);
    setPostActiveId(id);
  };

  const handlePost = (id) => {
    setShowPost(post.filter((item) => item.id === id));
  };

  return (
    <div>
      <ToastContainer />
      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}
      <ul className={css.card}>
        {!showPost &&
          post.length > 0 &&
          post?.map(({ id, title, description, banners, status }) => (
            <li
              key={id}
              className={`${css.post_container} 
                ${isPostActive.includes(id) ? css.postActive : ""}
              `}
            >
              <img
                src={banners[0] || banners[1] || banners[2]}
                alt=""
                className={css.img}
                onClick={() => handlePost(id)}
              />
              <h2 className={css.title}>{title}</h2>

              <PostsAdverticerMenu
                postMenuActive={postMenuActive}
                id={id}
                menuList={menuList}
                setMenuList={setMenuList}
                isModal={isModal}
              >
                <ul className={css.list}>
                  <li>
                    <NavLink
                      to={`/main/editPost/${id}`}
                      className={`${css.item}  ${
                        theme === "dark" ? css.iconDark : ""
                      }`}
                    >
                      <Icon_Edit_Post />
                      <span className={`${css.list_title} dark:text-white`}>
                        Edit the post
                      </span>
                    </NavLink>
                  </li>

                  <li className={css.item} onClick={handleRecoverePostMessage}>
                    <img src={relaunchPost} alt="relaunch post" />
                    <p className={css.list_title}>Relaunch the post</p>
                  </li>

                  <li className={css.item} onClick={handleDeletePostMessage}>
                    <img src={deletePost} alt="delete post" />
                    <p className={css.list_title}>Delete</p>
                  </li>
                </ul>
              </PostsAdverticerMenu>
            </li>
          ))}
      </ul>
      {isModal && (
        <Modal handleToggleModal={handleToggleModal} childrenEl="true">
          {isActive.recovere && (
            <>
              <p className={css.modal_title}>{isMessage}</p>
              <button
                type="button"
                className={css.modal_btn}
                onClick={() => handleRecoverePost(postActiveId)}
              >
                Confirm
              </button>
            </>
          )}

          {isActive.deleted && (
            <>
              <p className={css.modal_title}>{isMessage}</p>
              <button
                type="button"
                className={css.modal_btn}
                onClick={() => handleDeletePost(postActiveId)}
              >
                Confirm
              </button>
            </>
          )}

          <p
            className={`${css.modal_text} dark:text-white`}
            onClick={handleToggleModal}
          >
            Cancel
          </p>
        </Modal>
      )}
      <ul className={css.list}>
        {showPost &&
          showPost?.map(({ id, title, description, banners, links }) => (
            <li key={id}>
              <div className={css.top_container}>
                <GoBackButton
                  imgSrc={back}
                  imgAlt="Go back"
                  imgWidth="50px"
                  imgHeight="50px"
                  onClick={handleBack}
                />

                <p className={css.return}>Return to the feed</p>
              </div>
              <Banners banner={banners} />
              <PostsAdverticer
                id={id}
                title={title}
                description={description}
                links={links}
                banner={banners}
                setShowPost={setShowPost}
              />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default AdverticeArchivePage;
