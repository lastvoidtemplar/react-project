import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { useLocation } from "react-router";

function AuthLayout() {
  const {loading, authUser} = useAuth();
  const navigate = useNavigate();
  const location = useLocation()

  console.log(authUser);
  
  useEffect(() => {
    if (!loading &&authUser === null) {
      navigate("/login", {
        replace: true,
        state: {
            from: location
        }
      });
    }
  },[loading, authUser, location, navigate]);

  if (loading){
    return <div>Loading...</div>
  }

  if (authUser === null){
    return <></>
  }

  return <Outlet />;
}

export default AuthLayout;
