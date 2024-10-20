import { useState } from "react";
import ShowPasswordButton from "./ShowPasswordButton";

function InputField({ name, label, register, error, password = false, info }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={`mt-3 ${password && "relative"}`}>
      <label className="block text-slate-700 mb-2">
        {label}
        {info && <em className="ml-1 text-sm text-slate-500">{info}</em>}
      </label>
      <input
        name={name}
        type={password ? (showPassword ? "text" : "password") : "text"}
        {...register}
        className={`w-full p-2 border rounded ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      />
      {password && (
        <ShowPasswordButton
          isVisible={showPassword}
          onClick={() => setShowPassword((s) => !s)}
        />
      )}
      <div className="text-red-500 text-sm mt-1">{error?.message}</div>
    </div>
  );
}

export default InputField;
