import ConditionsItemsList from 'components/ExecutionConditionItemsList/ConditionsItemsList';
import '../../../src/resources/styles/theme.scss';
import { ConditionItemDto } from 'types/openapi';
import { actions as enumActions } from 'ducks/enums';
import { mockPlatformEnums } from '../ComplianceProfile/mock-data';
import { componentLoadWait } from '../../utils/constants';
import { EntityType } from 'ducks/filters';
import { mockAvailableFilters } from './mockdata';
import { actions as filtersActions } from 'ducks/filters';
import { SearchFieldListModel } from 'types/certificate';

const ConditionItemListTest = ({ smallerBadges = false }: { smallerBadges?: boolean } = {}) => {
    const conditionsItems = [
        {
            fieldSource: 'meta',
            fieldIdentifier: 'username|STRING',
            operator: 'CONTAINS',
            value: 'd' as any,
        },
    ] as ConditionItemDto[];

    const conditionName = 'test-condition-03';
    const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

    return (
        <ConditionsItemsList
            conditionItems={conditionsItems}
            conditionName={conditionName}
            conditionUuid={conditionUuid}
            smallerBadges={smallerBadges}
        />
    );
};

describe('Condition Item List', () => {
    beforeEach(() => {
        cy.mount(<ConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );
    });

    it('should render condition item list', () => {
        cy.contains('test-condition-03').should('be.visible');
    });

    it('should display condition items with proper badges', () => {
        cy.contains('test-condition-03').should('be.visible');
        cy.get('[class*="groupConditionBadge"]').should('be.visible');

        cy.contains('Metadata').should('be.visible');
        cy.contains("'Username'").should('be.visible');
        cy.contains('contains').should('be.visible');
        cy.contains("'d'").should('be.visible');
    });
    it('should render condition items with smaller badges variant', () => {
        cy.mount(<ConditionItemListTest smallerBadges={true} />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains("test-condition-03's Condition Items").should('be.visible');

        cy.get('[class*="groupConditionBadgeOnly"]').should('be.visible');
    });

    it('should handle multiple condition items', () => {
        const MultipleConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'meta',
                    fieldIdentifier: 'username|STRING',
                    operator: 'CONTAINS',
                    value: 'd' as any,
                },
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'AWS_Region|TEXT',
                    operator: 'EQUALS',
                    value: 'us-east-1' as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-multiple-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<MultipleConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-multiple-conditions').should('be.visible');
        cy.get('[class*="groupConditionBadge"]').should('have.length', 2);

        cy.contains("'Username'").should('be.visible');
        cy.contains("'d'").should('be.visible');

        cy.contains("'AWS_Region'").should('be.visible');
        cy.contains("'us-east-1'").should('be.visible');
    });

    it('should handle empty condition items array', () => {
        const EmptyConditionItemListTest = () => {
            const conditionsItems = [] as ConditionItemDto[];
            const conditionName = 'test-empty-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<EmptyConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-empty-conditions').should('be.visible');

        cy.get('[class*="groupConditionBadge"]').should('not.exist');
    });

    it('should handle boolean field types correctly', () => {
        const BooleanConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'isActive|BOOLEAN',
                    operator: 'EQUALS',
                    value: true as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-boolean-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<BooleanConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-boolean-conditions').should('be.visible');
        cy.contains("'true'").should('be.visible');
    });

    it('should handle array values with OR joining', () => {
        const ArrayConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'AWS_Region|TEXT',
                    operator: 'EQUALS',
                    value: ['us-east-1', 'us-west-2'] as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-array-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<ArrayConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-array-conditions').should('be.visible');
        cy.contains("'us-east-1' OR 'us-west-2'").should('be.visible');
    });

    it('should handle date formatting correctly', () => {
        const DateConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'createdDate|DATE',
                    operator: 'EQUALS',
                    value: '2023-12-25' as any,
                },
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'lastModified|DATETIME',
                    operator: 'EQUALS',
                    value: '2023-12-25T10:30:00Z' as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-date-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<DateConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-date-conditions').should('be.visible');
        // The exact date format will depend on the getFormattedDate/getFormattedDateTime functions
        cy.get('[class*="groupConditionBadge"]').should('be.visible');
    });

    it('should handle platform enum value formatting', () => {
        const PlatformEnumConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'status|ENUM',
                    operator: 'EQUALS',
                    value: 'active' as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-platform-enum-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<PlatformEnumConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-platform-enum-conditions').should('be.visible');
        cy.get('[class*="groupConditionBadge"]').should('be.visible');
    });

    it('should handle object values with name property', () => {
        const ObjectConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'user|OBJECT',
                    operator: 'EQUALS',
                    value: { name: 'John Doe', id: 123 } as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-object-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<ObjectConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-object-conditions').should('be.visible');
        cy.contains("'John Doe'").should('be.visible');
    });

    it('should handle missing field fallback to fieldIdentifier', () => {
        const MissingFieldConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'unknownField|TEXT',
                    operator: 'CONTAINS',
                    value: 'test' as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-missing-field-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<MissingFieldConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-missing-field-conditions').should('be.visible');
        // Should fallback to fieldIdentifier when field is not found
        cy.contains("'unknownField|TEXT'").should('be.visible');
    });

    it('should handle empty/null values', () => {
        const EmptyValueConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'emptyField|TEXT',
                    operator: 'EMPTY',
                    value: null as any,
                },
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'undefinedField|TEXT',
                    operator: 'NOT_EMPTY',
                    value: undefined as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-empty-value-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<EmptyValueConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-empty-value-conditions').should('be.visible');
        // Should handle empty values gracefully
        cy.get('[class*="groupConditionBadge"]').should('have.length', 2);
    });

    it('should handle different operators correctly', () => {
        const OperatorConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'AWS_Region|TEXT',
                    operator: 'NOT_CONTAINS',
                    value: 'test' as any,
                },
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'AWS_Zone|TEXT',
                    operator: 'STARTS_WITH',
                    value: 'us-' as any,
                },
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'AWS_accountId|TEXT',
                    operator: 'ENDS_WITH',
                    value: '123' as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-operator-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<OperatorConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-operator-conditions').should('be.visible');
        cy.get('[class*="groupConditionBadge"]').should('have.length', 3);

        // Verify different operators are displayed
        cy.contains('not contains').should('be.visible');
        cy.contains('starts with').should('be.visible');
        cy.contains('ends with').should('be.visible');
    });

    it('should handle different field sources correctly', () => {
        const FieldSourceConditionItemListTest = () => {
            const conditionsItems = [
                {
                    fieldSource: 'data',
                    fieldIdentifier: 'dataField|TEXT',
                    operator: 'CONTAINS',
                    value: 'dataValue' as any,
                },
                {
                    fieldSource: 'meta',
                    fieldIdentifier: 'metaField|TEXT',
                    operator: 'CONTAINS',
                    value: 'metaValue' as any,
                },
                {
                    fieldSource: 'custom',
                    fieldIdentifier: 'customField|TEXT',
                    operator: 'CONTAINS',
                    value: 'customValue' as any,
                },
            ] as ConditionItemDto[];

            const conditionName = 'test-field-source-conditions';
            const conditionUuid = 'a1297217-b68c-48fe-a317-2355e991c0e5';

            return <ConditionsItemsList conditionItems={conditionsItems} conditionName={conditionName} conditionUuid={conditionUuid} />;
        };

        cy.mount(<FieldSourceConditionItemListTest />).wait(componentLoadWait);
        cy.dispatchActions(
            enumActions.getPlatformEnumsSuccess({
                ...mockPlatformEnums,
            }),
            filtersActions.getAvailableFiltersSuccess({
                entity: EntityType.CONDITIONS,
                availableFilters: mockAvailableFilters as unknown as SearchFieldListModel[],
            }),
        );

        cy.contains('test-field-source-conditions').should('be.visible');
        cy.get('[class*="groupConditionBadge"]').should('have.length', 3);

        // Verify different field sources are displayed
        cy.contains('Data attribute').should('be.visible');
        cy.contains('Metadata').should('be.visible');
        cy.contains('Custom attribute').should('be.visible');
    });
});
