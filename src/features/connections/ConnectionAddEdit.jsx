import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./../../styles/datepicker-custom.css";
import {
  connectionActions,
  getAllServices,
  getErrorMessage,
  getExistingConnection,
  getLoadingState,
} from "./connection.slice";
import Button from "../../ui/Button";
import Error from "../../ui/Error";
import { getAuth } from "../account/auth.slice";
import Loader from "../../ui/Loader";
import ConnectionIcon from "../../ui/ConnectionIcon";
import { alertActions } from "../alert/alert.slice";
import InputField from "../../ui/InputField";
import ContentBox from "../../ui/ContentBox";
import ButtonContainer from "../../ui/ButtonContainer";

function ConnectionAddEdit() {
  const { id } = useParams(); // Get the ID from the URL
  const services = useSelector(getAllServices); // Get all services
  const existingConnection = useSelector(getExistingConnection); // returns the connection object for the existing connection
  const error = useSelector(getErrorMessage); // Get the error from the store
  const loading = useSelector(getLoadingState); // Get the loading state from the store
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { firstName, lastName, email } = useSelector(getAuth); // Get auth details

  // Find service and connection by ID
  let service = services.find((service) => service.id === Number(id));
  const connectionDefaultValue = {
    authMethod: "basic",
    serviceUrl: service.serviceUrl,
    serviceName: service.serviceName,
    username: "",
    password: "",
    expirationDate: null,
    description: "",
    grantAccess: false,
  };

  useEffect(() => {
    if (id) {
      dispatch(connectionActions.getConnectionById(id));
    }
  }, [id, dispatch]);

  // Redirect if the service ID is invalid
  if (!service) {
    return <Error message="Service not found!" />;
  }

  // Form validation schema
  const validationSchema = Yup.object().shape({
    serviceUrl: Yup.string()
      .url("Invalid URL format")
      .required("Service URL is required"),
    serviceName: Yup.string().required("Service connection name is required"),
    authMethod: Yup.string().required("Authentication method is required"),
    username: Yup.string(),
    password: Yup.string(),
    description: Yup.string(),
    expirationDate: Yup.date()
      .nullable()
      .required("Connection expiration date is required"),
  });

  // Setup form with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting, isDirty },
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: connectionDefaultValue,
  });

  // Watch authMethod and expirationDate for conditional logic
  const authMethod = watch("authMethod");
  const expirationDate = watch("expirationDate");

  // Pre-fill the form fields if editing an existing connection
  useEffect(() => {
    if (existingConnection) {
      reset({
        serviceUrl: existingConnection.serviceUrl,
        serviceName: existingConnection.serviceName,
        description: existingConnection.description || "",
        authMethod: existingConnection.authMethod || "basic",
        username: existingConnection.username || "",
        password: existingConnection.password || "",
        expirationDate: existingConnection.expirationDate,
        grantAccess: existingConnection.grantAccess || false,
      });
    } else {
      // Reset to default values when creating a new connection
      reset(connectionDefaultValue);
    }
  }, [existingConnection, reset, service]);

  // Handle form submission
  async function onSubmit(data) {
    const fullName = `${firstName} ${lastName}`;

    try {
      let message;
      // Editing an existing connection
      if (existingConnection) {
        await dispatch(
          connectionActions.updateConnection({ id, data })
        ).unwrap();
        message = "Connection Updated";
      } else {
        // Creating a new connection
        const newConnection = {
          serviceName: data.serviceName,
          icon: service.icon,
          description: data.description,
          id: service.id,
          serviceUrl: data.serviceUrl,
          createdBy: fullName,
          email,
          expirationDate: data.expirationDate.toISOString(),
          ...data,
        };
        await dispatch(connectionActions.addConnection(newConnection));
        message = "Connection Added";
      }
      // Redirect to connection list with a message
      dispatch(alertActions.success({ message, showAfterRedirect: true }));
      navigate("/connections");
    } catch (error) {
      console.error("Failed to save connection", error);
    }
  }

  // Handle the verify action (only verify without submission)
  function handleVerify(e) {
    e.preventDefault();
    const serviceUrl = watch("serviceUrl");
    const username = watch("username");
    const password = watch("password");

    console.log("Verifying connection with:");
    console.log("Service URL:", serviceUrl);
    console.log("Username:", username || "(not provided)");
    console.log("Password:", password ? "******" : "(not provided)");

    dispatch(
      connectionActions.setError(
        "Verification functionality is not implemented."
      )
    );
  }

  // Handle the Verify and Save (verifies and then submits the form)
  function handleVerifyAndSave(e) {
    e.preventDefault();
    handleVerify(e);
    handleSubmit(onSubmit)();
  }

  function handleReset(e) {
    e.preventDefault();
    reset();
  }

  return loading ? (
    <Loader />
  ) : (
    <ContentBox>
      <h1 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <ConnectionIcon src={service.icon} alt={service.name} />
        {`
      ${
        existingConnection
          ? `Edit ${existingConnection.serviceName}`
          : `Create ${service.serviceName}`
      } Service Connection`}
      </h1>

      <form>
        {/* Authentication Method */}
        <div className="mb-3">
          <label className="block text-slate-700 mb-2">
            Authentication method
          </label>
          <div className="flex items-center">
            <input
              type="radio"
              id="basicAuth"
              value="basic"
              {...register("authMethod")}
              className="form-radio h-4 w-4 mr-2"
            />
            <label htmlFor="basicAuth" className="mr-6 text-slate-700">
              Basic Authentication
            </label>

            <input
              type="radio"
              id="oauth2"
              value="oauth2"
              {...register("authMethod")}
              className="form-radio h-4 w-4 mr-2"
            />
            <label htmlFor="oauth2" className="text-slate-700">
              OAuth2
            </label>
          </div>
          {errors.authMethod && (
            <div className="text-red-500 text-sm mt-1">
              {errors.authMethod.message}
            </div>
          )}
        </div>

        {/* Service URL */}
        <InputField
          name="serviceUrl"
          label="Service URL"
          register={register("serviceUrl")}
          error={errors.serviceUrl}
        />

        {/* Username and Password */}
        {authMethod === "basic" && (
          <>
            <InputField
              name="username"
              label="Username (optional)"
              register={register("username")}
              error={errors.username}
            />
            <InputField
              password={true}
              name="password"
              label="Password (optional)"
              register={register("password")}
              error={errors.password}
            />

            {/* Verify Button */}
            <Button className="mt-3" type="primary" onClick={handleVerify}>
              Verify
            </Button>
          </>
        )}

        {/* Service Name */}
        <InputField
          name="serviceName"
          label="Service Connection Name"
          register={register("serviceName")}
          error={errors.serviceName}
        />

        {/* Description */}
        <InputField
          name="description"
          label="Description (optional)"
          register={register("description")}
          error={errors.description}
        />

        {/* Expiration Date Picker */}
        <div className="my-3">
          <label htmlFor="expirationDate" className="block text-slate-700 mb-2">
            Expiration Date
          </label>
          <DatePicker
            id="expirationDate"
            selected={expirationDate}
            onChange={(date) => setValue("expirationDate", date)}
            dateFormat="yyyy-MM-dd"
            className={`w-full px-1.5 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.expirationDate ? "border-red-500" : ""
            }`}
            placeholderText="Select expiration date"
            minDate={new Date()} // Prevent selecting past dates
          />
          {errors.expirationDate && (
            <div className="text-red-500 text-sm mt-1">
              {errors.expirationDate.message}
            </div>
          )}
        </div>

        {/* Grant Access Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("grantAccess")}
            className="form-checkbox text-blue-600 h-4 w-4 mr-2"
            id="grantAccess"
          />
          <label className="text-slate-700" htmlFor="grantAccess">
            Grant access permission to all pipelines
          </label>
        </div>

        {/* Error message */}
        {error && <Error message={error} />}

        {/* Action Buttons */}
        <ButtonContainer>
          <Button
            type="primary"
            disabled={isSubmitting}
            onClick={handleVerifyAndSave}
          >
            Verify and Save
          </Button>
          <Button type="link" onClick={() => navigate("/connections")}>
            Back
          </Button>
          {isDirty && (
            <Button type="link" onClick={handleReset} disabled={isSubmitting}>
              Reset
            </Button>
          )}
        </ButtonContainer>
      </form>
    </ContentBox>
  );
}

export default ConnectionAddEdit;
