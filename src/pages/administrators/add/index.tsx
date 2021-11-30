import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container } from "reactstrap";

import AdminForm from "components/AdminForm";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/administrators";

function AdminAdd() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isCreating = useSelector(selectors.isCreating);

  const title = (
    <h5>
      Add new <span className="fw-semi-bold">Administrator</span>
    </h5>
  );

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      name: string,
      surname: string,
      username: string,
      certFile: File,
      description: string,
      enabled: boolean,
      superAdmin: boolean,
      email: string,
      certificateUuid: string
    ) => {
      dispatch(
        actions.requestCreate(
          name,
          surname,
          username,
          email,
          certFile as File,
          description,
          superAdmin,
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
        <AdminForm
          isSubmitting={isCreating}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Widget>
    </Container>
  );
}

export default AdminAdd;
