import Header from 'components/Layout/Header';
import { useCallback, useState } from 'react';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';

const TestHeader = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => setSidebarOpen(!sidebarOpen), [sidebarOpen]);

    return <Header sidebarToggle={toggleSidebar} />;
};

describe('Footer component', () => {
    it('should render footer', () => {
        cy.mount(<TestHeader />).wait(componentLoadWait);
        cy.get('.nav-link').click().wait(clickWait);
        cy.get('.text-reset').click().wait(clickWait);
    });
});
