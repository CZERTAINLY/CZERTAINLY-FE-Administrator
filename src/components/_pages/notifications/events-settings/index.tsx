import TabLayout from 'components/Layout/TabLayout';
import { selectors as authSelectors } from 'ducks/auth';
import { actions as notificationActions } from 'ducks/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import { Resource } from 'types/openapi';
import NotificationInstanceList from '../notifications-instances';
import { useEffect } from 'react';
import EventsTable from 'components/_pages/notifications/events-settings/EventsTable';
import { LockWidgetNameEnum } from 'types/user-interface';

const EventsSettings = () => {
    const dispatch = useDispatch();
    const profile = useSelector(authSelectors.profile);

    useEffect(() => {
        dispatch(notificationActions.listNotificationInstances());
    }, [dispatch]);

    return (
        <Container className="themed-container" fluid>
            <TabLayout
                tabs={[
                    {
                        title: 'Events',
                        disabled: !profile?.permissions.allowedListings.includes(Resource.Settings),
                        content: <EventsTable mode="platform" widgetLocks={[LockWidgetNameEnum.EventSettings]} />,
                    },
                    {
                        title: 'Notification Instances',
                        disabled: !profile?.permissions.allowedListings.includes(Resource.NotificationInstances),
                        content: <NotificationInstanceList />,
                    },
                ]}
            />
        </Container>
    );
};

export default EventsSettings;
