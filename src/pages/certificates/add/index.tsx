import React, { useCallback } from "react";
import { Container } from "reactstrap";

import Widget from "components/Widget";
import { actions, selectors } from "ducks/certificates";
import { selectors as callbackSelectors } from "ducks/connectors";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import CertificateForm from "components/CertificateForm";
import { AttributeResponse } from "models/attributes";
import Spinner from "components/Spinner";

function CreateCertificate() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isCreating = useSelector(selectors.isCreatingCertificate);
  const isFetchingCallback = useSelector(callbackSelectors.isFetchingCallback);
  const isFetchingAttributes = useSelector(selectors.isFetchingAttributes);

  const title = (
    <h5>
      Create new <span className="fw-semi-bold">Certifiate</span>
    </h5>
  );

  const onCancel = useCallback(() => history.goBack(), [history]);

  const onSubmit = useCallback(
    (raProfileUuid: string, pkcs10: File, attributes: AttributeResponse[]) => {
      dispatch(
        actions.requestCreateCertificate(
          raProfileUuid,
          pkcs10,
          attributes,
          history
        )
      );
    },
    [dispatch, history]
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <CertificateForm
          isSubmitting={isCreating}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Widget>
      <Spinner active={isFetchingAttributes || isFetchingCallback} />
    </Container>
  );
}

export default CreateCertificate;
