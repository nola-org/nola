import css from "./SearchEngineResultsPage.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import {
  getAllPostApi,
  getPostsByCategoryId,
  getSubCategoriesId,
} from "../../services/https/https";
import { useParams } from "react-router-dom";
import { useSavePost } from "../../services/hooks/useSavePost";
import { Posts } from "../../components/Posts/Posts";
import { ToastError } from "../../services/ToastError/ToastError";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

const SearchEngineResultsPage = () => {
  const [data, setData] = useState([]);
  const { searchId } = useParams();
  const { isSaved, toggleSave } = useSavePost();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = (async () => {
      try {
        const { data } = await getAllPostApi();
        const filtered = data.results.filter(
          (post) => post.subcategory.id.toString() === searchId
        );
        setData(filtered);
      } catch (error) {
        ToastError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchId]);

  return (
    <div>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
          clickable: true,
        }}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className={css.swiper_container}
      >
        {[...Array(6)].map((slide, idx) => (
          <SwiperSlide
            key={idx}
            style={{
              width: "80%",
            }}
            className={css.swiper_slide}
          >
            <img src={slide} alt="" className={css.img} />
          </SwiperSlide>
        ))}
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

      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}
      {!loading &&
        <ul className={css.list}>
          {data &&
            data?.map((post) => (
              <>
                <Posts
                  key={post.id}
                  post={post}
                  handleSavePost={() => toggleSave(post)}
                  savedPost={isSaved(post.id)}
                />
              </>
            ))}
        </ul>}
   
       {data?.length === 0 && !loading &&(
        <div className={css.container}>
          <p className={`${css.noResults} dark:text-white`}>
            No results found for your query.
          </p>
        </div>
        )
      }
 
    </div>
  );
};

export default SearchEngineResultsPage;
