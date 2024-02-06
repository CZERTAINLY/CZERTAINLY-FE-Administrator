import cx from 'classnames';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Navbar } from 'reactstrap';

import { selectors } from 'ducks/auth';

import NotificationsOverview from 'components/_pages/notifications/overview';
import logo from '../../../resources/images/czertainly_white_H.svg';
import style from './Header.module.scss';

interface Props {
    sidebarToggle: () => void;
}

function Header({ sidebarToggle }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const profile = useSelector(selectors.profile);

    const toggleDropdown = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    return (
        <Navbar className={cx(style.root, style.sticky)}>
            <Nav>
                <NavItem className={cx(style.logo)}>
                    <Link to="/dashboard">
                        <img src={logo} alt="CZERTAINLY Logo" />
                    </Link>
                </NavItem>
            </Nav>

            <Nav>
                <NavItem
                    className={cx('visible-xs mr-4 d-sm-up-none', style.headerIcon, style.sidebarToggler)}
                    href="#"
                    onClick={sidebarToggle}
                >
                    <i className="fa fa-bars fa-2x text-muted" />
                </NavItem>
                <h4 className={style.appName}>Administrator Interface</h4>
            </Nav>

            <Nav className="ml-auto">
                {!!profile ? (
                    <Dropdown isOpen={isOpen} toggle={toggleDropdown}>
                        <DropdownToggle nav>
                            <i className={cx('fa fa-user-circle-o fa-2x', style.adminPhoto)} />
                            <span className={style.adminName}>{profile.username}</span>
                            <i className={cx('fa fa-angle-down ml-sm', style.arrow, { [style.arrowActive]: isOpen })} />
                        </DropdownToggle>

                        <DropdownMenu style={{ width: '100%' }}>
                            <DropdownItem>
                                <NavLink to={`/userprofile`}>Profile</NavLink>
                            </DropdownItem>

                            <DropdownItem>
                                <NavLink
                                    to="#"
                                    onClick={() => {
                                        window.location.href = (window as any).__ENV__.LOGOUT_URL;
                                    }}
                                >
                                    Log out
                                </NavLink>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : null}

                <NotificationsOverview />
            </Nav>
        </Navbar>
    );
}

export default Header;
