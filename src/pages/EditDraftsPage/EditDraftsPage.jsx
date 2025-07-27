import { useEffect, useState } from "react";
import {
  getAccountApi,
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
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

const EditDraftsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const [isModal, setIsModal] = useState(false);
  const [postSuccessfullyAdded, setPostSuccessfullyAdded] = useState(false);
  const [validForm, setValidForm] = useState(false);
  const [data, setData] = useState([]);
  const [profile, setProfile] = useState({});
  const [links, setLinks] = useState(() => {
    return location?.state?.links || [{ id: nanoid(), url: "", name: "" }];
  });
  const [post, setPost] = useState(() => {
    return (
      {
        // id: nanoid(),
        description: "",
        title: "",
        category: { name: "" },
        subcategory: { name: "" },
        callToAction: "" || "Read more",
        callToActionLinks: "",
        banners: [],
      }
    );
  });
  

  useEffect(() => {
    const getData = (async () => {
      try {
        if (location.state) {
          setData(location.state);
          setPost(location.state);
          setLinks(
            location?.state?.links?.length > 0
              ? location?.state?.links
              : [{ id: nanoid(), url: "", name: "" }]
          );
          return;
        }

        const data = await getDraftsPostId(params.editDraftsId);

        if (data.status === 200) {
          setData(data.data);
          setPost(data.data);
          data?.data?.links?.map(({ href, action }) => {
            if (href?.length === 0 || action?.length === 0) {
              setLinks([{ id: nanoid(), url: "", name: "" }]);
              return;
            } else if (location.state) {
              setLinks(
                location?.state?.links?.length > 0
                  ? location?.state?.links
                  : [{ id: nanoid(), url: "", name: "" }]
              );
              return;
            } else {
              setLinks(data?.data?.links);
            }
          });
          return;
        }

        if (data?.status === 403) {
          ToastError(data?.response?.data?.detail || "Try again later.");
          setTimeout(() => {
            navigate("/main");
          }, 3000);

          return;
        }

        throw new Error(
          data?.data?.detail || data?.message || "Try again later."
        );
      } catch (error) {
        ToastError(
          error?.response?.statusText || error.message || "Try again later."
        );
      }
    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await getAccountApi();
      setProfile(data.profile_picture?.replace("image/upload/", ""));
    })();
  }, []);

  const handleToggleModal = () => {
    setIsModal((prev) => !prev);
  };

  const handleBack = () => {
    setIsModal((prev) => !prev);
  };

  const cancelAddPost = () => {
    navigate("/main");
    setIsModal((prev) => !prev);
    // localStorage.removeItem("createPost");
  };

  const createPostDrafts = async () => {
    try {
      setIsModal((prev) => !prev);
      const dataRes = await patchPostApi(params.editDraftsId, {
        category: { name: data.category.name },
        subcategory: { name: data.subcategory.name },
        ...data,
        status: "draft",
      });

      navigate("/main");
      // localStorage.removeItem("createPost");
    } catch (error) {
      ToastError(error.message);
    }
  };

  useEffect(() => {
    if (
      data?.title !== "" &&
      data?.category?.name !== "" &&
      data?.subcategory?.name !== ""
    ) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [data?.category, data?.subcategory, data?.title, data]);

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      const dataRes = await patchPostApi(params.editDraftsId, {
        ...data,
        category: { name: data.category.name },
        subcategory: { name: data.subcategory.name },
        status: "pending",
      });

      setPostSuccessfullyAdded(true);

      setTimeout(() => {
        navigate("/main");
      }, 3000);
      // localStorage.removeItem("createPost");
    } catch (error) {
      ToastError(error?.response?.statusText || error.message);
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

          {data && Object.keys(data)?.length > 0 ? (
            <form onSubmit={handleSubmitPost}>
              <>
                <CreatePost
                  post={data}
                  setPost={setData}
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
              </>
            </form>
          ) : (
            <div className="loader">
              <LoaderSpiner />
            </div>
          )}
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

// const EditDraftsPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const params = useParams();

//   const [isModal, setIsModal] = useState(false);
//   const [postSuccessfullyAdded, setPostSuccessfullyAdded] = useState(false);
//   const [validForm, setValidForm] = useState(false);
//   // const [data, setData] = useState([]);

//   const [links, setLinks] = useState(() => {
//     return (
//       location?.state?.links || [{ id: nanoid(), url: "", name: "" }]
//     );
//   });
//   const [data, setData] = useState(
//     () => {
//       return (
//         {
//           id: nanoid(),
//           title: "",
//           description: "",
//           category: { id: "", name: "" },
//           subcategory: { id: "", name: "" },
//           callToAction: "Read more",
//           callToActionLinks: "",
//           banners: [],
//           // links: [{ id: nanoid(), href: "", action: "" }],
//         }
//       );
//     }
//   );

//   useEffect(() => {
//     const getData = (async () => {
//       try {
//         if (location.state) {
//           console.log("location.state", location.state);

//           setData(location.state);
//           setLinks(location?.state?.links?.length > 0 ? location?.state?.links : [{ id: nanoid(), url: "", name: "" }]);
//           return;
//         }

//         const data = await getDraftsPostId(params.editDraftsId);
//         console.log(data.links);

//         setData(data);

//          data?.links?.map(({ href, action }) => {
//           if (href?.length === 0 || action?.length === 0) {
//             setLinks([{ id: nanoid(), url: "", name: "" }]);
//             return;
//           } else if (location.state) {
//             setLinks(location?.state?.links?.length > 0 ? location?.state?.links : [{ id: nanoid(), url: "", name: "" }])
//             return
//           }else
//           {
//             setLinks(data.links);
//           }
//         });
//       } catch (error) {
//         ToastError(error?.response?.statusText || error.message);
//       }
//     })();
//     // eslint-disable-next-line
//   }, []);

//   const handleToggleModal = () => {
//     setIsModal((prev) => !prev);
//   };

//   const handleBack = () => {
//     console.log(isModal);
//     setIsModal((prev) => !prev);
//   };

//   const cancelAddPost = () => {
//     navigate("/main");
//     setIsModal((prev) => !prev);
//   };

//   const createPostDrafts = async () => {
//     try {
//       setIsModal((prev) => !prev);
//       const dataRes = await patchPostApi(params.editDraftsId, {
//         ...data,
//         status: "draft",
//       });

//       navigate("/main");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (
//       data?.title !== "" &&
//       data?.category?.name !== "" &&
//       data?.subcategory?.name !== ""
//     ) {
//       setValidForm(true);
//     } else {
//       setValidForm(false);
//     }
//   }, [data?.category, data?.subcategory, data?.title, data]);

//   const handleSubmitPost = async (e) => {
//     e.preventDefault();
//     console.log("EditDrafts", {
//         ...data,

//       });
//     try {
//       const dataRes = await patchPostApi(params.editDraftsId, {
//         ...data,
//         status: "pending",
//       });

//       setPostSuccessfullyAdded(true);

//       setTimeout(() => {
//         navigate("/main");
//       }, 3000);
//     } catch (error) {
//       ToastError(error?.response?.statusText || error.message);
//     }
//   };

//   const handlePreview = () => {
//      navigate("/main/addPost/previewAdvertisemet", {
//       state: {
//         data,
//         from: location.pathname,
//       },
//     });
//   };

//   return (
//     <>
//       <ToastContainer />
//       <p>EditDraftsPage</p>
//       {!postSuccessfullyAdded && (
//         <>
//           <div className={css.top_container} onClick={handleBack}>
//             <GoBackButton
//               to=""
//               imgWidth="50px"
//               imgHeight="50px"
//               imgAlt="Go back"
//             />
//             <p className={`${css.title_back} dark:text-white`}>
//               New advertisement
//             </p>
//           </div>

//           <form onSubmit={handleSubmitPost}>

//               <>
//                   <CreatePost
//                     post={data}
//                     setPost={setData}
//                     links={links}
//                     setLinks={setLinks}
//                   />

//                 <div className={css.btn_container}>
//                     <button
//                     type="button"
//                     className={css.btn_preview_container}
//                     onClick={handlePreview}
//                   >
//                     <span className={`${css.btn_preview} dark:text-white`}>
//                       Preview
//                     </span>
//                   </button>

//                   <button
//                     type="submit"
//                     className={`${css.btn} ${
//                       validForm ? css.btn_active : css.btn_disabled
//                     }`}
//                     disabled={validForm ? false : true}
//                   >
//                     <span className={css.btn_back_active}>Publish</span>
//                   </button>
//                 </div>
//               </>
//            </form>
//         </>
//       )}
//       {isModal && (
//         <Modal
//           handleToggleModal={handleToggleModal}
//           confirm={createPostDrafts}
//           cancel={cancelAddPost}
//           title="Save a draft?"
//           description="You can come back to edit later."
//         ></Modal>
//       )}
//       {postSuccessfullyAdded && (
//         <MessagePostOnModeration>
//           Advertisement is under moderation. <br />
//           It will take about 15 minutes.
//         </MessagePostOnModeration>
//       )}
//     </>
//   );
// };

export default EditDraftsPage;
