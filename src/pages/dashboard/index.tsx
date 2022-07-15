import { Col, Container, Row } from "reactstrap";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "components/Spinner";
import { actions, selectors } from "ducks/dashboard";
import CountBadge from "components/DashboardItem/CountBadge";
import CertificateByGroupChart from "components/DashboardItem/CertificateByGroup";
import CertificateByRaProfileChart from "components/DashboardItem/CertificateByRaProfiles";
import CertificateTypesChart from "components/DashboardItem/CertificateByTypes";
import CertificateExpiryChart from "components/DashboardItem/CertificateByExpiry";
import CertificateKeySizeChart from "components/DashboardItem/CertificateByKeySize";
import CertificateConstraintsChart from "components/DashboardItem/CertificateByConstraints";
import CertificateByStatusChart from "components/DashboardItem/CertificateByStatus";

function Dashboard() {
  const dashboard = useSelector(selectors.dashboard);
  const isFetching = useSelector(selectors.isFetching);

  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(actions.getDashboard());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Container className="themed-container" fluid={true}>
      <Row>
        <Col>
          <CountBadge
            data={dashboard?.totalCertificates}
            title="Certificates"
          />
        </Col>
        <Col>
          <CountBadge data={dashboard?.totalGroups} title="Groups" />
        </Col>
        <Col>
          <CountBadge data={dashboard?.totalDiscoveries} title="Discoveries" />
        </Col>
        <Col>
          <CountBadge data={dashboard?.totalRaProfiles} title="RA Profiles" />
        </Col>
      </Row>
      <Row xs="1" sm="1" md="2" lg="2" xl="3">
        <Col>
          <CertificateByStatusChart data={dashboard?.certificateStatByStatus} />
        </Col>
        <Col>
          <CertificateByGroupChart
            data={dashboard?.groupStatByCertificateCount}
          />
        </Col>
        <Col>
          <CertificateByRaProfileChart
            data={dashboard?.raProfileStatByCertificateCount}
          />
        </Col>
        <Col>
          <CertificateTypesChart data={dashboard?.certificateStatByType} />
        </Col>
        <Col>
          <CertificateExpiryChart data={dashboard?.certificateStatByExpiry} />
        </Col>
        <Col>
          <CertificateKeySizeChart data={dashboard?.certificateStatByKeySize} />
        </Col>
        <Col>
          <CertificateConstraintsChart
            data={dashboard?.certificateStatByBasicConstraints}
          />
        </Col>
      </Row>
      <Spinner active={isFetching || dashboard === null} />
    </Container>
  );
}

export default Dashboard;