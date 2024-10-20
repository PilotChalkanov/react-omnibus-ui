import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../users/users.slice";
import { alertActions } from "../alert/alert.slice";
import ContentBox from "../../ui/ContentBox";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import TitleText from "../../ui/TitleText";
import ButtonContainer from "../../ui/ButtonContainer";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form validation rules
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // Get form functions using useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  // Handle form submission
  async function onSubmit(data) {
    dispatch(alertActions.clear());

    try {
      // Dispatch the register action and wait for it to resolve
      await dispatch(userActions.register(data)).unwrap();

      // Navigate to the login page after successful registration
      navigate("/account/login");

      // Display success alert after navigating
      dispatch(
        alertActions.success({
          message: "Registration successful",
          showAfterRedirect: true,
        })
      );
    } catch (error) {
      // Display error message in case of failure
      dispatch(alertActions.error(error));
    }
  }

  return (
    <ContentBox>
      <TitleText>Register</TitleText>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name Input */}
        <InputField
          name="firstName"
          label="First Name"
          register={register("firstName")}
          error={errors.firstName}
        />
        {/* Last Name Input */}
        <InputField
          name="lastName"
          label="Last Name"
          register={register("lastName")}
          error={errors.lastName}
        />
        {/* Email Input */}
        <InputField
          name="email"
          label="Email"
          register={register("email")}
          error={errors.email}
        />
        {/* Username Input */}
        <InputField
          name="username"
          label="Username"
          register={register("username")}
          error={errors.username}
        />
        {/* Password Input */}
        <InputField
          name="password"
          label="Password"
          register={register("password")}
          error={errors.password}
          password={true}
        />
        {/* Action Buttons */}
        <ButtonContainer>
          <Button type="primary" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
          <Button type="link" to="../login">
            Cancel
          </Button>
        </ButtonContainer>
      </form>
    </ContentBox>
  );
}

export default Register;
