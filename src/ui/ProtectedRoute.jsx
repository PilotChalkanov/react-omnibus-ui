import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../features/account/auth.slice";

function ProtectedRoute({ children }) {
  const auth = useSelector(getAuth);

  const navigate = useNavigate();

  useEffect(
    function () {
      if (!auth) navigate("/account/login");
    },
    [navigate, auth]
  );

  return auth ? children : null;
}

export default ProtectedRoute;
