import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { actions, selectors } from "ducks/ca-authorities";
import { selectors as callbackSelectors } from "ducks/connectors";
import AuthorityForm from "components/AuthorityForm";
import Widget from "components/Widget";
import { Container } from "reactstrap";
import Spinner from "components/Spinner";

function AuthorityAdd() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isCreating = useSelector(selectors.isCreatingAuthority);
  const isFetchingAttributes = useSelector(selectors.isFetchingAttributes);
  const isFetchingCallback = useSelector(callbackSelectors.isFetchingCallback);

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      name: string,
      connectorUuid: string,
      credential: any,
      status: string,
      attributes: any,
      kind: string
    ) => {
      dispatch(
        actions.requestCreateAuthority(
          name,
          connectorUuid,
          credential,
          status,
          attributes,
          kind,
          history
        )
      );
    },
    [dispatch, history]
  );

  const title = (
    <h5>
      Add New <span className="fw-semi-bold">Authority</span>
    </h5>
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <AuthorityForm
          isSubmitting={isCreating}
          onCancel={onCancel}
          onSubmit={onSubmit}
        ></AuthorityForm>
      </Widget>
      <Spinner active={isFetchingCallback || isFetchingAttributes} />
    </Container>
  );
}

export default AuthorityAdd;
