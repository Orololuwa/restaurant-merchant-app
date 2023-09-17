import { appRoutes } from "core/routes/routes";
import { LocalStorage } from "lib/utils";
import { Navigate } from "react-router-dom";

const IsRestaurantCreatedGuard = ({ children }: { children: JSX.Element }) => {
  const isRestaurantCreated = LocalStorage.get("selectedRestaurant");

  if (!isRestaurantCreated) {
    return <Navigate to={appRoutes.RESTAURANT_CHOOSE} />;
  }

  return children;
};

export default IsRestaurantCreatedGuard;
