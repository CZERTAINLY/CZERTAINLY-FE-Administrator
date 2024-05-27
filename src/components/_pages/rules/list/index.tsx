import TabLayout from 'components/Layout/TabLayout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'reactstrap';
import ConditionsListComponent from './conditions-list-component';
import RulesListComponent from './rules-list-component';

const RulesList = () => {
    const { tabIndex } = useParams();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (tabIndex && parseInt(tabIndex) <= 1) {
            setActiveTab(parseInt(tabIndex));
        }
    }, [tabIndex]);

    return (
        <Container className="themed-container" fluid>
            <>
                <TabLayout
                    selectedTab={activeTab}
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
            </>
        </Container>
    );
};

export default RulesList;
