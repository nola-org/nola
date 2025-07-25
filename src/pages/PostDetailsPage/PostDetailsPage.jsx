import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import css from "./PostDetailsPage.module.css";
import { ReactComponent as Icon_Back } from "../../assets/icons/arrow_left.svg";
import { ReactComponent as Save_Icon } from "../../assets/icons/save.svg";
import { useEffect, useRef, useState } from "react";
import { getPostIdApi } from "../../services/https/https";
import { ToastError } from "../../services/ToastError/ToastError";
import { ToastContainer } from "react-toastify";
import { useCustomContext } from "../../services/Context/Context";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";
import { PostsAdverticer } from "../../components/PostsAdverticer/PostsAdverticer";
import { Toastify } from "../../services/Toastify/Toastify";
import { Banners } from "../../components/Banners/Banners";
import { useSavePost } from "../../services/hooks/useSavePost";

const LOKAL_KEY = "savedPost";

const PostDetailsPage = () => {
  const { theme, setTheme } = useCustomContext();
  const { isSaved, toggleSave } = useSavePost();
  const location = useLocation();
  const locationRef = useRef(location.state?.from ?? "/main");
  const navigate = useNavigate();
  const { postsId, setPostsId } = useCustomContext();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = (async () => {
      try {
        const { data } = await getPostIdApi(postId);

        setPost(data);
      } catch (error) {
        ToastError("Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  const handleBack = () => {
    setPostsId(post?.id);
    
    if (window.history.length > 5) {    
    navigate(-1); 
    } else {
    navigate('/main'); 
  }
};


  // useEffect(() => {
  //   setPostsId(post?.id);
  // }, [post?.id, setPostsId]);

  // const handleSavePostClick = (savedId) => {
  //   if (savedPostId.includes(post.id)) {
  //     const deletePost = savedPost.filter((post) => post.id !== savedId);

  //     const deletePostId = savedPostId.filter((el) => el !== savedId);

  //     setSavedPost(deletePost);

  //     setSavedPostId(deletePostId);

  //     ToastError("Post has been deleted");
  //     return;
  //   }
  //   setSavedPostId((prev) => {
  //     if (prev.includes(savedId)) {
  //       return prev.filter((postId) => postId !== savedId);
  //     } else {
  //       localStorage.setItem("savedPostId", JSON.stringify([...prev, savedId]));
  //       setSavedPost((prev) => [...prev, post]);
  //       Toastify("Post successfully saved");
  //       return [...prev, savedId];
  //     }
  //   });
  // };

  const handleSaveToggle = () => {
    toggleSave(post);
    // if (isSaved(post.id)) {
    //   ToastError("Post has been deleted");
    // }
  };

  return (
    <div>
      <ToastContainer />

      <div className={css.top_container}>
        <NavLink
          to={locationRef.current}
          onClick={handleBack}
          className={`${css.back_arrow} ${
            theme === "dark" ? css.iconDark : ""
          }`}
        >
          <Icon_Back />
        </NavLink>
        <p className={css.return}>{post?.title}</p>
      </div>

      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}

      {post && (
        <div key={post.id} className={css.post_container}>
          <Banners banner={post.banners} />

          <button
            type="button"
            // onClick={() => handleSavePostClick(post.id)}
            onClick={handleSaveToggle}
            className={css.save_btn}
          >
            {!isSaved(post.id) ? (
              <div className={theme === "dark" ? css.iconDark : ""}>
                <Save_Icon />
              </div>
            ) : (
              <div
                className={theme === "dark" ? css.iconSaveDark : css.iconSave}
              >
                <Save_Icon />
              </div>
            )}
          </button>

          <PostsAdverticer
            title={post.title}
            description={post.description}
            links={post.links}
            profile_picture={post?.advertiser?.profile_picture?.replace(
              "image/upload/",
              ""
            )}
          />
        </div>
      )}
    </div>
  );
};

export default PostDetailsPage;
