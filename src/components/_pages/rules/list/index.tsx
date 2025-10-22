import TabLayout from 'components/Layout/TabLayout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Container } from 'reactstrap';
import ConditionsListComponent from './conditions-list-component';
import RulesListComponent from './rules-list-component';

const RulesList = () => {
    const [activeTab, setActiveTab] = useState(0);

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
