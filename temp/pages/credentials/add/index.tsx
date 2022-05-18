import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { actions, selectors } from "ducks/credentials";
import { selectors as callbackSelectors } from "ducks/connectors";
import CredentialForm from "components/CredentialForm";
import Widget from "components/Widget";
import { Container } from "reactstrap";
import Spinner from "components/Spinner";

function CredentialAdd() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isCreating = useSelector(selectors.isCreatingCredential);
  const isFetchingCallback = useSelector(callbackSelectors.isFetchingCallback);
  const isFetchingAttributes = useSelector(selectors.isFetchingAttributes);

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (name: string, kind: string, connectorUuid: string, attributes: any) => {
      dispatch(
        actions.requestCreateCredential(
          name,
          kind,
          connectorUuid,
          attributes,
          history
        )
      );
    },
    [dispatch, history]
  );

  const title = (
    <h5>
      Add New <span className="fw-semi-bold">Credential</span>
    </h5>
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <CredentialForm
          isSubmitting={isCreating}
          onCancel={onCancel}
          onSubmit={onSubmit}
        ></CredentialForm>
      </Widget>
      <Spinner active={isFetchingCallback || isFetchingAttributes} />
    </Container>
  );
}

export default CredentialAdd;
