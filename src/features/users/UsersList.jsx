import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions, getUsers } from "./users.slice";
import Button from "../../ui/Button";
import Loader from "../../ui/Loader";
import TitleText from "../../ui/TitleText";
import FeatureHeader from "../../ui/FeatureHeader";
import { alertActions } from "../alert/alert.slice";
import { getAuth } from "../account/auth.slice";

function UsersList() {
  const { data: usersData, loading, error } = useSelector(getUsers);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(getAuth);

  useEffect(() => {
    dispatch(userActions.getAll());
  }, [dispatch]);

  async function handleDeleteUser(id) {
    await dispatch(userActions.delete(id));
    dispatch(alertActions.error({ message: "User Deleted" }));
  }

  return (
    <>
      <FeatureHeader>
        <TitleText>Users</TitleText>

        <Button to="add" type="primary">
          Add User
        </Button>
      </FeatureHeader>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display error if any
      ) : (
        <table className="min-w-full bg-slate-50 border border-gray-200 shadow mt-4">
          <thead className="bg-slate-100">
            <tr>
              <th
                className="py-2 px-3 border-b text-left"
                style={{ width: "20%" }}
              >
                First Name
              </th>
              <th
                className="py-2 px-3 border-b text-left"
                style={{ width: "20%" }}
              >
                Last Name
              </th>
              <th
                className="py-2 px-3 border-b text-left"
                style={{ width: "20%" }}
              >
                Username
              </th>
              <th
                className="py-2 px-3 border-b text-left"
                style={{ width: "20%" }}
              >
                Email
              </th>
              <th style={{ width: "20%" }}></th>
            </tr>
          </thead>
          <tbody>
            {usersData?.map((user) => {
              // Check if the current user is the logged-in user
              const isCurrentUser = loggedInUser && user.id === loggedInUser.id;

              return (
                <tr key={user.id} className="hover:bg-slate-100">
                  <td className="py-2 px-3 border-b">{user.firstName}</td>
                  <td className="py-2 px-3 border-b">{user.lastName}</td>
                  <td className="py-2 px-3 border-b">
                    {user.username}
                    {isCurrentUser && (
                      <span className="text-sm text-green-700 ml-2 font-bold">
                        (You)
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 border-b">{user.email}</td>
                  <td className="py-2 px-3 border-b flex gap-2">
                    <Button type="link" to={`edit/${user.id}`}>
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(user.id)}
                      type="secondary"
                      disabled={user.isDeleting}
                    >
                      <p>Delete</p>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}

export default UsersList;
