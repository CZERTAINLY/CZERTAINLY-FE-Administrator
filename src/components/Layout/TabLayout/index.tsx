import Tabs from 'components/Tabs';
import { useMemo, useState } from 'react';
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
    const [activeTab, setActiveTab] = useState(selectedTab || 0);

    const memoizedTabs = useMemo(() => {
        return tabs.filter((e) => !e.hidden);
    }, [tabs]);

    return (
        <Widget noBorder={noBorder}>
            <Tabs tabs={memoizedTabs} selectedTab={activeTab} onTabChange={setActiveTab} />
            <hr className="my-4 border-gray-200" />
            {memoizedTabs.map((t, i) => (onlyActiveTabContent === false || activeTab === i ? <div key={i}>{t.content}</div> : null))}
        </Widget>
    );
}
