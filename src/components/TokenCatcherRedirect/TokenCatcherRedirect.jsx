import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { googleLoginThunk } from "../../redux/auth/googleLoginThunk";

const TokenCatcherRedirect = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    const hashToken = new URLSearchParams(location.hash.slice(1)).get("token");

    console.log("location.hash:", location.hash);
    console.log("token из hash:", hashToken);

    if (hashToken) {
      dispatch(googleLoginThunk(hashToken))
        .unwrap()
        .then(() => {
          setStatus("success");
          // Чистим hash и переходим
        //   window.history.replaceState(null, "", location.pathname);
          navigate("/main/accountAdverticer/adverticerEdit", { replace: true });
        })
        .catch(() => {
          setStatus("error");
          navigate("/main/authorization", { replace: true });
        });
    } else {
      setStatus("error");
      navigate("/main/authorization", { replace: true });
    }
  }, [location, dispatch, navigate]);

  return (
    <div>
      {status === "loading" && <p>⏳ Авторизация...</p>}
      {status === "error" && <p>❌ Ошибка авторизации</p>}
    </div>
  );
};

export default TokenCatcherRedirect;