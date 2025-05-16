import BooleanBadge from 'components/BooleanBadge/BooleanBadge';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import { getInputStringFromIso8601String } from 'components/Input/DurationField';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';

import { selectors as enumSelectors, getEnumLabel } from 'ducks/enums';
import { actions, selectors } from 'ducks/notification-profiles';
import { actions as notificationActions, selectors as notificationSelectors } from 'ducks/notifications';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router';

import { Badge, Col, Container, Row } from 'reactstrap';
import { PlatformEnum, RecipientType } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';

export default function NotificationProfileDetail() {
    const { uuid, version } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notificationProfile = useSelector(selectors.notificationProfile);
    const isFetchingDetail = useSelector(selectors.isFetchingDetail);

    const notificationInstance = useSelector(notificationSelectors.notificationInstanceDetail);
    const isFetchingNotificationInstanceDetail = useSelector(notificationSelectors.isFetchingNotificationInstanceDetail);

    const recipientTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.RecipientType));

    const getFreshData = useCallback(() => {
        if (!uuid || !version) return;
        dispatch(actions.getNotificationProfileDetail({ uuid, version: Number(version) }));
    }, [dispatch, uuid, version]);

    useEffect(() => {
        getFreshData();
    }, [getFreshData]);

    useEffect(() => {
        dispatch(notificationActions.clearNotificationInstanceDetail());
        if (!notificationProfile?.notificationInstance?.uuid) return;
        dispatch(notificationActions.getNotificationInstance({ uuid: notificationProfile.notificationInstance.uuid }));
    }, [dispatch, notificationProfile]);

    const onEditNotificationProfile = useCallback(() => {
        if (!uuid || !version) return;
        navigate(`../notificationprofiles/edit/${uuid}/${version}`);
    }, [navigate, uuid, version]);

    const onDeleteNotificationProfile = useCallback(() => {
        if (!uuid || !version) return;
        dispatch(actions.deleteNotificationProfile({ uuid: uuid, redirect: '../notificationprofiles' }));
    }, [dispatch, uuid, version]);

    const notificationProfileWidgetButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'pencil',
                disabled: false,
                tooltip: 'Edit',
                onClick: () => {
                    onEditNotificationProfile();
                },
            },
            {
                icon: 'trash',
                disabled: false,
                tooltip: 'Delete',
                onClick: () => {
                    onDeleteNotificationProfile();
                },
            },
        ],
        [onEditNotificationProfile, onDeleteNotificationProfile],
    );

    const headers: TableHeader[] = useMemo(
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

    const profileData: TableDataRow[] = useMemo(
        () =>
            !notificationProfile
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', notificationProfile.uuid],
                      },
                      {
                          id: 'name',
                          columns: ['Name', notificationProfile.name],
                      },
                      {
                          id: 'description',
                          columns: ['Description', notificationProfile.description ?? ''],
                      },
                      {
                          id: 'version',
                          columns: ['Profile Version', notificationProfile.version.toString()],
                      },
                      {
                          id: 'recipientType',
                          columns: [
                              'Recipient Type',
                              <Badge key="recipientType" color="secondary">
                                  {getEnumLabel(recipientTypeEnum, notificationProfile.recipient.type)}
                              </Badge>,
                          ],
                      },
                      {
                          id: 'recipientUuid',
                          columns: ['Recipient UUID', notificationProfile.recipient.uuid ?? ''],
                      },
                      {
                          id: 'recipientName',
                          columns: [
                              'Recipient Name',
                              <Link
                                  key="notificationProviderName"
                                  to={(() => {
                                      switch (notificationProfile.recipient.type) {
                                          case RecipientType.User:
                                              return `../../../users/detail/${notificationProfile.recipient.uuid}`;
                                          case RecipientType.Group:
                                              return `../../../groups/detail/${notificationProfile.recipient.uuid}`;
                                          case RecipientType.Role:
                                              return `../../../roles/detail/${notificationProfile.recipient.uuid}`;
                                          case RecipientType.None:
                                          case RecipientType.Owner:
                                              return '';
                                      }
                                  })()}
                              >
                                  {notificationProfile.recipient.name}
                              </Link>,
                          ],
                      },
                      {
                          id: 'internalNotification',
                          columns: [
                              'Internal Notification',
                              <BooleanBadge key="internalNotification" value={notificationProfile.internalNotification} invertColor />,
                          ],
                      },
                      {
                          id: 'frequency',
                          columns: [
                              'Frequency',
                              notificationProfile.frequency ? getInputStringFromIso8601String(notificationProfile.frequency) : '',
                          ],
                      },
                      {
                          id: 'repetitions',
                          columns: ['Max Repetitions', notificationProfile.repetitions?.toString() ?? ''],
                      },
                  ],
        [notificationProfile, recipientTypeEnum],
    );
    const notificationInstanceData: TableDataRow[] = useMemo(
        () =>
            !notificationInstance
                ? []
                : [
                      {
                          id: 'uuid',
                          columns: ['UUID', notificationInstance.uuid],
                      },
                      {
                          id: 'name',
                          columns: [
                              'Name',
                              <Link key="name" to={`../../../notificationinstances/detail/${notificationInstance.uuid}`}>
                                  {notificationInstance.name}
                              </Link>,
                          ],
                      },
                      {
                          id: 'description',
                          columns: ['Description', notificationInstance.description ?? ''],
                      },
                      {
                          id: 'kind',
                          columns: ['Kind', notificationInstance.kind ?? ''],
                      },
                      {
                          id: 'notificationProviderUuid',
                          columns: ['Notification Provider Uuid', notificationInstance.connectorUuid],
                      },
                      {
                          id: 'notificationProviderName',
                          columns: [
                              'Notification Provider Name',
                              <Link key="notificationProviderName" to={`../../../connectors/detail/${notificationInstance.connectorUuid}`}>
                                  {notificationInstance.connectorName}
                              </Link>,
                          ],
                      },
                  ],
        [notificationInstance],
    );

    return (
        <Container className="themed-container" fluid>
            <Row>
                <Col>
                    <Widget
                        title="Notification Profile Details"
                        busy={isFetchingDetail}
                        widgetLockName={LockWidgetNameEnum.NotificationProfileDetails}
                        widgetButtons={notificationProfileWidgetButtons}
                        titleSize="large"
                        refreshAction={getFreshData}
                    >
                        <CustomTable headers={headers} data={profileData} />
                    </Widget>
                </Col>
                <Col>
                    <Widget
                        title="Notification Instance Details"
                        busy={isFetchingDetail || isFetchingNotificationInstanceDetail}
                        widgetLockName={LockWidgetNameEnum.NotificationProfileDetails}
                        titleSize="large"
                    >
                        <CustomTable headers={headers} data={notificationInstanceData} />
                    </Widget>
                </Col>
            </Row>
        </Container>
    );
}
