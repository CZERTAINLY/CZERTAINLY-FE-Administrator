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

const EventsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const events = useMemo(
        () => [
            {
                uuid: 1,
                name: 'Event1',
            },
        ],
        [],
    );

    const isFetchingList = useSelector(selectors.isFetchingList);

    const getEvents = useCallback(() => {
        dispatch(actions.listNotificationProfiles());
    }, [dispatch]);

    useEffect(() => {
        getEvents();
    }, [getEvents]);

    const isBusy = useMemo(() => isFetchingList, [isFetchingList]);

    const widgetButtons: WidgetButtonProps[] = useMemo(
        () => [
            {
                icon: 'plus',
                disabled: false,
                tooltip: 'Create Event',
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
                id: 'eventName',
                content: 'Name',
                sortable: true,
            },
        ],
        [],
    );

    const dataRows: TableDataRow[] = useMemo(
        () =>
            !events
                ? []
                : events.map((profile) => ({
                      id: profile.uuid,
                      columns: [
                          <Link key="name" to={`./detail/${profile.uuid}`}>
                              {profile.name}
                          </Link>,
                      ],
                  })),
        [events],
    );

    return (
        <Container className="themed-container" fluid>
            <Widget
                title="List of Events"
                widgetButtons={widgetButtons}
                refreshAction={getEvents}
                titleSize="larger"
                widgetLockName={LockWidgetNameEnum.ListOfEvents}
                lockSize="large"
                busy={isBusy}
            >
                <br />
                <CustomTable headers={headers} data={dataRows} canSearch={true} hasPagination={true} />
            </Widget>
        </Container>
    );
};

export default EventsList;
