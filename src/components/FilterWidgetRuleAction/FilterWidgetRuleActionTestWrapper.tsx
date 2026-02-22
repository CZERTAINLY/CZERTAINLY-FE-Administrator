import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import { of } from 'rxjs';
import { createMockStore } from 'utils/test-helpers';
import FilterWidgetRuleAction from './index';
import { EntityType } from 'ducks/filters';
import { PlatformEnum } from 'types/openapi';
import type { SearchFieldListModel } from 'types/certificate';
import type { ExecutionItemModel } from 'types/rules';

export const defaultMockAvailableFilters: SearchFieldListModel[] = [
    {
        filterFieldSource: 'meta' as const,
        searchFieldData: [
            {
                fieldIdentifier: 'status',
                fieldLabel: 'Status',
                type: 'string' as const,
                conditions: [],
            },
            {
                fieldIdentifier: 'enabled',
                fieldLabel: 'Enabled',
                type: 'boolean' as const,
                conditions: [],
            },
            {
                fieldIdentifier: 'kind',
                fieldLabel: 'Kind',
                type: 'list' as const,
                conditions: [],
                value: [
                    { uuid: 'k1', name: 'Kind One' },
                    { uuid: 'k2', name: 'Kind Two' },
                ],
                multiValue: false,
            },
        ],
    },
];

const defaultEnumsPreload = {
    enums: {
        platformEnums: {
            [PlatformEnum.FilterFieldSource]: {
                meta: { label: 'Meta' },
                custom: { label: 'Custom' },
                data: { label: 'Data' },
                property: { label: 'Property' },
            },
            [PlatformEnum.ExecutionType]: {
                setField: { label: 'Set Field' },
                sendNotification: { label: 'Send Notification' },
            },
        },
    },
};

export interface FilterWidgetRuleActionTestWrapperProps {
    title?: string;
    entity?: EntityType;
    availableFilters?: SearchFieldListModel[];
    onActionsUpdate?: (actions: ExecutionItemModel[]) => void;
    ExecutionsList?: ExecutionItemModel[];
    disableBadgeRemove?: boolean;
    busyBadges?: boolean;
}

export function FilterWidgetRuleActionTestWrapper({
    title = 'Filter rule actions',
    entity = EntityType.CERTIFICATE,
    availableFilters = defaultMockAvailableFilters,
    onActionsUpdate,
    ExecutionsList,
    disableBadgeRemove,
    busyBadges,
}: FilterWidgetRuleActionTestWrapperProps) {
    const getAvailableFiltersApi = useMemo(() => () => of(availableFilters), [availableFilters]);

    const preloadedState = useMemo(
        () => ({
            ...defaultEnumsPreload,
            filters: {
                filters: [
                    {
                        entity,
                        filter: {
                            availableFilters,
                            currentFilters: [],
                            preservedFilters: [],
                            isFetchingFilters: false,
                        },
                    },
                ],
            },
        }),
        [entity, availableFilters],
    );

    const store = useMemo(() => createMockStore(preloadedState), [preloadedState]);

    return (
        <Provider store={store}>
            <FilterWidgetRuleAction
                title={title}
                entity={entity}
                getAvailableFiltersApi={getAvailableFiltersApi}
                onActionsUpdate={onActionsUpdate}
                ExecutionsList={ExecutionsList}
                disableBadgeRemove={disableBadgeRemove}
                busyBadges={busyBadges}
            />
        </Provider>
    );
}
