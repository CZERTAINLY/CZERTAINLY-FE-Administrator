import BooleanBadge from 'components/BooleanBadge/BooleanBadge';
import CustomTable, { TableDataRow, TableHeader } from 'components/CustomTable';
import Widget from 'components/Widget';
import { WidgetButtonProps } from 'components/WidgetButtons';
import { getEnumLabel, selectors as enumSelectors } from 'ducks/enums';
import { actions, selectors } from 'ducks/notification-profiles';
import { useCallback, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { Badge, Container } from 'reactstrap';
import { PlatformEnum } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';

const NotificationProfilesList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notificationProfiles = useSelector(selectors.notificationProfiles);
    const isFetchingList = useSelector(selectors.isFetchingList);

    const recipientTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.RecipientType));

    const getNotificationProfiles = useCallback(() => {
        dispatch(actions.listNotificationProfiles());
    }, [dispatch]);

    useEffect(() => {
        getNotificationProfiles();
    }, [getNotificationProfiles]);

    const isBusy = useMemo(() => isFetchingList, [isFetchingList]);

    const providersButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create Notification Profile',
                onClick: () => {
                    navigate('./add');
                },
            },
        ],
        [navigate],
    );

    const headers: TableHeader[] = useMemo(
        () => [
            {
                id: 'profileName',
                content: 'Name',
                sortable: true,
            },
            {
                id: 'description',
                content: 'Description',
            },
            {
                id: 'recipientType',
                content: 'Recipient Type',
                sortable: true,
                align: 'center',
            },
            {
                id: 'internalNotification',
                content: 'Internal Notification',
                sortable: true,
                align: 'center',
            },
            {
                id: 'Version',
                content: 'Version',
                align: 'right',
            },
        ],
        [],
    );

    const dataRows: TableDataRow[] = useMemo(
        () =>
            !notificationProfiles
                ? []
                : notificationProfiles.map((profile) => ({
                      id: profile.uuid,
                      columns: [
                          <Link key="name" to={`./detail/${profile.uuid}/${profile.version}`}>
                              {profile.name}
                          </Link>,
                          profile.description ?? '',
                          <Badge key="recipientType" className="secondary">
                              {getEnumLabel(recipientTypeEnum, profile.recipientType)}
                          </Badge>,
                          <BooleanBadge key="internalNotification" value={profile.internalNotification} />,
                          profile.version.toString(),
                      ],
                  })),
        [notificationProfiles, recipientTypeEnum],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="List of Notification Profiles"
                widgetButtons={providersButtons}
                refreshAction={getNotificationProfiles}
                titleSize="larger"
                widgetLockName={LockWidgetNameEnum.ListOfNotificationProfiles}
                lockSize="large"
                busy={isBusy}
            >
                <br />
                <CustomTable headers={headers} data={dataRows} canSearch={true} hasPagination={true} />
            </Widget>
        </Container>
    );
};

export default NotificationProfilesList;
