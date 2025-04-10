import Sidebar from 'components/Layout/Sidebar';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { Resource } from 'types/openapi';

describe('Sidebar component', () => {
    it('should render sidebar', () => {
        const allowedResources = [
            Resource.Certificates,
            Resource.RaProfiles,
            Resource.Discoveries,
            Resource.Groups,
            Resource.Keys,
            Resource.Connectors,
            Resource.Users,
            Resource.Roles,
            Resource.TokenProfiles,
            Resource.ComplianceProfiles,
            Resource.Credentials,
            Resource.Authorities,
            Resource.Tokens,
            Resource.Groups,
            Resource.Entities,
            Resource.Locations,
            Resource.AcmeAccounts,
            Resource.AcmeProfiles,
            Resource.CmpProfiles,
            Resource.ScepProfiles,
            Resource.ApprovalProfiles,
            Resource.Approvals,
            Resource.Jobs,
            Resource.Settings,
            Resource.Attributes,
            Resource.NotificationInstances,
            Resource.Settings,
            Resource.AuditLogs,
            Resource.Rules,
            Resource.Actions,
            Resource.Triggers,
        ];
        cy.mount(<Sidebar allowedResources={allowedResources} />).wait(componentLoadWait);
        cy.get('nav > div').contains('Dashboard').click().wait(clickWait);
        cy.get('nav > div').contains('Connectors').click().wait(clickWait);
        cy.get('nav > div').contains('Access Control').click().wait(clickWait);
        cy.get('nav > div').contains('Profiles').click().wait(clickWait);
        cy.get('nav > div').contains('Inventory').click().wait(clickWait);
        cy.get('nav > div').contains('Protocols').click().wait(clickWait);
        cy.get('nav > div').contains('Approvals').click().wait(clickWait);
        cy.get('nav > div').contains('Scheduler').click().wait(clickWait);
        cy.get('nav > div').contains('Settings').click().wait(clickWait);
        cy.get('nav > div').contains('Audit Logs').click().wait(clickWait);
    });
});
