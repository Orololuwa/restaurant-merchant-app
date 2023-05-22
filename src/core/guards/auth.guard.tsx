import { useAppSelector } from "core/hooks/use-redux";
import { appRoutes } from "core/routes/routes";
import { ExpirySession, tokenKey } from "lib/utils";
import { useLocation, Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const [isLoggedIn] = useAppSelector((state) => [state.auth.isLoggedIn]);
  ExpirySession.get(tokenKey);

  if (!isLoggedIn) {
    return (
      <Navigate to={appRoutes.SIGN_IN} state={{ from: location }} replace />
    );
  }

  return children;
};

export default AuthGuard;
