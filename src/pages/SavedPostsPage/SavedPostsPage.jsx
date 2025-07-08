import { NavLink, useLocation } from "react-router-dom";
import css from "./SavedPostsPage.module.css";
import { ReactComponent as Save_Icon } from "../../assets/icons/saved_icon.svg";
import { useEffect, useState } from "react";
import { Toastify } from "../../services/Toastify/Toastify";
import { ToastContainer } from "react-toastify";
import { Modal } from "../../components/Modal/Modal";
import { useCustomContext } from "../../services/Context/Context";
import {
  deleteSavePostApi,
  getSavePostApi,
  postSavePostApi,
  postUnsavePostApi,
} from "../../services/https/https";
import { ToastError } from "../../services/ToastError/ToastError";
import { useAuth } from "../../services/hooks/useAuth";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";
import { useSavePost } from "../../services/hooks/useSavePost";

const LOKAL_KEY = "savedPost";

export const SavedPostsPage = () => {
  const { token } = useAuth();
  const { theme } = useCustomContext();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalPostId, setModalPostId] = useState(null);

  const { savedPosts, isSaved, toggleSave } = useSavePost();

  useEffect(() => {
    if (token) {
      setLoading(true);
      getSavePostApi()
        .then((data) => setPosts(data))
        .catch(() => ToastError("Error loading saved posts"))
        .finally(() => setLoading(false));
      return;
    } else {
      setPosts(savedPosts);
      setLoading(false);
    }
  }, [token, savedPosts]);

  const handleConfirmDelete = (postId) => {
    toggleSave({ id: postId });

    setPosts((prev) => prev.filter((p) => p.id !== postId));

    // Toastify("Post has been deleted");
    setModalPostId(null);
  };

  return (
    <div>
      <ToastContainer />
      <h1 className={css.title}>My saved</h1>
      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}
      {posts.length > 0 ? (
        <ul className={css.list}>
          {posts.map((post) => (
            <li key={post.id} className={css.item}>
              <NavLink to={`/main/${post.id}`}>
                <img
                  src={post.banners[0] || post.banners[1] || post.banners[2]}
                  alt=""
                  className={css.img}
                />
              </NavLink>
              <div className={css.item_footer}>
                <NavLink to={`/${post.advertiser.id}`}>
                  <p className={`${css.item_description} dark:text-white`}>
                    {post.title}
                  </p>
                </NavLink>
                <button
                  type="button"
                  className={`${css.item_btn} ${
                    theme === "dark" ? css.iconDark : ""
                  }`}
                  onClick={() => setModalPostId(post.id)}
                >
                  <Save_Icon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={css.container}>
          <h2 className={`${css.title_empty} dark:text-white`}>
            This list is empty
          </h2>
          <p className={`${css.description} dark:text-white`}>
            Add something you’ve liked from the main page
          </p>
        </div>
      )}

      {modalPostId && (
        <Modal
          title="Are you sure you want to delete?"
          confirm={() => handleConfirmDelete(modalPostId)}
          cancel={() => setModalPostId(null)}
        />
      )}
    </div>
  );
};

// const SavedPostsPage = () => {
//    const { token } = useAuth();
//   const location = useLocation();
//   const { theme, setTheme } = useCustomContext();
//   const [isModal, setIsModal] = useState(false);
//   const [isDeletePost, setDeletePost] = useState("");
//   const [posts, setPosts] = useState(() => {
//     return JSON.parse(localStorage.getItem(LOKAL_KEY));
//   });
//   const [savedPostId, setSavedPostId] = useState(() => {
//     return JSON.parse(localStorage.getItem("savedPostId")) ?? [];
//   });
//   const [loading, setLoading] = useState(() =>
//   { posts.length >= 0 && false }
//   );

//   useEffect(() => {
//     (async () => {
//       setLoading(true)
//       if (token) {

//         try {
//           const dataRes = await getSavePostApi()
//           setPosts(dataRes);

//         } catch (error) {
//          ToastError(error.message)
//         } finally {
//           setLoading(false)
//         }
//         return
// }

//  })()
//   }, [token])

//   const handleToggleModal = (message) => {
//     setDeletePost(message);
//     setIsModal((prev) => !prev);
//   };

//   const handleDeletePost = async (postId) => {
//     const savedPost = posts.filter((post) => post.id !== postId);

//     const deleteostId = posts.filter((post) => post.id === postId);
//     const [deleteId] = deleteostId.map(({ id }) => id);
//     const deletePostId = savedPostId.filter((el) => el !== deleteId);

//     setPosts(savedPost);
//     setSavedPostId(deletePostId);

//     if (token) {
//       try {
// handleToggleModal();
//         const dataRes = await postSavePostApi(deleteId)
//         console.log(dataRes);

//       } catch (error) {
//         handleToggleModal();
//        ToastError(error.message)
//       }
//       return
//     }

//     localStorage.setItem("savedPostId", JSON.stringify(deletePostId));
//     localStorage.setItem(LOKAL_KEY, JSON.stringify(savedPost));

//     Toastify("Post has been deleted");
//     handleToggleModal();
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <h1 className={css.title}>My saved</h1>

//       {loading && (
//         <div className="loader">
//           <LoaderSpiner />
//         </div>
//       )}

//       {posts?.length > 0 ? (
//         <ul className={css.list}>
//           {posts.map((post) => (
//             <li key={post.id} className={css.item}>
//               <NavLink to={`/main/${post.id}`} state={{ from: location }}>
//                 <img src={post.banners[0]} alt="" className={css.img} />
//               </NavLink>
//               <div className={css.item_footer}>
//                 <NavLink to="/:advertiserId" className={css.item_footer}>
//                   <div>
//                     <img src="" alt="" className={css.logo_icon} />
//                   </div>

//                   <p className={`${css.item_description} dark:text-white`}>
//                     {post.title}
//                   </p>
//                 </NavLink>
//                 <button
//                   type="button"
//                   className={`${css.item_btn} ${
//                     theme === "dark" ? css.iconDark : ""
//                   }`}
//                   onClick={
//                     () => handleToggleModal(post.id)
//                     // onClick={() => handleDeletePost(post.id)
//                   }
//                 >
//                   <Save_Icon />
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <div className={css.container}>
//           <h2 className={`${css.title_empty} dark:text-white`}>
//             This list is empty
//           </h2>
//           <p className={`${css.description} dark:text-white`}>
//             Add something you`ve liked from the main page
//           </p>
//         </div>
//       )}

//       {isModal && (
//         <Modal
//           handleToggleModal={handleToggleModal}
//           title="Are you sure you want to delete?"
//           confirm={() => handleDeletePost(isDeletePost)}
//           cancel={handleToggleModal}
//         />
//       )}
//     </div>
//   );
// };

export default SavedPostsPage;
