import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from 'ducks/notifications';

import Widget from 'components/Widget';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import { LockWidgetNameEnum } from 'types/user-interface';
import { formatTimeAgo } from 'utils/dateUtil';

function NotificationsOverview() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const overviewNotifications = useSelector(selectors.overviewNotifications);
    const isFetchingOverview = useSelector(selectors.isFetchingOverview);

    const [isOpenNotifications, setIsOpenNotifications] = useState(false);
    const toggleNotificationsDropdown = useCallback(() => setIsOpenNotifications(!isOpenNotifications), [isOpenNotifications]);

    const notificationsList = useMemo(
        () =>
            overviewNotifications.length === 0 ? (
                <div className={'p-2 ml-2 text-center fw-lighter fst-italic'}>No unread notifications</div>
            ) : (
                overviewNotifications.map((notification, i) => (
                    <div key={notification.uuid} className={i % 2 === 1 ? 'p-2 ml-2 bg-secondary bg-opacity-10' : 'p-2 ml-2'}>
                        <Row className="g-0">
                            <Col className="g-0 col-1">
                                <Button
                                    color="white"
                                    size="md"
                                    className={'p-0 m-0'}
                                    onClick={() => dispatch(actions.markAsReadNotification({ uuid: notification.uuid }))}
                                >
                                    <i className="fa fa-check"></i>
                                </Button>
                            </Col>
                            <Col className="g-0 col-11">
                                {notification.message}
                                <span className="fw-light small px-1">{formatTimeAgo(notification.sentAt)}</span>
                                {notification.targetObjectType && notification.targetObjectIdentification && (
                                    <Button
                                        color="white"
                                        size="sm"
                                        className={'p-0 m-0'}
                                        onClick={() => {
                                            navigate(
                                                `/${notification.targetObjectType}/detail/${notification.targetObjectIdentification?.reduce(
                                                    (prev, curr) => prev + '/' + curr,
                                                )}`,
                                            );
                                        }}
                                    >
                                        <i className="fa fa-circle-arrow-right"></i>
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    </div>
                ))
            ),
        [overviewNotifications, dispatch, navigate],
    );

    return (
        <Dropdown isOpen={isOpenNotifications} toggle={toggleNotificationsDropdown}>
            <DropdownToggle nav>
                <i
                    className={overviewNotifications.length > 0 ? 'fa fa-bell pt-1 mt-2 text-warning' : 'fa fa-bell-slash pt-1 mt-2'}
                    style={{ color: 'white' }}
                />
            </DropdownToggle>

            <DropdownMenu style={{ width: '400px', maxHeight: '500px', overflowY: 'auto' }} className="m-0 p-0">
                <Widget
                    busy={isFetchingOverview}
                    widgetLockName={LockWidgetNameEnum.NotificationsOverview}
                    className="m-0 p-0"
                    hideWidgetButtons={true}
                >
                    {notificationsList}
                    <div className={'p-2 ml-auto bg-dark text-white text-center'}>
                        <Link to="/notifications" onClick={() => setIsOpenNotifications(false)} className="text-reset">
                            View all notifications
                        </Link>
                    </div>
                </Widget>
            </DropdownMenu>
        </Dropdown>
    );
}

export default NotificationsOverview;
