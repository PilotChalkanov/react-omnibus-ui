import { useSelector } from "react-redux";
import { getAllConnections, getAllServices } from "./connection.slice";
import ConnectionIcon from "../../ui/ConnectionIcon";

function ServicesList({ handleServiceChange, selectedService }) {
  const services = useSelector(getAllServices);
  const allConnections = useSelector(getAllConnections);

  return (
    <ul className="list-none space-y-2 mt-4">
      {services.map((service) => {
        // Check if the service.id exists in allConnections
        const isServiceConnected = allConnections.some(
          (connection) => connection.id === service.id
        );

        return (
          <li
            key={service.id}
            className={`flex items-center p-1.5 ps-3  rounded border border-slate-200 bg-white  ${
              isServiceConnected ? "bg-gray-100" : "hover:bg-slate-100 shadow"
            }`}
            title={
              isServiceConnected
                ? "The service connection is already added"
                : ""
            } // Tooltip for disabled connections
          >
            {/* Wrap input and content in a label to make the entire item clickable */}
            <label
              htmlFor={service.id} // Associate label with input
              className="flex gap-2 items-center flex-grow"
            >
              <input
                type="radio"
                disabled={isServiceConnected} // Disable if service.id is in allConnections
                className={`form-radio h-4 w-4  ${
                  isServiceConnected ? "" : "cursor-pointer"
                }`}
                id={service.id} // Unique ID for each input
                name="service"
                value={service.id}
                checked={selectedService === service.id}
                onChange={() => handleServiceChange(service.id)}
              />
              <span className={`${isServiceConnected ? "opacity-35" : ""}`}>
                <ConnectionIcon src={service.icon} alt={service.serviceName} />
              </span>
              <span
                className={`  ${
                  isServiceConnected ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {service.serviceName}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

export default ServicesList;
