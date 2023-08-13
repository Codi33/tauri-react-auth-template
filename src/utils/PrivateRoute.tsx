import { useIsAuthenticated } from "react-auth-kit";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
  let IsAuthenticated = useIsAuthenticated();

  if (IsAuthenticated()) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
};

export default PrivateRoute;
