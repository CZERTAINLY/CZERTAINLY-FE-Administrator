import cx from 'classnames';
import Tabs from 'components/Tabs';
import { useEffect, useMemo, useState } from 'react';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import Widget from 'components/Widget';

type Props = {
    tabs: {
        title: string | React.ReactNode;
        hidden?: boolean;
        disabled?: boolean;
        content: React.ReactNode;
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
        <Widget>
            <Tabs tabs={memoizedTabs} selectedTab={activeTab} onTabChange={setActiveTab} />
            <hr className="my-4 border-gray-200" />
            <TabContent activeTab={activeTab}>
                {memoizedTabs.map((t, i) =>
                    onlyActiveTabContent === false || activeTab === i ? (
                        <TabPane key={`pane-${i}`} tabId={i}>
                            {t.content}
                        </TabPane>
                    ) : null,
                )}
            </TabContent>
        </Widget>
    );
}
