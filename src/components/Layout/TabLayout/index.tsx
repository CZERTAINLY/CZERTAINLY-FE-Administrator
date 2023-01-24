import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

type Props = {
    tabs: { title: string; content: JSX.Element }[];
}

export default function TabLayout({tabs}: Props) {
    const [activeTab, setActiveTab] = useState(0);

    return (<>
        <Nav tabs>
            {tabs.map((t, i) => (
                <NavItem key={`nav-${i}`}><NavLink className={activeTab === i ? "active" : ""} onClick={() => setActiveTab(i)}>{t.title}</NavLink></NavItem>))}
        </Nav>
        <TabContent activeTab={activeTab}>
            {tabs.map((t, i) => {
                return (
                    <TabPane key={`pane-${i}`} tabId={i}>
                        {t.content}
                    </TabPane>)
            })}
        </TabContent>
    </>);
}