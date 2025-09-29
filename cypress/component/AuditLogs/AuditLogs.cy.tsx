import { EntityType } from 'ducks/filters';
import { useNavigate } from 'react-router';
import {
    mockActorEnum,
    mockAuditLogs,
    mockAuthMethodEnum,
    mockModuleEnum,
    mockOperationEnum,
    mockOperationResultEnum,
    mockResourceEnum,
} from './mockdata';
import { WidgetButtonProps } from 'components/WidgetButtons';

import CustomTable, { TableDataRow } from 'components/CustomTable';
import {
    auditLogsDetailRowHeaders,
    auditLogsRowHeaders,
    createAuditLogDetailData,
    createAuditLogsList,
} from 'components/_pages/auditLogs/utils';
import { AuditLogDto } from 'types/openapi';
import { Container } from 'reactstrap';
import PagedList from 'components/PagedList/PagedList';
import { clickWait, componentLoadWait } from '../../utils/constants';

const TestAuditLogsComponent = () => {
    const auditLogs = mockAuditLogs as unknown as AuditLogDto[];
    const moduleEnum = mockModuleEnum;
    const actorEnum = mockActorEnum;
    const authMethodEnum = mockAuthMethodEnum;
    const resourceEnum = mockResourceEnum;
    const operationEnum = mockOperationEnum;
    const operationResultEnum = mockOperationResultEnum;
    const isBusy = false;
    const navigate = useNavigate();

    const buttons: WidgetButtonProps[] = [
        {
            icon: 'download',
            disabled: false,
            tooltip: 'Export Audit logs',
            onClick: () => {
                console.log('export button click');
            },
        },
        {
            icon: 'trash',
            disabled: false,
            tooltip: 'Purge Audit logs',
            onClick: () => {
                console.log('purge button click');
            },
        },
    ];
    const onInfoClick = (log: AuditLogDto) => {
        console.log('onInfoClick', log);
    };
    const auditLogsList: TableDataRow[] = createAuditLogsList(
        auditLogs,
        resourceEnum,
        moduleEnum,
        actorEnum,
        authMethodEnum,
        operationEnum,
        operationResultEnum,
        navigate,
        onInfoClick,
    );

    return (
        <Container className="themed-container" fluid>
            <PagedList
                onListCallback={() => {}}
                entity={EntityType.AUDIT_LOG}
                addHidden={true}
                hasCheckboxes={false}
                additionalButtons={buttons}
                headers={auditLogsRowHeaders}
                data={auditLogsList}
                hasDetails={false}
                isBusy={isBusy}
                title="Audit logs"
                entityNameSingular="an Audit log"
                entityNamePlural="Audit logs"
                filterTitle="Audit logs Filter"
            />
        </Container>
    );
};

describe('TestAuditLogsComponent', () => {
    beforeEach(() => {
        cy.mount(<TestAuditLogsComponent />).wait(componentLoadWait);
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

    it('should trigger function when clicking info button', () => {
        cy.window().then((win) => {
            cy.spy(win.console, 'log').as('consoleLog');
        });
        cy.get('button[title="Detail"]').first().click().wait(clickWait);
        cy.get('@consoleLog').should('be.calledWithMatch', 'onInfoClick');
    });

    it('should trigger function when clicking on download button', () => {
        cy.window().then((win) => {
            cy.spy(win.console, 'log').as('consoleLog');
        });
        cy.get('button[title="Export Audit logs"]').click().wait(clickWait);
        cy.get('@consoleLog').should('be.calledWithMatch', 'export button click');
    });

    it('should trigger function when clicking on purge button', () => {
        cy.window().then((win) => {
            cy.spy(win.console, 'log').as('consoleLog');
        });
        cy.get('button[title="Purge Audit logs"]').click().wait(clickWait);
        cy.get('@consoleLog').should('be.calledWithMatch', 'purge button click');
    });
});

type AuditLogDetailItem = {
    property: string;
    propertyValue: string | React.ReactNode;
};
const createAuditLogDetailRows = (a: AuditLogDetailItem) => ({
    id: a.property,
    columns: [a.property, a.propertyValue],
});
const resourceEnum = mockResourceEnum;
const onLinkClick = () => {
    console.log('onLinkClick');
};

const TestAuditLogDetailComponentCase1 = () => {
    const log = mockAuditLogs[0] as unknown as AuditLogDto;

    return (
        <CustomTable
            headers={auditLogsDetailRowHeaders}
            data={createAuditLogDetailData(log, resourceEnum, onLinkClick).map(createAuditLogDetailRows) as unknown as TableDataRow[]}
        />
    );
};

describe('TestAuditLogDetailComponentCase1', () => {
    beforeEach(() => {
        cy.mount(<TestAuditLogDetailComponentCase1 />).wait(componentLoadWait);
    });

    it('renders table headers', () => {
        cy.contains('th', 'Property').should('exist');
        cy.contains('th', 'Value').should('exist');
    });

    it('renders timestamp', () => {
        cy.contains('tr', 'Timestamp').within(() => {
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
        cy.contains('tr', 'Resource').within(() => {
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

const TestAuditLogDetailComponentCase2 = () => {
    const log = mockAuditLogs[1] as unknown as AuditLogDto;

    return (
        <CustomTable
            headers={auditLogsDetailRowHeaders}
            data={createAuditLogDetailData(log, resourceEnum, onLinkClick).map(createAuditLogDetailRows) as unknown as TableDataRow[]}
        />
    );
};
describe('TestAuditLogDetailComponentCase2', () => {
    beforeEach(() => {
        cy.mount(<TestAuditLogDetailComponentCase2 />).wait(componentLoadWait);
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

const TestAuditLogDetailComponentCase3 = () => {
    const log = mockAuditLogs[2] as unknown as AuditLogDto;
    return (
        <CustomTable
            headers={auditLogsDetailRowHeaders}
            data={createAuditLogDetailData(log, resourceEnum, onLinkClick).map(createAuditLogDetailRows) as unknown as TableDataRow[]}
        />
    );
};

describe('TestAuditLogDetailComponentCase3', () => {
    beforeEach(() => {
        cy.mount(<TestAuditLogDetailComponentCase3 />).wait(componentLoadWait);
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

const TestAuditLogDetailComponentCase4 = () => {
    const log = mockAuditLogs[3] as unknown as AuditLogDto;
    const resourceEnum = mockResourceEnum;
    return (
        <CustomTable
            headers={auditLogsDetailRowHeaders}
            data={createAuditLogDetailData(log, resourceEnum, onLinkClick).map(createAuditLogDetailRows) as unknown as TableDataRow[]}
        />
    );
};

describe('TestAuditLogDetailComponentCase4', () => {
    beforeEach(() => {
        cy.mount(<TestAuditLogDetailComponentCase4 />).wait(componentLoadWait);
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
