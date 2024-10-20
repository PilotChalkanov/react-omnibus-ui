import { useRouteError } from "react-router-dom";

function Error({ message }) {
  const error = useRouteError();
  return (
    <div className="bg-red-100 border border-red-200 shadow text-red-700 px-4 py-3 rounded relative my-4">
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">
        {message || error.data || error.message}
      </span>
    </div>
  );
}

export default Error;
