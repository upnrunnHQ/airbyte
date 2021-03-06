import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useResource, useFetcher } from "rest-hooks";

import ContentCard from "../../../components/ContentCard";
import ServiceForm from "../../../components/ServiceForm";
import ConnectionBlock from "../../../components/ConnectionBlock";
import DestinationDefinitionSpecificationResource, {
  DestinationDefinitionSpecification
} from "../../../core/resources/DestinationDefinitionSpecification";
import SourceDefinitionResource from "../../../core/resources/SourceDefinition";
import { AnalyticsService } from "../../../core/analytics/AnalyticsService";
import config from "../../../config";
import PrepareDropDownLists from "./PrepareDropDownLists";
import { Destination } from "../../../core/resources/Destination";

type IProps = {
  destination?: Destination;
  dropDownData: Array<{ text: string; value: string; img?: string }>;
  hasSuccess?: boolean;
  onSubmit: (values: {
    name: string;
    serviceType: string;
    destinationDefinitionId?: string;
    connectionConfiguration?: any;
  }) => void;
  errorStatus?: number;
  currentSourceDefinitionId: string;
};

const useDestinationDefinitionSpecificationLoad = (
  destinationDefinitionId: string
) => {
  const [
    destinationDefinitionSpecification,
    setDestinationSpecification
  ] = useState<null | DestinationDefinitionSpecification>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDestinationDefinitionSpecification = useFetcher(
    DestinationDefinitionSpecificationResource.detailShape(),
    true
  );

  useEffect(() => {
    (async () => {
      if (destinationDefinitionId) {
        setIsLoading(true);
        setDestinationSpecification(
          await fetchDestinationDefinitionSpecification({
            destinationDefinitionId
          })
        );
        setIsLoading(false);
      }
    })();
  }, [fetchDestinationDefinitionSpecification, destinationDefinitionId]);

  return { destinationDefinitionSpecification, isLoading };
};

const DestinationStep: React.FC<IProps> = ({
  onSubmit,
  dropDownData,
  hasSuccess,
  errorStatus,
  currentSourceDefinitionId,
  destination
}) => {
  const [destinationId, setDestinationId] = useState("");
  const {
    destinationDefinitionSpecification,
    isLoading
  } = useDestinationDefinitionSpecificationLoad(destinationId);
  const currentSource = useResource(SourceDefinitionResource.detailShape(), {
    sourceDefinitionId: currentSourceDefinitionId
  });
  const { getDestinationDefinitionById } = PrepareDropDownLists();

  const onDropDownSelect = (sourceId: string) => {
    const destinationConnector = getDestinationDefinitionById(sourceId);
    AnalyticsService.track("New Destination - Action", {
      user_id: config.ui.workspaceId,
      action: "Select a connector",
      connector_destination: destinationConnector?.name,
      connector_destination_definition_id:
        destinationConnector?.destinationDefinitionId
    });
    setDestinationId(sourceId);
  };
  const onSubmitForm = async (values: {
    name: string;
    serviceType: string;
  }) => {
    await onSubmit({
      ...values,
      destinationDefinitionId:
        destinationDefinitionSpecification?.destinationDefinitionId
    });
  };

  const errorMessage =
    errorStatus === 0 ? null : errorStatus === 400 ? (
      <FormattedMessage id="form.validationError" />
    ) : (
      <FormattedMessage id="form.someError" />
    );

  useEffect(
    () => setDestinationId(destination?.destinationDefinitionId || ""),
    [destination]
  );

  return (
    <>
      <ConnectionBlock itemFrom={{ name: currentSource.name }} />
      <ContentCard
        title={<FormattedMessage id="onboarding.destinationSetUp" />}
      >
        <ServiceForm
          allowChangeConnector
          onDropDownSelect={onDropDownSelect}
          onSubmit={onSubmitForm}
          hasSuccess={hasSuccess}
          formType="destination"
          dropDownData={dropDownData}
          errorMessage={errorMessage}
          specifications={
            destinationDefinitionSpecification?.connectionSpecification
          }
          documentationUrl={
            destinationDefinitionSpecification?.documentationUrl
          }
          isLoading={isLoading}
          formValues={
            destination
              ? {
                  ...destination.connectionConfiguration,
                  name: destination.name,
                  serviceType: destination.destinationDefinitionId
                }
              : null
          }
        />
      </ContentCard>
    </>
  );
};

export default DestinationStep;
