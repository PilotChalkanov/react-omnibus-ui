import { useState } from "react";

import Button from "../../ui/Button";
import ServicesList from "./ServicesList";
import TitleText from "../../ui/TitleText";
import ContentBox from "../../ui/ContentBox";
import ButtonContainer from "../../ui/ButtonContainer";

function SelectServiceConnection() {
  const [selectedService, setSelectedService] = useState(null);

  function handleServiceChange(id) {
    setSelectedService(id);
  }

  return (
    <ContentBox>
      <TitleText>New Service Connection</TitleText>
      <ServicesList
        handleServiceChange={handleServiceChange}
        selectedService={selectedService}
      />
      <ButtonContainer>
        {selectedService ? (
          <Button type="primary" to={`/connections/edit/${selectedService}`}>
            Next
          </Button>
        ) : null}
        <Button type="link" to="/connections">
          Back
        </Button>
      </ButtonContainer>
    </ContentBox>
  );
}

export default SelectServiceConnection;
