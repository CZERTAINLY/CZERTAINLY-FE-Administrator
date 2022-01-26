import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  ButtonGroup,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

import ProgressButton from "components/ProgressButton";
import Select from "react-select";
import { useInputValue } from "utils/hooks";
import { actions as callbackActions } from "ducks/connectors";
import {
  actions as raActions,
  selectors as raSelectors,
} from "ducks/ra-profiles";
import DynamicForm from "components/DynamicForm";
import { attributeCombiner } from "utils/commons";
import { AttributeResponse } from "models/attributes";
import {
  AcmeProfileDetailResponse,
  AcmeProfileResponse,
} from "api/acme-profile";
import Widget from "components/Widget";
import {
  validateCustomIp,
  validateCustomPort,
  validateCustomUrl,
} from "utils/validators";

interface Props {
  editMode?: boolean;
  acmeProfile?: (AcmeProfileResponse & AcmeProfileDetailResponse) | null;
  isSubmitting?: boolean;
  onCancel: () => void;
  onSubmit: (
    name: string,
    description: string,
    termsOfServiceUrl: string,
    dnsResolverIp: string,
    dnsResolverPort: string,
    raProfileUuid: string,
    websiteUrl: string,
    retryInterval: number,
    termsOfServiceChangeDisable: boolean,
    validity: number,
    issueCertificateAttributes: AttributeResponse[],
    revokeCertificateAttributes: AttributeResponse[],
    insistContact: boolean,
    insistTermsOfService: boolean,
    changeTermsOfServiceUrl: string
  ) => void;
}

function AcmeProfileForm({
  editMode,
  isSubmitting = false,
  onCancel,
  onSubmit,
  acmeProfile,
}: Props) {
  const dispatch = useDispatch();

  const raProfiles = useSelector(raSelectors.selectProfiles);

  const selectIssueAttributes = useSelector(
    raSelectors.selectIssuanceAttributes
  );
  const selectRevokeAttributes = useSelector(
    raSelectors.selectRevocationAttributes
  );

  // const callbackResponse = useSelector(callbackSelectors.callbackResponse);

  const [name, setName] = useState(acmeProfile?.name || "");
  const [description, setDescription] = useState(
    acmeProfile?.description || ""
  );
  const [raProfileUuid, setRaProfileUuid] = useState("0");
  const [termsOfServiceUrl, setTermsOfServiceUrl] = useState("");
  const [dnsResolverIp, setDnsResolverIp] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [dnsResolverPort, setDnsResolverPort] = useState("");
  const [retryInterval, setRetryInterval] = useState("30");
  const [validity, setValidity] = useState("5000");
  const [insistContact, setInsistContact] = useState(false);
  const [insistTermsOfService, setInsistTermsOfServiceUrl] = useState(false);
  const [termsOfServiceChangeDisable, setTermsOfServiceChangeApproval] =
    useState(false);

  const [issueEditableAttributes, setIssueEditableAttributes]: any = useState(
    []
  );
  const [issueAttributes, setIssueAttributes] = useState(selectIssueAttributes);
  const [passIssueAttributes, setIssuePassAttributes] = useState<any>(
    selectIssueAttributes
  );
  const [passIssueEditAttributes, setIssuePassEditAttributes] = useState(
    selectIssueAttributes
  );

  const [revokeEditableAttributes, setRevokeEditableAttributes]: any = useState(
    []
  );
  const [revokeAttributes, setRevokeAttributes] = useState(
    selectRevokeAttributes
  );
  const [passRevokeAttributes, setRevokePassAttributes] = useState<any>(
    selectRevokeAttributes
  );
  const [passRevokeEditAttributes, setRevokePassEditAttributes] = useState(
    selectRevokeAttributes
  );
  const [raProfileOptions, setRaProfileOptions] = useState<any>();
  const [changeTermsOfServiceUrl, setChangeTermsOfServiceUrl] = useState<any>();

  const onName = useInputValue(setName);
  const onDescription = useInputValue(setDescription);
  const onWebsiteUrl = useInputValue(setWebsiteUrl);
  const onTermsAndService = useInputValue(setTermsOfServiceUrl);
  const onDnsResolver = useInputValue(setDnsResolverIp);
  const onDnsResolverPort = useInputValue(setDnsResolverPort);
  const onRetryInterval = useInputValue(setRetryInterval);
  const onValidity = useInputValue(setValidity);
  const onChangeTermsOfServiceUrl = useInputValue(setChangeTermsOfServiceUrl);

  const onRaProfile = useCallback(
    (id: string) => {
      dispatch(raActions.requestIssuanceAttributes(id.toString()));
      dispatch(raActions.requestRevokeAttributes(id.toString()));
      setRaProfileUuid(id);
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(raActions.requestRaProfilesList());
  }, [dispatch]);

  useEffect(() => {
    setIssuePassAttributes(selectIssueAttributes);
    setIssueAttributes(selectIssueAttributes);
    setIssuePassEditAttributes(selectIssueAttributes);
  }, [selectIssueAttributes]);

  useEffect(() => {
    setRevokePassAttributes(selectRevokeAttributes);
    setRevokeAttributes(selectRevokeAttributes);
    setRevokePassEditAttributes(selectRevokeAttributes);
  }, [selectRevokeAttributes]);

  const onFormSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      let changedIssueAttributes: AttributeResponse[] = [];
      let changedRevokeAttributes: AttributeResponse[] = [];
      if (!editMode) {
        changedIssueAttributes = issueAttributes;
      } else {
        for (let i of issueAttributes) {
          if (
            JSON.stringify(issueEditableAttributes).indexOf(JSON.stringify(i)) <
              0 ||
            !!i.value
          )
            if (
              typeof i.value === "object" &&
              typeof i.value.id == "undefined"
            ) {
              try {
                i.value = i.value[0];
              } catch {
                console.warn("Non List Items");
              }
            }
          changedIssueAttributes.push(i);
        }
      }

      if (!editMode) {
        changedRevokeAttributes = revokeAttributes;
      } else {
        for (let i of revokeAttributes) {
          if (
            JSON.stringify(revokeEditableAttributes).indexOf(
              JSON.stringify(i)
            ) < 0 ||
            !!i.value
          )
            if (
              typeof i.value === "object" &&
              typeof i.value.id == "undefined"
            ) {
              try {
                i.value = i.value[0];
              } catch {
                console.warn("Non List Items");
              }
            }
          changedRevokeAttributes.push(i);
        }
      }
      onSubmit(
        name,
        description,
        termsOfServiceUrl,
        dnsResolverIp,
        dnsResolverPort,
        raProfileUuid,
        websiteUrl,
        Number(retryInterval),
        termsOfServiceChangeDisable,
        Number(validity),
        changedIssueAttributes,
        changedRevokeAttributes,
        insistContact,
        insistTermsOfService,
        changeTermsOfServiceUrl
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name,
      description,
      termsOfServiceUrl,
      dnsResolverIp,
      dnsResolverPort,
      raProfileUuid,
      retryInterval,
      termsOfServiceChangeDisable,
      validity,
      issueAttributes,
      revokeAttributes,
      websiteUrl,
      insistContact,
      insistTermsOfService,
      changeTermsOfServiceUrl,
    ]
  );

  useEffect(() => {
    setName(acmeProfile?.name || "");
    setDescription(acmeProfile?.description || "");
    setRaProfileUuid(acmeProfile?.raProfileUuid || "");
    setTermsOfServiceUrl(acmeProfile?.termsOfServiceUrl || "");
    setDnsResolverIp(acmeProfile?.dnsResolverIp || "");
    setDnsResolverPort(acmeProfile?.dnsResolverPort || "");
    setRetryInterval(acmeProfile?.retryInterval?.toString() || "");
    setValidity(acmeProfile?.validity?.toString() || "");
    setTermsOfServiceChangeApproval(
      acmeProfile?.termsOfServiceChangeDisable || false
    );
    setWebsiteUrl(acmeProfile?.websiteUrl || "");
    setChangeTermsOfServiceUrl(acmeProfile?.changeTermsOfServiceUrl || "");
    if (editMode) {
      var raProf: any = [];
      if (acmeProfile?.raProfile?.name) {
        raProf.push({
          label: acmeProfile?.raProfile?.name,
          value: acmeProfile?.raProfile?.uuid,
        });
      }
      raProf.push({ label: "NONE", value: "NONE" });
      for (let i of raProfiles) {
        if (i.uuid !== acmeProfile?.raProfile?.uuid) {
          raProf.push({ label: i.name, value: i.uuid });
        }
      }
      setRaProfileOptions(raProf);
      setRaProfileUuid(acmeProfile?.raProfile?.uuid || "NONE");
    }
  }, [acmeProfile, raProfiles, editMode]);

  useEffect(() => {
    const raLength = acmeProfile?.issueCertificateAttributes || [];
    if (raLength.length > 0 && editMode) {
      const edtAttributes = attributeCombiner(
        acmeProfile?.issueCertificateAttributes || [],
        selectIssueAttributes
      );
      setIssueEditableAttributes(edtAttributes);
      setIssuePassEditAttributes(edtAttributes);
    }
  }, [selectIssueAttributes, acmeProfile, editMode]);

  function updateAttributes(formAttributes: AttributeResponse) {
    let updated =
      issueAttributes.length !== 0 ? issueAttributes : selectIssueAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setIssueAttributes(updateAttributes);
  }

  function updateAttributesEdit(formAttributes: AttributeResponse) {
    let updated =
      issueAttributes.length !== 0 ? issueAttributes : issueEditableAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setIssueAttributes(updateAttributes);
  }

  useEffect(() => {
    const raLength = acmeProfile?.revokeCertificateAttributes || [];
    if (raLength.length > 0 && editMode) {
      const edtAttributes = attributeCombiner(
        acmeProfile?.revokeCertificateAttributes || [],
        selectRevokeAttributes
      );
      setRevokeEditableAttributes(edtAttributes);
      setRevokePassEditAttributes(edtAttributes);
    }
  }, [selectRevokeAttributes, acmeProfile, editMode]);

  function updateRevokeAttributes(formAttributes: AttributeResponse) {
    let updated =
      revokeAttributes.length !== 0 ? revokeAttributes : selectRevokeAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setRevokeAttributes(updateAttributes);
  }

  function updateRevokeAttributesEdit(formAttributes: AttributeResponse) {
    let updated =
      revokeAttributes.length !== 0
        ? issueAttributes
        : revokeEditableAttributes;
    let updateAttributes: AttributeResponse[] = [];
    for (let i of updated) {
      if (i.uuid === formAttributes.uuid) {
        updateAttributes.push(formAttributes);
      } else {
        updateAttributes.push(i);
      }
    }
    setRevokeAttributes(updateAttributes);
  }

  const submitTitle = editMode ? "Save" : "Create";
  const inProgressTitle = editMode ? "Saving..." : "Creating...";

  return (
    <Form onSubmit={onFormSubmit}>
      <Row form>
        <Col>
          <FormGroup>
            <Label for="name">ACME Profile Name</Label>
            <Input
              type="text"
              name="name"
              placeholder="RA Profile Name"
              value={name}
              onChange={onName}
              disabled={editMode}
              invalid={name.length === 0}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Description / Comment"
              value={description}
              onChange={onDescription}
            />
          </FormGroup>

          <Widget title="Challenge Configuration">
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
              <Col>
                <FormGroup>
                  <Label for="dnsResolverIp">DNS Resolver IP</Label>
                  <Input
                    type="text"
                    name="dnsResolverIp"
                    placeholder="DNS Resolver IP. If not provided system default will be used"
                    value={dnsResolverIp}
                    onChange={onDnsResolver}
                    valid={validateCustomIp(dnsResolverIp)}
                    invalid={
                      dnsResolverIp ? !validateCustomIp(dnsResolverIp) : false
                    }
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="dnsResolverPort">DNS Resolver Port</Label>
                  <Input
                    type="number"
                    name="dnsResolverPort"
                    placeholder="DNS Resolver Port"
                    value={dnsResolverPort}
                    onChange={onDnsResolverPort}
                    valid={validateCustomPort(dnsResolverPort)}
                    invalid={
                      dnsResolverPort
                        ? !validateCustomPort(dnsResolverPort)
                        : false
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
              <Col>
                <FormGroup>
                  <Label for="retryInterval">Retry Interval (In seconds)</Label>
                  <Input
                    type="number"
                    name="retryInterval"
                    placeholder="Retry Interval"
                    value={retryInterval}
                    onChange={onRetryInterval}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="validity">Order Validity (In seconds)</Label>
                  <Input
                    type="number"
                    name="validity"
                    placeholder="Order Validity"
                    value={validity}
                    onChange={onValidity}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Widget>

          <Widget title="Terms of Service Configuration">
            <Row xs="1" sm="1" md="2" lg="2" xl="2">
              <Col>
                <FormGroup>
                  <Label for="termsOfServiceUrl">Terms of Service URL</Label>
                  <Input
                    type="text"
                    name="termsOfServiceUrl"
                    placeholder="Terms of Service URL"
                    value={termsOfServiceUrl}
                    onChange={onTermsAndService}
                    valid={validateCustomUrl(termsOfServiceUrl)}
                    invalid={
                      termsOfServiceUrl
                        ? !validateCustomUrl(termsOfServiceUrl)
                        : false
                    }
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="websiteUrl">Website URL</Label>
                  <Input
                    type="text"
                    name="websiteUrl"
                    placeholder="Website URL"
                    value={websiteUrl}
                    onChange={onWebsiteUrl}
                    valid={validateCustomUrl(websiteUrl)}
                    invalid={
                      websiteUrl ? !validateCustomUrl(websiteUrl) : false
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row xs="1" sm="1" md="2" lg="2" xl="2">
              <Col>
                <FormGroup>
                  <Label for="changeTermsOfServiceUrl">
                    Changes of Terms of Service URL
                  </Label>
                  <Input
                    type="text"
                    name="changeTermsOfServiceUrl"
                    placeholder="Changes of Terms of Service URL"
                    value={changeTermsOfServiceUrl}
                    onChange={onChangeTermsOfServiceUrl}
                    valid={validateCustomUrl(changeTermsOfServiceUrl)}
                    invalid={
                      changeTermsOfServiceUrl
                        ? !validateCustomUrl(changeTermsOfServiceUrl)
                        : false
                    }
                  />
                </FormGroup>
              </Col>
              <Col className="align-items-center">
                <FormGroup>
                  <Label for="termsOfServiceChangeDisable">
                    Disable new Order (Changes in Terms of Service)
                  </Label>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <Input
                    type="checkbox"
                    name="termsOfServiceChangeDisable"
                    defaultChecked={acmeProfile?.termsOfServiceChangeDisable}
                    onChange={(event) =>
                      setTermsOfServiceChangeApproval(event.target.checked)
                    }
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="insistTermsOfService">
                Require agree on Terms Of Service for new account
              </Label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Input
                type="checkbox"
                name="insistTermsOfService"
                defaultChecked={insistTermsOfService}
                onChange={(event) =>
                  setInsistTermsOfServiceUrl(event.target.checked)
                }
              />
            </FormGroup>

            <FormGroup>
              <Label for="insistContact">
                Require Contact Information for new Accounts
              </Label>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Input
                type="checkbox"
                name="insistContact"
                defaultChecked={acmeProfile?.insistContact}
                onChange={(event) => setInsistContact(event.target.checked)}
              />
            </FormGroup>
          </Widget>

          <Widget title="RA Profile Configuration">
            <FormGroup>
              <Label for="raProfile">Default RA Profile</Label>
              {!editMode ? (
                <Select
                  maxMenuHeight={140}
                  menuPlacement="auto"
                  options={raProfiles
                    ?.map(function (provider) {
                      return {
                        label: provider.name,
                        value: provider.uuid,
                      };
                    })
                    .concat({ label: "NONE", value: "NONE" })}
                  placeholder="Select RA Profile. If not selected, ACME Profile will be created without RA Profile"
                  onChange={(event) => onRaProfile(event?.value || "")}
                />
              ) : (
                <Select
                  maxMenuHeight={140}
                  menuPlacement="auto"
                  defaultInputValue={acmeProfile?.raProfile?.name || "NONE"}
                  options={raProfileOptions}
                  placeholder="Select RA Profile. If not selected, ACME Profile will be created without RA Profile"
                  onChange={(event: any) => onRaProfile(event?.value || "")}
                />
              )}
            </FormGroup>

            {!editMode ? (
              <DynamicForm
                fieldInfo={
                  raProfileUuid !== "0"
                    ? JSON.parse(JSON.stringify(passIssueAttributes))
                    : []
                }
                attributeFunction={updateAttributes}
                actions={callbackActions}
                setPassAttribute={setIssuePassAttributes}
              />
            ) : (
              <DynamicForm
                fieldInfo={
                  raProfileUuid !== "0"
                    ? JSON.parse(JSON.stringify(passIssueEditAttributes))
                    : []
                }
                attributeFunction={updateAttributesEdit}
                editMode={true}
                actions={callbackActions}
                setPassAttribute={setIssuePassEditAttributes}
              />
            )}

            {!editMode ? (
              <DynamicForm
                fieldInfo={
                  raProfileUuid !== "0"
                    ? JSON.parse(JSON.stringify(passRevokeAttributes))
                    : []
                }
                attributeFunction={updateRevokeAttributes}
                actions={callbackActions}
                setPassAttribute={setRevokePassAttributes}
              />
            ) : (
              <DynamicForm
                fieldInfo={
                  raProfileUuid !== "0"
                    ? JSON.parse(JSON.stringify(passRevokeEditAttributes))
                    : []
                }
                attributeFunction={updateRevokeAttributesEdit}
                editMode={true}
                actions={callbackActions}
                setPassAttribute={setRevokePassEditAttributes}
              />
            )}
          </Widget>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <ButtonGroup>
          <Button color="default" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <ProgressButton
            title={submitTitle}
            inProgressTitle={inProgressTitle}
            inProgress={isSubmitting}
          />
        </ButtonGroup>
      </div>
    </Form>
  );
}

export default AcmeProfileForm;
