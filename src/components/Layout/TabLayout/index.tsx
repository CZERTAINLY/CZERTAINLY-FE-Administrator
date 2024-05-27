import cx from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';

type Props = {
    tabs: {
        title: string | JSX.Element;
        hidden?: boolean;
        content: JSX.Element;
        disabled?: boolean;
        onClick?: () => void;
    }[];
    onlyActiveTabContent?: boolean;
    selectedTab?: number;
};

export default function TabLayout({ tabs, onlyActiveTabContent = false, selectedTab }: Props) {
    const [activeTab, setActiveTab] = useState(selectedTab || 0);

    const memoizedTabs = useMemo(() => {
        return tabs.filter((e) => !e.hidden);
    }, [tabs]);

    useEffect(() => {
        if (selectedTab !== undefined && selectedTab !== activeTab) {
            setActiveTab(selectedTab);
        } else if (memoizedTabs.length <= activeTab) {
            setActiveTab(0);
        }
    }, [activeTab, memoizedTabs, selectedTab]);

    return (
        <>
            <Nav tabs>
                {memoizedTabs.map((t, i) => (
                    <NavItem key={`nav-${i}`}>
                        <NavLink
                            className={cx({ active: activeTab === i })}
                            onClick={() => {
                                if (t.disabled) {
                                    return;
                                }
                                setActiveTab(i);
                                if (t.onClick) {
                                    t.onClick();
                                }
                            }}
                        >
                            {t.title}
                        </NavLink>
                    </NavItem>
                ))}
            </Nav>
            <TabContent activeTab={activeTab}>
                {memoizedTabs.map((t, i) =>
                    onlyActiveTabContent === false || activeTab === i ? (
                        <TabPane key={`pane-${i}`} tabId={i}>
                            {t.content}
                        </TabPane>
                    ) : null,
                )}
            </TabContent>
        </>
    );
}
