import { createAction } from '@reduxjs/toolkit';
import PagedList from 'components/PagedList/PagedList';
import { TableDataRow, TableHeader } from 'components/CustomTable';
import { EntityType } from 'ducks/filters';
import { actions as pagingActions } from 'ducks/paging';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { SearchRequestModel } from 'types/certificate';
import '../../../src/resources/styles/theme.scss';
import { clickWait, componentLoadWait } from '../../utils/constants';

const testListRequest = createAction<SearchRequestModel>('test/pagedList/request');

const headers: TableHeader[] = [{ id: 'name', content: 'Name' }];

function rows(count: number): TableDataRow[] {
    return Array.from({ length: count }, (_, i) => ({ id: i, columns: [`Row ${i + 1}`] }));
}

const PagedListTest = () => {
    const dispatch = useDispatch();
    const onListCallback = useCallback((req: SearchRequestModel) => dispatch(testListRequest(req)), [dispatch]);
    return (
        <PagedList
            entity={EntityType.NOTIFICATION_PROFILES}
            headers={headers}
            data={rows(20)}
            title="Test List"
            entityNameSingular="item"
            entityNamePlural="items"
            onListCallback={onListCallback}
        />
    );
};

describe('PagedList pagination', () => {
    it('requests next page when pagination is used', () => {
        cy.mount(<PagedListTest />).wait(componentLoadWait);
        cy.dispatchActions(pagingActions.listSuccess({ entity: EntityType.NOTIFICATION_PROFILES, totalItems: 20 }));
        cy.get('.page-item.active > .page-link').should('contain', '1');
        cy.expectActionAfter(
            () => cy.get('a.page-link[aria-label="Next"]').click().wait(clickWait),
            testListRequest.match,
            (action) => {
                expect(action.payload.pageNumber).to.equal(2);
            },
        );
        cy.get('.page-item.active > .page-link').should('contain', '2');
        cy.contains('Showing 11 to 20 items of 20').should('exist');
    });
});
