import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container } from "reactstrap";

import RaProfileForm from "components/RaProfileForm";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/ra-profiles";
import { selectors as callbackSelectors } from "ducks/connectors";
import { AttributeResponse } from "models/attributes";

function RaProfileAdd() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isCreating = useSelector(selectors.isCreating);
  const isFetchingCallback = useSelector(callbackSelectors.isFetchingCallback);
  const isFetchingAttributes = useSelector(selectors.isFetchingAttributes);

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      caInstanceUuid: string,
      name: string,
      description: string,
      attributes: AttributeResponse[]
    ) => {
      dispatch(
        actions.requestCreateRaProfile(
          caInstanceUuid,
          name,
          description,
          attributes,
          history
        )
      );
    },
    [dispatch, history]
  );

  const title = (
    <h5>
      Add new <span className="fw-semi-bold">RA Profile</span>
    </h5>
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <RaProfileForm
          isSubmitting={isCreating}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Widget>
      <Spinner
        active={isFetching || isFetchingCallback || isFetchingAttributes}
      />
    </Container>
  );
}

export default RaProfileAdd;
