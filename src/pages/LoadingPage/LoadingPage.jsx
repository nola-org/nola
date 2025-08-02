import { useState } from "react";
import css from "./LoadingPage.module.css";
import WelcomePage from "../WelcomePage/WelcomePage";
import logo2 from "../../assets/images/nola-no-one-likes-advertisement-typography-1-Photoroom.png"
import logo from "../../assets/images/nola.webp"
import logo3 from "../../assets/images/nola-no-one-likes-advertisement-typography-1-Photoroom.jpg"
import logo4 from "../../assets/images/nola-no-one-likes-advertisement-typography-1.jpeg"
import logo5 from "../../assets/images/nola-no.svg"
import logo6 from "../../assets/images/nola-logo.jpeg"

const LoadingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  // setTimeout(() => {
  //   setIsLoading(false);
  // }, 6000
  //   // 1500
  // );

  return (
    <div>
      {isLoading ? (
        <div className={css.container}>
        <div className={css.test}><p> webp <img src={logo} alt="logo" className={css.logo} /></p></div>
          <div className={css.test}> <p>  png   <img src={logo2} alt="logo" className={css.logo} /></p></div>
          {/* <div className={css.test}> <p>  jpeg   <img src={logo6} alt="logo" className={css.logo} /></p></div> */}
          {/* <div className={css.test}> <p>  svg   <img src={logo5} alt="logo" className={css.logo}/></p></div> */}
        </div>
      ) : (
        <WelcomePage />
      )}
    </div>
  );
};

export default LoadingPage;
