import FilterWidget from 'components/FilterWidget';
import { availableFilters } from './data';
import { Observable, of } from 'rxjs';
import { EntityType } from 'ducks/filters';
import { SearchFieldListModel } from 'types/certificate';
import { Provider } from 'react-redux';
import { createStore, Store, AnyAction } from 'redux';

describe('FilterWidget Component', () => {
    let store: Store<any, AnyAction>;

    const mockState = {
        enums: {
            platformEnums: {
                FilterFieldSource: {
                    custom: { label: 'Custom', code: 'custom' },
                    data: { label: 'Data', code: 'data' },
                    meta: { label: 'Meta', code: 'meta' },
                    property: { label: 'Property', code: 'property' },
                },
                FilterConditionOperator: {
                    CONTAINS: { label: 'Contains', code: 'CONTAINS' },
                    NOT_CONTAINS: { label: 'Not Contains', code: 'NOT_CONTAINS' },
                    EQUALS: { label: 'Equals', code: 'EQUALS' },
                    NOT_EQUALS: { label: 'Not Equals', code: 'NOT_EQUALS' },
                    EMPTY: { label: 'Empty', code: 'EMPTY' },
                    NOT_EMPTY: { label: 'Not Empty', code: 'NOT_EMPTY' },
                    STARTS_WITH: { label: 'Starts With', code: 'STARTS_WITH' },
                    ENDS_WITH: { label: 'Ends With', code: 'ENDS_WITH' },
                    MATCHES: { label: 'Matches', code: 'MATCHES' },
                    NOT_MATCHES: { label: 'Not Matches', code: 'NOT_MATCHES' },
                    GREATER: { label: 'Greater', code: 'GREATER' },
                    GREATER_OR_EQUAL: { label: 'Greater Or Equal', code: 'GREATER_OR_EQUAL' },
                    LESSER: { label: 'Lesser', code: 'LESSER' },
                    LESSER_OR_EQUAL: { label: 'Lesser Or Equal', code: 'LESSER_OR_EQUAL' },
                    IN_NEXT: { label: 'In Next', code: 'IN_NEXT' },
                    IN_PAST: { label: 'In Past', code: 'IN_PAST' },
                    COUNT_EQUAL: { label: 'Count Equal', code: 'COUNT_EQUAL' },
                    COUNT_NOT_EQUAL: { label: 'Count Not Equal', code: 'COUNT_NOT_EQUAL' },
                    COUNT_GREATER_THAN: { label: 'Count Greater Than', code: 'COUNT_GREATER_THAN' },
                    COUNT_LESS_THAN: { label: 'Count Less Than', code: 'COUNT_LESS_THAN' },
                },
            },
        },
        filters: {
            filters: [
                {
                    entity: EntityType.CERTIFICATE,
                    filter: {
                        availableFilters: availableFilters as any,
                        currentFilters: [],
                        isFetchingFilters: false, // Always false to prevent loading overlay
                    },
                },
            ],
        },
        // Add user-interface slice to prevent widgetLocks error
        userInterface: {
            widgetLocks: [],
        },
    };

    const reducer = (state = mockState, action: AnyAction) => {
        // Handle setCurrentFilters action
        if (action.type === 'filters/setCurrentFilters') {
            const { entity, currentFilters } = action.payload;
            return {
                ...state,
                filters: {
                    ...state.filters,
                    filters: state.filters.filters.map((filter) =>
                        filter.entity === entity ? { ...filter, filter: { ...filter.filter, currentFilters } } : filter,
                    ),
                },
            };
        }
        return state;
    };

    beforeEach(() => {
        store = createStore(reducer, mockState);

        const defaultProps = {
            title: 'Test Filter Widget',
            entity: EntityType.CERTIFICATE,
            getAvailableFiltersApi: (): Observable<SearchFieldListModel[]> => {
                return new Observable((subscriber) => {
                    subscriber.next(availableFilters as any);
                    subscriber.complete();
                });
            },
        };

        cy.mount(
            <Provider store={store}>
                <FilterWidget {...defaultProps} />
            </Provider>,
        );
    });

    it('renders the widget with title', () => {
        cy.contains('Test Filter Widget');
    });

    it('displays available groups in the filter field source select', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').should('contain', 'Custom');
        cy.get('[data-testid="group-menu"]').should('contain', 'Data');
        cy.get('[data-testid="group-menu"]').should('contain', 'Meta');
        cy.get('[data-testid="group-menu"]').should('contain', 'Property');
    });

    it('updates fields when group is selected', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Custom').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').should('contain', 'AWS_Region');
        cy.get('[data-testid="field-menu"]').should('contain', 'Department');
        cy.get('[data-testid="field-menu"]').should('contain', 'Test integer');
    });

    it('updates conditions when field is selected', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Custom').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('AWS_Region').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').should('contain', 'Contains');
        cy.get('[data-testid="condition-menu"]').should('contain', 'Equals');
        cy.get('[data-testid="condition-menu"]').should('contain', 'Empty');
    });

    it('adds a string filter and displays badge', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Custom').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('AWS_Region').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Contains').click();
        cy.get('#valueSelect').type('us-east');

        cy.get('#addFilter').should('not.be.disabled');
        cy.get('#addFilter').click();

        cy.get('[data-testid="filter-badge"]').should('exist');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Custom');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'AWS_Region');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Contains');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'us-east');
    });

    it('adds a multi-value list filter', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Custom').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('Department').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Equals').click();
        cy.get('#valueSelect').click();
        cy.get('[data-testid="value-menu"]').contains('IT').click();
        cy.get('#valueSelect').click();
        cy.get('[data-testid="value-menu"]').contains('HR').click();
        cy.get('#addFilter').click();
        cy.get('[data-testid="filter-badge"]').should('exist');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Custom');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Department');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Equals');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'IT OR HR');
    });

    it('adds a boolean filter', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Meta').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('Is Private Key Available').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Equals').click();
        cy.get('#valueSelect').click();
        cy.get('[data-testid="value-menu"]').contains('True').click();
        cy.get('#addFilter').click();
        cy.get('[data-testid="filter-badge"]').should('exist');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Meta');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Is Private Key Available');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Equals');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'True');
    });

    it('adds a number filter with count condition', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Property').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('Groups').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Count Greater Than').click();
        cy.get('#valueSelect').type('5');
        cy.get('#addFilter').click();
        cy.get('[data-testid="filter-badge"]').should('exist');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Property');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Groups');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Count Greater Than');
        cy.get('[data-testid="filter-badge"]').should('contain.text', '5');
    });

    it('prevents non-integer input in number fields', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Property').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('Groups').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Count Equal').click();
        cy.get('#valueSelect').type('3.5');
        cy.get('#valueSelect').should('have.value', '35');
        cy.get('#valueSelect').type('-');
        cy.get('#valueSelect').should('have.value', '35');
    });

    it('handles duration input for interval conditions', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Custom').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('datecustom').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('In Next').click();
        cy.get('#valueSelect').type('5d 12h');
        cy.get('#addFilter').click();
        cy.get('[data-testid="filter-badge"]').should('exist');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Custom');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'datecustom');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'In Next');
        cy.get('[data-testid="filter-badge"]').should('contain.text', '5d 12h');
    });

    it('shows "Invalid regex pattern" for syntactically invalid regex', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Property').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('Common Name').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Matches').click();
        cy.get('#valueSelect').clear().type('[a-');
        cy.contains('Invalid regex pattern').should('exist');
        cy.get('#addFilter').should('be.disabled');
    });

    it('accepts valid regex and enables Add button', () => {
        // use a valid regex; escape backslash sequence for digit shorthand
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Property').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('Common Name').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Matches').click();
        cy.get('#valueSelect').clear().type('^[a-z]+\\d{2}$');
        cy.contains('Invalid regex pattern').should('not.exist');
        cy.contains('Incomplete regex pattern').should('not.exist');
        cy.contains('Incomplete quantifier in regex').should('not.exist');
        cy.get('#addFilter').should('not.be.disabled');
    });

    it('disables add button for invalid duration', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Custom').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('datecustom').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('In Next').click();
        cy.get('#valueSelect').type('invalid');
        cy.get('#addFilter').should('be.disabled');
        cy.get('#valueSelect').clear().type('2d 30m');
        cy.get('#addFilter').should('not.be.disabled');
    });

    it('edits an existing filter', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Custom').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('AWS_Region').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Equals').click();
        cy.get('#valueSelect').type('us-west');
        cy.contains('Add').click();

        cy.get('[data-testid="filter-badge"]').click();
        cy.get('#valueSelect').clear().type('eu-central');
        cy.get('#addFilter').click();
        cy.get('[data-testid="filter-badge"]').should('exist');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Custom');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'AWS_Region');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'Equals');
        cy.get('[data-testid="filter-badge"]').should('contain.text', 'eu-central');
    });

    it('removes a filter', () => {
        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Data').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('Email').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Contains').click();
        cy.get('#valueSelect').type('@example.com');
        cy.get('#addFilter').click();
        cy.get('[data-testid="filter-badge-span"]').click();
        cy.get('[data-testid="filter-badge"]').should('not.exist');
    });

    it('does not show remove icon when disableBadgeRemove is true', () => {
        // Remount with disableBadgeRemove=true
        const props = {
            title: 'Test Filters',
            entity: EntityType.CERTIFICATE,
            getAvailableFiltersApi: (apiClients: any) => of(availableFilters as any),
            disableBadgeRemove: true,
        };
        cy.mount(
            <Provider store={store}>
                <FilterWidget {...props} />
            </Provider>,
        );

        cy.get('[data-testid="group-control"]').click();
        cy.get('[data-testid="group-menu"]').contains('Custom').click();
        cy.get('[data-testid="field-control"]').click();
        cy.get('[data-testid="field-menu"]').contains('AWS_Region').click();
        cy.get('[data-testid="condition-control"]').click();
        cy.get('[data-testid="condition-menu"]').contains('Equals').click();
        cy.get('#valueSelect').type('us-east');
        cy.get('#addFilter').click();

        cy.get('[data-testid="filter-badge-span"]').should('not.exist');
    });
});
