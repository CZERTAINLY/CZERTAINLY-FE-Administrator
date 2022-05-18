import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Action } from "redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";
import ConfirmEditDialog from "components/ConfirmActionDialog";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/credentials";
import CredentialForm from "components/CredentialForm";

function CredentialEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isEditing = useSelector(selectors.isEditing);
  const credential = useSelector(selectors.selectSelectedCredential);
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;
  const [showConfirm, toggleConfirmDialog] = useState(false);
  const [editAction, setEditAction] = useState<Action | null>(null);
  const resetValueAttributeTypes = ["file", "secret"];

  const defaultValues = {
    ...(credential || { attributes: [] }),
  };

  const onCancelEdit = useCallback(() => toggleConfirmDialog(false), []);
  const onConfirmEdit = useCallback(() => {
    toggleConfirmDialog(true);
    dispatch(editAction);
  }, [dispatch, editAction]);

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (name: string, kind: string, connectorUuid: string, attributes: any) => {
      setEditAction(
        actions.requestUpdateCredential(
          uuid,
          name,
          kind,
          connectorUuid,
          attributes,
          history
        )
      );
      toggleConfirmDialog(true);
    },
    [history, uuid]
  );

  useEffect(() => {
    dispatch(actions.requestCredentialDetail(uuid));
  }, [dispatch, uuid]);

  const title = (
    <h5>
      Edit <span className="fw-semi-bold">Credential</span>
    </h5>
  );

  const getAttributes = () => {
    let editableAttributes = [];
    for (let i of credential?.attributes || []) {
      if (resetValueAttributeTypes.includes(i.type)) {
        let updated = i;
        i.value = "";
        editableAttributes.push(updated);
      } else {
        editableAttributes.push(i);
      }
    }
    let updated = defaultValues || { attributes: [] };
    updated["attributes"] = editableAttributes;
    return updated;
  };

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <CredentialForm
          defaultValues={getAttributes()}
          isSubmitting={isEditing}
          onCancel={onCancel}
          onSubmit={onSubmit}
          editMode={true}
        ></CredentialForm>
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

export default CredentialEdit;
