import { useState } from "react";
import css from "./LoadingPage.module.css";
import WelcomePage from "../WelcomePage/WelcomePage";
import logo from "../../assets/images/nola-no-one-likes-advertisement-typography-1-Photoroom.png"

const LoadingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  setTimeout(() => {
    setIsLoading(false);
  }, 1500
  );

  return (
    <div>
      {isLoading ? (
        <div className={css.container}>
          <img src={logo} alt="logo" className={css.logo} />
        </div>
      ) : (
        <WelcomePage />
      )}
    </div>
  );
};

export default LoadingPage;
