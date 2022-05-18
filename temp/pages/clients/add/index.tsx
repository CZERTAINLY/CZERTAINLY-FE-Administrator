import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container } from "reactstrap";

import ClientForm from "components/ClientForm";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/clients";

function ClientAdd() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isCreating = useSelector(selectors.isCreatingClient);

  const title = (
    <h5>
      Add new <span className="fw-semi-bold">Client</span>
    </h5>
  );

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      clientName: string,
      certFile: File,
      description: string,
      enabled: boolean,
      certificateUuid: string
    ) => {
      dispatch(
        actions.requestCreateClient(
          clientName,
          certFile as File,
          description,
          enabled,
          certificateUuid,
          history
        )
      );
    },
    [dispatch, history]
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <ClientForm
          isSubmitting={isCreating}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Widget>
    </Container>
  );
}

export default ClientAdd;
