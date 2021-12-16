import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action } from "redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";
import ConfirmEditDialog from "components/ConfirmActionDialog";
import Spinner from "components/Spinner";
import { actions, selectors } from "ducks/connectors";
import ConnectorForm from "components/ConnectorForm";

function ConnectorEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isEditing = useSelector(selectors.isEditing);
  const connector = useSelector(selectors.selectConnectorDetails);
  const isConnected = useSelector(selectors.isConnected);
  const isConnecting = useSelector(selectors.isConnectingConnector);
  const connectionDetails = useSelector(selectors.connectorConnectionDetails);
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;
  const [showConfirm, toggleConfirmDialog] = useState(false);
  const [editAction, setEditAction] = useState<Action | null>(null);

  const defaultValues = {
    ...(connector || { name: "", type: "", url: "", uuid: "" }),
  };

  const onCancelEdit = useCallback(() => toggleConfirmDialog(false), []);
  const ConfirmEdit = () => {
    dispatch(editAction);
    toggleConfirmDialog(false);
  };

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      uuid: string,
      name: string,
      url: string,
      authType: string,
      authAttributes: any
    ) => {
      setEditAction(
        actions.requestUpdateConnector(
          uuid,
          name,
          url,
          authType,
          authAttributes,
          history
        )
      );
      toggleConfirmDialog(true);
    },
    [history]
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
        actions.requestConnectConnector(
          name,
          url,
          authType,
          authAttributes,
          uuid
        )
      );
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(actions.requestConnectorDetail(uuid));
  }, [dispatch, uuid]);

  const getDefaultValues = () => {
    return {
      name: defaultValues.name,
      url: defaultValues.url,
      uuid: defaultValues.uuid,
    };
  };

  return (
    <Container className="themed-container">
      <ConnectorForm
        defaultValues={getDefaultValues()}
        isSubmitting={isEditing}
        isConnecting={isConnecting}
        onCancel={onCancel}
        onSubmit={onSubmit}
        onConnect={onConnect}
        editMode={true}
        isConnected={isConnected}
        connectionDetails={connectionDetails}
      ></ConnectorForm>
      <ConfirmEditDialog
        isOpen={showConfirm}
        onCancel={onCancelEdit}
        onConfirm={ConfirmEdit}
      />
      <Spinner active={isFetching} />
    </Container>
  );
}

export default ConnectorEdit;
