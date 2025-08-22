import css from "./MainPage.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../services/hooks/useAuth";
import { Toastify } from "../../services/Toastify/Toastify";
import { ToastError } from "../../services/ToastError/ToastError";
import { ToastContainer } from "react-toastify";
import { Posts } from "../../components/Posts/Posts";
import {
  getAllPostApi,
  getSavePostApi,
  postSavePostApi,
} from "../../services/https/https";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";
import { useCustomContext } from "../../services/Context/Context";
import { useSavePost } from "../../services/hooks/useSavePost";
import { useParams } from "react-router-dom";

const LOKAL_KEY = "savedPost";

export const MainPage = () => {
  const { theme } = useCustomContext();
  const { token } = useParams();
  
  const { postsId, setPostsId } = useCustomContext();

  const [isScrollTop, setIsScrollTop] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isSaved, toggleSave } = useSavePost();

  console.log("token", token);
  // Скролл-хедер
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      setIsScrollTop(scrollTop < lastScrollTop);
      setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const { data: resp } = await getAllPostApi();
        setData(resp.results);
      } catch {
        ToastError("Error! Try later");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={css.main_container}>
      <ToastContainer />

      <div
        className={`${css.logo_container} ${
          theme === "dark" ? css.iconDark : ""
        } ${isScrollTop ? css.logo_container_active : ""} ${
          isScrollTop && theme === "dark" ? css.logo_container_active_dark : ""
        }`}
      >
        <p className={css.logo}>NOLA</p>
      </div>

      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}

      <ul>
        {data &&
          data?.map((post) => (
            <Posts
              key={post.id}
              post={post}
              handleSavePost={() => toggleSave(post)}
              savedPost={isSaved(post.id)}
              elementId={postsId}
            />
          ))}
      </ul>
    </div>
  );
};

// export const MainPage = () => {
//   const { token } = useAuth();
//   const { theme } = useCustomContext();
//   const [isScrollTop, setIsScrollTop] = useState(true);
//   const [lastScrollTop, setLastScrollTop] = useState(0);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { isSaved, toggleSave } = useSavePost();

//     useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = document.documentElement.scrollTop;

//       if (scrollTop < lastScrollTop) {
//         setIsScrollTop(true);
//       } else {
//         setIsScrollTop(false);
//       }
//       setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [lastScrollTop]);

//   useEffect(() => {
//     setLoading(true);
//     const fetchData = (async () => {
//       try {
//         const { data } = await getAllPostApi();

//         setData(data.results);
//         setLoading(false);
//       } catch (error) {
//         setLoading(false);
//         ToastError("Error! Try later");
//       }
//     })();
//   }, []);

//   return (
//     <div className={css.main_container}>
//             <ToastContainer />

//       <div
//         className={`${css.logo_container} ${
//           theme === "dark" ? css.iconDark : ""
//         } ${isScrollTop ? css.logo_container_active : ""} ${
//           isScrollTop && theme === "dark" ? css.logo_container_active_dark : ""
//         }`}
//       >
//         <p className={css.logo}>NOLA</p>
//       </div>
//       {loading && (
//         <div className="loader">
//           <LoaderSpiner />
//         </div>
//       )}
//           <ul>
//       {data &&
//         data?.map(({ id, title, banners, callToAction, advertiser }) => (
//           <Posts
//             key={id}
//             data={data}
//             url={banners}
//             title={title}
//             callToAction={callToAction}
//             advertiser={advertiser}
//             id={id}
//             handleSavePost={() => toggleSave(data)}
//             savedPost={isSaved(id)}
//           />
//         ))}
//     </ul>
//       {/* <ul>
//         {data && data?.map((post) => (
//           <Posts
//             key={post.id}
//             data={post}
//             banners={post.banners}
//             title={post.title}
//             callToAction={post.callToAction}
//             advertiser={post.advertiser}
//             id={post.id}
//             handleSavePost={() => toggleSave(post.id)}
//             savedPost={isSaved(post.id)}
//           />
//         ))}
//       </ul> */}
//     </div>
//   );
// };

// const MainPage = () => {
//   const { token } = useAuth();
//   const { theme, setTheme } = useCustomContext();
//   const [isScrollTop, setIsScrollTop] = useState(true);
//   const [lastScrollTop, setLastScrollTop] = useState(0);
//   const [posts, setPost] = useState(() => {
//     return JSON.parse(localStorage.getItem(LOKAL_KEY)) ?? [];
//   });

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [savedPostId, setSavedPostId] = useState(() => {
//     return JSON.parse(localStorage.getItem("savedPostId")) ?? [];
//   });

//   useEffect(() => {
//     setLoading(true);
//     const fetchData = (async () => {
//       try {
//         const { data } = await getAllPostApi();

//         setData(data.results);
//         setLoading(false);
//       } catch (error) {
//         setLoading(false);
//         ToastError("Error! Try later");
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     return localStorage.setItem(LOKAL_KEY, JSON.stringify(posts));
//   }, [posts]);

//   useEffect(() => {
//     localStorage.setItem("savedPostId", JSON.stringify(savedPostId));
//   }, [savedPostId]);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = document.documentElement.scrollTop;

//       if (scrollTop < lastScrollTop) {
//         setIsScrollTop(true);
//       } else {
//         setIsScrollTop(false);
//       }
//       setLastScrollTop(scrollTop <= 0 ? 0 : scrollTop);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [lastScrollTop]);

//   const handleSavePost = async (savedId) => {
//     const savedPost = data.filter(({ id }) => id === savedId);
//     const savedValid = posts?.find((post) => post.id === savedId);

//     if (token) {
//       try {
//         if (!savedValid) {
//           setSavedPostId(async (prev) => {
//             if (prev.includes(savedId) && !savedValid) {
//               return prev.filter((postId) => postId !== savedId);
//             } else {
//               localStorage.setItem(
//                 "savedPostId",
//                 JSON.stringify([...prev, savedId])
//               );

//               const dataRes = await postSavePostApi(savedId, ...savedPost);
//             }
//           });
//           try {
//             const dataRes = await getSavePostApi();
//             console.log("dataRes", dataRes);

//             setPost(dataRes);
//             return;
//           } catch (error) {
//             ToastError(error.message);
//           }
//         }
//       } catch (error) {
//         ToastError(error.message);
//       }
//       return;
//     } else if (!savedValid) {
//       setSavedPostId((prev) => {
//         if (prev.includes(savedId) && !savedValid) {
//           return prev.filter((postId) => postId !== savedId);
//         } else {
//           localStorage.setItem(
//             "savedPostId",
//             JSON.stringify([...prev, savedId])
//           );
//           return [...prev, savedId];
//         }
//       });
//     }

//     if (posts) {
//       // const savedValid = posts.find((post) => post.id === savedId);

//       if (savedValid) {
//         const deletePost = posts.filter((post) => post.id !== savedValid.id);

//         const deletePostId = savedPostId.filter((el) => el !== savedValid.id);

//         setPost(deletePost);

//         setSavedPostId(deletePostId);
//         ToastError("Post has been deleted");
//         return;
//       }
//       Toastify("Post successfully saved");
//     }

//     setPost((prev) => [...prev, ...savedPost]);
//   };

//   // useEffect(() => {
//   //   localStorage.removeItem("pathname");
//   // }, []);

//   // const handleSetting = () => {
//   //   localStorage.setItem("pathname", "/main");
//   // };

//   return (
//     <div className={css.main_container}>
//       <ToastContainer />
//       {/* <NavLink
//         // to="setting"
//         to="/setting"
//       >
//         <button type="button" onClick={handleSetting}>
//           Setting
//         </button>
//       </NavLink> */}

//       <div
//         className={`${css.logo_container} ${
//           theme === "dark" ? css.iconDark : ""
//         } ${isScrollTop ? css.logo_container_active : ""} ${
//           isScrollTop && theme === "dark" ? css.logo_container_active_dark : ""
//         }`}
//       >
//         <p className={css.logo}>NOLA</p>
//       </div>
//       {loading && (
//         <div className="loader">
//           <LoaderSpiner />
//         </div>
//       )}
//       <ul>
//         {data &&
//           data?.map(({ id, title, banners, callToAction, advertiser }) => (
//             <Posts
//               key={id}
//               data={data}
//               url={banners}
//               title={title}
//               callToAction={callToAction}
//               advertiser={advertiser}
//               id={id}
//               handleSavePost={handleSavePost}
//               savedPost={savedPostId}
//             />
//           ))}
//       </ul>
//     </div>
//   );
// };

export default MainPage;
