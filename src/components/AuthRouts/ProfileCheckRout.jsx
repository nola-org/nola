import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { fetchProfile } from "../../redux/profileSlice";
import { ToastError } from "../../services/ToastError/ToastError";
import { useAuth } from "../../services/hooks/useAuth";

export const ProfileCheckRout = ({
  component: Component,
  redirectTo = "/",
}) => {

  const { token } = useAuth();
  const profile = useSelector(state => state.profile.data);
  const profileStatus = useSelector(state => state.profile.status);
  const profileError = useSelector(state => state.profile.error);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (token && profileStatus === 'idle') {
      dispatch(fetchProfile());
    }
  }, [token, profileStatus, dispatch]);

  useEffect(() => {
    if (profileError) {
      ToastError(profileError);
    }
  }, [profileError]);

  const loading = token && profileStatus === 'loading';

  return !profile?.bio?.length ? <Navigate to={redirectTo} /> : Component;
};

ProfileCheckRout.propTypes = {
  component: PropTypes.node,
  redirectTo: PropTypes.node,
};
