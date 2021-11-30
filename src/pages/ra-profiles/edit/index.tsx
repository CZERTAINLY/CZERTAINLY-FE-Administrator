import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action } from "redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import RaProfileForm from "components/RaProfileForm";
import ConfirmEditDialog from "components/ConfirmActionDialog";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/ra-profiles";
import { AttributeResponse } from "models/attributes";

function RaProfileEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isEditing = useSelector(selectors.isEditing);
  const raProfile = useSelector(selectors.selectProfileDetail);
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;
  const [showConfirm, toggleConfirmDialog] = useState(false);
  const [editAction, setEditAction] = useState<Action | null>(null);

  const onCancelEdit = useCallback(() => toggleConfirmDialog(false), []);
  const onConfirmEdit = useCallback(
    () => dispatch(editAction),
    [dispatch, editAction]
  );

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      caInstanceUuid: string,
      name: string,
      description: string,
      attributes: AttributeResponse[]
    ) => {
      setEditAction(
        actions.requestUpdateProfile(
          caInstanceUuid,
          uuid,
          name,
          description,
          attributes,
          history
        )
      );
      toggleConfirmDialog(true);
    },
    [history, uuid]
  );

  useEffect(() => {
    dispatch(actions.requestProfileDetail(uuid));
  }, [dispatch, uuid]);

  const title = (
    <h5>
      Edit <span className="fw-semi-bold">RA Profile</span>
    </h5>
  );

  return (
    <Container className="themed-container">
      <Widget title={title}>
        <RaProfileForm
          isSubmitting={isEditing}
          raProfile={raProfile}
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

export default RaProfileEdit;
