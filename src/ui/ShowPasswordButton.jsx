import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

function ShowPasswordButton({ onClick, isVisible = false }) {
  return (
    <button
      type="button"
      title="Click to Show Password"
      onClick={onClick}
      className="absolute right-4 top-[52px] transform -translate-y-1/2 text-gray-600 "
    >
      {isVisible ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
}

export default ShowPasswordButton;
