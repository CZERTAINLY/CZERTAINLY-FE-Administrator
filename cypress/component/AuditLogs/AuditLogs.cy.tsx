import AuditLogs from 'components/_pages/auditLogs';
import GlobalModal from 'components/GlobalModal';
import { clickWait, componentLoadWait } from '../../utils/constants';
import { actions as enumActions } from 'ducks/enums';
import { mockPlatformEnums } from './mockdata';
import { actions as auditLogsActions } from 'ducks/auditLogs';
import { mockAuditLogs, mockAvailableFilters } from './mockdata';
import { actions as filterActions, EntityType } from 'ducks/filters';
import { AuditLogDto } from 'types/openapi';
import '../../../src/resources/styles/theme.scss';

const TestAuditLogsComponent = () => {
    return (
        <>
            <AuditLogs />
            <GlobalModal />
        </>
    );
};

describe('TestAuditLogsComponent', () => {
    beforeEach(() => {
        // Mount the component after setting up interceptors
        cy.mount(<TestAuditLogsComponent />).wait(componentLoadWait);

        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            auditLogsActions.listAuditLogsSuccess(mockAuditLogs as unknown as AuditLogDto[]),
            filterActions.getAvailableFiltersSuccess({
                entity: EntityType.AUDIT_LOG,
                availableFilters: mockAvailableFilters,
            }),
        );
        // Set up Redux action interceptors before mounting the component
        cy.window().then((win) => {
            // Intercept getPlatformEnums action
            win.registerReduxActionListener(
                (action) => action.type === enumActions.getPlatformEnums.type,
                () => {
                    win.store.dispatch(
                        enumActions.getPlatformEnumsSuccess({
                            ...mockPlatformEnums,
                        }),
                    );
                },
            );
            // Intercept listAuditLogs action
            win.registerReduxActionListener(
                (action) => action.type === auditLogsActions.listAuditLogs.type,
                () => {
                    win.store.dispatch(
                        auditLogsActions.listAuditLogsSuccess({
                            ...(mockAuditLogs as unknown as AuditLogDto[]),
                        }),
                    );
                },
            );

            // Intercept getAvailableFilters action
            win.registerReduxActionListener(
                (action) => action.type === filterActions.getAvailableFilters.type,
                () => {
                    win.store.dispatch(
                        filterActions.getAvailableFiltersSuccess({
                            entity: EntityType.AUDIT_LOG,
                            availableFilters: mockAvailableFilters,
                        }),
                    );
                },
            );
        });
    });

    it('renders title and table headers', () => {
        cy.contains('h5', 'Audit logs').should('exist');
        cy.contains('th', 'Id').should('exist');
        cy.contains('th', 'Timestamp').should('exist');
        cy.contains('th', 'Module').should('exist');
        cy.contains('th', 'Actor').should('exist');
        cy.contains('th', 'Auth method').should('exist');
        cy.contains('th', 'Resource').should('exist');
        cy.contains('th', 'Affiliated resource').should('exist');
        cy.contains('th', 'Operation').should('exist');
        cy.contains('th', 'Operation result').should('exist');
    });

    it('should render correct rows amount', () => {
        cy.get('table tbody tr').should('have.length', mockAuditLogs.length);
    });

    //check correct render for diffrent resource cases
    it('first row Resource should be Compliance Profile with link to detail page with name', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.contains('td', 'Compliance Profile').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').contains('test').should('exist');
            });
    });

    it('seconsd row Resource should be Compliance Profile WITHOUT link to detail page', () => {
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.contains('td', 'Compliance Profile').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('not.exist');
            });
    });

    it('third row Resource should be Compliance Profile WITH info button', () => {
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.contains('td', 'Compliance Profile').should('exist');
                cy.get('button[title="Go to details"]').should('exist');
            });
    });

    it('fourth row Resource should be Compliance Profile WITHOUT info button', () => {
        cy.get('table tbody tr')
            .eq(3)
            .within(() => {
                cy.contains('td', 'Compliance Profile').should('exist');
                cy.get('button[title="Go to details"]').should('not.exist');
            });
    });

    //check correct render for diffrent affiliatedResource cases

    it('first row Affiliated resource should be Compliance Profile with link to detail page with name', () => {
        cy.get('table tbody tr')
            .first()
            .within(() => {
                cy.contains('td', 'Compliance Profile').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').contains('Custom').should('exist');
            });
    });

    it('second row Affiliated resource should be Compliance Profile without link to detail page and name', () => {
        cy.get('table tbody tr')
            .eq(1)
            .within(() => {
                cy.contains('td', 'Compliance Profile').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('not.exist');
            });
    });

    it('third row Affiliated resource should be Compliance Profile WITH info button', () => {
        cy.get('table tbody tr')
            .eq(2)
            .within(() => {
                cy.contains('td', 'Compliance Profile').should('exist');
                cy.get('button[title="Go to details"]').should('exist');
            });
    });

    it('fourth row Affiliated resource should be Compliance Profile WITHOUT info button', () => {
        cy.get('table tbody tr')
            .eq(3)
            .within(() => {
                cy.contains('td', 'Compliance Profile').should('exist');
                cy.get('button[title="Go to details"]').should('not.exist');
            });
    });

    it('should open modal when clicking info button', () => {
        cy.get('button[title="Detail"]').first().click().wait(clickWait);
        cy.get('.modal-content').should('be.visible');
        cy.get('button').contains('Close').click().wait(clickWait);
        cy.get('.modal-content').should('not.exist');
    });

    describe('case 1 log testing', () => {
        beforeEach(() => {
            cy.get('button[title="Detail"]').first().click().wait(clickWait);
            cy.get('.modal-content').should('be.visible');
        });

        it('renders table headers', () => {
            cy.contains('th', 'Property').should('exist');
            cy.contains('th', 'Value').should('exist');
        });

        it('renders timestamp', () => {
            cy.get('tr[data-id="Timestamp"]').within(() => {
                cy.contains('Timestamp').should('exist');
                cy.contains('2025-09-29T08:46:19.567Z').should('exist');
            });
        });

        it('renders logged at', () => {
            cy.contains('tr', 'Logged at').within(() => {
                cy.contains('Logged at').should('exist');
                cy.contains('2025-09-29T08:46:19.572062Z').should('exist');
            });
        });

        it('renders resource', () => {
            cy.get('tr[data-id="Resource"]').within(() => {
                cy.contains('Resource').should('exist');
                cy.contains('Compliance Profile').should('exist');
            });
        });

        it('renders resource objects as a link with name', () => {
            cy.contains('tr', 'Resource objects').within(() => {
                cy.contains('Resource objects').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').contains('test').should('exist');
            });
        });

        it('renders affiliated resource objects as a link with name', () => {
            cy.contains('tr', 'Affiliated resource objects').within(() => {
                cy.contains('Affiliated resource objects').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').contains('Custom').should('exist');
            });
        });

        it('renders affiliated resource label', () => {
            cy.contains('td', /^Affiliated resource$/) // regex for exact match
                .within(() => {
                    cy.contains('Affiliated resource').should('exist');
                });
            cy.contains('td', /^Affiliated resource$/)
                .parent()
                .should('contain', 'Compliance Profile');
        });

        it('renders request method', () => {
            cy.contains('tr', 'Request method').within(() => {
                cy.contains('Request method').should('exist');
                cy.contains('DELETE').should('exist');
            });
        });

        it('renders request path', () => {
            cy.contains('tr', 'Request path').within(() => {
                cy.contains('Request path').should('exist');
                cy.contains(
                    '/api/v2/complianceProfiles/6db02cd3-71c0-4b3f-be98-97d4bbd8320c/associations/raProfiles/c08e64f5-a98b-49df-908d-b3b26f50c145',
                ).should('exist');
            });
        });

        it('renders request IP address', () => {
            cy.contains('tr', 'Request IP address').within(() => {
                cy.contains('Request IP address').should('exist');
                cy.contains('31.42.175.148').should('exist');
            });
        });

        it('renders message', () => {
            cy.contains('tr', 'Message').within(() => {
                cy.contains('Message').should('exist');
            });
        });

        it('renders operation data', () => {
            cy.contains('tr', 'Operation data').within(() => {
                cy.contains('Operation data').should('exist');
            });
        });

        it('shows additional data JSON', () => {
            cy.contains('td', 'Additional data')
                .parent()
                .should('contain', 'associationObjectUuid')
                .and('contain', 'c08e64f5-a98b-49df-908d-b3b26f50c145');
        });
    });

    describe('case 2 log testing', () => {
        beforeEach(() => {
            cy.get('button[title="Detail"]').eq(1).click().wait(clickWait);
            cy.get('.modal-content').should('be.visible');
        });
        it('renders resource objects as empty string', () => {
            cy.contains('tr', 'Resource objects').within(() => {
                cy.contains('Resource objects').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('not.exist');
            });
        });

        it('renders affiliated resource objects as empty string', () => {
            cy.contains('tr', 'Affiliated resource objects').within(() => {
                cy.contains('Affiliated resource objects').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('not.exist');
            });
        });
    });

    describe('case 3 log testing', () => {
        beforeEach(() => {
            cy.get('button[title="Detail"]').eq(2).click().wait(clickWait);
            cy.get('.modal-content').should('be.visible');
        });
        it('renders resource objects as a link with uuid', () => {
            cy.contains('tr', 'Resource objects').within(() => {
                cy.contains('Resource objects').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').contains('6db02cd3-71c0-4b3f-be98-97d4bbd8320c').should('exist');
            });
        });

        it('renders affiliated resource objects as a link with link to detail page', () => {
            cy.contains('tr', 'Affiliated resource objects').within(() => {
                cy.contains('Affiliated resource objects').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').contains('c08e64f5-a98b-49df-908d-b3b26f50c145').should('exist');
            });
        });
    });

    describe('case 4 log testing', () => {
        beforeEach(() => {
            cy.get('button[title="Detail"]').eq(3).click().wait(clickWait);
            cy.get('.modal-content').should('be.visible');
        });
        it('renders resource objects as string with name', () => {
            cy.contains('tr', 'Resource objects').within(() => {
                cy.contains('Resource objects').should('exist');
                cy.contains('test').should('exist');
            });
        });

        it('renders affiliated resource objects as string with name', () => {
            cy.contains('tr', 'Affiliated resource objects').within(() => {
                cy.contains('Affiliated resource objects').should('exist');
                cy.contains('test').should('exist');
            });
        });
    });

    describe('case 5 log testing', () => {
        beforeEach(() => {
            cy.get('button[title="Detail"]').eq(4).click().wait(clickWait);
            cy.get('.modal-content').should('be.visible');
        });
        it('renders resource objects as string with name', () => {
            cy.contains('tr', 'Resource objects').within(() => {
                cy.contains('Resource objects').should('exist');
                cy.contains('test (6db02cd3-71c0-4b3f-be98-97d4bbd8320c)').should('exist');
            });
        });

        it('renders affiliated resource objects as string with name', () => {
            cy.contains('tr', 'Affiliated resource objects').within(() => {
                cy.contains('Affiliated resource objects').should('exist');
                cy.contains('Custom').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').should('exist');
                cy.get('a[href*="/complianceprofiles/detail/"]').contains('Custom').should('exist');
            });
        });
    });
});
