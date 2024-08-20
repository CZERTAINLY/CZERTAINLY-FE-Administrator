import AttributeEditor from 'components/Attributes/AttributeEditor';
import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';
import ProgressButton from 'components/ProgressButton';
import Spinner from 'components/Spinner';
import StatusBadge from 'components/StatusBadge';
import CertificateList from 'components/_pages/certificates/list';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/locations';
import { actions as raActions, selectors as raSelectors } from 'ducks/ra-profiles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import { Badge, Form as BootstrapForm, Button, ButtonGroup, Container, FormGroup, Label } from 'reactstrap';
import { AttributeDescriptorModel } from 'types/attributes';

import { mutators } from 'utils/attributes/attributeEditorMutators';
import { collectFormAttributes, getAttributeContent } from 'utils/attributes/attributes';
import { actions as customAttributesActions, selectors as customAttributesSelectors } from '../../../../ducks/customAttributes';

import { LockWidgetNameEnum } from 'types/user-interface';
import { validateRequired } from 'utils/validators';
import { CertificateState, Resource } from '../../../../types/openapi';
import CustomAttributeWidget from '../../../Attributes/CustomAttributeWidget';
import TabLayout from '../../../Layout/TabLayout';
import CertificateStatusBadge from '../../../_pages/certificates/CertificateStatus';

import cx from 'classnames';
import style from './locationDetail.module.scss';

export default function LocationDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { entityId, id } = useParams();

    const location = useSelector(selectors.location);
    const pushAttributeDescriptors = useSelector(selectors.pushAttributeDescriptors);
    const csrAttributeDescriptors = useSelector(selectors.csrAttributeDescriptors);
    const raProfiles = useSelector(raSelectors.raProfiles);
    const issuanceAttributeDescriptors = useSelector(raSelectors.issuanceAttributes);

    const resourceCustomAttributes = useSelector(customAttributesSelectors.secondaryResourceCustomAttributes);
    const isFetchingResourceCustomAttributes = useSelector(customAttributesSelectors.isFetchingResourceCustomAttributes);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);
    const isFetchingPushAttributeDescriptors = useSelector(selectors.isFetchingPushAttributeDescriptors);
    const isFetchingCSRAttributeDescriptors = useSelector(selectors.isFetchingCSRAttributeDescriptors);
    const isPushingCertificate = useSelector(selectors.isPushingCertificate);
    const isIssuingCertificate = useSelector(selectors.isIssuingCertificate);
    const isRemovingCertificate = useSelector(selectors.isRemovingCertificate);
    const isRenewingCertificate = useSelector(selectors.isAutoRenewingCertificate);
    const isSyncing = useSelector(selectors.isSyncing);

    const isFetchingRaProfiles = useSelector(raSelectors.isFetchingList);
    const isFetchingIssuanceAttributes = useSelector(raSelectors.isFetchingIssuanceAttributes);

    const [issueGroupAttributesCallbackAttributes, setIssueGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [pushGroupAttributesCallbackAttributes, setPushGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);
    const [csrGroupAttributesCallbackAttributes, setCsrGroupAttributesCallbackAttributes] = useState<AttributeDescriptorModel[]>([]);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const [confirmRemoveDialog, setConfirmRemoveDialog] = useState<boolean>(false);
    const [issueDialog, setIssueDialog] = useState<boolean>(false);
    const [pushDialog, setPushDialog] = useState<boolean>(false);

    const [certCheckedRows, setCertCheckedRows] = useState<string[]>([]);

    const [selectedCerts, setSelectedCerts] = useState<string[]>([]);

    const isBusy = useMemo(
        () =>
            isFetching ||
            isDeleting ||
            isFetchingPushAttributeDescriptors ||
            isFetchingCSRAttributeDescriptors ||
            isFetchingResourceCustomAttributes,
        [isFetching, isDeleting, isFetchingPushAttributeDescriptors, isFetchingCSRAttributeDescriptors, isFetchingResourceCustomAttributes],
    );

    const getFreshLocationDetails = useCallback(() => {
        dispatch(customAttributesActions.listSecondaryResourceCustomAttributes(Resource.Certificates));

        if (!id || !entityId) return;
        dispatch(actions.getLocationDetail({ entityUuid: entityId!, uuid: id! }));
    }, [dispatch, entityId, id]);

    useEffect(() => {
        getFreshLocationDetails();
    }, [id, getFreshLocationDetails]);

    useEffect(() => {
        if (!id || !entityId || !location || !location.uuid) return;

        if (location.enabled) {
            dispatch(actions.getPushAttributes({ entityUuid: entityId, uuid: id }));
            dispatch(actions.getCSRAttributes({ entityUuid: entityId, uuid: id }));
        }
    }, [dispatch, id, location, entityId]);

    useEffect(() => {
        if (!isPushingCertificate) setPushDialog(false);
    }, [isPushingCertificate]);

    useEffect(() => {
        if (!issueDialog) return;

        dispatch(raActions.resetState());
        dispatch(raActions.listRaProfiles());
    }, [dispatch, issueDialog]);

    const onEditClick = useCallback(() => {
        if (!location) return;
        navigate(`../../../edit/${location.entityInstanceUuid}/${location.uuid}`, { relative: 'path' });
    }, [location, navigate]);

    const onEnableClick = useCallback(() => {
        if (!location) return;
        dispatch(actions.enableLocation({ entityUuid: location.entityInstanceUuid, uuid: location.uuid }));
    }, [dispatch, location]);

    const onDisableClick = useCallback(() => {
        if (!location) return;
        dispatch(actions.disableLocation({ entityUuid: location.entityInstanceUuid, uuid: location.uuid }));
    }, [dispatch, location]);

    const onRemoveConfirmed = useCallback(() => {
        if (!location || certCheckedRows.length === 0) return;

        certCheckedRows.forEach((certUuid) => {
            dispatch(
                actions.removeCertificate({
                    entityUuid: location.entityInstanceUuid,
                    locationUuid: location.uuid,
                    certificateUuid: certUuid,
                }),
            );
        });

        setConfirmRemoveDialog(false);
        setCertCheckedRows([]);
    }, [dispatch, location, certCheckedRows]);

    const onRenewClick = useCallback(() => {
        if (!location) return;

        for (const certUuid of certCheckedRows) {
            dispatch(
                actions.autoRenewCertificate({
                    entityUuid: location.entityInstanceUuid,
                    locationUuid: location.uuid,
                    certificateUuid: certUuid,
                }),
            );
        }
    }, [certCheckedRows, dispatch, location]);

    const onSyncClick = useCallback(() => {
        if (!location) return;

        dispatch(actions.syncLocation({ entityUuid: location.entityInstanceUuid, uuid: location.uuid }));
    }, [dispatch, location]);

    const onPushSubmit = useCallback(
        (values: any) => {
            if (selectedCerts.length === 0 || !location) return;

            const attrs = collectFormAttributes(
                'pushAttributes',
                [...(pushAttributeDescriptors ?? []), ...pushGroupAttributesCallbackAttributes],
                values,
            );

            selectedCerts.forEach((certUuid) => {
                dispatch(
                    actions.pushCertificate({
                        entityUuid: location.entityInstanceUuid,
                        locationUuid: location.uuid,
                        certificateUuid: certUuid,
                        pushRequest: { attributes: attrs },
                    }),
                );
            });
        },
        [dispatch, location, pushAttributeDescriptors, selectedCerts, pushGroupAttributesCallbackAttributes],
    );

    const onIssueSubmit = useCallback(
        (values: any) => {
            if (!location) return;

            const issueAttrs = collectFormAttributes(
                'issueAttributes',
                [...(issuanceAttributeDescriptors ?? []), ...issueGroupAttributesCallbackAttributes],
                values,
            );
            const csrAttrs = collectFormAttributes(
                'csrAttributes',
                [...(csrAttributeDescriptors ?? []), ...csrGroupAttributesCallbackAttributes],
                values,
            );
            const certificateCustomAttributes = collectFormAttributes('customCertificate', resourceCustomAttributes, values);
            dispatch(
                actions.issueCertificate({
                    entityUuid: location.entityInstanceUuid,
                    locationUuid: location.uuid,
                    issueRequest: {
                        raProfileUuid: values.raProfile.value.split(':#')[0],
                        csrAttributes: csrAttrs,
                        issueAttributes: issueAttrs,
                        certificateCustomAttributes: certificateCustomAttributes,
                    },
                }),
            );
            setIssueDialog(false);
        },
        [
            csrAttributeDescriptors,
            dispatch,
            issuanceAttributeDescriptors,
            location,
            issueGroupAttributesCallbackAttributes,
            csrGroupAttributesCallbackAttributes,
            resourceCustomAttributes,
        ],
    );

    const onDeleteConfirmed = useCallback(() => {
        if (!location) return;

        dispatch(actions.deleteLocation({ entityUuid: location.entityInstanceUuid, uuid: location.uuid, redirect: '../../../locations' }));
        setConfirmDelete(false);
    }, [location, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditClick();
                },
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
            {
                icon: 'check',
                disabled: location?.enabled || false,
                tooltip: 'Enable',
                onClick: () => {
                    onEnableClick();
                },
            },
            {
                icon: 'times',
                disabled: !location?.enabled || false,
                tooltip: 'Disable',
                onClick: () => {
                    onDisableClick();
                },
            },
        ],
        [location?.enabled, onDisableClick, onEditClick, onEnableClick],
    );

    const selectedCertificateDetails = useMemo(() => {
        const selectedCert = location?.certificates.find((c) => c.certificateUuid === certCheckedRows[0]);
        return selectedCert;
    }, [location, certCheckedRows]);

    const certButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'trash',
                disabled: certCheckedRows.length === 0,
                tooltip: 'Remove',
                onClick: () => {
                    setConfirmRemoveDialog(true);
                },
            },
            {
                icon: 'push',
                disabled: !location?.supportMultipleEntries && (location ? location.certificates.length > 0 : false),
                tooltip: 'Push',
                onClick: () => {
                    setPushDialog(true);
                },
            },
            {
                icon: 'cubes',
                disabled: !location?.supportKeyManagement,
                tooltip: 'Issue',
                onClick: () => {
                    setIssueDialog(true);
                },
            },
            {
                icon: 'retweet',
                disabled: certCheckedRows.length === 0 || selectedCertificateDetails?.state === CertificateState.Requested,
                tooltip: 'Renew',
                onClick: () => {
                    onRenewClick();
                },
            },
            {
                icon: 'sync',
                disabled: false,
                tooltip: 'Sync',
                onClick: () => {
                    onSyncClick();
                },
            },
        ],
        [certCheckedRows.length, location, onRenewClick, onSyncClick, selectedCertificateDetails?.state],
    );

    const detailHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'property',
                content: 'Property',
            },
            {
                id: 'value',
                content: 'Value',
            },
        ],
        [],
    );

    const detailData: TableDataRow[] = useMemo(
        () =>
            !location
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', location.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', location.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', location.description || ''],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <StatusBadge enabled={location.enabled} />],
                      },
                      {
                          id: 'entityUuid',
                          columns: ['Entity UUID', location.entityInstanceUuid],
                      },
                      {
                          id: 'entityName',
                          columns: [
                              'Entity Name',
                              location.entityInstanceUuid ? (
                                  <Link to={`../../entities/detail/${location.entityInstanceUuid}`}>{location.entityInstanceName}</Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                  ],
        [location],
    );

    const certHeaders: TableHeader[] = useMemo(
        () => [
            {
                id: 'cn',
                content: 'Common Name',
                sortable: true,
                width: '15%',
            },
            {
                id: 'cs',
                content: 'State',
                sortable: true,
                width: '15%',
            },
            {
                id: 'vs',
                content: 'Validation Status',
                sortable: true,
                width: '15%',
            },
            {
                id: 'pk',
                align: 'center',
                content: 'Private Key',
                sortable: true,
                width: '5%',
            },
            {
                id: 'metadata',
                content: 'Metadata',
                width: '40%',
            },
            {
                id: 'CSR Detail',
                content: 'CSR Detail',
                width: '35%',
            },
        ],
        [],
    );

    const certData: TableDataRow[] = useMemo(
        () =>
            !location
                ? []
                : location.certificates.map((cert) => ({
                      id: cert.certificateUuid,
                      columns: [
                          <Link
                              className={cx({ [style.newCertificateColumn]: cert.state === CertificateState.Requested })}
                              key={cert.certificateUuid}
                              to={`../../../certificates/detail/${cert.certificateUuid}`}
                          >
                              {cert.commonName || 'empty'}
                          </Link>,
                          <CertificateStatusBadge status={cert.state} />,
                          <CertificateStatusBadge status={cert.validationStatus} />,
                          cert.withKey ? <Badge color="success">Yes</Badge> : <Badge color="danger">No</Badge>,

                          !cert.metadata || cert.metadata.length === 0 ? (
                              ''
                          ) : (
                              <div
                                  style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '20em', overflow: 'hidden' }}
                                  className={cx({ [style.newCertificateColumn]: cert.state === CertificateState.Requested })}
                              >
                                  {cert.metadata.map((atr) => atr.connectorName + ' (' + atr.items.length + ')').join(', ')}
                              </div>
                          ),

                          !cert.csrAttributes || cert.csrAttributes.length === 0 ? (
                              ''
                          ) : (
                              <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '20em', overflow: 'hidden' }}>
                                  {cert.csrAttributes.map((atr) => getAttributeContent(atr.contentType, atr.content) ?? '').join(', ')}
                              </div>
                          ),
                      ],

                      detailColumns: [
                          <></>,
                          <></>,
                          <></>,
                          <></>,
                          <></>,
                          cert.metadata?.length ? (
                              <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA_FLAT} metadata={cert.metadata} />
                          ) : (
                              <></>
                          ),
                          cert.csrAttributes?.length ? (
                              <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.ATTRIBUTE} attributes={cert.csrAttributes} />
                          ) : (
                              <></>
                          ),
                      ],
                  })),
        [location],
    );

    return (
        <Container className="themed-container" fluid>
            <TabLayout
                tabs={[
                    {
                        title: 'Details',
                        content: (
                            <Widget>
                                <Widget
                                    title="Location Properties"
                                    busy={isBusy}
                                    widgetButtons={buttons}
                                    titleSize="large"
                                    refreshAction={getFreshLocationDetails}
                                    widgetLockName={LockWidgetNameEnum.LocationDetails}
                                >
                                    <br />

                                    <CustomTable headers={detailHeaders} data={detailData} />
                                </Widget>

                                <Widget
                                    title="Location Certificates"
                                    titleSize="large"
                                    widgetButtons={certButtons}
                                    busy={
                                        isRenewingCertificate ||
                                        isPushingCertificate ||
                                        isRemovingCertificate ||
                                        isSyncing ||
                                        isIssuingCertificate
                                    }
                                >
                                    <br />

                                    <Label>Location certificates</Label>

                                    <CustomTable
                                        headers={certHeaders}
                                        data={certData}
                                        hasCheckboxes={true}
                                        multiSelect={false}
                                        onCheckedRowsChanged={(rows) => {
                                            setCertCheckedRows(rows as string[]);
                                        }}
                                        hasDetails={true}
                                    />
                                </Widget>
                            </Widget>
                        ),
                    },
                    {
                        title: 'Attributes',
                        content: (
                            <Widget>
                                <Widget title="Attributes" titleSize="large">
                                    <br />

                                    <Label>Location Attributes</Label>
                                    <AttributeViewer attributes={location?.attributes} />
                                </Widget>
                                {location && (
                                    <CustomAttributeWidget
                                        resource={Resource.Locations}
                                        resourceUuid={location.uuid}
                                        attributes={location.customAttributes}
                                    />
                                )}

                                <Widget title="Metadata" titleSize="large">
                                    <br />
                                    {location?.metadata && (
                                        <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={location.metadata} />
                                    )}
                                </Widget>
                            </Widget>
                        ),
                    },
                ]}
            />

            <Dialog
                isOpen={confirmDelete}
                caption="Delete Location"
                body="You are about to delete Location. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={confirmRemoveDialog}
                caption={`Remove ${certCheckedRows.length === 1 ? 'certificate' : 'certificates'} from the location`}
                body={
                    <>
                        You are about to remove certificates from the location:
                        <br />
                        {certCheckedRows.map((uuid) => {
                            const cert = location?.certificates.find((c) => c.certificateUuid === uuid);
                            return cert ? (
                                <>
                                    {cert.commonName || 'empty'}
                                    <br />
                                </>
                            ) : (
                                <></>
                            );
                        })}
                        <br />
                        <br />
                        Is this what you want to do?
                    </>
                }
                toggle={() => setConfirmRemoveDialog(false)}
                buttons={[
                    { color: 'danger', onClick: onRemoveConfirmed, body: 'Yes, remove' },
                    { color: 'secondary', onClick: () => setConfirmRemoveDialog(false), body: 'Cancel' },
                ]}
            />

            <Dialog
                isOpen={pushDialog}
                caption="Push certificate to the location"
                toggle={() => setPushDialog(false)}
                buttons={[]}
                size="xl"
                body={
                    <>
                        <CertificateList
                            selectCertsOnly={true}
                            multiSelect={false}
                            hideWidgetButtons
                            onCheckedRowsChanged={(certs: (string | number)[]) => setSelectedCerts(certs as string[])}
                        />

                        <Form onSubmit={onPushSubmit} mutators={{ ...mutators() }}>
                            {({ handleSubmit, pristine, submitting, valid }) => (
                                <BootstrapForm onSubmit={handleSubmit}>
                                    <AttributeEditor
                                        id="pushAttributes"
                                        attributeDescriptors={pushAttributeDescriptors!}
                                        groupAttributesCallbackAttributes={pushGroupAttributesCallbackAttributes}
                                        setGroupAttributesCallbackAttributes={setPushGroupAttributesCallbackAttributes}
                                    />

                                    <div style={{ textAlign: 'right' }}>
                                        <ButtonGroup>
                                            <ProgressButton
                                                inProgress={isPushingCertificate}
                                                title="Push"
                                                type="submit"
                                                color="primary"
                                                disabled={pristine || submitting || !valid || selectedCerts.length === 0}
                                                onClick={handleSubmit}
                                            />

                                            <Button
                                                type="button"
                                                color="secondary"
                                                disabled={submitting}
                                                onClick={() => setPushDialog(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                </BootstrapForm>
                            )}
                        </Form>

                        <Spinner active={isPushingCertificate || isRemovingCertificate} />
                    </>
                }
            />

            <Dialog
                isOpen={issueDialog}
                caption="Issue certificate for the location"
                toggle={() => setIssueDialog(false)}
                buttons={[]}
                size="lg"
                body={
                    <>
                        <Form onSubmit={onIssueSubmit} mutators={{ ...mutators() }}>
                            {({ handleSubmit, pristine, submitting, valid }) => (
                                <BootstrapForm onSubmit={handleSubmit}>
                                    <Field name="raProfile" validate={validateRequired()}>
                                        {({ input, meta }) => (
                                            <FormGroup>
                                                <Label for="certificateSelect">RA Profile</Label>

                                                <Select
                                                    {...input}
                                                    inputId="certificateSelect"
                                                    maxMenuHeight={140}
                                                    menuPlacement="auto"
                                                    options={raProfiles.map((p) => ({
                                                        value: p.uuid + ':#' + p.authorityInstanceUuid,
                                                        label: p.name,
                                                    }))}
                                                    placeholder="Select RA profile"
                                                    styles={{
                                                        control: (provided) =>
                                                            meta.touched && meta.invalid
                                                                ? {
                                                                      ...provided,
                                                                      border: 'solid 1px red',
                                                                      '&:hover': { border: 'solid 1px red' },
                                                                  }
                                                                : { ...provided },
                                                    }}
                                                    onChange={(value) => {
                                                        input.onChange(value);
                                                        dispatch(
                                                            raActions.listIssuanceAttributeDescriptors({
                                                                authorityUuid: value.value.split(':#')[1],
                                                                uuid: value.value.split(':#')[0],
                                                            }),
                                                        );
                                                    }}
                                                />

                                                <div
                                                    className="invalid-feedback"
                                                    style={meta.touched && meta.invalid ? { display: 'block' } : {}}
                                                >
                                                    {meta.error}
                                                </div>
                                            </FormGroup>
                                        )}
                                    </Field>

                                    <br />

                                    <TabLayout
                                        tabs={[
                                            {
                                                title: 'Certificate Signing Request Attributes',
                                                content: csrAttributeDescriptors ? (
                                                    <AttributeEditor
                                                        id="csrAttributes"
                                                        attributeDescriptors={csrAttributeDescriptors}
                                                        groupAttributesCallbackAttributes={csrGroupAttributesCallbackAttributes}
                                                        setGroupAttributesCallbackAttributes={setCsrGroupAttributesCallbackAttributes}
                                                    />
                                                ) : (
                                                    <></>
                                                ),
                                            },
                                            {
                                                title: 'RA Profile Issue Attributes',
                                                content: issuanceAttributeDescriptors ? (
                                                    <AttributeEditor
                                                        id="issueAttributes"
                                                        attributeDescriptors={issuanceAttributeDescriptors}
                                                        groupAttributesCallbackAttributes={issueGroupAttributesCallbackAttributes}
                                                        setGroupAttributesCallbackAttributes={setIssueGroupAttributesCallbackAttributes}
                                                    />
                                                ) : (
                                                    <></>
                                                ),
                                            },
                                            {
                                                title: 'Certificate Custom Attributes',
                                                content: (
                                                    <AttributeEditor
                                                        id="customCertificate"
                                                        attributeDescriptors={resourceCustomAttributes}
                                                    />
                                                ),
                                            },
                                        ]}
                                    />

                                    <div style={{ textAlign: 'right' }}>
                                        <ButtonGroup>
                                            <ProgressButton
                                                inProgress={isPushingCertificate}
                                                title="Issue"
                                                type="submit"
                                                color="primary"
                                                disabled={pristine || submitting || !valid}
                                                onClick={handleSubmit}
                                            />

                                            <Button
                                                type="button"
                                                color="secondary"
                                                disabled={submitting}
                                                onClick={() => setIssueDialog(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </ButtonGroup>
                                    </div>
                                </BootstrapForm>
                            )}
                        </Form>

                        <Spinner
                            active={isFetchingRaProfiles || isFetchingIssuanceAttributes || isIssuingCertificate || isRemovingCertificate}
                        />
                    </>
                }
            />
        </Container>
    );
}
