import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./ui/ProtectedRoute";
import AppLayout from "./ui/AppLayout";
import AccountLayout from "./ui/AccountLayout";
import Login from "./features/account/Login";
import PasswordRecovery from "./features/account/PasswordRecovery";
import Register from "./features/account/Register";
import Home from "./ui/Home";
import UsersList from "./features/users/UsersList";
import UsersAddEdit from "./features/users/UsersAddEdit";
import SelectServiceConnection from "./features/connections/SelectServiceConnection";
import ConnectionAddEdit from "./features/connections/ConnectionAddEdit";
import ConnectionList from "./features/connections/ConnectionList";
import PairedConnectionList from "./features/connections/PairedConnectionList";
import NotFound from "./ui/NotFound";
import Error from "./ui/Error";

const router = createBrowserRouter([
  {
    // Private Routes
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <Error />, // Include errorElement for the protected section

    children: [
      { path: "/", element: <Home /> },
      { path: "users", element: <UsersList /> },
      { path: "users/add", element: <UsersAddEdit /> },
      { path: "users/edit/:id", element: <UsersAddEdit /> },
      { path: "connections", element: <ConnectionList /> },
      { path: "connections/edit/:id", element: <ConnectionAddEdit /> },
      { path: "connections/create", element: <SelectServiceConnection /> }, // Corrected from 'select'
      { path: "connections/paired", element: <PairedConnectionList /> },
    ],
  },
  {
    // Public Routes
    path: "account",
    element: <AccountLayout />,
    errorElement: <Error />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "recover", element: <PasswordRecovery /> },
      { path: "*", element: <Navigate to="account/login" /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
