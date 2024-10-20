import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { authActions, getAuthLoading } from "./features/account/auth.slice";
import Loader from "./ui/Loader";

function App() {
  const dispatch = useDispatch();
  const authLoading = useSelector(getAuthLoading); // Your selector for auth

  useEffect(() => {
    // On app load, check if there's an auth token in the cookies and restore the auth state
    dispatch(authActions.loadAuthFromCookie());
  }, [dispatch]);
  if (authLoading) return <Loader fullscreen={true} />;
  return <RouterProvider router={router} />;
}

export default App;
