import css from "./AccountAdverticerPage.module.css";
import { ReactComponent as Icon_Settings } from "../../assets/icons/settings.svg";
import { ReactComponent as Icon_Edit } from "../../assets/icons/edit_account.svg";

import { NavLink, Outlet, useNavigationType } from "react-router-dom";
import { ScrollBar } from "../../components/ScrollBar/ScrollBar";
import { useEffect, useState } from "react";
import { getAccountApi } from "../../services/https/https";
import { Advertiser } from "../../components/Advertiser/Advertiser";
import { useCustomContext } from "../../services/Context/Context";

const AccountAdverticerPage = () => {
  const { theme, setTheme } = useCustomContext();
  // const navigationType = useNavigationType();
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = (async () => {
      const { data } = await getAccountApi();

      setData(data);
    })();
  }, []);

  useEffect(() => {
    localStorage.removeItem("pathname");
  }, []);

  // useEffect(() => {
  //   if (navigationType === "POP") {
  //     localStorage.removeItem("createPost");
  //   }
  // }, [navigationType]);

  const handleSetting = () => {
    localStorage.setItem("pathname", "/main/setting");
  };

  return (
    <div>
      <div className={css.nav}>
        <NavLink
          // to="/main/settingAdverticer"
          to="/setting"
          className={theme === "dark" ? css.iconDark : css.icon}
          onClick={handleSetting}
        >
          <Icon_Settings />
        </NavLink>

        <p className={css.title}>{data.first_name}</p>

        <NavLink
          to="adverticerEdit"
          className={theme === "dark" ? css.iconDark : css.icon}
        >
          <Icon_Edit />
        </NavLink>
      </div>

      <Advertiser data={data} />

      <ScrollBar
        labelOne="Active"
        pathnameOne="/main/accountAdverticer"
        labelTwo={`Archived`}
        pathnameTwo="/main/accountAdverticer/adverticerArchive"
      />

      <Outlet />
    </div>
  );
};

export default AccountAdverticerPage;
