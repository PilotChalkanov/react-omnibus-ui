import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getLoadingState,
  getAllConnections,
  getPairedConnections,
  connectionActions,
} from "./connection.slice";
import ConnectionListItem from "./ConnectionListItem";
import Button from "../../ui/Button";
import ThreeDotsMenu from "../../ui/ThreeDotsMenu";
import Loader from "../../ui/Loader";
import TitleText from "../../ui/TitleText";
import ButtonContainer from "../../ui/ButtonContainer";
import FeatureHeader from "../../ui/FeatureHeader";
// import { areConnectionsPaired } from "../../services/connection-services";

function ConnectionList() {
  const [selectedConnections, setSelectedConnections] = useState([]);
  const dispatch = useDispatch();

  // Fetch data from Redux store
  let allConnections = useSelector(getAllConnections);
  let pairedConnections = useSelector(getPairedConnections);
  const loading = useSelector(getLoadingState);

  useEffect(() => {
    async function fetchData() {
      try {
        await dispatch(connectionActions.fetchConnections()).unwrap();
        await dispatch(connectionActions.fetchPairedConnections()).unwrap();
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    }

    fetchData();
  }, [dispatch]);

  // Check if the selected connections are already paired
  function areConnectionsPaired() {
    if (
      selectedConnections.length !== 2 ||
      !pairedConnections ||
      pairedConnections.length === 0
    ) {
      return false; // Ensure pairedConnections is properly loaded
    }
    return pairedConnections
      .filter((pair) => pair !== undefined)
      .some(
        (pair) =>
          (pair[0] === selectedConnections[0] &&
            pair[1] === selectedConnections[1]) ||
          (pair[0] === selectedConnections[1] &&
            pair[1] === selectedConnections[0])
      );
  }

  // Handle pairing or un-pairing
  function togglePairing() {
    if (areConnectionsPaired()) {
      dispatch(connectionActions.unpairConnections(selectedConnections));
    } else {
      dispatch(connectionActions.pairConnections(selectedConnections));
    }
    setSelectedConnections([]);
  }

  return (
    <div className="flex flex-col">
      <FeatureHeader>
        <TitleText>Service Connections</TitleText>

        <ButtonContainer margin={false}>
          <Button
            type="primary"
            onClick={togglePairing}
            disabled={selectedConnections.length !== 2}
            title="Select two connections to enable pairing/un-pairing"
          >
            {areConnectionsPaired() ? "Unpair" : "Pair"}
          </Button>
          <Button type="primary" to="/connections/create">
            New
          </Button>
          <ThreeDotsMenu />
        </ButtonContainer>
      </FeatureHeader>

      {/* Display Loader if data is loading */}
      {loading ? (
        <Loader />
      ) : (
        allConnections
          .filter((connection) => connection !== undefined && connection.id) // Filter out any undefined or incomplete entries
          .map((connection) => (
            <ConnectionListItem
              setSelectedConnections={setSelectedConnections}
              isChecked={selectedConnections.includes(connection.id)}
              name={connection.serviceName}
              icon={connection.icon}
              description={connection.description}
              id={connection.id}
              createdBy={connection.createdBy}
              email={connection.email}
              expirationDate={connection.expirationDate}
              key={connection.id}
            />
          ))
      )}
    </div>
  );
}

export default ConnectionList;
