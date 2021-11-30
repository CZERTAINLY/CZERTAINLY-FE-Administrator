import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action } from "redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import AdminForm from "components/AdminForm";
import ConfirmEditDialog from "components/ConfirmActionDialog";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/administrators";

function AdminEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isEditing = useSelector(selectors.isEditing);
  const admin = useSelector(selectors.selectAdministratorDetails);
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;
  const [showConfirm, toggleConfirmDialog] = useState(false);
  const [editAction, setEditAction] = useState<Action | null>(null);

  const defaultValues = {
    ...(admin || {}),
  };

  const onCancelEdit = useCallback(() => toggleConfirmDialog(false), []);
  const onConfirmEdit = useCallback(
    () => dispatch(editAction),
    [dispatch, editAction]
  );

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      name: string,
      surname: string,
      username: string,
      certFile: File,
      description: string,
      _enabled: boolean,
      superAdmin: boolean,
      email: string,
      certificateUuid: string
    ) => {
      setEditAction(
        actions.requestUpdate(
          uuid,
          name,
          surname,
          username,
          email,
          certFile,
          description,
          superAdmin,
          certificateUuid,
          history
        )
      );
      toggleConfirmDialog(true);
    },
    [history, uuid]
  );

  useEffect(() => {
    dispatch(actions.requestDetail(uuid));
  }, [dispatch, uuid]);

  const title = (
    <h5>
      Edit <span className="fw-semi-bold">Administrator</span>
    </h5>
  );

  return (
    <Container className="themed-container">
      <Widget title={title}>
        <AdminForm
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

export default AdminEdit;
