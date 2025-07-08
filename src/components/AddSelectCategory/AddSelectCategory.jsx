import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Select from "react-select";
import css from "./AddSelectCategory.module.css";
import { useCustomContext } from "../../services/Context/Context";
import { getCategories } from "../../services/https/https";

export const AddSelectCategory = ({ setPost, post }) => {
  const { theme } = useCustomContext();

  const [categories, setCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [disabledSelect, setDisabledSelect] = useState(true);

  useEffect(() => {
    (async () => {
      const fetchedCategories = await getCategories(); // [{ id, name, subcategories: [] }]
      const formatted = fetchedCategories.results.map((cat) => ({
        ...cat,
        label: cat.name,
        value: cat.id,
        subcategories: cat.subcategories.map((sub) => ({
          ...sub,
          label: sub.name,
          value: sub.id,
        })),
      }));
      setCategories(formatted);
    })();
  }, []);


  useEffect(() => {
    if (post?.category?.id) {
      const selected = categories.find((cat) => cat.id === post.category.id);
      if (selected) {
        setFilteredSubcategories(selected.subcategories);
        setDisabledSelect(false);
      }
    }
  }, [post?.category?.id, post?.category?.name, categories]);

  const handleSelectCategoryPost = async (option) => {
    setPost((prev) => ({
      ...prev,
      category: {
        id: option.id,
        name: option.name,
      },
      subcategory: { id: "", name: "" },
    }));
    setFilteredSubcategories(option.subcategories || []);
    setDisabledSelect(false);
  };
  console.log(post);
  const handleSelectSubcategoryPost = (option) => {
    setPost((prev) => ({
      ...prev,
      subcategory: {
        id: option.id,
        name: option.name,
      },
    }));
  };

  const themeSelect = (theme) => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary25: "transparent",
      primary: "#ECCD43",
    },
  });

  const selectedCategoryOption =
    categories.find((cat) => cat.id === post?.category?.id) || null;
  const selectedSubcategoryOption =
    filteredSubcategories.find((sub) => sub.id === post?.subcategory?.id) ||
    null;

  return (
    <>
      <label className={`${css.post_description} dark:text-white`}>
        Category*
        {theme === "dark" ? (
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                padding: "8px 24px",
                backgroundColor: "rgb(30 28 28)",
              }),
              menuList: (styles) => ({
                ...styles,
                backgroundColor: "rgb(137 132 132)",
                color: "white",
              }),
            }}
            theme={themeSelect}
            onChange={handleSelectCategoryPost}
            value={selectedCategoryOption}
            options={categories}
          />
        ) : (
          <Select
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                padding: "8px 24px",
              }),
            }}
            theme={themeSelect}
            onChange={handleSelectCategoryPost}
            value={selectedCategoryOption}
            options={categories}
          />
        )}
      </label>
      <label className={`${css.post_description} dark:text-white`}>
        Subcategory*
        {theme === "dark" ? (
          <Select
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                padding: "8px 24px",
                backgroundColor: !state.isDisabled ? "" : "#363232",
              }),
              menuList: (styles) => ({
                ...styles,
                backgroundColor: "rgb(137 132 132)",
                color: "white",
              }),
            }}
            theme={themeSelect}
            onChange={handleSelectSubcategoryPost}
            isDisabled={disabledSelect}
            value={selectedSubcategoryOption}
            options={filteredSubcategories}
          />
        ) : (
          <Select
            styles={{
              control: (baseStyles, state) => ({
                padding: "8px 24px",
                backgroundColor: !state.isDisabled ? "" : "#e4e1e1",
                ...baseStyles,
              }),
            }}
            theme={themeSelect}
            onChange={handleSelectSubcategoryPost}
            isDisabled={disabledSelect}
            value={selectedSubcategoryOption}
            options={filteredSubcategories}
          />
        )}
      </label>
    </>
  );
};

AddSelectCategory.propTypes = {
  setPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
