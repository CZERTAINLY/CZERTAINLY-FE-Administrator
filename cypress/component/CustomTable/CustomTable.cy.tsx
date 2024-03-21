import CustomTable from 'components/CustomTable/index';
import { useCallback, useMemo, useState } from 'react';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';
import detailHeaders from './mock-data';

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
        [page, pageSize, detailData],
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
});
