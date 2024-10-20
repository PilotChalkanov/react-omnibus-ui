import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate for navigation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "./users.slice";
import { alertActions } from "../alert/alert.slice";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import TitleText from "../../ui/TitleText";
import ContentBox from "../../ui/ContentBox";
import ButtonContainer from "../../ui/ButtonContainer";

function UsersAddEdit() {
  const { id } = useParams(); // Get the user ID from the URL if it exists
  const [title, setTitle] = useState(""); // Title for the page (Add/Edit)
  const user = useSelector((state) => state.users?.item); // Select the user from the Redux state
  const navigate = useNavigate(); // Hook for navigation
  const dispatch = useDispatch();

  // Form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .transform((x) => (x === "" ? undefined : x)) // Handle empty password in edit mode
      .concat(id ? null : Yup.string().required("Password is required")) // Password is required if adding a new user
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = {
    resolver: yupResolver(validationSchema),
    defaultValues: id
      ? user
      : {
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
        },
  };

  // Get form functions from react-hook-form
  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  const { errors, isSubmitting, isDirty } = formState;

  // Effect to set title and load user details if editing
  useEffect(() => {
    if (id) {
      setTitle("Edit User");
      // Fetch user details from the API and populate form fields
      dispatch(userActions.getById(id))
        .unwrap()
        .then((user) => {
          if (user) {
            reset(user); // Reset only if data has been fetched
          }
        });
    } else {
      setTitle("Add User");
    }
  }, [dispatch, id, reset]);

  // Reset handler

  function handleReset(e) {
    e.preventDefault();
    reset();
  }

  // Form submission handler
  async function onSubmit(data) {
    dispatch(alertActions.clear()); // Clear previous alerts

    try {
      let message;
      if (id) {
        console.log(data);
        // Update user if editing
        await dispatch(userActions.update({ id, data })).unwrap();
        message = "User Updated";
      } else {
        // Register a new user
        await dispatch(userActions.register(data)).unwrap();
        message = "User Added";
      }

      // Navigate to the users list page with a success message
      navigate("/users");
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
    } catch (error) {
      // Show an error alert if the operation fails
      dispatch(alertActions.error(error));
    }
  }

  return (
    <ContentBox>
      <TitleText>{title}</TitleText>
      {/* Display the form if there's no loading or error state */}
      {!(user?.loading || user?.error) && (
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* First Name */}
          <InputField
            name="firstName"
            label="First Name"
            register={register("firstName")}
            error={errors.firstName}
          />
          {/* Last Name */}
          <InputField
            name="lastName"
            label="Last Name"
            register={register("lastName")}
            error={errors.lastName}
          />
          {/* Email */}
          <InputField
            name="email"
            label="Email"
            register={register("email")}
            error={errors.email}
          />
          {/* Username */}
          <InputField
            name="username"
            label="Username"
            register={register("username")}
            error={errors.username}
          />
          {/* Password */}
          <InputField
            name="password"
            label={"Password"}
            info={id && "(Leave blank to keep the same password"}
            register={register("password")}
            error={errors.password}
            password={true}
          />

          {/* Action Buttons */}
          <ButtonContainer>
            <Button type="primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            {isDirty && (
              <Button type="link" onClick={handleReset} disabled={isSubmitting}>
                Reset
              </Button>
            )}
            <Button type="link" to="/users">
              Cancel
            </Button>
          </ButtonContainer>
        </form>
      )}

      {/* Display loading indicator */}
      {user?.loading && (
        <div className="text-center my-5">
          <span className="inline-block animate-spin border-4 border-t-transparent border-gray-600 rounded-full w-8 h-8"></span>
        </div>
      )}

      {/* Display error message */}
      {user?.error && (
        <div className="text-center my-5">
          <div className="text-red-500">Error loading user: {user.error}</div>
        </div>
      )}
    </ContentBox>
  );
}

export default UsersAddEdit;
