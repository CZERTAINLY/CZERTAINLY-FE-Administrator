import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";
import cx from "classnames";

import style from "./Layout.module.scss";
import Alerts from "components/Alerts";
import Footer from "components/Layout/Footer";
import Header from "components/Layout/Header";
import Sidebar from "components/Layout/Sidebar";

function Layout() {

   const [sidebarOpen, setSidebarOpen] = useState(false);

   const toggleSidebar = useCallback(
      () => setSidebarOpen(!sidebarOpen),
      [sidebarOpen]
   );

   return (

      <div className={style.root}>

         <Sidebar />

         <div className={cx(style.wrap, { [style.sidebarOpen]: sidebarOpen })}>

            <Header sidebarToggle={toggleSidebar} />

            <main className={style.content}>
               <Outlet />
            </main>

            <Alerts />
            <Footer />

         </div>

      </div>

   );

}

export default Layout;
