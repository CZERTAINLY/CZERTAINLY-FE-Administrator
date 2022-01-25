import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Container } from "reactstrap";

import Spinner from "components/Spinner";
import Widget from "components/Widget";
import { actions, selectors } from "ducks/acme-profiles";
import { selectors as callbackSelectors } from "ducks/connectors";
import { AttributeResponse } from "models/attributes";
import AcmeProfileForm from "components/AcmeProfileForm";

function RaProfileEdit() {
  const dispatch = useDispatch();
  const history = useHistory();
  const isFetching = useSelector(selectors.isFetching);
  const isEditing = useSelector(selectors.isEditing);
  const acmeProfile = useSelector(selectors.selectSelectedProfile);
  const isFetchingCallback = useSelector(callbackSelectors.isFetchingCallback);
  const { params } = useRouteMatch();
  const uuid = (params as any).id as string;

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
        actions.requestUpdateProfile(
          uuid,
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
    [dispatch, history, uuid]
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
        <AcmeProfileForm
          isSubmitting={isEditing}
          acmeProfile={acmeProfile}
          onCancel={onCancel}
          onSubmit={onSubmit}
          editMode={true}
        />
      </Widget>
      <Spinner active={isFetching || isFetchingCallback} />
    </Container>
  );
}

export default RaProfileEdit;
