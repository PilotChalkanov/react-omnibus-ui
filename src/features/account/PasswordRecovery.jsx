import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { authActions } from "./auth.slice";
import ContentBox from "../../ui/ContentBox";
import Button from "../../ui/Button";
import InputField from "../../ui/InputField";
import TitleText from "../../ui/TitleText";
import ButtonContainer from "../../ui/ButtonContainer";

function PasswordRecovery() {
  const dispatch = useDispatch();

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ email }) {
    return dispatch(authActions.recovery({ email }));
  }

  return (
    <ContentBox>
      <TitleText>Recover Password</TitleText>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="email"
          label="Please enter your email address"
          register={register("email")}
          error={errors.email}
        />
        <ButtonContainer>
          <Button type="primary" loading={isSubmitting}>
            Submit
          </Button>
          <Button type="link" to="../login">
            Back to login
          </Button>
        </ButtonContainer>
      </form>
    </ContentBox>
  );
}

export default PasswordRecovery;
