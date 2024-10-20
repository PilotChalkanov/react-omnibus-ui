import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "./auth.slice";
import ContentBox from "../../ui/ContentBox";
import TitleText from "../../ui/TitleText";
import InputField from "../../ui/InputField";
import ButtonContainer from "../../ui/ButtonContainer";
import Button from "../../ui/Button";
import { alertActions } from "../alert/alert.slice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Get the navigate function

  // Form validation rules using Yup schema
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // Get form functions using useForm() hook
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError, // To manually set errors
  } = useForm(formOptions);

  // Handle form submission
  async function onSubmit({ username, password }) {
    try {
      // Dispatch login action with credentials
      await dispatch(authActions.login({ username, password })).unwrap(); // Ensure that errors are caught
      // Navigate back to homepage
      navigate("/");
    } catch (error) {
      dispatch(alertActions.error(error || "An error occurred"));
    }
  }

  return (
    <ContentBox>
      <TitleText>Login</TitleText>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Username Input */}
        <InputField
          name="username"
          label="Username"
          register={register("username")}
          error={errors.username} // Display username error
        />
        {/* Password Input with Show Password Button */}
        <InputField
          name="password"
          label="Password"
          register={register("password")}
          error={errors.password} // Display password error
          password={true}
        />
        {/* Submit and navigation buttons */}
        <ButtonContainer>
          <Button type="primary" loading={isSubmitting}>
            Login
          </Button>
          <Button type="link" to="../register">
            Register
          </Button>
          <Button type="link" to="../recover">
            Forgot Password?
          </Button>
        </ButtonContainer>
      </form>
    </ContentBox>
  );
}

export default Login;
