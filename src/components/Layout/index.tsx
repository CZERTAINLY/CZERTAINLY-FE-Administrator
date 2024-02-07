import cx from 'classnames';
import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Alerts from 'components/Alerts';
import GlobalModal from 'components/GlobalModal';
import Footer from 'components/Layout/Footer';
import Header from 'components/Layout/Header';
import Sidebar from 'components/Layout/Sidebar';
import style from './Layout.module.scss';

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => setSidebarOpen(!sidebarOpen), [sidebarOpen]);

    return (
        <div className={style.root}>
            <Header sidebarToggle={toggleSidebar} />
            <Sidebar />

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
