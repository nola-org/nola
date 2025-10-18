import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLoginThunk } from "../../redux/auth/googleLoginThunk";
import axios from "axios";

const TokenCatcherRedirect = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error


useEffect(() => {
  const hashToken = new URLSearchParams(location.hash.slice(1)).get("token");

  const handleLogin = async () => {
    if (!hashToken) {
      setStatus("error");
      navigate("/main/authorization", { replace: true });
      return;
    }

    try {
      const res = await axios.post(
        "https://nola-spot-python-1.onrender.com/api/auth/refresh-cookie/",
        { access: hashToken },
        {
          withCredentials: true,
        }
      );


      await dispatch(googleLoginThunk(hashToken)).unwrap();

      setStatus("success");

      navigate("/main/accountAdverticer/adverticerEdit", { replace: true });
    } catch (error) {
      setStatus("error");
      navigate("/main/authorization", { replace: true });
    }
  };

  handleLogin();
}, [location, dispatch, navigate]);

  // useEffect(() => {
  //   const hashToken = new URLSearchParams(location.hash.slice(1)).get("token");


  //   if (hashToken) {
  //     dispatch(googleLoginThunk(hashToken))
  //       .unwrap()
  //       .then(() => {
  //         setStatus("success");
  //         // Чистим hash и переходим
  //       //   window.history.replaceState(null, "", location.pathname);
  //         navigate("/main/accountAdverticer/adverticerEdit", { replace: true });
  //       })
  //       .catch(() => {
  //         setStatus("error");
  //         navigate("/main/authorization", { replace: true });
  //       });
  //   } else {
  //     setStatus("error");
  //     navigate("/main/authorization", { replace: true });
  //   }
  // }, [location, dispatch, navigate]);

  return (
    <div>
      {status === "loading" && <p>⏳ Авторизация...</p>}
      {status === "error" && <p>❌ Ошибка авторизации</p>}
    </div>
  );
};

export default TokenCatcherRedirect;