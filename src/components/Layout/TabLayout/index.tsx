import Tabs from 'components/Tabs';
import { useMemo, useState, useEffect } from 'react';
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
    noBorder?: boolean;
};

export default function TabLayout({ tabs, onlyActiveTabContent = true, selectedTab, noBorder = false }: Props) {
    const [activeTab, setActiveTab] = useState(selectedTab ?? 0);

    const memoizedTabs = useMemo(() => {
        return tabs.filter((e) => !e.hidden);
    }, [tabs]);

    const currentTab = selectedTab !== undefined ? selectedTab : activeTab;

    useEffect(() => {
        if (selectedTab !== undefined) {
            setActiveTab(selectedTab);
        } else if (tabs.length > 0 && activeTab >= tabs.length) {
            setActiveTab(0);
        }
    }, [selectedTab, tabs.length, activeTab]);

    const handleTabChange = (tab: number) => {
        if (selectedTab === undefined) {
            setActiveTab(tab);
        }
    };

    return (
        <Widget noBorder={noBorder}>
            <Tabs tabs={memoizedTabs} selectedTab={currentTab} onTabChange={handleTabChange} />
            <hr className="my-4 border-gray-200" />
            {memoizedTabs.map((t, i) => (onlyActiveTabContent === false || currentTab === i ? <div key={i}>{t.content}</div> : null))}
        </Widget>
    );
}
