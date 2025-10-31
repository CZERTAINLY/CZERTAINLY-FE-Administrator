import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { Menu, User } from 'lucide-react';
import Dropdown from 'components/Dropdown';
import NotificationsOverview from 'components/_pages/notifications/overview';

import { selectors } from 'ducks/auth';

import logo from '../../../resources/images/czertainly_white_H.svg';

interface Props {
    sidebarToggle: () => void;
}

function Header({ sidebarToggle }: Props) {
    const profile = useSelector(selectors.profile);

    const navigate = useNavigate();

    return (
        <header className="flex items-center justify-between sticky top-0 left-0 w-full z-50 bg-blue-500 px-4 py-2 h-[var(--header-height)]">
            <Link to="/dashboard">
                <img src={logo} alt="CZERTAINLY Logo" className="h-9" />
            </Link>
            <div className="flex items-center gap-2">
                {!!profile && (
                    <Dropdown
                        title={
                            <div className="flex items-center gap-2">
                                <User size={24} />
                                {profile.username}
                            </div>
                        }
                        btnStyle="transparent"
                        className="text-white"
                        items={[
                            {
                                title: 'Profile',
                                onClick: () => {
                                    navigate('/userprofile');
                                },
                            },
                            {
                                title: 'Log out',
                                onClick: () => {
                                    window.location.href = (window as any).__ENV__.LOGOUT_URL;
                                },
                            },
                        ]}
                    />
                )}
                <NotificationsOverview />
                <button className="text-white md:hidden" onClick={sidebarToggle}>
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
}

export default Header;
