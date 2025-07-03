import PropTypes from "prop-types";
import css from "./AddPostLinks.module.css";
import add from "../../assets/icons/addBaner.svg";
import deleteLink from "../../assets/icons/deleteLink.svg";

export const AddPostLinks = ({
  links,
  onLinkChange,
  onLinkAdd,
  onLinkDelete,
}) => {
  const el = links?.find((item) => item.id === links[links.length - 1].id);

  return (
    <>
      {links &&
        links?.map(({ id, href, action }) => (
          <div key={id} className={css.links_container}>
            <div className={css.list}>
              <input
                value={href}
                placeholder="href"
                className={`${css.item}   dark:bg-black dark:border-white dark:text-white`}
                onChange={(e) => onLinkChange(id, e.target.value, action)}
              />
            </div>
            <div className={css.list_name}>
              <input
                value={action}
                onChange={(e) => onLinkChange(id, href, e.target.value)}
                placeholder="action"
                className={`${css.item}  ${css.item_name} dark:bg-black dark:border-white dark:text-white`}
              />
            </div>

            {el.id === id ? (
              <img
                src={add}
                alt="add link"
                className={css.img}
                onClick={onLinkAdd}
              />
            ) : (
              <img
                src={deleteLink}
                alt="delete link"
                className={css.img}
                onClick={() => onLinkDelete(id)}
              />
            )}
          </div>
        ))}
    </>
  );
};

AddPostLinks.propTypes = {
  links: PropTypes.array,
  onLinkChange: PropTypes.func,
  onLinkAdd: PropTypes.func,
  onLinkDelete: PropTypes.func,
  setLinks: PropTypes.func,
  post: PropTypes.any,
};
