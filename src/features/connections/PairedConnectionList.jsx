import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import {
  connectionActions,
  getAllConnections,
  getLoadingState,
  getPairedConnections,
} from "./connection.slice";
import PairedConnectionListItem from "./PairedConnectionListItem";
import Loader from "../../ui/Loader";
import TitleText from "../../ui/TitleText";
import FeatureHeader from "../../ui/FeatureHeader";

function PairedConnectionList() {
  const [selectedPair, setSelectedPair] = useState([]); // State to store the selected pair
  const dispatch = useDispatch();
  const pairedConnections = useSelector(getPairedConnections);
  // Array containing arrays with the IDs of the connection pairs
  const allConnections = useSelector(getAllConnections);
  // Array with all the existing connections
  const loading = useSelector(getLoadingState);

  useEffect(() => {
    dispatch(connectionActions.fetchConnections());
    dispatch(connectionActions.fetchPairedConnections()).unwrap();
  }, [dispatch]);

  // Function to find a connection by ID
  const findConnectionById = (id) =>
    allConnections.find((conn) => conn.id === id);

  // Handle selecting a pair
  const handleSelectPair = (pair) => {
    if (selectedPair[0] === pair[0] && selectedPair[1] === pair[1]) {
      // If the selected pair is clicked again, deselect it
      setSelectedPair([]);
    } else {
      setSelectedPair(pair);
    }
  };

  // Handle unpairing the selected pair
  const handleUnpair = () => {
    if (selectedPair.length === 2) {
      dispatch(connectionActions.unpairConnections(selectedPair));
      dispatch(connectionActions.fetchPairedConnections());
      setSelectedPair([]); // Reset the selected pair after un-pairing
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <FeatureHeader>
        <TitleText>Paired Connections List</TitleText>
        {/* Unpair Button */}
        <Button
          type="primary"
          disabled={selectedPair.length !== 2}
          onClick={handleUnpair}
        >
          Unpair
        </Button>
      </FeatureHeader>

      {/* Display Paired Connections */}
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-4">
          {pairedConnections
            .filter((pair) => pair !== undefined || null)
            .map((pair, index) => {
              const isSelected =
                selectedPair[0] === pair[0] && selectedPair[1] === pair[1];

              return (
                <PairedConnectionListItem
                  key={index}
                  pair={pair}
                  connectionOne={findConnectionById(pair[0])}
                  connectionTwo={findConnectionById(pair[1])}
                  isSelected={isSelected}
                  handleSelectPair={handleSelectPair}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}

export default PairedConnectionList;
