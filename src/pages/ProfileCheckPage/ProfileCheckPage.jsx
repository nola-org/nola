import { NavLink } from "react-router-dom";
import registrationCheck from "../../assets/icons/registrationCheck.svg";
import css from "./ProfileCheckPage.module.css";

const ProfyleCheckPage = () => {
  return (
    <div>
      <p className={`${css.title} dark:text-white`}>Add an advertisement</p>
      <div className={css.registrationCheck_container}>
        <img src={registrationCheck} alt="registrationCheck" />
        <p className={`${css.description} dark:text-white`}>
          Unfortunately, at the moment you can`t post your ads
        </p>

        <p className={css.authorizationCheck}>
          Please complete your
          <NavLink
            to="/main/accountAdverticer/adverticerEdit"
            className={css.authorizationLinks}
          >
            <span className={`dark:text-white`}> profile </span>
          </NavLink>
          <span className={`dark:text-white`}>to start posting ads.</span>
        </p>
      </div>
    </div>
  );
};

export default ProfyleCheckPage;
