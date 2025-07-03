import css from "./Advertiser.module.css";
import PropTypes from "prop-types";
import { useState } from "react";
import { CutString } from "../../components/CutString/CutString";
import { OurLinksList } from "../../components/OurLinksList/OurLinksList";
import { useCustomContext } from "../../services/Context/Context";
import { ReactComponent as Icon_Links } from "../../assets/icons/links.svg";
import image_account from "../../assets/icons/image.svg";

export const Advertiser = ({ data }) => {
  const [cutStr, setCutStr] = useState(true);
  const { theme, setTheme } = useCustomContext();
  const [ourLinksList, setOurLinksList] = useState(false);

  const handleMoreText = (e) => {
    setCutStr((pre) => !pre);
  };

  const handOurLinksList = () => {
    setOurLinksList(true);
  };

  return (
    <>
      {/* {data?.map(({name, textarea}) => ())} */}
      <div className={css.main}>
        <img
          src={
            data?.profile_picture?.replace("image/upload/", "") || image_account
          }
          alt="photo"
          width="72"
          height="72"
          className={css.icon}
        />
        <div className={css.account}>
          <h3 className={css.title}>{data?.first_name}</h3>
          {/* <p className={css.count}>Publication: 108</p> */}
        </div>
      </div>

      <div
        className={theme === "dark" ? css.iconDark : css.footer}
        onClick={handOurLinksList}
      >
        <Icon_Links />

        <p className={theme === "dark" ? css.linksDark : css.links}>Links</p>
      </div>

      {data?.bio && (
        <div className={css.description}>
          {cutStr ? (
            <CutString string={data?.bio || ""} maxLength={150} />
          ) : (
            <p style={{ maxWidth: "90%" }}>{data?.bio || ""}</p>
          )}

          {cutStr ? (
            <button
              type="button"
              onClick={handleMoreText}
              className={theme === "dark" ? css.footerDark_btn : css.footer_btn}
            >
              See more
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleMoreText()}
              className={theme === "dark" ? css.footerDark_btn : css.footer_btn}
            >
              Roll up
            </button>
          )}
        </div>
      )}

      {ourLinksList && (
        <OurLinksList data={data} setOurLinksList={setOurLinksList} />
      )}
    </>
  );
};

Advertiser.propTypes = {
  data: PropTypes.node.isRequired,
};
