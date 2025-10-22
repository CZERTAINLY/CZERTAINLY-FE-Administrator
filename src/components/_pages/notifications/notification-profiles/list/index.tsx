import BooleanBadge from 'components/BooleanBadge/BooleanBadge';
import { TableDataRow, TableHeader } from 'components/CustomTable';
import PagedList from 'components/PagedList/PagedList';
import { getEnumLabel, selectors as enumSelectors } from 'ducks/enums';
import { actions, selectors } from 'ducks/notification-profiles';
import { useCallback, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import { Container } from 'reactstrap';
import Badge from 'components/Badge';
import { EntityType } from 'ducks/filters';
import { SearchRequestModel } from 'types/certificate';
import { PlatformEnum } from 'types/openapi';
import { LockWidgetNameEnum } from 'types/user-interface';

const NotificationProfilesList = () => {
    const dispatch = useDispatch();

    const notificationProfiles = useSelector(selectors.notificationProfiles);

    const recipientTypeEnum = useSelector(enumSelectors.platformEnum(PlatformEnum.RecipientType));

    const onListCallback = useCallback(
        (pagination: SearchRequestModel) => dispatch(actions.listNotificationProfiles(pagination)),
        [dispatch],
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
            <PagedList
                entity={EntityType.NOTIFICATION_PROFILES}
                onListCallback={onListCallback}
                headers={headers}
                data={dataRows}
                title="List of Notification Profiles"
                entityNameSingular="a Notification Profile"
                entityNamePlural="Notification Profiles"
                pageWidgetLockName={LockWidgetNameEnum.ListOfNotificationProfiles}
            />
        </Container>
    );
};

export default NotificationProfilesList;
