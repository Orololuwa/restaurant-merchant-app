import { useToast } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "core/hooks/use-redux";
import { appRoutes } from "core/routes/routes";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "store/action-creators/auth.actions";

const SetupCompleteGuard = ({ children }: { children: JSX.Element }) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getProfile());
  }, []);

  const data = useAppSelector((state) => state.auth.profile);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.error)
      toast({
        status: "error",
        description: data.error,
        position: "top",
      });
  }, [data.error]);

  const setupComplete = data.data?.setupComplete;

  if (!setupComplete) {
    navigate(appRoutes.RESTAURANT_SETUP);
  }

  return children;
};

export default SetupCompleteGuard;
