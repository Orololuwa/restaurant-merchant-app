import { useToast } from "@chakra-ui/react";
import { Loading } from "core/components/loading";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import { appRoutes } from "core/routes/routes";
import { LocalStorage } from "lib/utils";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getARestaurant } from "store/action-creators/restaurant.action";

const SetupCompleteGuard = ({ children }: { children: JSX.Element }) => {
  const data = useAppSelector((state) => state.restaurant.restaurant);
  const restaurantId = LocalStorage.get("selectedRestaurant");
  const toast = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data.error)
      toast({
        status: "error",
        description: data.error,
        position: "top",
      });
  }, [data.error]);

  const setupComplete = data?.data?.setupComplete;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.data || !restaurantId) {
      setLoading(false);
      return;
    }

    (async () => {
      await dispatch(getARestaurant(restaurantId));
      setLoading(false);
    })();
  }, [data]);

  console.log({ loading, setupComplete, "data.loading": data.loading, data });

  if (data.loading || loading) return <Loading />;

  if (!setupComplete) {
    return <Navigate to={appRoutes.RESTAURANT_SETUP} />;
  }

  return children;
};

export default SetupCompleteGuard;
