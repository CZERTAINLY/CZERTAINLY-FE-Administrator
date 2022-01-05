import React from "react";
import { Container } from "reactstrap";

import Widget from "components/Widget";

function About() {
  return (
    <Container className="themed-container" fluid>
      <Widget
        title={
          <h2>
            <span className="fw-semi-bold">About</span>
          </h2>
        }
      >
        <p>CZERTAINLY for certificate management and automation.</p>
        <ul>
          <li>
            Developer:{" "}
            <a
              href="https://www.3key.company"
              target="_blank"
              rel="noopener noreferrer"
            >
              3Key Company s.r.o.
            </a>
          </li>
        </ul>
      </Widget>

      <Widget
        title={
          <h2>
            <span className="fw-semi-bold">Support</span>
          </h2>
        }
      >
        <p>
          If you find a bug or unexpected working behaviour in the platform,
          kindly let us know using the following support email address:
        </p>
        <p>
          <a href="mailto: support@czertainly.com">CZERTAINLY Support Email</a>{" "}
          or use the{" "}
          <a
            href="https://czertainly.atlassian.net/servicedesk/customer/portal/1"
            target="_blank"
            rel="noopener noreferrer"
          >
            CZERTAINLY Support Portal
          </a>
        </p>
        <p>
          For better identification of the issue, please include the following
          in your email:
        </p>
        <ul>
          <li>Version - version of CZERTAINLY from this page</li>
          <li>Contract ID - contract identification for CZERTAINLY</li>
          <li>
            Description - description of the issue. Include as much detail as
            possible, screenshots, logs, anything which can help us to reproduce
            the issue and will streamline the analysis and resolution
          </li>
        </ul>
      </Widget>
    </Container>
  );
}

export default About;
