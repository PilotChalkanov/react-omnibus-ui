import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { differenceInDays, parseISO, isBefore, format } from "date-fns"; // Import for date calculations
import { EXPIRATION_DAYS } from "../../config";
import {
  connectionActions,
  findPairedConnectionsById,
} from "./connection.slice";
import Button from "../../ui/Button";
import ConnectionIcon from "../../ui/ConnectionIcon";
import { alertActions } from "../alert/alert.slice";

function ConnectionListItem({
  name,
  icon,
  description,
  id,
  createdBy,
  email,
  expirationDate,
  setSelectedConnections,
  isChecked,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const pairedWithConnections = useSelector(findPairedConnectionsById(id));
  const dispatch = useDispatch();

  // Parse the expiration date and calculate days remaining
  const parsedExpirationDate = parseISO(expirationDate);
  const daysRemaining = differenceInDays(parsedExpirationDate, new Date());

  // Determine if the connection is expired or expiring soon
  const isExpired = isBefore(parsedExpirationDate, new Date());
  const isExpiringSoon = !isExpired && daysRemaining <= EXPIRATION_DAYS;

  function toggleExpand() {
    if (isOpen) {
      // Set isOpen to false first, then delay hiding content
      setIsOpen(false);
      setTimeout(() => setShouldRenderContent(false), 300); // Delay matches the CSS transition duration
    } else {
      setIsOpen(true);
      setShouldRenderContent(true);
    }
  }

  function toggleCheckbox() {
    setSelectedConnections((selectedConnections) => {
      if (selectedConnections.includes(id)) {
        return selectedConnections.filter((existingId) => existingId !== id);
      } else {
        return [...selectedConnections, id];
      }
    });
  }

  async function handleDelete(e) {
    e.stopPropagation(); // Prevent parent click
    await dispatch(connectionActions.removeConnection(id)).unwrap();
    // Remove all pairs containing the id from the paired connections list
    await dispatch(connectionActions.removeAllPairs(id));
    // Clear the selectedConnections state after deletion
    setSelectedConnections([]);

    // Alert message
    dispatch(alertActions.error({ message: "Connection deleted" }));
  }

  function getConnectionClassName(isExpired, isExpiringSoon, isChecked) {
    // Determine border color based on connection state
    const baseBorderColor = isExpired
      ? "border-red-400" // Red border if expired
      : isExpiringSoon
      ? "border-amber-300" // Amber border if expiring soon
      : "border-gray-300"; // Default gray border for normal state

    // Apply thick gray border if the connection is selected
    const borderStyle = isChecked
      ? "border-2 border-gray-400"
      : `border ${baseBorderColor}`;

    return `relative ${borderStyle} shadow rounded p-4 mt-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-all duration-300`;
  }

  return (
    <div
      className={getConnectionClassName(isExpired, isExpiringSoon, isChecked)}
      role="button"
      onClick={toggleExpand}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
      aria-expanded={isOpen}
      aria-controls={`connection-details-${id}`}
    >
      {/* Tooltip */}
      {isTooltipVisible && (
        <div className="absolute top-[4px] left-1/2 transform -translate-x-1/2 -translate-y-full bg-slate-50 text-slate-800 border-2 text-sm rounded px-1">
          Click to expand, select two connections to enable pairing
        </div>
      )}

      <div className="px-2 grid grid-cols-3 items-center">
        {/* Checkbox to highlight the item */}
        <div className="flex gap-3 justify-start items-center">
          <input
            onClick={(e) => e.stopPropagation()}
            type="checkbox"
            checked={isChecked}
            onChange={toggleCheckbox}
            className="transform scale-125 cursor-pointer"
          />
          {/* Connection Icon */}
          <ConnectionIcon src={icon} alt={name} />
          {/* Connection Name */}
          <p className="mb-0 font-semibold text-slate-600">{name}</p>
        </div>
        {/* Paired Status Indicator */}
        <div className="flex gap-3">
          {pairedWithConnections.length > 0 ? (
            <p className={"ps-1 font-semibold text-sm text-green-600"}>
              Paired
            </p>
          ) : null}

          <p
            className={`ps-1 font-semibold text-sm ${
              isExpired
                ? "text-red-600"
                : isExpiringSoon
                ? "text-amber-600"
                : ""
            }`}
          >
            {isOpen
              ? `Expires on ${format(parsedExpirationDate, "MMM dd, yyyy")}`
              : isExpired
              ? "Expired"
              : isExpiringSoon
              ? `Expires in ${daysRemaining + 1} ${
                  daysRemaining === 0 ? "day" : "days"
                }`
              : ""}
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 text-sm">
          <Button type="link" to={`/connections/edit/${id}`}>
            Edit
          </Button>
          <Button
            type="secondary"
            disabled={!isChecked}
            onClick={handleDelete}
            title="Select a connection using the checkbox to enable deleting"
          >
            Delete
          </Button>
          <p className="text-xs text-gray-500">{isOpen ? "▲" : "▼"}</p>
        </div>
      </div>

      {/* Expanded content with transition */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        id={`connection-details-${id}`}
      >
        {shouldRenderContent && (
          <div className="mt-3 px-2">
            <div className="grid grid-cols-3">
              {/* Service details */}
              <div>
                <p className="font-bold mb-1">Description</p>
                <p className="mb-2">{description}</p>
              </div>
              <div className="ps-1 text-sm">
                {pairedWithConnections.length > 0 ? (
                  <>
                    <p className="font-semibold">Paired with</p>
                    <ul>
                      {pairedWithConnections.map((connectionName) => (
                        <li key={connectionName}>{connectionName}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
              {/* Creator details */}
              <div className="text-right text-sm">
                <p className="font-bold mb-1">Creator</p>
                <p className="mb-0">{createdBy}</p>
                <p className="text-gray-500 mb-0">{email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ConnectionListItem.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  createdBy: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  setSelectedConnections: PropTypes.func.isRequired,
  isChecked: PropTypes.bool.isRequired,
  expirationDate: PropTypes.string.isRequired,
};

export default ConnectionListItem;
