import cx from 'classnames';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router';

import Alerts from 'components/Alerts';
import GlobalModal from 'components/GlobalModal';
import Footer from 'components/Layout/Footer';
import Header from 'components/Layout/Header';
import Sidebar from 'components/Layout/Sidebar';
import style from './Layout.module.scss';
import { useSelector } from 'react-redux';
import { selectors } from 'ducks/auth';

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => setSidebarOpen(!sidebarOpen), [sidebarOpen]);

    const profile = useSelector(selectors.profile);

    return (
        <div className={style.root}>
            <Header sidebarToggle={toggleSidebar} />
            <Sidebar allowedResources={profile?.permissions.allowedListings} />

            <div className={cx(style.wrap, { [style.sidebarOpen]: sidebarOpen })}>
                <main className={style.content}>
                    <Outlet />
                </main>

                <Alerts />
                <GlobalModal />
                <Footer />
            </div>
        </div>
    );
}

export default Layout;
