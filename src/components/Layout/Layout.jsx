/* eslint-disable no-unused-vars */
import { NavLink, Outlet, useLocation } from "react-router-dom";
import css from "./Layout.module.css";
import { useAuth } from "../../services/hooks/useAuth";
import { ReactComponent as Icon_Home } from "../../assets/icons/home.svg";
import { ReactComponent as Icon_Searching } from "../../assets/icons/searching.svg";
import { ReactComponent as Icon_Add } from "../../assets/icons/add_footer.svg";
import { ReactComponent as Icon_Save } from "../../assets/icons/saved_foote.svg";
import { ReactComponent as Icon_Account } from "../../assets/icons/account.svg";
import { useCustomContext } from "../../services/Context/Context";
import { getAccountApi, getDraftsApi } from "../../services/https/https";
import { useEffect, useState } from "react";
import { ToastError } from "../../services/ToastError/ToastError";
import { instance } from "../../services/axios";

const Layout = () => {
  const location = useLocation();
  const { token } = useAuth();
  const { theme, setTheme } = useCustomContext();
  const [profile, setProfile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState(true);

  useEffect(() => {
    const fetchData = (async () => {
      try {
        if (token) {
          instance.defaults.headers.common.Authorization = `Bearer ${token}`;
        }

        const res = await getAccountApi();
        setProfile(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          return;
        } else {
          ToastError(error.message);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const data = await getDraftsApi();
        setDrafts(true);
      } catch (error) {
        ToastError(error?.response?.statusText || error.message);
      }
    })();
  }, []);

  return (
    <div>
      <main className={css.main}>{!loading && <Outlet />}</main>
      {!loading && (
        <footer className={`${css.footer} `}>
          <nav className={`${css.nav} dark:bg-black`}>
            <ul className={css.list}>
              <li className={css.item}>
                <NavLink to="">
                  <div
                    className={`${css.icon} ${
                      theme === "dark"
                        ? css.iconDark
                        : location.pathname === "/main"
                        ? css.iconDarkActive
                        : ""
                    } ${location.pathname === "/main" ? css.iconActive : ""}`}
                  >
                    <Icon_Home />
                  </div>
                </NavLink>
              </li>
              <li className={css.item}>
                <NavLink to="search">
                  <div
                    className={`${css.icon} ${
                      theme === "dark"
                        ? css.iconDark
                        : location.pathname === "/main/search"
                        ? css.iconDarkActiveWidth
                        : ""
                    } ${
                      location.pathname === "/main/search"
                        ? css.iconActiveWidth
                        : ""
                    }`}
                  >
                    <Icon_Searching />
                  </div>
                </NavLink>
              </li>
              <li className={css.item}>
                {!token ? (
                  <NavLink to="registrationCheck">
                    <div
                      className={`${css.icon} ${
                        theme === "dark"
                          ? css.iconDark
                          : location.pathname === "/main/registrationCheck"
                          ? css.iconDarkActiveWidth
                          : ""
                      } ${
                        location.pathname === "/main/registrationCheck"
                          ? css.iconActiveWidth
                          : ""
                      }`}
                    >
                      <Icon_Add />
                    </div>
                  </NavLink>
                ) : !profile.bio > 0 ? (
                  <NavLink to="profileCheckPage">
                    <div
                      className={`${css.icon} ${
                        theme === "dark"
                          ? css.iconDark
                          : location.pathname === "/main/profileCheckPage"
                          ? css.iconDarkActiveWidth
                          : ""
                      } ${
                        location.pathname === "/main/profileCheckPage"
                          ? css.iconActiveWidth
                          : ""
                      }`}
                    >
                      <Icon_Add />
                    </div>
                  </NavLink>
                ) : drafts ? (
                  <NavLink to="/main/drafts">
                    <div
                      className={`${css.icon} ${
                        theme === "dark"
                          ? css.iconDark
                          : location.pathname === "/main/drafts"
                          ? css.iconDarkActiveWidth
                          : ""
                      } ${
                        location.pathname === "/main/drafts"
                          ? css.iconActiveWidth
                          : ""
                      }`}
                    >
                      <Icon_Add />
                    </div>
                  </NavLink>
                ) : (
                  <NavLink to="addPost">
                    <div
                      className={`${css.icon} ${
                        theme === "dark"
                          ? css.iconDark
                          : location.pathname === "/main/drafts"
                          ? css.iconDarkActiveWidth
                          : ""
                      } ${
                        location.pathname === "/main/drafts"
                          ? css.iconActiveWidth
                          : ""
                      }`}
                    >
                      <Icon_Add />
                    </div>
                  </NavLink>
                )}
              </li>

              <li className={css.item}>
                <NavLink to="savedPosts">
                  <div
                    className={`${css.icon} 
                   ${css.icon_save}
                    ${
                      theme === "dark"
                        ? css.iconDark
                        : location.pathname === "/main/savedPosts"
                        ? css.iconDarkActiveWidth
                        : ""
                    } ${
                      location.pathname === "/main/savedPosts"
                        ? css.iconActiveWidth
                        : ""
                    }`}
                  >
                    <Icon_Save />
                  </div>
                </NavLink>
              </li>
              <li className={css.item}>
                <NavLink to="authorization">
                  <div
                    className={`${css.icon} ${
                      theme === "dark"
                        ? css.iconDark
                        : location.pathname === "/main/accountAdverticer" ||
                          location.pathname === "/main/authorization" ||
                          location.pathname ===
                            "/main/authorization/registration"
                        ? css.iconDarkActive
                        : ""
                    } ${
                      location.pathname === "/main/accountAdverticer" ||
                      location.pathname === "/main/authorization" ||
                      location.pathname === "/main/authorization/registration"
                        ? css.iconActive
                        : ""
                    }`}
                  >
                    <Icon_Account />
                  </div>
                </NavLink>
              </li>
            </ul>
          </nav>
        </footer>
      )}
    </div>
  );
};

export default Layout;
