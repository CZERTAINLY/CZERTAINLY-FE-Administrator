import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from 'ducks/notifications';

import { ArrowRight, Bell, Check } from 'lucide-react';
import Dropdown, { DropdownItem } from 'components/Dropdown';
import { useNavigate } from 'react-router';
import Button from 'components/Button';
// import { LockWidgetNameEnum } from 'types/user-interface';
import { formatTimeAgo } from 'utils/dateUtil';

function NotificationsOverview() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const overviewNotifications = useSelector(selectors.overviewNotifications);
    // TODO: Add a loading state
    // const isFetchingOverview = useSelector(selectors.isFetchingOverview);

    const notificationsList: DropdownItem[] = useMemo(
        () =>
            overviewNotifications.length === 0
                ? [
                      {
                          title: 'No unread notifications',
                          onClick: () => {},
                      },
                  ]
                : overviewNotifications.map((notification) => ({
                      title: (
                          <div className="flex items-center gap-2" key={notification.uuid}>
                              <Button onClick={() => dispatch(actions.markAsReadNotification({ uuid: notification.uuid }))}>
                                  <Check size={18} />
                              </Button>
                              <div className="flex flex-col">
                                  <span className="text-sm font-medium">{notification.message}</span>
                                  <span className="text-xs text-gray-500">{formatTimeAgo(notification.sentAt)}</span>
                                  <Button
                                      onClick={() => {
                                          navigate(
                                              `/${notification.targetObjectType}/detail/${notification.targetObjectIdentification?.reduce(
                                                  (prev, curr) => prev + '/' + curr,
                                              )}`,
                                          );
                                      }}
                                  >
                                      <ArrowRight size={18} />
                                  </Button>
                              </div>
                          </div>
                      ),
                      onClick: () => {},
                  })),
        [overviewNotifications, dispatch, navigate],
    );

    return (
        <Dropdown
            title={
                <div className="flex items-center gap-2">
                    <Bell size={24} />
                    <span className="sr-only">Notifications</span>
                </div>
            }
            btnStyle="transparent"
            className="text-white"
            items={[
                ...notificationsList,
                {
                    title: 'View all notifications',
                    onClick: () => {
                        navigate('/notifications');
                    },
                },
            ]}
            hideArrow
        />
    );
}

export default NotificationsOverview;
