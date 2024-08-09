import AttributeViewer, { ATTRIBUTE_VIEWER_TYPE } from 'components/Attributes/AttributeViewer';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Dialog from 'components/Dialog';

import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { actions, selectors } from 'ducks/discoveries';
import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { Col, Container, Label, Row } from 'reactstrap';

import CustomAttributeWidget from 'components/Attributes/CustomAttributeWidget';
import TabLayout from 'components/Layout/TabLayout';
import { actions as rulesActions, selectors as ruleSelectors } from 'ducks/rules';
import { LockWidgetNameEnum } from 'types/user-interface';
import { dateFormatter } from 'utils/dateUtil';
import { PlatformEnum, Resource } from '../../../../types/openapi';
import DiscoveryStatus from '../DiscoveryStatus';
import DiscoveryCertificates from './DiscoveryCertificates';

export default function DiscoveryDetail() {
    const dispatch = useDispatch();

    const { id } = useParams();

    const discovery = useSelector(selectors.discovery);

    const isFetching = useSelector(selectors.isFetchingDetail);
    const isDeleting = useSelector(selectors.isDeleting);

    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const eventNameEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.ResourceEvent));
    const triggerHistorySummary = useSelector(ruleSelectors.triggerHistorySummary);
    const isFetchingTriggerSummary = useSelector(ruleSelectors.isFetchingTriggerHistorySummary);
    const isFetchingRuleTriggerHistories = useSelector(ruleSelectors.isFetchingTriggerHistories);

    const isBusy = useMemo(
        () => isFetching || isDeleting || isFetchingRuleTriggerHistories,
        [isFetching, isDeleting, isFetchingRuleTriggerHistories],
    );
    const resourceTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.Resource));
    const triggerTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.TriggerType));

    // useEffect(() => {
    //     if (!id) return;
    //     dispatch(rulesActions.getTriggerHistorySummary({ triggerObjectUuid: id }));
    // }, [id, dispatch]);

    const getFreshTriggerHistorySummary = useCallback(() => {
        if (!id) return;
        dispatch(rulesActions.getTriggerHistorySummary({ triggerObjectUuid: id }));
    }, [id, dispatch]);

    const getFreshDiscoveryDetails = useCallback(() => {
        if (!id) return;
        dispatch(actions.resetState());
        dispatch(actions.getDiscoveryDetail({ uuid: id }));
        dispatch(rulesActions.getTriggerHistorySummary({ triggerObjectUuid: id }));
    }, [id, dispatch]);

    useEffect(() => {
        getFreshDiscoveryDetails();
    }, [id, getFreshDiscoveryDetails]);

    const onDeleteConfirmed = useCallback(() => {
        if (!discovery) return;

        dispatch(actions.deleteDiscovery({ uuid: discovery.uuid }));
        setConfirmDelete(false);
    }, [discovery, dispatch]);

    const buttons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    setConfirmDelete(true);
                },
            },
        ],
        [],
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
            !discovery
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', discovery.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', discovery.name],
                      },
                      {
                          id: 'kind',
                          columns: ['Kind', discovery.kind],
                      },
                      {
                          id: 'discoveryProviderUUID',
                          columns: ['Discovery Provider UUID', discovery.connectorUuid],
                      },
                      {
                          id: 'discoveryProviderName',
                          columns: [
                              'Discovery Provider Name',
                              discovery.connectorUuid ? (
                                  <Link to={`../../connectors/detail/${discovery.connectorUuid}`}>{discovery.connectorName}</Link>
                              ) : (
                                  ''
                              ),
                          ],
                      },
                      {
                          id: 'status',
                          columns: ['Status', <DiscoveryStatus status={discovery.status} />],
                      },
                      {
                          id: 'startTime',
                          columns: [
                              'Discovery Start Time',
                              <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(discovery.startTime)}</span>,
                          ],
                      },
                      {
                          id: 'endTime',
                          columns: ['Discovery End Time', <span style={{ whiteSpace: 'nowrap' }}>{dateFormatter(discovery.endTime)}</span>],
                      },
                      {
                          id: 'totalCertificatesDiscovered',
                          columns: ['Total Certificates Discovered', discovery.totalCertificatesDiscovered?.toString() || '0'],
                      },
                      {
                          id: 'message',
                          columns: ['Message', discovery.message || ''],
                      },
                  ],
        [discovery],
    );

    const triggerHeaders: TableHeader[] = [
        {
            id: 'name',
            content: 'Name',
        },
        {
            id: 'eventResource',
            content: 'Event Resource',
        },
        {
            id: 'triggerType',
            content: 'Trigger Type',
        },
        {
            id: 'ignoreTrigger',
            content: 'Ignore Trigger',
        },
        {
            id: 'eventName',
            content: 'Event Name',
        },
        {
            id: 'resource',
            content: 'Resource',
        },
        {
            id: 'description',
            content: 'Description',
        },
    ];

    const triggerTableData: TableDataRow[] = discovery?.triggers.length
        ? discovery.triggers.map((trigger) => ({
              id: trigger.uuid,
              columns: [
                  <Link to={`../../triggers/detail/${trigger.uuid}`}>{trigger.name}</Link>,
                  trigger?.eventResource ? getEnumLabel(resourceTypeEnum, trigger.eventResource) : '',
                  getEnumLabel(triggerTypeEnum, trigger.type),
                  trigger.ignoreTrigger ? 'Yes' : 'No',
                  getEnumLabel(eventNameEnum, trigger.event || ''),
                  getEnumLabel(resourceTypeEnum, trigger.resource || ''),
                  trigger.description || '',
              ],
          }))
        : [];

    const triggersSummary: TableDataRow[] = !triggerHistorySummary
        ? []
        : [
              {
                  id: 'objectsEvaluated',
                  columns: ['Number of Objects Evaluated', triggerHistorySummary?.objectsEvaluated.toString() || '0'],
              },
              {
                  id: 'objectsMatched',
                  columns: ['Number of Objects Matched', triggerHistorySummary?.objectsMatched.toString() || '0'],
              },
              {
                  id: 'objectsIgnored',
                  columns: ['Number of Objects Ignored', triggerHistorySummary?.objectsIgnored.toString() || '0'],
              },
          ];

    return (
        <Container className="themed-container" fluid>
            <TabLayout
                tabs={[
                    {
                        title: 'Details',
                        content: (
                            <Widget>
                                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                    <Col>
                                        <Widget
                                            title="Certificate Discovery Details"
                                            busy={isBusy}
                                            widgetButtons={buttons}
                                            titleSize="large"
                                            refreshAction={getFreshDiscoveryDetails}
                                            widgetLockName={LockWidgetNameEnum.DiscoveryDetails}
                                        >
                                            <br />

                                            <CustomTable headers={detailHeaders} data={detailData} />
                                        </Widget>
                                    </Col>

                                    <Col>
                                        <Widget title="Metadata" titleSize="large">
                                            <br />
                                            <AttributeViewer viewerType={ATTRIBUTE_VIEWER_TYPE.METADATA} metadata={discovery?.metadata} />
                                        </Widget>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={triggerHistorySummary?.associationObjectUuid !== id ? '12' : '8'}>
                                        <Widget
                                            title="Assigned Triggers"
                                            busy={isBusy}
                                            titleSize="large"
                                            widgetLockName={LockWidgetNameEnum.DiscoveryDetails}
                                        >
                                            <CustomTable headers={triggerHeaders} data={triggerTableData} />
                                        </Widget>
                                    </Col>

                                    {triggerHistorySummary?.associationObjectUuid === id && (
                                        <Col md="4">
                                            <Widget
                                                title="Triggers summary"
                                                titleSize="large"
                                                busy={isFetchingTriggerSummary}
                                                refreshAction={getFreshTriggerHistorySummary}
                                            >
                                                <CustomTable headers={detailHeaders} data={triggersSummary} />
                                            </Widget>
                                        </Col>
                                    )}
                                </Row>
                                {discovery?.uuid && (
                                    <DiscoveryCertificates id={discovery.uuid} triggerHistorySummary={triggerHistorySummary} />
                                )}
                            </Widget>
                        ),
                    },
                    {
                        title: 'Attributes',
                        content: (
                            <Widget>
                                <Row xs="1" sm="1" md="2" lg="2" xl="2">
                                    <Col>
                                        <Widget title="Attributes" titleSize="large">
                                            <br />
                                            <Label>Discovery Attributes</Label>
                                            <AttributeViewer attributes={discovery?.attributes} />
                                        </Widget>
                                    </Col>
                                    <Col>
                                        {discovery && (
                                            <CustomAttributeWidget
                                                resource={Resource.Discoveries}
                                                resourceUuid={discovery.uuid}
                                                attributes={discovery.customAttributes}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </Widget>
                        ),
                    },
                ]}
            />
            <Dialog
                isOpen={confirmDelete}
                caption="Delete Certification Discovery"
                body="You are about to delete Discovery. Is this what you want to do?"
                toggle={() => setConfirmDelete(false)}
                buttons={[
                    { color: 'danger', onClick: onDeleteConfirmed, body: 'Yes, delete' },
                    { color: 'secondary', onClick: () => setConfirmDelete(false), body: 'Cancel' },
                ]}
            />
        </Container>
    );
}
