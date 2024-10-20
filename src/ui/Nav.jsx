import { useDispatch } from "react-redux";
import { authActions } from "../features/account/auth.slice";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation

  async function logout() {
    await dispatch(authActions.logout()).unwrap();
    navigate("/account/login"); // Redirect to login page after logout
  }

  return (
    <nav className="bg-slate-100 px-3 py-2 border-b border-slate-300">
      <div className="flex flex-grow items-center justify-end me-2">
        <Button type="link" to="/users">
          Users
        </Button>
        <Button type="link" onClick={logout}>
          Logout
        </Button>
      </div>
    </nav>
  );
}

export default Nav;
