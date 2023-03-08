import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

type Props = {
    tabs: {
        title: string | JSX.Element;
        content: JSX.Element;
        onClick?: () => void
    }[];
}

export default function TabLayout({tabs}: Props) {
    const [activeTab, setActiveTab] = useState(0);

    return (<>
        <Nav tabs>
            {tabs.map((t, i) => (
                <NavItem key={`nav-${i}`}><NavLink className={activeTab === i ? "active" : ""} onClick={() => {
                    setActiveTab(i);
                    if (t.onClick) {
                        t.onClick();
                    }
                }}>{t.title}</NavLink></NavItem>))}
        </Nav>
        <TabContent activeTab={activeTab}>
            {tabs.map((t, i) => activeTab === i ?
                <TabPane key={`pane-${i}`} tabId={i}>
                    {t.content}
                </TabPane> : null)
            }
        </TabContent>
    </>);
}