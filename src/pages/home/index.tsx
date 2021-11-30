import React from "react";
import { Container, Row, Col } from "reactstrap";

import Widget from "components/Widget";

function Home() {
  return (
    <Container className="themed-container" fluid>
      <Widget
        title={
          <h2>
            <span className="fw-semi-bold">
              Welcome to CZERTAINLY!
            </span>
          </h2>
        }
      >
        <p>The only tool you need for your certificate management.</p>
        <p>
          CZERTAINLY acts as integration component for certification
          authorities which has the following goals:
        </p>

        <ul>
          <li>
            provide a higher level abstraction on top of certification authority
            configuration
          </li>
          <li>
            introduce agility – change the service configuration on the fly,
            without impact on integrated clients
          </li>
          <li>
            streamline integration procedure and reduce time and costs needed
          </li>
        </ul>

        <p>
          The CZERTAINLY is sitting usually in front of the RA, or can be the
          part of it, or can communicate directly with the CA. Based on the
          definition of profiles and configured authorisation of clients, CZERTAINLY
          will handle the communication with the CA accordingly.
        </p>
        <p>
          Through the CZERTAINLY, you can manage the integration with the CA
          and definition of the profiles, which clients are authorised to which
          profiles, and allow different administrators to take care of the
          solution, including management of different roles and access rules.
        </p>
      </Widget>

      <Row xs="1" sm="1" md="2" lg="2" xl="2">
        <Col>
          <Widget
            title={
              <h2>
                <span className="fw-semi-bold">Guides</span>
              </h2>
            }
          >
            <p>Different guides exists for your reference, including:</p>
            <ul>
              <li>user guide, for administrative users of the CZERTAINLY</li>
              <li>
                administration guide for system administrators on how to install
                and maintain CZERTAINLY
              </li>
              <li>
                integration guide, which describes the integration flow of the
                APIs within applications
              </li>
            </ul>

            <p>The documentation is available on the following link:</p>
            <p>
              <a
                href="https://www.czertainly.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                CZERTAINLY Official Documentation
              </a>
            </p>
          </Widget>
        </Col>
        <Col>
          <Widget
            title={
              <h2>
                <span className="fw-semi-bold">Feedback</span>
              </h2>
            }
          >
            <p>
              We value the cooperation between companies to enhance features and
              functions of the CZERTAINLY. Therefore we would like to encourage
              you to talk with us in case you would like to implement new
              features or in case you have ideas how to improve the CZERTAINLY.
              Your feedback would be definitely discussed and you will receive
              response on what is our standpoint.
            </p>

            <p>For any kind of feedback, use the <br/>
              <a href="mailto: support@czertainly.com">
                CZERTAINLY Support Email
              </a>
              <br/>
              or use the <br/>
              <a href="https://czertainly.atlassian.net/servicedesk/customer/portal/1"
                 target="_blank"
                 rel="noopener noreferrer">
                CZERTAINLY Support Portal
              </a>.
            </p>
          </Widget>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
