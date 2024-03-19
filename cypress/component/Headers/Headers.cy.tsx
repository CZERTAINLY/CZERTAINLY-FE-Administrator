import Header from 'components/Layout/Header';
import { useCallback, useState } from 'react';
import '../../../src/resources/styles/theme.scss';

const TestHeader = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => setSidebarOpen(!sidebarOpen), [sidebarOpen]);

    return <Header sidebarToggle={toggleSidebar} />;
};

describe('Footer component', () => {
    it('should render footer', () => {
        cy.mount(<TestHeader />);
        cy.wait(1000);
        cy.get('.nav-link').click();
        cy.wait(1000);
        cy.get('.text-reset').click();
    });
});
