import TabLayout from 'components/Layout/TabLayout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ConditionsListComponent from './conditions-list-component';
import RulesListComponent from './rules-list-component';

const RulesList = () => {
    const { tabIndex } = useParams();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (tabIndex && Number.parseInt(tabIndex, 10) <= 1) {
            setActiveTab(Number.parseInt(tabIndex, 10));
        }
    }, [tabIndex]);

    return (
        <TabLayout
            selectedTab={activeTab}
            onlyActiveTabContent
            tabs={[
                {
                    title: 'Rules',
                    content: <RulesListComponent />,
                    onClick: () => setActiveTab(0),
                },
                {
                    title: 'Conditions',
                    content: <ConditionsListComponent />,
                    onClick: () => setActiveTab(1),
                },
            ]}
        />
    );
};

export default RulesList;
