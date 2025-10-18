import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchProfile } from "../../redux/profileSlice";
import { ToastError } from "../../services/ToastError/ToastError";
import { useAuth } from "../../services/hooks/useAuth";
import { getAccountApi } from "../../services/https/https";
import { useState } from "react";
import { logOutThunk } from "../../redux/auth/authThunk";
import { LoaderSpiner } from "../../services/loaderSpinner/LoaderSpinner";

export const ProfileCheckRout = ({
  component: Component,
  redirectTo = "/",
}) => {

  const { token } = useAuth();
  // const profile = useSelector(state => state.profile.data);
  // const profileStatus = useSelector(state => state.profile.status);
  // const profileError = useSelector(state => state.profile.error);
  const dispatch = useDispatch();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
  
  // useEffect(() => {
  //   if (token && profileStatus === 'idle') {
  //     dispatch(fetchProfile());
  //   }
  // }, [token, profileStatus, dispatch]);

  // useEffect(() => {
  //   if (profileError) {
  //     ToastError(profileError);
  //   }
  // }, [profileError]);

  // const loading = token && profileStatus === 'loading';
  useEffect(() => {
       if (!token) {
        dispatch(logOutThunk());
         return;
       }
    
      const fetchData = (async () => {
        try {

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
    }, [token]);
  
  if (loading) return (
    <div className="loader">
            <LoaderSpiner />
    </div>
  );
  
  return !profile?.bio?.length ? <Navigate to={redirectTo} /> : Component;
};

ProfileCheckRout.propTypes = {
  component: PropTypes.node,
  redirectTo: PropTypes.node,
};
