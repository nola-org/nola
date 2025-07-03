import PropTypes from "prop-types";
import css from "./PostsAdverticerMenu.module.css";

export const PostsAdverticerMenu = ({
  id,
  postMenuActive,
  children,
  isModal = false,
  menuList,
  setMenuList,
  status,
}) => {
  const handleOpenBackdrop = () => {
    setMenuList(true);
  };

  const handleCloseBackdrop = (e) => {
    const { target, currentTarget } = e;

    if (target === currentTarget) {
      setMenuList(false);
    }
  };

  return (
    <div className={css.test}>
      <div className={css.post_menu} onClick={() => postMenuActive(id)}>
        <p>213</p>
        <p>7</p>
        <button
          onClick={handleOpenBackdrop}
          className={css.more_menu}
          disabled={status === "pending"}
        >
          ***
        </button>
      </div>

      {menuList && !isModal && (
        <div className={css.backdrop} onClick={handleCloseBackdrop}>
          <div className={`${css.container} dark:bg-darkGray`}>{children}</div>
        </div>
      )}
    </div>
  );
};

PostsAdverticerMenu.propTypes = {
  id: PropTypes.string,
  postMenuActive: PropTypes.func,
  children: PropTypes.node,
  isModal: PropTypes.bool,
  menuList: PropTypes.bool,
  setMenuList: PropTypes.func,
  status: PropTypes.string,
};
