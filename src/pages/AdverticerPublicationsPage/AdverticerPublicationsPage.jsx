import { useEffect, useRef, useState } from "react";
import {
  getAccountApi,
  getPostUserApi,
  patchPostApi,
} from "../../services/https/https";
import { useCustomContext } from "../../services/Context/Context";
import { Link, NavLink } from "react-router-dom";
import { Modal } from "../../components/Modal/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toastify } from "../../services/Toastify/Toastify";
import { PostsAdverticer } from "../../components/PostsAdverticer/PostsAdverticer";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import back from "../../assets/images/back.jpg";
import css from "./AdverticerPublicationsPage.module.css";
import { PostsAdverticerMenu } from "../../components/PostsAdverticerMenu/PostsAdverticerMenu";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

import editPost from "../../assets/icons/edit_post.svg";
import pausePost from "../../assets/icons/pause_post.svg";
import relaunchPost from "../../assets/icons/relaunch_post.svg";
import archivePost from "../../assets/icons/archive_post.svg";
import { ReactComponent as Icon_Edit_Post } from "../../assets/icons/edit_post.svg";
import { Banners } from "../../components/Banners/Banners";
import { ToastError } from "../../services/ToastError/ToastError";

const AdverticerPublicationsPage = () => {
  const { theme, setTheme } = useCustomContext();
  const [post, setPost] = useState([]);
  const [menuList, setMenuList] = useState(false);

  const [deletePost, setDeletePost] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [isActive, setIsActive] = useState({
    archived: false,
    stopped: false,
    deleted: false,
    launchAgain: false,
  });
  const [menuActive, setMenuActive] = useState(false);

  const [isPostStopped, setIsPostStopped] = useState("");

  const [showPost, setShowPost] = useState(false);
  const [postActiveId, setPostActiveId] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     (async () => {
  //       console.log(post[0]);
  //       // return{
  //       //   ...post[0],
  //       //   status: "pending"
  //       // }

  //        const res = await patchPostApi(4, {
  //         ...post[0],
  //         status: "pending"
  //       })
  //         console.log("data MessagePostOnModeration", res);

  // })()
  //   }, [post])

  useEffect(() => {
    setLoading(true);
    const getData = (async () => {
      try {
        const { data } = await getAccountApi();
        const dataPublication = await getPostUserApi();

        const res = dataPublication?.data.filter(
          (el) => el.status === "pending" || el.status === "published"
        );

        setPost(res);
      } catch (error) {
        console.log(error);
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
      archived: false,
      stopped: false,
      deleted: false,
      launchAgain: false,
    });
  };

  const handlePostArchivationMessage = () => {
    handleToggleModal("Are you sure you want to archive the post?");
    setIsActive({
      archived: true,
      stopped: false,
      deleted: false,
      launchAgain: false,
    });
  };

  const handlePostStoppingMessage = () => {
    handleToggleModal("Are you sure you want to pause the post?");
    setIsActive({
      archived: false,
      stopped: true,
      deleted: false,
      launchAgain: false,
    });
  };

  const handlePostLaunchAgainMessage = () => {
    handleToggleModal("Are you sure you want to relaunch the post?");
    setIsActive({
      archived: false,
      stopped: false,
      deleted: false,
      launchAgain: true,
    });
  };

  const handlePostArchivation = (id) => {
    console.log("handlePostArchivation", id);

    setPost(post.filter((item) => item.id !== id));
    handleToggleModal();
    Toastify("Curent post has been archived!");
  };

  const handlePostStopping = async (id) => {
    const [stoppedPost] = post.filter((item) => item.id === id);
    // setPost(post.filter((item) => item.id === id));

    try {
      handleToggleModal();
      const data = await patchPostApi(id, {
        ...stoppedPost,
        status: "archived",
      });
      setIsActive({
        archived: false,
        stopped: true,
        deleted: false,
        launchAgain: false,
      });
      setIsPostStopped(id);
      // setIsPostStopped(true);
      Toastify("Current post stopping!");
    } catch (error) {
      ToastError(error.message || "Try again later.");
    }
  };

  const handlePostLaunchAgain = (id) => {
    console.log("handlePostLaunchAgain", id);

    // setPost(post.filter((item) => item.id === id));
    handleToggleModal();
    // setIsPostStopped(false);
    setIsPostStopped("");
    Toastify("Post has been launched");
  };
  const postMenuActive = (id) => {
    console.log("postMenuActive", id);
    setMenuActive((prev) => !prev);
    setPostActiveId(id);
  };

  const handlePost = (id) => {
    setShowPost(post.filter((item) => item.id === id));
  };

  return (
    <div className={css.container}>
      <ToastContainer />
      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}
      <ul className={css.card}>
        {!showPost &&
          post?.length > 0 &&
          post.status !== "archived" &&
          post?.map(({ id, title, description, banners, status }) => (
            <li
              key={id}
              className={`${css.post_container} ${
                isPostStopped === id ? css.stoppedPost : ""
              }`}
            >
              <img
                src={banners[0]}
                alt=""
                className={`${css.img}  
                 ${status === "pending" && css.imgOnModeration}
                  `}
                onClick={() => handlePost(id)}
              />
              <h2 className={css.title}>{title}</h2>

              {status === "pending" && (
                <div className={status === "pending" && css.postOnModeration}>
                  <p>Post pending moderation</p>
                </div>
              )}

              <PostsAdverticerMenu
                id={id}
                postMenuActive={postMenuActive}
                menuList={menuList}
                setMenuList={setMenuList}
                isModal={isModal}
                status={status}
              >
                <ul className={css.list}>
                  <li
                    className={`${css.item}  ${
                      theme === "dark" ? css.iconDark : ""
                    }`}
                  >
                    <NavLink to={`/main/editPost/${postActiveId}`}>
                      <Icon_Edit_Post />
                      {/* <img src={editPost} alt="edit post" /> */}
                      <span className={`${css.list_title} dark:text-white`}>
                        Edit the post
                      </span>
                    </NavLink>
                  </li>

                  {!isActive.stopped ? (
                    <li
                      className={`${css.item} `}
                      onClick={handlePostStoppingMessage}
                    >
                      <img src={pausePost} alt="pause post" />
                      <p className={css.list_title}>Pause the post</p>
                    </li>
                  ) : (
                    <li
                      className={css.item}
                      onClick={handlePostLaunchAgainMessage}
                    >
                      <img src={relaunchPost} alt="relaunch post" />
                      <p className={css.list_title}>Relaunch the post</p>
                    </li>
                  )}

                  {/* <li
                    className={css.item}
                    onClick={handlePostArchivationMessage}
                  >
                    <img src={archivePost} alt="archive post" />
                    <p className={css.list_title}>Archive the post</p>
                  </li> */}
                </ul>
              </PostsAdverticerMenu>
            </li>
          ))}

        {isModal && (
          <Modal handleToggleModal={handleToggleModal} childrenEl="true">
            {isActive.archived && (
              <>
                <p className={css.modal_title}>{isMessage}</p>
                <button
                  type="button"
                  className={css.modal_btn}
                  onClick={() => handlePostArchivation(postActiveId)}
                >
                  Confirm
                </button>
              </>
            )}

            {isActive.stopped && (
              <>
                <p className={css.modal_title}>{isMessage}</p>
                <button
                  type="button"
                  className={css.modal_btn}
                  onClick={() => handlePostStopping(postActiveId)}
                >
                  Confirm
                </button>
              </>
            )}

            {isActive.launchAgain && (
              <>
                <p className={css.modal_title}>{isMessage}</p>
                <button
                  type="button"
                  className={css.modal_btn}
                  onClick={() => handlePostLaunchAgain(postActiveId)}
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
      </ul>

      <ul>
        {showPost &&
          showPost?.map(
            ({ id, title, description, banners, links, advertiser }) => (
              <li key={id}>
                <div className={css.top_container}>
                  <GoBackButton
                    imgAlt="Go back"
                    imgWidth="50px"
                    imgHeight="50px"
                    onClick={handleBack}
                    // title="Return to the feed"
                  />

                  <p className={css.return}>Return to the feed</p>
                </div>
                {/* <img src={banners[0]} alt="" className={css.img} /> */}
                <Banners banner={banners} />
                <PostsAdverticer
                  data={post}
                  id={id}
                  title={title}
                  description={description}
                  links={links}
                  banner={banners}
                  setShowPost={setShowPost}
                  profile_picture={advertiser.profile_picture?.replace(
                    "image/upload/",
                    ""
                  )}
                />
              </li>
            )
          )}
      </ul>
    </div>
  );
};

export default AdverticerPublicationsPage;
