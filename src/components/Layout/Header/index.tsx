import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { Navbar, Nav, NavItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

import { selectors } from 'ducks/auth';

import style from './Header.module.scss';

interface Props {
   sidebarToggle: () => void;
}

function Header({ sidebarToggle }: Props) {
   const [isOpen, setIsOpen] = useState(false);
   const profile = useSelector(selectors.profile);

   const toggleDropdown = useCallback(
      () => setIsOpen(!isOpen),
      [isOpen],
   );

   console.log((window as any).__ENV__.LOGOUT_URL);

   return (

      <Navbar className={style.root}>

         <Nav>
            <NavItem className={cx('visible-xs mr-4 d-sm-up-none', style.headerIcon, style.sidebarToggler)} href="#" onClick={sidebarToggle}>
               <i className="fa fa-bars fa-2x text-muted" />
            </NavItem>
            <h4 className={style.appName}>Administrator Interface</h4>
         </Nav>

         <Nav className="ml-auto">

            {
               !!profile ? (

                  <Dropdown isOpen={isOpen} toggle={toggleDropdown}>

                     <DropdownToggle nav>
                        <i className={cx('fa fa-user-circle-o fa-2x', style.adminPhoto)} />
                        <span className="text-body">{profile.username}</span>
                        <i className={cx('fa fa-angle-down ml-sm', style.arrow, { [style.arrowActive]: isOpen })} />
                     </DropdownToggle>

                     <DropdownMenu style={{ width: '100%' }}>

                        <DropdownItem>
                           <NavLink to="/app/profile">Profile</NavLink>
                        </DropdownItem>

                        <DropdownItem>
                           <NavLink to="#" onClick={() => { window.location.href = (window as any).__ENV__.LOGOUT_URL }}>Log out</NavLink>
                        </DropdownItem>

                     </DropdownMenu>

                  </Dropdown>
               )
                  : null
            }

         </Nav>

      </Navbar>

   );
}

export default Header;
