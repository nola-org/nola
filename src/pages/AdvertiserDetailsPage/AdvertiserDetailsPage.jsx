import { NavLink, useNavigate, useParams } from "react-router-dom";
import css from "./AdvertiserDetailsPage.module.css";
import { ReactComponent as Icon_Back } from "../../assets/icons/arrow_left.svg";
import { Advertiser } from "../../components/Advertiser/Advertiser";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { useEffect, useRef, useState } from "react";
import { PostsAdverticer } from "../../components/PostsAdverticer/PostsAdverticer";
import {
  getAccountId,
  getPostUserApi,
  getPostUserIdApi,
} from "../../services/https/https";
import { useCustomContext } from "../../services/Context/Context";
import { Banners } from "../../components/Banners/Banners";
import { ToastError } from "../../services/ToastError/ToastError";

const AdvertiserDetailsPage = () => {
  const { advertiserId } = useParams();
  console.log("advertiserId", advertiserId);

  const locationRef = useRef(location.state?.from ?? "/main");
  const navigate = useNavigate();
  const { postsId, setPostsId } = useCustomContext();
  const { theme, setTheme } = useCustomContext();
  const [data, setData] = useState([]);
  const [dataPublication, setDataPublication] = useState([]);
  const [showPost, setShowPost] = useState(false);

  //  useEffect(() => {
  //     http://${advertiserId}
  // }, [])

  useEffect(() => {
    const getData = (async () => {
      try {
        // const data = await getAccountIdApi(advertiserId);
        // const { data } = await getAllPostApi();
        const data = await getAccountId(advertiserId);
        console.log(data);

        setData(data);
      } catch (error) {
        ToastError(error.message);
      }
    })();
  }, [advertiserId]);

  useEffect(() => {
    const getData = (async () => {
      try {
        // const {data} = await getPostUserApi(advertiserId)
        const { data } = await getPostUserIdApi(advertiserId);

        console.log("setDataPublication", data);
        // const res = data.filter((el) =>
        //   // el.status === "pending" ||
        //   el.status === "published")

        setDataPublication(data || []);
      } catch (error) {
        ToastError(error.message);
      }
    })();
  }, [advertiserId]);

  const handleBack = () => {
    setShowPost(false);
  };

  const handleGoBack = () => {
    // if (locationRef.current) return;
    navigate(-1);

    setPostsId(data?.id);
  };

  const handlePost = (id) => {
    setShowPost(dataPublication?.filter((item) => item.id === id));
  };
  console.log("showPost", dataPublication);

  return (
    <div className={css.container}>
      {/* <div onClick={handleGoBack}>
        <GoBackButton
          imgAlt="Go back"
          imgWidth="50px"
          imgHeight="50px"
          title="Friendly Study"
        />
      </div> */}

      <NavLink
        to={locationRef.current}
        onClick={handleGoBack}
        className={`${css.back_container} ${
          theme === "dark" ? css.iconDark : ""
        }`}
      >
        <Icon_Back />
        <p className={`${css.back_text} dark:text-white`}>{data.first_name}</p>
      </NavLink>

      <Advertiser data={data} />

      <p className={css.hero_title}>Publication</p>

      <ul className={css.card}>
        {!showPost &&
          dataPublication?.map(({ id, title, description, banners }) => (
            <li key={id} className={css.post_container}>
              <img
                src={banners[0]}
                alt="banner"
                className={css.img}
                onClick={() => handlePost(id)}
              />
              <h2 className={css.title}>{title}</h2>
            </li>
          ))}
      </ul>

      <ul className={css.list}>
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
                  />

                  <p className={css.return}>Return to the feed</p>
                </div>
                <Banners banner={banners} />
                {/* <img src={banners} alt="" className={css.img} /> */}
                <PostsAdverticer
                  id={id}
                  title={title}
                  description={description}
                  links={links}
                  banner={banners}
                  setShowPost={setShowPost}
                  profile_picture={advertiser?.profile_picture?.replace(
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

export default AdvertiserDetailsPage;
