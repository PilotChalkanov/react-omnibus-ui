import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Alert from "../features/alert/Alert";

export default AccountLayout;

function AccountLayout() {
  const auth = useSelector((x) => x.auth.value);

  // redirect to home if already logged in
  if (auth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <div className="mx-4 my-6">
        <Alert />
      </div>
      <div className="container mx-auto max-w-lg">
        <Outlet />
      </div>
    </>
  );
}
