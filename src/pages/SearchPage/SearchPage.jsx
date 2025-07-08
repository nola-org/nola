import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import css from "./SearchPage.module.css";
import { useEffect, useState } from "react";
import { getCategories } from "../../services/https/https";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import searchIcon from "../../assets/images/search.jpg";
import { ReactComponent as Icon_Searching } from "../../assets/icons/searching.svg";
import { useCustomContext } from "../../services/Context/Context";
import { ToastError } from "../../services/ToastError/ToastError";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

const SearchPage = () => {
  const { theme, setTheme } = useCustomContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [quwery, setQuwery] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const search = searchParams.get("search");

  useEffect(() => {
    const getData = (async () => {
      try {
        const data = await getCategories();
        setData(data.results);
      } catch (error) {
        ToastError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (quwery.trim()) {
      setSearchPerformed(true);
    } else {
      setSearchPerformed(false);
    }
  }, [quwery]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleChangeSearch = ({ target }) => {
    setSearchParams({ search: target.value });
    setQuwery(target.value);
  };

  const searchData = data.filter(({ name }) =>
    name.toLowerCase().trim().includes(quwery.toLowerCase().trim())
  );

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
      <form>
        <div className={css.input_container}>
          <label>
            <input
              type="text"
              value={search || ""}
              // placeholder="Searching"
              onChange={handleChangeSearch}
              className={`${css.input}  dark:bg-black dark:border-white dark:text-white`}
            />
          </label>

          <div
            className={`${css.search_icon} ${
              theme === "dark" ? css.iconDark : ""
            }`}
          >
            <Icon_Searching />
          </div>
        </div>
      </form>
      <h2 className={`${css.title} dark:text-white`}>Categories</h2>

      {loading && (
        <div className="loader">
          <LoaderSpiner />
        </div>
      )}

      {searchData.length > 0 ? (
        <ul className={css.list}>
          {searchData.map((el) => (
            <li key={el.id} className={css.item}>
              <NavLink to={`categories/${el.id}`} state={location}>
                <img src={searchIcon} alt="search icon" className={css.img} />
                <p className={css.description}>{el.name}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      ) : (
        searchPerformed && (
          <div className={css.container}>
            <p className={`${css.noResults} dark:text-white`}>
              No results found for your query.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
