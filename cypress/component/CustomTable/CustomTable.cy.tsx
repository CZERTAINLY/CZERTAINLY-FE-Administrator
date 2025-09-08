import CustomTable from 'components/CustomTable/index';
import { useCallback, useMemo, useState } from 'react';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';
import detailHeaders from './mock-data';
import { getOwnerName, getGroupNames, createWidgetDetailHeaders } from '../../../src/utils/widget';

const CustomTableTest = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const onPageSizeChanged = useCallback(
        (pageSize: number) => {
            setPageSize(pageSize);
            setPage(1);
        },
        [setPageSize, setPage],
    );

    const detailData = useMemo(() => {
        const data = [];
        for (let i = 0; i < pageSize; i++) {
            data.push({
                id: i,
                columns: ['Test Data', 'Test Data', 'Test Data', 'Test Data'],
            });
        }
        return data;
    }, [pageSize]);

    const paginationData = useMemo(
        () => ({
            page: page,
            totalItems: 20,
            pageSize,
            loadedPageSize: pageSize,
            totalPages: Math.ceil(20 / pageSize),
            itemsPerPageOptions: [5, 10],
        }),
        [page, pageSize],
    );

    return (
        <CustomTable
            headers={detailHeaders}
            data={detailData}
            hasDetails={true}
            hasPagination={true}
            canSearch={false}
            onPageSizeChanged={onPageSizeChanged}
            paginationData={paginationData}
            onPageChanged={setPage}
        />
    );
};

describe('Create a table', () => {
    it('should render a table', () => {
        cy.mount(<CustomTableTest />).wait(componentLoadWait);
        cy.get('table').should('be.visible');
        cy.get('.form-select').select('5');
        cy.get('.form-select').select('10');
        cy.get(':nth-child(4) > .page-link').click().wait(clickWait);
    });

    it('should show Unassigned for missing owner and groups', () => {
        const headers = createWidgetDetailHeaders();

        const mockUsers = [
            { uuid: 'u-1', username: 'jdoe' },
            { uuid: 'u-2', username: 'asmith' },
        ] as any;
        const mockGroups = [
            { uuid: 'g-1', name: 'Group A' },
            { uuid: 'g-2', name: 'Group B' },
        ] as any;

        const ownerName = getOwnerName(undefined, mockUsers); // should be Unassigned

        // For groups: page logic renders Unassigned when no groupUuids or length===0
        const groupUuids: string[] = [];
        const groupNames = getGroupNames(groupUuids, mockGroups); // [] in this case, triggers Unassigned in page

        const groupsCell: string | JSX.Element | JSX.Element[] =
            Array.isArray(groupNames) && groupNames.length === 0
                ? 'Unassigned'
                : Array.isArray(groupNames)
                  ? groupNames.map((n) => (
                        <span key={n}>
                            {n}
                            <br />
                        </span>
                    ))
                  : groupNames;

        const data = [
            { id: 'owner', columns: ['Owner', ownerName] },
            { id: 'groups', columns: ['Groups', groupsCell] },
        ];

        cy.mount(<CustomTable headers={headers} data={data} hasDetails={false} hasPagination={false} canSearch={false} />).wait(
            componentLoadWait,
        );

        cy.get('table').should('be.visible');
        cy.contains('tr', 'Owner').within(() => {
            cy.contains('Unassigned');
        });
        cy.contains('tr', 'Groups').within(() => {
            cy.contains('Unassigned');
        });
    });

    it('should show owner username and group names when present', () => {
        const headers = createWidgetDetailHeaders();

        const mockUsers = [
            { uuid: 'u-1', username: 'jdoe' },
            { uuid: 'u-2', username: 'asmith' },
        ] as any;
        const mockGroups = [
            { uuid: 'g-1', name: 'Group A' },
            { uuid: 'g-2', name: 'Group B' },
        ] as any;

        const ownerName = getOwnerName('u-1', mockUsers); // jdoe
        const groupUuids: string[] = ['g-1', 'g-2'];
        const groupNames = getGroupNames(groupUuids, mockGroups) as string[];

        const groupsCell: string | JSX.Element | JSX.Element[] = groupNames.map((n) => (
            <span key={n}>
                {n}
                <br />
            </span>
        ));

        const data = [
            { id: 'owner', columns: ['Owner', ownerName] },
            { id: 'groups', columns: ['Groups', groupsCell] },
        ];

        cy.mount(<CustomTable headers={headers} data={data} hasDetails={false} hasPagination={false} canSearch={false} />).wait(
            componentLoadWait,
        );

        cy.get('table').should('be.visible');
        cy.contains('tr', 'Owner').within(() => {
            cy.contains('jdoe');
        });
        cy.contains('tr', 'Groups').within(() => {
            cy.contains('Group A');
            cy.contains('Group B');
        });
    });
});
