import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import css from "./SearchCategoriesPage.module.css";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { useEffect, useState } from "react";
import { getCategoriesId, getSubCategories } from "../../services/https/https";
import { ToastError } from "../../services/ToastError/ToastError";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

const SearchCategoriesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = (async () => {
      try {
        const data = await getCategoriesId(id);
        setData(data);
      } catch (error) {
        ToastError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <div className={css.top_container} onClick={handleBack}>
        <GoBackButton
          to=""
          imgWidth="50px"
          imgHeight="50px"
          imgAlt="Go back"
          title="Searching"
        />
      </div>

      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}

      <h1 className={css.title}>{data?.name}</h1>

      <ul className={css.list}>
        {data &&
          data?.subcategories?.map(({ name, id }) => (
            <li key={id} className={css.item}>
              <NavLink to={`searchEngineResults/${id}`} state={location}>
                <img src="" alt="" className={css.img} />
                <p className={css.descr}>{name}</p>
              </NavLink>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SearchCategoriesPage;
