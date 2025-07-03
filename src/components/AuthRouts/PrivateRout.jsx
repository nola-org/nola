import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../services/hooks/useAuth";

export const PrivateRoute = ({ component: Component, redirectTo = "/" }) => {
  const { token } = useAuth();
  return !token ? <Navigate to={redirectTo} /> : Component;
};

PrivateRoute.propTypes = {
  component: PropTypes.node,
  redirectTo: PropTypes.node,
};
