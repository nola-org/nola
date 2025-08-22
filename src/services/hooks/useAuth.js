import { useSelector } from 'react-redux'
import {  selectIsRefreshing, selectIsToken, selectIsLoggedIn } from "../../redux/auth/authSelector"

// export const useAuth = () => {
//     return {
//     isRefreshing: useSelector(selectIsRefreshing),
//     token: useSelector(selectIsToken)
//   }
// }

export const useAuth = () => {
  return {
    token: useSelector(selectIsToken),
    isLoggedIn: useSelector(selectIsLoggedIn),
    isRefreshing: useSelector(selectIsRefreshing),
  };
};