import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action } from "redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import ClientForm from "components/ClientForm";
import ConfirmEditDialog from "components/ConfirmActionDialog";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/clients";

function ClientEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isEditing = useSelector(selectors.isEditing);
  const client = useSelector(selectors.selectClientDetails);
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;
  const [showConfirm, toggleConfirmDialog] = useState(false);
  const [editAction, setEditAction] = useState<Action | null>(null);

  const defaultValues = {
    ...(client || {}),
  };

  const onCancelEdit = useCallback(() => toggleConfirmDialog(false), []);
  const onConfirmEdit = useCallback(
    () => dispatch(editAction),
    [dispatch, editAction]
  );

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      _clientName: string,
      certFile: File,
      description: string,
      enabled: boolean,
      certificateUuid: string
    ) => {
      setEditAction(
        actions.requestUpdateClient(
          uuid,
          certFile,
          description,
          certificateUuid,
          history
        )
      );
      toggleConfirmDialog(true);
    },
    [history, uuid]
  );

  useEffect(() => {
    dispatch(actions.requestClientDetail(uuid));
  }, [dispatch, uuid]);

  const title = (
    <h5>
      Edit <span className="fw-semi-bold">Client</span>
    </h5>
  );

  return (
    <Container className="themed-container">
      <Widget title={title}>
        <ClientForm
          isSubmitting={isEditing}
          defaultValues={defaultValues}
          onCancel={onCancel}
          onSubmit={onSubmit}
          editMode
        />
      </Widget>
      <ConfirmEditDialog
        isOpen={showConfirm}
        onCancel={onCancelEdit}
        onConfirm={onConfirmEdit}
      />
      <Spinner active={isFetching} />
    </Container>
  );
}

export default ClientEdit;
