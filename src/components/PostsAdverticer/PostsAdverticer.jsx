import PropTypes from "prop-types";
import { ReactComponent as Icon_Links } from "../../assets/icons/links.svg";
import css from "./PostsAdverticer.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { useCustomContext } from "../../services/Context/Context";

export const PostsAdverticer = ({
  title,
  description,
  links,
  profile_picture,
  profileId,
  openInfo,
}) => {
  const { theme, setTheme } = useCustomContext();

  return (
    <>
      <div className={`${css.logo_container} ${openInfo && css.openInfo}`}>
        <NavLink to={`/${profileId}`} className={css.account_link}>
          <img src={profile_picture} alt="photo" className={css.logo} />

          <p className={`${css.logo_description} dark:text-white`}>{title}</p>
        </NavLink>
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
              <div className={`${theme === "dark" && css.iconDark}`}>
                <Icon_Links />
              </div>
              <a
                href={href}
                target="blank"
                className={`${css.url} dark:text-white`}
              >
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
  profileId: PropTypes.number,
  links: PropTypes.array,
  description: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
  profile_picture: PropTypes.string,
  openInfo: PropTypes.bool,
};
