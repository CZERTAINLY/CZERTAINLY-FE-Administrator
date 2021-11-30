import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { actions, selectors } from "ducks/connectors";
import ConnectorForm from "components/ConnectorForm";
import { ConnectorFunctionGroup } from "models";
import { Container } from "reactstrap";

function ConnectorAdd() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isCreating = useSelector(selectors.isCreatingConnector);
  const isConnecting = useSelector(selectors.isConnectingConnector);
  const isConnected = useSelector(selectors.isConnected);
  const connectionDetails = useSelector(selectors.connectorConnectionDetails);

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      uuid: string,
      name: string,
      url: string,
      status: string,
      functionGroups: ConnectorFunctionGroup[],
      authType: string,
      authAttributes: any
    ) => {
      dispatch(
        actions.requestCreateConnector(
          name,
          url,
          status,
          functionGroups,
          authType,
          authAttributes,
          history
        )
      );
    },
    [dispatch, history]
  );

  const onConnect = useCallback(
    (
      uuid: string,
      name: string,
      url: string,
      authType: string,
      authAttributes: any
    ) => {
      dispatch(
        actions.requestConnectConnector(name, url, authType, authAttributes, "")
      );
    },
    [dispatch]
  );

  return (
    <Container className="themed-container" fluid>
      <ConnectorForm
        isSubmitting={isCreating}
        isConnecting={isConnecting}
        isConnected={isConnected}
        connectionDetails={connectionDetails}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onConnect={onConnect}
      ></ConnectorForm>
    </Container>
  );
}

export default ConnectorAdd;
