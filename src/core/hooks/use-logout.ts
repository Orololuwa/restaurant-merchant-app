import { useNavigate } from "react-router-dom";
import { logOut } from "store/action-creators/auth.actions";
import { useAppDispatch } from "./use-redux";
import { LocalStorage } from "lib/utils";
import { resetARestaurant } from "store/action-creators/restaurant.action";

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logOut(navigate));
    dispatch(resetARestaurant());
    LocalStorage.remove("selectedRestaurant");
  };

  return { logoutHandler };
};
