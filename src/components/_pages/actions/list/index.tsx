import TabLayout from 'components/Layout/TabLayout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import ActionsListComponent from './actions-list-component';
import ExecutionsListComponent from './executions-list-component';

const RulesList = () => {
    const { tabIndex } = useParams();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (tabIndex && parseInt(tabIndex) <= 1) {
            setActiveTab(parseInt(tabIndex));
        }
    }, [tabIndex]);

    return (
        <TabLayout
            selectedTab={activeTab}
            tabs={[
                {
                    title: 'Actions',
                    content: <ActionsListComponent />,
                    onClick: () => setActiveTab(0),
                },
                {
                    title: 'Executions',
                    content: <ExecutionsListComponent />,
                    onClick: () => setActiveTab(1),
                },
            ]}
        />
    );
};

export default RulesList;
