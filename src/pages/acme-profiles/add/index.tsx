import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Container } from "reactstrap";

import AcmeProfileForm from "components/AcmeProfileForm";
import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/acme-profiles";
import { selectors as profileSelectors } from "ducks/ra-profiles";
import { selectors as callbackSelectors } from "ducks/connectors";
import { AttributeResponse } from "models/attributes";

function RaProfileAdd() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isFetchingAttribute = useSelector(
    profileSelectors.isFetchingAttributes
  );
  const isCreating = useSelector(selectors.isCreating);
  const isFetchingCallback = useSelector(callbackSelectors.isFetchingCallback);

  const onCancel = useCallback(() => history.goBack(), [history]);
  const onSubmit = useCallback(
    (
      name: string,
      description: string,
      termsOfServiceUrl: string,
      dnsResolverIp: string,
      dnsResolverPort: string,
      raProfileUuid: string,
      websiteUrl: string,
      retryInterval: number,
      termsOfServiceChangeApproval: boolean,
      validity: number,
      issueCertificateAttributes: AttributeResponse[],
      revokeCertificateAttributes: AttributeResponse[],
      insistContact,
      insistTermsOfService,
      changeTermsOfServiceUrl
    ) => {
      dispatch(
        actions.requestCreateAcmeProfile(
          name,
          description,
          termsOfServiceUrl,
          dnsResolverIp,
          dnsResolverPort,
          raProfileUuid,
          websiteUrl,
          retryInterval,
          termsOfServiceChangeApproval,
          validity,
          issueCertificateAttributes,
          revokeCertificateAttributes,
          insistContact,
          insistTermsOfService,
          changeTermsOfServiceUrl,
          history
        )
      );
    },
    [dispatch, history]
  );

  const title = (
    <h5>
      Add new <span className="fw-semi-bold">ACME Profile</span>
    </h5>
  );

  return (
    <Container className="themed-container" fluid>
      <Widget title={title}>
        <AcmeProfileForm
          isSubmitting={isCreating}
          onCancel={onCancel}
          onSubmit={onSubmit}
        />
      </Widget>
      <Spinner
        active={isFetching || isFetchingCallback || isFetchingAttribute}
      />
    </Container>
  );
}

export default RaProfileAdd;
