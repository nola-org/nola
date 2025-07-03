import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import css from "./PreviewAdvertisemetPage.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { PostsAdverticer } from "../../components/PostsAdverticer/PostsAdverticer";
import { MessagePostOnModeration } from "../../components/MessagePostOnModeration/MessagePostOnModeration";
import { Banners } from "../../components/Banners/Banners";
import { ToastError } from "../../services/ToastError/ToastError";
import { ToastContainer } from "react-toastify";
import { patchPostApi } from "../../services/https/https";

const PreviewAdvertisemetPage = ({ setPreview }) => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [validForm, setValidForm] = useState(false);
  const [preview, sePreview] = useState(() => {
    // return JSON.parse(localStorage.getItem("previewPost")) || "";
    return state.post || state.data || [];
  });

  const [postSuccessfullyAdded, setPostSuccessfullyAdded] = useState(false);

  useEffect(() => {
    if (
      preview?.title !== "" &&
      preview?.category?.name !== "" &&
      preview?.subcategory?.name !== ""
    ) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [preview?.category?.name, preview?.subcategory?.name, preview?.title]);

  const handleConfirmClick = async () => {
    try {
      const res = await patchPostApi(preview.id, {
        ...preview,
        status: "pending",
      });
      setPostSuccessfullyAdded(true);
      // localStorage.removeItem("previewPost");
      localStorage.removeItem("filterCategory");

      setTimeout(() => {
        navigate("/main");
      }, 3000);
    } catch (error) {
      ToastError(error.message || "Try again later.");
    }
  };

  const handleBack = () => {
    navigate(`${state.from}`, { state: preview || [] });
  };

  return (
    <>
      <ToastContainer />
      {postSuccessfullyAdded && (
        <MessagePostOnModeration>
          Advertisement is under moderation. <br />
          It will take about 15 minutes.
        </MessagePostOnModeration>
      )}
      {!postSuccessfullyAdded && (
        <>
          <div className={css.preview_container}>
            <div className={css.previewMain}>
              <p className={css.title}>Advertisement preview</p>

              {preview &&
                [preview]?.map(({ banners }) => (
                  <>
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={30}
                      loop={true}
                      pagination={{ el: ".swiper-pagination", clickable: true }}
                      navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                        clickable: true,
                      }}
                      modules={[EffectCoverflow, Pagination, Navigation]}
                      className={css.swiper_container}
                    >
                      {banners[0] && (
                        <SwiperSlide
                          style={{
                            width: "80%",
                          }}
                          className={css.swiper_slide}
                        >
                          {console.log(banners)}
                          <img src={banners[0]} alt="" className={css.img} />
                        </SwiperSlide>
                      )}

                      {banners[1] && (
                        <SwiperSlide
                          style={{
                            width: "80%",
                          }}
                          className={css.swiper_slide}
                        >
                          {console.log(banners)}
                          <img src={banners[1]} alt="" className={css.img} />
                        </SwiperSlide>
                      )}

                      {banners[2] && (
                        <SwiperSlide
                          style={{
                            width: "80%",
                          }}
                          className={css.swiper_slide}
                        >
                          {console.log(banners)}
                          <img src={banners[2]} alt="" className={css.img} />
                        </SwiperSlide>
                      )}

                      <div className="slider-controler">
                        <div
                          className="swiper-button-prev slider-arrow"
                          style={{ color: "transparent" }}
                        ></div>
                        <div
                          className="swiper-button-next slider-arrow"
                          style={{ color: "transparent" }}
                        ></div>

                        <div
                          className="swiper-pagination"
                          style={{
                            position: "relative",
                            bottom: "2px",
                          }}
                        ></div>
                      </div>
                    </Swiper>
                    {[preview]?.map(({ title, description, links }) => (
                      <>
                        <PostsAdverticer
                          title={title}
                          description={description}
                          links={links}
                          profile_picture={preview.advertiser.profile_picture?.replace(
                            "image/upload/",
                            ""
                          )}
                        />
                      </>
                    ))}
                  </>
                ))}
            </div>
          </div>

          <div className={css.btn_container}>
            <button
              type="button"
              className={`${css.btn_back_container}`}
              onClick={handleBack}
            >
              <span
                className={`${css.btn_back} dark:text-white dark:border-white`}
              >
                Back to editing
              </span>
            </button>

            <button
              type="button"
              className={`${css.btn} ${
                validForm ? css.btn_active : css.btn_disabled
              }`}
              disabled={validForm ? false : true}
              onClick={handleConfirmClick}
            >
              <span className={css.btn_back_active}>Publish</span>
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default PreviewAdvertisemetPage;

PreviewAdvertisemetPage.propTypes = {
  post: PropTypes.object,
  setPreview: PropTypes.bool,
};
