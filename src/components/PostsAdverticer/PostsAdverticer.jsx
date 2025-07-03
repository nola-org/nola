import PropTypes from "prop-types";
import { ReactComponent as Icon_Links } from "../../assets/icons/links.svg";
import css from "./PostsAdverticer.module.css";

export const PostsAdverticer = ({ title, description, links, profile_picture }) => {

  return (
    <>
      <div className={css.logo_container}>
        <img src={profile_picture} alt="photo" className={css.logo} />
        <p className={`${css.logo_description} dark:text-white`}>{title}</p>
      </div>

      <p className={`${css.title} dark:text-white`}>{title}</p>

      <p className={`${css.descriptionTest} dark:text-white`}>{description}</p>

      {links?.length > 0 && (
        <p className={`${css.links} dark:text-white`}>Links:</p>
      )}
      <ul>
        {links?.map(({ id, href, action }) =>
          action?.length !== 0 ? (
            <li key={id} className={`${css.links_item}`}>
              {/* <img src="" alt="" className={css.link_img} /> */}
              <Icon_Links /> 
              <a href={href} target="blank" className={`${css.url} dark:text-white`}>
                {action}
              </a>
            </li>
          ) : (
            ""
          )
        )}
      </ul>
    </>
  );
};

PostsAdverticer.propTypes = {
  links: PropTypes.array,
  description: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
  profile_picture: PropTypes.string,
};
