import React, { useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from 'ducks/notifications';

import { ArrowRight, Bell, Check } from 'lucide-react';
import Dropdown from 'components/Dropdown';
import { useNavigate, Link } from 'react-router';
import Button from 'components/Button';
import { LockWidgetNameEnum } from 'types/user-interface';
import { formatTimeAgo } from 'utils/dateUtil';
import Widget from 'components/Widget';

function NotificationsOverview() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLButtonElement>(null);
    const overviewNotifications = useSelector(selectors.overviewNotifications);

    const isFetchingOverview = useSelector(selectors.isFetchingOverview);

    const notificationsList: React.ReactNode = useMemo(
        () =>
            overviewNotifications.length === 0
                ? 'No unread notifications'
                : overviewNotifications.map((notification, index) => (
                      <React.Fragment key={notification.uuid}>
                          <div className="flex items-start gap-1 mb-2">
                              <Button
                                  variant="transparent"
                                  onClick={() => dispatch(actions.markAsReadNotification({ uuid: notification.uuid }))}
                              >
                                  <Check size={16} />
                              </Button>
                              <div>
                                  <span className="text-sm leading-[16px] font-medium text-gray-800 mr-2">{notification.message}</span>
                                  <span className="text-xs leading-[16px] text-gray-500 mr-2">{formatTimeAgo(notification.sentAt)}</span>
                                  <Button
                                      color="secondary"
                                      className="!rounded-full !p-0.5 relative top-[1px]"
                                      onClick={() => {
                                          navigate(
                                              `/${notification.targetObjectType}/detail/${notification.targetObjectIdentification?.reduce(
                                                  (prev, curr) => prev + '/' + curr,
                                              )}`,
                                          );
                                          dropdownRef.current?.click();
                                      }}
                                  >
                                      <ArrowRight size={10} strokeWidth={3} />
                                  </Button>
                              </div>
                          </div>
                          {index < overviewNotifications.length - 1 && <hr className="border-gray-200 mb-2" />}
                      </React.Fragment>
                  )),
        [overviewNotifications, dispatch, navigate],
    );

    return (
        <Dropdown
            title={
                <div className="flex items-center gap-2 text-white">
                    <Bell size={24} strokeWidth={1.5} />
                    <span className="sr-only">Notifications</span>
                </div>
            }
            btnStyle="transparent"
            menuClassName="max-w-[360px]"
            menu={
                <Widget
                    busy={isFetchingOverview}
                    widgetLockName={LockWidgetNameEnum.NotificationsOverview}
                    className="!p-0"
                    noBorder
                    hideWidgetButtons={true}
                >
                    <div className="max-h-[360px] overflow-y-auto">{notificationsList}</div>
                    <div className="sticky bottom-0 bg-white pt-2 border-t border-gray-200">
                        <Link to="/notifications" className="w-full" onClick={() => dropdownRef.current?.click()}>
                            <Button color="secondary" className="w-full justify-center">
                                View all notifications
                            </Button>
                        </Link>
                    </div>
                </Widget>
            }
            hideArrow
            buttonRef={dropdownRef}
        />
    );
}

export default NotificationsOverview;
