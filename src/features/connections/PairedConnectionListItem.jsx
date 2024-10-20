import { useState } from "react";
import ConnectionIcon from "../../ui/ConnectionIcon";

function PairedConnectionListItem({
  connectionOne,
  connectionTwo,
  pair,
  handleSelectPair,
  isSelected,
}) {
  const [isConnected, setIsConnected] = useState(true);

  if (!connectionOne || !connectionTwo) return null; // Ensure both connections exist

  return (
    <div
      className={`grid grid-cols-3 border shadow rounded p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 ${
        isSelected ? "border-gray-400 border-2" : ""
      }`}
      onClick={() => handleSelectPair(pair)} // Select pair on click
    >
      {/* Left Box */}
      <div className="flex items-center justify-center gap-3  text-slate-700 bg-blue-100 px-4 py-2 rounded-md shadow">
        <ConnectionIcon
          src={connectionOne.icon}
          alt={connectionOne.serviceName}
        />
        <p className="font-semibold">{connectionOne.serviceName}</p>
      </div>

      {/* Connection Status Text */}

      <p
        className={`text-center my-auto font-semibold ${
          isConnected ? "text-green-600" : "text-red-600"
        }`}
      >
        {isConnected ? "Connected" : "Disconnected"}
      </p>

      {/* Right Box */}
      <div className="flex items-center justify-center gap-3 text-slate-700 bg-amber-100 px-4 py-2 rounded-md shadow ">
        <ConnectionIcon
          src={connectionTwo.icon}
          alt={connectionTwo.serviceName}
        />
        <p className="font-semibold">{connectionTwo.serviceName}</p>
      </div>
    </div>
  );
}

export default PairedConnectionListItem;
